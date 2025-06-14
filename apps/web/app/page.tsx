"use client";

import { TopicSelection } from "@/components/TopicSelection";
import { Quiz } from "@/components/Quiz";
import { Results } from "@/components/Results";
import { useQuizStore } from "@/store/useQuizStore";

export default function Home() {
  const { settings, isQuizRunning } = useQuizStore();

  const renderContent = () => {
    if (!settings) {
      return <TopicSelection />;
    } else if (isQuizRunning) {
      return <Quiz />;
    } else {
      return <Results />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Quiz App
        </h1>
        {renderContent()}
      </div>
    </main>
  );
}
