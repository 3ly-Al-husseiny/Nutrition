import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// Models
import { Resource, PaginatedResponse, ResourceFilter } from '../Components/library/models/library.model';

/**
 * ==========================================================================
 * RESOURCE API SERVICE
 * ==========================================================================
 * Handles data fetching for the library.
 * 
 * ARCHITECTURE NOTE:
 * In a full-stack application, the filtering, sorting, pagination, and 
 * recommendation logic implemented here would typically reside on the server.
 * 
 * This service simulates that backend behavior client-side by fetching a 
 * static JSON file and processing it using RxJS operators.
 */

@Injectable({
  providedIn: 'root'
})
export class ResourceApi {

  constructor(private http: HttpClient) { }


  // =============================================
  // 1. PUBLIC API METHODS
  // =============================================

  /**
   * Fetches resources based on the provided filter criteria.
   * Simulates a complex backend query (Search + Filter + Sort + Paginate).
   */
  getResources(filters: ResourceFilter): Observable<PaginatedResponse> {

    // --- A. Setup Params (Simulation of query string construction) ---
    let params = new HttpParams();
    if (filters.search) params = params.append('search', filters.search);
    if (filters.categories?.length) params = params.append('categories', filters.categories.join(','));
    if (filters.formats?.length) params = params.append('formats', filters.formats.join(','));
    if (filters.sort) params = params.append('sort', filters.sort);
    if (filters.page) params = params.append('page', filters.page);
    if (filters.pageSize) params = params.append('pageSize', filters.pageSize);

    // --- B. Execute Request & Simulate Backend Logic ---
    return this.http.get<Resource[]>('data/library/resources.json').pipe(
      map(allItems => {
        // Destructure for cleaner access
        const {
          search,
          categories,
          formats,
          sort,
          page = 1,
          pageSize = 9,
          activeFilter,
          favoriteIds = []
        } = filters;

        let items = allItems;

        // 1. View Context Logic
        if (activeFilter === 'recommended') {
          // Delegate to recommendation engine
          items = this.generateRecommendations(allItems, favoriteIds);
        } else if (activeFilter === 'favorites') {
          // Filter strictly by favorite IDs
          items = items.filter(i => favoriteIds.includes(i.id));
        }

        // 2. Search Filtering (Title or Tags)
        if (search) {
          const lowerTerm = search.toLowerCase();
          items = items.filter(i =>
            i.title.toLowerCase().includes(lowerTerm) ||
            i.tags.some(t => t.toLowerCase().includes(lowerTerm))
          );
        }

        // 3. Category Filtering
        if (categories && categories.length > 0) {
          items = items.filter(i => categories.includes(i.category));
        }

        // 4. Format Filtering
        if (formats && formats.length > 0) {
          items = items.filter(i => formats.includes(i.format));
        }

        // 5. Sorting (Skip if in 'recommended' mode, as it uses its own scoring sort)
        if (activeFilter !== 'recommended') {
          if (sort === 'title') {
            items.sort((a, b) => a.title.localeCompare(b.title));
          } else {
            // Default: Newest first
            items.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
          }
        }

        // 6. Pagination
        const totalItems = items.length;
        const startIndex = (page - 1) * pageSize;
        const paginatedItems = items.slice(startIndex, startIndex + pageSize);

        return { items: paginatedItems, totalItems };
      })
    );
  }

  /**
   * Fetches a single resource by ID.
   */
  getResourceById(id: number): Observable<Resource | undefined> {
    return this.http.get<Resource[]>('data/library/resources.json').pipe(
      map(resources => resources.find(res => res.id === id))
    );
  }


  // =============================================
  // 2. PRIVATE HELPER METHODS (Recommendation Engine)
  // =============================================

  /**
   * Generates a personalized list of resources based on user favorites.
   * 
   * Algorithm:
   * 1. Analyze the user's existing favorites to build a "Interest Profile" (Frequency map of Categories, Tags, Formats).
   * 2. Score every non-favorited item in the library against this profile.
   * 3. Sort by score descending.
   */
  private generateRecommendations(allItems: Resource[], favoriteIds: number[]): Resource[] {

    // Scenario A: Cold Start (No favorites yet)
    // Return a random shuffle to encourage discovery.
    if (!favoriteIds || favoriteIds.length === 0) {
      return [...allItems].sort(() => 0.5 - Math.random());
    }

    // Scenario B: Personalized Recommendations

    // 1. Build User Profile
    const likedResources = allItems.filter(r => favoriteIds.includes(r.id));

    const catFreq: Record<string, number> = {};
    const fmtFreq: Record<string, number> = {};
    const tagFreq: Record<string, number> = {};

    likedResources.forEach(r => {
      catFreq[r.category] = (catFreq[r.category] || 0) + 1;
      fmtFreq[r.format] = (fmtFreq[r.format] || 0) + 1;
      r.tags.forEach(t => tagFreq[t] = (tagFreq[t] || 0) + 1);
    });

    // 2. Score Candidates
    const scoredItems = allItems
      .filter(item => !favoriteIds.includes(item.id)) // Exclude items already favorited
      .map(item => {
        let score = 0;

        // Weight: Category Match (High Priority: 10pts * Frequency)
        if (catFreq[item.category]) {
          score += (10 * catFreq[item.category]);
        }

        // Weight: Tag Match (Medium Priority: 5pts * Frequency)
        item.tags.forEach(tag => {
          if (tagFreq[tag]) {
            score += (5 * tagFreq[tag]);
          }
        });

        // Weight: Format Match (Low Priority: 3pts * Frequency)
        if (fmtFreq[item.format]) {
          score += (3 * fmtFreq[item.format]);
        }

        // Weight: ID Boost (Tie-Breaker to stabilize sort order)
        score += (item.id * 0.1);

        return { item, score };
      });

    // 3. Return Sorted Results
    return scoredItems
      .filter(x => x.score > 0)        // Only return relevant items
      .sort((a, b) => b.score - a.score) // Best match first
      .map(x => x.item);
  }
}