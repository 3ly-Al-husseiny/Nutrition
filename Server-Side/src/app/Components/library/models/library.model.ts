/**
 * ==========================================================================
 * LIBRARY MODELS
 * ==========================================================================
 * Defines the core data structures, types, and API interfaces used 
 * throughout the Library feature (Components, Store, and Services).
 */

// =============================================
// 1. DOMAIN TYPES
// =============================================

/**
 * The four main pillars of wellness tracked in the application.
 */
export type Category =
  | 'Nutrition'
  | 'Mental Health'
  | 'Physical Health'
  | 'Productivity';

/**
 * The media type of the resource.
 * Determines the icon and the viewer component (Video Player, Audio Player, etc.) used in the Detail View.
 */
export type Format =
  | 'Article'
  | 'Video'
  | 'Podcast'
  | 'Guide'
  | 'Website';


// =============================================
// 2. ENTITY DEFINITIONS
// =============================================

/**
 * Represents a single wellness resource item.
 */
export interface Resource {
  id: number;
  title: string;
  description: string;
  category: Category;
  format: Format;
  published: string; // ISO Date String (YYYY-MM-DD)
  tags: string[];

  // --- Optional Metadata ---
  duration?: string; // e.g., "10 min", "7 days"
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail?: string; // URL to cover image

  // --- Content Fields ---
  url?: string;      // External link, YouTube embed URL, or Audio file URL
  content?: string;  // HTML content for Articles/Guides
}


// =============================================
// 3. API / SERVICE INTERFACES
// =============================================

/**
 * Structure of the response expected from the ResourceApi.
 * Supports server-side pagination.
 */
export interface PaginatedResponse {
  items: Resource[];
  totalItems: number;
}

/**
 * Payload used to query the ResourceApi.
 * Encapsulates all active filters, sorting, and pagination state.
 */
export interface ResourceFilter {
  search?: string;
  categories?: Category[];
  formats?: Format[];
  sort?: 'newest' | 'title';
  page?: number;
  pageSize?: number;

  // --- Contextual Filters ---
  activeFilter?: 'all' | 'favorites' | 'recommended';
  favoriteIds?: number[]; // Passed to API to help generate recommendations or filter favorites
}