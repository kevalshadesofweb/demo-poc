import type { QuizQuestion, QuizSettings } from "@/types/quiz";

interface QuestionsResponse {
  response_code: number;
  results: QuizQuestion[];
}

export async function getQuestions(
  settings: QuizSettings
): Promise<QuizQuestion[]> {
  try {
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
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions. Please try again later.");
  }
}
