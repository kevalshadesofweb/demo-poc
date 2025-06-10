import { useQuery } from "@tanstack/react-query";
import type { QuizQuestion, QuizSettings } from "@/types/quiz";

interface QuestionsResponse {
  response_code: number;
  results: QuizQuestion[];
}

async function getQuestions(settings: QuizSettings): Promise<QuizQuestion[]> {
  const { category, difficulty, amount } = settings;
  const url = new URL("https://opentdb.com/api.php");
  url.searchParams.append("amount", amount.toString());
  url.searchParams.append("category", category.toString());
  url.searchParams.append("difficulty", difficulty);
  url.searchParams.append("type", "multiple");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  const data: QuestionsResponse = await response.json();
  if (data.response_code !== 0) {
    throw new Error("Failed to fetch questions");
  }

  return data.results;
}

export function useQuestions(settings: QuizSettings | null) {
  return useQuery({
    queryKey: ["questions", settings],
    queryFn: () => getQuestions(settings!),
    enabled: !!settings,
  });
}
