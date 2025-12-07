import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStore } from '../store/library.store';

/**
 * ==========================================================================
 * SIDEBAR COMPONENT
 * ==========================================================================
 * A versatile navigation component that adapts its behavior based on:
 * 1. Screen size (Mobile vs Tablet vs Desktop).
 * 2. Context (In-grid layout vs Overlay).
 * 
 * Interactions are delegated to the LibraryStore to maintain state consistency.
 */

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  /**
   * Flag to designate this instance as a "floating" overlay (used on Tablets/Mobile).
   * If false, it acts as the static sidebar within the main grid layout.
   */
  @Input() isOverlay = false;

  constructor(public store: LibraryStore) { }


  // =============================================
  // HOST BINDINGS (CSS Class Control)
  // =============================================

  /**
   * Binds the `.is-overlay` class to the host element.
   * Used in CSS to apply fixed positioning and z-index.
   */
  @HostBinding('class.is-overlay')
  get isOverlayClass() {
    return this.isOverlay;
  }

  /**
   * Binds the `.is-open` class to the host element.
   * Controls the slide-in animation for mobile/tablet drawers.
   */
  @HostBinding('class.is-open')
  get isOpen() {
    // 1. Tablet Overlay Mode
    if (this.isOverlay) {
      return this.store.isTabletOverlayOpen();
    }
    // 2. Mobile Drawer Mode (Default for non-overlay on small screens)
    return this.store.isMobileMenuOpen();
  }

  /**
   * Binds the `.is-collapsed` class to the host element.
   * Controls the width reduction on Desktop.
   */
  @HostBinding('class.is-collapsed')
  get isCollapsed() {
    return this.store.isSidebarCollapsed();
  }


  // =============================================
  // INTERACTION HANDLERS
  // =============================================

  /**
   * Handles clicks on the sidebar header (Logo/Collapse button).
   * The behavior changes based on screen width and the `isOverlay` input.
   */
  handleHeaderClick(): void {
    const screenWidth = window.innerWidth;

    // Scenario A: This is an Overlay Sidebar (Tablet/Mobile Slide-out)
    // Clicking the header should always close the overlay.
    if (this.isOverlay) {
      if (screenWidth < 768) {
        this.store.toggleMobileMenu();
      } else {
        this.store.toggleTabletOverlay();
      }
      return;
    }

    // Scenario B: This is the Main Grid Sidebar
    if (screenWidth < 768) {
      // Mobile: Toggle the mobile menu state (usually managed by FAB, but allowed here)
      this.store.toggleMobileMenu();
    } else if (screenWidth >= 768 && screenWidth < 992) {
      // Tablet: Trigger the *separate* tablet overlay to open
      this.store.toggleTabletOverlay();
    } else {
      // Desktop: Toggle the collapse/expand state of the grid sidebar
      this.store.toggleSidebar();
    }
  }
}