import { Component, OnInit, signal, computed, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap } from 'rxjs';

// Services & Stores
import { ResourceApi } from '../../services/resource-api';
import { LibraryStore } from '../library/store/library.store';

// Models
import { Resource } from '../library/models/library.model';

/**
 * ==========================================================================
 * RESOURCE DETAIL PAGE COMPONENT
 * ==========================================================================
 * Renders the specific details of a selected resource.
 * 
 * Features:
 * 1. Fetches resource data based on Route ID.
 * 2. Sanitizes potentially unsafe content (HTML/Iframes).
 * 3. Implements a custom Audio Player for Podcast resources.
 * 4. Handles Global Keyboard Shortcuts for media control.
 */

@Component({
  selector: 'app-resource-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, FormsModule],
  templateUrl: './resource-detail.html',
  styleUrl: './resource-detail.css'
})
export class ResourceDetailPage implements OnInit {

  // =============================================
  // 1. DATA STATE SIGNALS
  // =============================================
  readonly resource = signal<Resource | undefined | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);


  // =============================================
  // 2. AUDIO PLAYER STATE
  // =============================================
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  readonly isPlaying = signal(false);
  readonly currentProgress = signal(0); // Percentage (0-100)
  readonly currentTimeStr = signal('0:00');
  readonly durationStr = signal('0:00');

  // Tracks if user is currently dragging the seek slider to prevent UI jitter
  readonly isDragging = signal(false);
  private wasPlayingBeforeDrag = false;


  // =============================================
  // 3. COMPUTED VALUES (Sanitization)
  // =============================================

  /**
   * Generates a safe URL for Video Iframes.
   * Bypasses Angular's security for trusted YouTube embeds.
   */
  readonly safeVideoUrl = computed(() => {
    const res = this.resource();
    if (res?.format === 'Video' && res.url) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(res.url);
    }
    return null;
  });

  /**
   * Generates safe HTML for Articles/Guides.
   * Allows rendering rich text content from the backend.
   */
  readonly safeHtmlContent = computed(() => {
    const res = this.resource();
    if ((res?.format === 'Article' || res?.format === 'Guide') && res.content) {
      return this._sanitizer.bypassSecurityTrustHtml(res.content);
    }
    return null;
  });


  // =============================================
  // 4. LIFECYCLE & INIT
  // =============================================

  constructor(
    private _route: ActivatedRoute,
    public _router: Router,
    private _resourceApi: ResourceApi,
    public store: LibraryStore,
    private _location: Location,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Ensure favorites are loaded for the heart icon state
    this.store.loadFavorites();

    // React to URL ID changes (supports deep linking and switching resources directly)
    this._route.paramMap.pipe(
      switchMap(params => {
        this.loading.set(true);
        const idParam = params.get('id');
        if (!idParam) throw new Error('No ID provided');
        return this._resourceApi.getResourceById(+idParam);
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.resource.set(data);
          this.error.set(null);
        } else {
          this.error.set(`Resource could not be found.`);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load the resource.');
        this.loading.set(false);
      }
    });
  }


  // =============================================
  // 5. GENERAL ACTIONS
  // =============================================

  isFavorite(id: number): boolean {
    return this.store.favoriteIds().includes(id);
  }

  goBack(): void {
    this._location.back();
  }


  // =============================================
  // 6. AUDIO PLAYER LOGIC
  // =============================================

  /**
   * Toggles play/pause state of the native audio element.
   */
  toggleAudio() {
    const player = this.audioPlayerRef.nativeElement;
    if (player.paused) {
      player.play();
      this.isPlaying.set(true);
    } else {
      player.pause();
      this.isPlaying.set(false);
    }
  }

  /**
   * Called continuously as the audio plays.
   * Updates the progress bar unless the user is currently dragging it.
   */
  onAudioTimeUpdate() {
    if (this.isDragging()) return; // Stop updates while user interacts

    const player = this.audioPlayerRef.nativeElement;
    if (player.duration) {
      const progress = (player.currentTime / player.duration) * 100;
      this.currentProgress.set(progress);
    }
    this.currentTimeStr.set(this.formatTime(player.currentTime));
  }

  /**
   * Handlers for audio metadata loading and completion.
   */
  onAudioLoaded() {
    const player = this.audioPlayerRef.nativeElement;
    this.durationStr.set(this.formatTime(player.duration));
    this.isPlaying.set(!player.paused);
  }

  onAudioEnded() {
    this.isPlaying.set(false);
    this.currentProgress.set(0);
    this.currentTimeStr.set('0:00');
    this.audioPlayerRef.nativeElement.currentTime = 0;
  }

  /**
   * Formats seconds into MM:SS string.
   */
  private formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }


  // =============================================
  // 7. SEEK BAR INTERACTION (Drag & Click)
  // =============================================

  /**
   * User starts dragging the slider.
   * We pause updates to preventing "fighting" between the timer and the user's cursor.
   */
  onDragStart() {
    if (!this.audioPlayerRef) return;
    const player = this.audioPlayerRef.nativeElement;

    this.wasPlayingBeforeDrag = !player.paused;
    player.pause();
    this.isDragging.set(true);
  }

  /**
   * User releases the slider.
   * Resume playback if it was playing before.
   */
  onDragEnd() {
    if (!this.audioPlayerRef) return;

    this.isDragging.set(false);
    if (this.wasPlayingBeforeDrag) {
      this.audioPlayerRef.nativeElement.play();
    }
  }

  /**
   * Handles the actual value change of the range input.
   */
  seekAudio(event: Event) {
    if (!this.audioPlayerRef) return;

    const target = event.target as HTMLInputElement;
    if (!target) return;

    const value = target.value;
    const player = this.audioPlayerRef.nativeElement;

    const progress = parseFloat(value);
    this.currentProgress.set(progress);

    // Calculate new time
    const time = (progress / 100) * player.duration;
    player.currentTime = time;

    this.currentTimeStr.set(this.formatTime(time));
  }


  // =============================================
  // 8. KEYBOARD ACCESSIBILITY
  // =============================================

  /**
   * Global keyboard listeners for media control.
   * Only active if the resource is a Podcast.
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    // Safety Checks: Must be Podcast, Player must exist
    if (this.resource()?.format !== 'Podcast' || !this.audioPlayerRef) return;

    // Ignore if typing in an input field
    const target = event.target as HTMLElement;
    if (['INPUT', 'BUTTON', 'A', 'TEXTAREA'].includes(target.tagName)) return;

    const player = this.audioPlayerRef.nativeElement;
    const SEEK_TIME = 5; // Seconds to skip

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        player.currentTime = Math.max(0, player.currentTime - SEEK_TIME);
        break;

      case 'ArrowRight':
        event.preventDefault();
        player.currentTime = Math.min(player.duration, player.currentTime + SEEK_TIME);
        break;

      case ' ':
      case 'Spacebar':
        event.preventDefault();
        this.toggleAudio();
        break;
    }
  }
}