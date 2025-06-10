import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types/quiz";

interface CategoriesResponse {
  trivia_categories: Category[];
}

async function getCategories(): Promise<Category[]> {
  const response = await fetch("https://opentdb.com/api_category.php");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const data: CategoriesResponse = await response.json();
  return data.trivia_categories;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}
