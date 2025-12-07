import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ==========================================================================
 * SCROLL TOP COMPONENT
 * ==========================================================================
 * A utility component that monitors the window scroll position.
 * 
 * Functionality:
 * 1. Detects global scroll events via HostListener.
 * 2. Toggles a visibility signal based on a specific threshold (300px).
 * 3. Performs a native smooth scroll back to the top of the viewport.
 */

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.css',
})
export class ScrollTop {

  // =============================================
  // 1. STATE SIGNALS
  // =============================================

  /**
   * Controls the presence of the '.show' CSS class.
   * True when the user has scrolled down past the threshold.
   */
  isVisible = signal(false);


  // =============================================
  // 2. EVENT LISTENERS
  // =============================================

  /**
   * Monitors the window scroll event.
   * Updates the visibility state based on the vertical scroll position.
   */
  @HostListener('window:scroll')
  onWindowScroll() {
    const SCROLL_THRESHOLD = 300; // Pixels
    this.isVisible.set(window.scrollY > SCROLL_THRESHOLD);
  }


  // =============================================
  // 3. PUBLIC METHODS
  // =============================================

  /**
   * Triggers a native smooth scroll animation to the top of the page.
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}