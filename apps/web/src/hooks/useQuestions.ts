import { useQuery } from "@tanstack/react-query";
import type { QuizSettings } from "@/types/quiz";
import { getQuestions } from "@/services/questions";
import { QUERY_KEYS } from "@/constants/quiz";

export function useQuestions(settings: QuizSettings | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.QUESTIONS, settings],
    queryFn: () => getQuestions(settings!),
    enabled: !!settings,
  });
}
