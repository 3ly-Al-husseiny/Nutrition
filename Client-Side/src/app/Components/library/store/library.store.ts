import { Injectable, computed, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

// Services
import { ResourceApi } from '../../../services/resource-api';
import { Favorites } from '../../../services/favorites';

// Models
import { Category, Format, Resource } from '../models/library.model';

/**
 * ==========================================================================
 * LIBRARY STORE
 * ==========================================================================
 * Central state management for the Resource Library.
 * 
 * Responsibilities:
 * 1. Holds the "Source of Truth" for all library data (Resources, UI State, Filters).
 * 2. Manages the reactive pipeline between State -> API -> UI.
 * 3. Synchronizes state with URL Query Parameters (Deep Linking).
 * 4. Persists user preferences (Sidebar state, Favorites).
 */

@Injectable({ providedIn: 'root' })
export class LibraryStore {

  // =============================================
  // 1. STATE SIGNALS (The Source of Truth)
  // =============================================

  // --- Data State ---
  readonly paginatedItems = signal<Resource[]>([]);
  readonly totalItems = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly favoriteIds = signal<number[]>([]);

  // --- Filter & Sort State ---
  readonly search = signal('');
  readonly selectedCategories = signal<Category[]>([]);
  readonly selectedFormats = signal<Format[]>([]);
  readonly sortBy = signal<'newest' | 'title'>('newest');
  readonly currentPage = signal(1);
  readonly pageSize = signal(9);
  readonly activeFilter = signal<'all' | 'favorites' | 'recommended'>('recommended');

  // Snapshot to prevent recommendations from shuffling while paging/viewing details
  readonly recommendationSnapshot = signal<number[]>([]);

  // --- UI / Layout State ---
  readonly viewMode = signal<'grid' | 'list'>('grid');
  readonly isSidebarCollapsed = signal(false);
  readonly isMobileMenuOpen = signal(false);
  readonly isTabletOverlayOpen = signal(false);


  // =============================================
  // 2. DERIVED STATE (Computed Signals)
  // =============================================

  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  readonly areFiltersActive = computed(() =>
    this.selectedCategories().length > 0 || this.selectedFormats().length > 0
  );

  readonly isOverlayActive = computed(() =>
    this.isMobileMenuOpen() || this.isTabletOverlayOpen()
  );


  // =============================================
  // 3. CONSTRUCTOR & EFFECTS
  // =============================================

  constructor(
    private _ResourceApi: ResourceApi,
    private _Favorites: Favorites,
    private _router: Router
  ) {

    // --- Effect: URL Synchronization ---
    // Updates the browser URL whenever relevant state signals change.
    effect(() => {
      const queryParams: { [key: string]: string | null } = {
        search: this.search() || null,
        sort: this.sortBy() !== 'newest' ? this.sortBy() : null,
        categories: this.selectedCategories().length > 0 ? this.selectedCategories().join(',') : null,
        formats: this.selectedFormats().length > 0 ? this.selectedFormats().join(',') : null,
        view: this.activeFilter() !== 'recommended' ? this.activeFilter() : null
      };

      this._router.navigate(['/library'], {
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });

    // --- Pipeline: Data Fetching ---
    // Reacts to changes in filters, debounces input, and calls the API.
    const filters$ = computed(() => ({
      search: this.search(),
      categories: this.selectedCategories(),
      formats: this.selectedFormats(),
      sort: this.sortBy(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
      activeFilter: this.activeFilter(),
      // Logic for passing Favorite IDs to the API:
      favoriteIds: this.activeFilter() === 'favorites'
        ? this.favoriteIds()           // Favorites Page: Needs LIVE updates (to remove unfavorited items immediately)
        : this.activeFilter() === 'recommended'
          ? this.recommendationSnapshot() // Recommended Page: Needs STATIC snapshot (to prevent shuffle on interaction)
          : undefined
    }));

    toObservable(filters$).pipe(
      debounceTime(300), // Wait for user to stop typing/clicking
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)), // Avoid duplicate calls
      switchMap(latestFilters => {
        this.loading.set(true);
        return this._ResourceApi.getResources(latestFilters);
      })
    ).subscribe({
      next: (response) => {
        this.paginatedItems.set(response.items);
        this.totalItems.set(response.totalItems);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load resources:', err);
        this.error.set('Could not load wellness resources. Please try again later.');
        this.loading.set(false);
      }
    });

    // --- Persistence: Sidebar State ---
    const savedState = localStorage.getItem('isSidebarCollapsed');
    if (savedState) {
      this.isSidebarCollapsed.set(JSON.parse(savedState));
    }
    effect(() => {
      localStorage.setItem('isSidebarCollapsed', JSON.stringify(this.isSidebarCollapsed()));
    });
  }


  // =============================================
  // 4. ACTIONS (State Modifiers)
  // =============================================

  // --- Initialization ---
  loadInitialData() {
    this.loadFavorites();
    // Take a snapshot of favorites on load for consistent recommendations
    this.recommendationSnapshot.set(this.favoriteIds());
  }

  // --- Favorites Logic ---
  loadFavorites() {
    this.favoriteIds.set(this._Favorites.getFavorites());
  }

  toggleFavorite(id: number) {
    const currentFavorites = this.favoriteIds();
    if (currentFavorites.includes(id)) {
      this._Favorites.removeFavorite(id);
    } else {
      this._Favorites.addFavorite(id);
    }
    this.loadFavorites();
  }

  // --- Filter Setters ---
  setSearch(v: string) {
    this.search.set(v);
    this.currentPage.set(1);
  }

  setSort(v: 'newest' | 'title') {
    this.sortBy.set(v);
    this.currentPage.set(1);
  }

  setCurrentPage(page: number) {
    this.currentPage.set(page);
  }

  setActiveFilter(filter: 'all' | 'favorites' | 'recommended') {
    // If switching BACK to recommended, refresh the snapshot
    if (filter === 'recommended') {
      this.recommendationSnapshot.set(this.favoriteIds());
    }
    this.activeFilter.set(filter);
    this.currentPage.set(1);
  }

  // --- Category Toggles ---
  toggleCategory(category: Category) {
    this.selectedCategories.update(cats => {
      const catSet = new Set(cats);
      if (catSet.has(category)) {
        catSet.delete(category);
      } else {
        catSet.add(category);
      }
      return Array.from(catSet);
    });
    this.currentPage.set(1);
  }

  setCategories(categories: Category[]) {
    this.selectedCategories.set(categories);
  }

  clearCategories() {
    this.selectedCategories.set([]);
    this.currentPage.set(1);
  }

  // --- Format Toggles ---
  toggleFormat(format: Format) {
    this.selectedFormats.update(fmts => {
      const fmtSet = new Set(fmts);
      if (fmtSet.has(format)) {
        fmtSet.delete(format);
      } else {
        fmtSet.add(format);
      }
      return Array.from(fmtSet);
    });
    this.currentPage.set(1);
  }

  setFormats(formats: Format[]) {
    this.selectedFormats.set(formats);
  }

  clearFormats() {
    this.selectedFormats.set([]);
    this.currentPage.set(1);
  }

  // --- Bulk Actions ---
  resetFilters() {
    this.search.set('');
    this.selectedCategories.set([]);
    this.selectedFormats.set([]);
    this.sortBy.set('newest');
    this.currentPage.set(1);
  }

  clearAllFilters() {
    this.selectedCategories.set([]);
    this.selectedFormats.set([]);
    this.currentPage.set(1);
  }

  // --- UI Actions ---
  toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  toggleTabletOverlay() {
    this.isTabletOverlayOpen.set(!this.isTabletOverlayOpen());
  }

  closeOverlays() {
    this.isMobileMenuOpen.set(false);
    this.isTabletOverlayOpen.set(false);
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }
}