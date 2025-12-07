import { Component, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

// Components & Directives
import { Sidebar } from "./sidebar/sidebar";
import { Draggable } from '../../directives/draggable';

// Store & Models
import { LibraryStore } from './store/library.store';
import { Category, Format, Resource } from './models/library.model';

/**
 * ==========================================================================
 * LIBRARY PAGE COMPONENT
 * ==========================================================================
 * The main container for the resource library. It orchestrates:
 * 1. URL Query Parameter parsing (Deep linking).
 * 2. Interaction with the LibraryStore for state management.
 * 3. Layout management (Sidebar, Grid/List views).
 */

@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    Sidebar,
    Draggable,
    NgIf
  ],
  templateUrl: './library.html',
  styleUrl: './library.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryPage implements OnInit {

  // =============================================
  // 1. STATIC DATA (Filters)
  // =============================================
  readonly categories: Category[] = ['Nutrition', 'Mental Health', 'Physical Health', 'Productivity'];
  readonly formats: Format[] = ['Article', 'Video', 'Podcast', 'Guide', 'Website'];


  // =============================================
  // 2. COMPUTED VALUES
  // =============================================

  /**
   * Generates an array of page numbers based on total items in the store.
   * Used for rendering the pagination controls.
   * Optimized to show max 10 pages with smart pagination.
   */
  pageNumbers = computed(() => {
    const total = this.store.totalPages();
    const current = this.store.currentPage();
    
    if (total <= 10) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    // Smart pagination: show first, last, current ± 2
    const pages: number[] = [];
    const range = 2;
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of middle range
    let start = Math.max(2, current - range);
    let end = Math.min(total - 1, current + range);
    
    // Add ellipsis before middle range if needed
    if (start > 2) {
      pages.push(-1); // -1 represents ellipsis
    }
    
    // Add middle range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis after middle range if needed
    if (end < total - 1) {
      pages.push(-1);
    }
    
    // Always show last page
    if (total > 1) {
      pages.push(total);
    }
    
    return pages;
  });


  // =============================================
  // 3. LIFECYCLE & INITIALIZATION
  // =============================================

  constructor(
    public store: LibraryStore,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // Reset store filters to default state before applying URL params
    this.store.resetFilters();

    // Parse URL Query Parameters to restore state (Deep Linking)
    const queryParams = this._route.snapshot.queryParamMap;

    const search = queryParams.get('search');
    const categoriesParam = queryParams.get('categories');
    const formatsParam = queryParams.get('formats');
    const sort = queryParams.get('sort') as 'title' | 'newest';
    const view = queryParams.get('view') as 'all' | 'favorites' | 'recommended';

    // Apply Search
    if (search) {
      this.store.setSearch(search);
    }

    // Apply Categories (Validate against allowed types)
    if (categoriesParam) {
      const cats = categoriesParam.split(',') as Category[];
      if (cats.every(c => this.categories.includes(c))) {
        this.store.setCategories(cats);
      }
    }

    // Apply Formats (Validate against allowed types)
    if (formatsParam) {
      const fmts = formatsParam.split(',') as Format[];
      if (fmts.every(f => this.formats.includes(f))) {
        this.store.setFormats(fmts);
      }
    }

    // Apply Sorting
    if (sort === 'title') {
      this.store.setSort(sort);
    }

    // Apply Active View Filter (Tabs)
    if (view && ['all', 'favorites', 'recommended'].includes(view)) {
      this.store.setActiveFilter(view);
    }

    // Trigger initial data fetch based on the state set above
    this.store.loadInitialData();
  }


  // =============================================
  // 4. HELPER METHODS
  // =============================================

  /**
   * Checks if a specific resource ID is in the user's favorites list.
   * Used for toggling the heart icon state in the UI.
   */
  isFavorite(id: number): boolean {
    return this.store.favoriteIds().includes(id);
  }

  /**
   * TrackBy function for resource items.
   * Improves *ngFor performance by tracking items by ID.
   */
  trackByResourceId(index: number, item: Resource): number {
    return item.id;
  }

  /**
   * TrackBy function for category filters.
   */
  trackByCategory(index: number, category: Category): string {
    return category;
  }

  /**
   * TrackBy function for format filters.
   */
  trackByFormat(index: number, format: Format): string {
    return format;
  }

  /**
   * TrackBy function for tags.
   */
  trackByTag(index: number, tag: string): string {
    return tag;
  }

  /**
   * TrackBy function for page numbers.
   */
  trackByPageNumber(index: number, page: number): number {
    return page;
  }
}