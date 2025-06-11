import type { Category } from "@/types/quiz";

interface CategoriesResponse {
  trivia_categories: Category[];
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data: CategoriesResponse = await response.json();
    return data.trivia_categories;
  } catch (error) {
    // Handle network errors, JSON parsing errors, etc.
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories. Please try again later.");
  }
}
