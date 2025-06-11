import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categories";
import { QUERY_KEYS } from "@/constants/quiz";

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });
}
