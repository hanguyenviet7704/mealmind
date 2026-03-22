import { apiClient } from '@/lib/api/client';

export interface RecipeSummary {
  id: string; name: string; imageUrl: string | null; description: string;
  cuisine: string; difficulty: string; prepTime: number; cookTime: number;
  totalTime: number; defaultServings: number; calories: number | null;
  mealTypes: string[]; isBookmarked?: boolean;
}

export interface PaginatedRecipes {
  data: RecipeSummary[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// apiClient already strips the outer { data, meta, error } envelope.
// getBookmarkedRecipes on the backend returns paginate(data, ...) → { data: [...], meta: {...} }
// Therefore apiClient<PaginatedRecipes> will give us { data: [...], meta: {...} } directly.
export const getBookmarksApi = async (page = 1, pageSize = 50): Promise<PaginatedRecipes> => {
  return apiClient<PaginatedRecipes>(`/recipes/bookmarks?page=${page}&pageSize=${pageSize}`);
};

export const bookmarkRecipeApi = async (recipeId: string) => {
  return apiClient(`/recipes/${recipeId}/bookmark`, { method: 'POST' });
};

export const unbookmarkRecipeApi = async (recipeId: string) => {
  return apiClient(`/recipes/${recipeId}/bookmark`, { method: 'DELETE' });
};
