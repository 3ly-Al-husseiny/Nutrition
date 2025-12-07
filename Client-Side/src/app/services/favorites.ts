import { Injectable } from '@angular/core';

/**
 * ==========================================================================
 * FAVORITES SERVICE
 * ==========================================================================
 * Manages the client-side persistence of user favorites.
 * 
 * Implementation Details:
 * - Uses `localStorage` to persist data across browser sessions.
 * - Stores a simple array of Resource IDs (number[]).
 * - Handles JSON parsing errors gracefully to prevent app crashes.
 */

@Injectable({
  providedIn: 'root'
})
export class Favorites {

  private readonly FAVORITES_STORAGE_KEY = 'favorites';

  // =============================================
  // 1. PUBLIC API
  // =============================================

  /**
   * Retrieves the current list of favorite Resource IDs.
   * Returns an empty array if storage is empty or corrupted.
   */
  getFavorites(): number[] {
    try {
      const favoritesJson = localStorage.getItem(this.FAVORITES_STORAGE_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (e) {
      // Fallback if local storage data is corrupted
      console.warn('Error reading favorites from localStorage, resetting to empty.', e);
      return [];
    }
  }

  /**
   * Adds a resource ID to the favorites list.
   * Includes a check to prevent duplicate entries.
   */
  addFavorite(id: number): void {
    const currentFavorites = this.getFavorites();
    if (!currentFavorites.includes(id)) {
      const updatedFavorites = [...currentFavorites, id];
      this.saveFavorites(updatedFavorites);
    }
  }

  /**
   * Removes a resource ID from the favorites list.
   */
  removeFavorite(id: number): void {
    const currentFavorites = this.getFavorites();
    const updatedFavorites = currentFavorites.filter(favId => favId !== id);
    this.saveFavorites(updatedFavorites);
  }


  // =============================================
  // 2. PRIVATE HELPERS
  // =============================================

  /**
   * Persists the array of IDs to localStorage.
   * Wrapped in try/catch to handle potential "Quota Exceeded" errors.
   */
  private saveFavorites(ids: number[]): void {
    try {
      localStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }
}