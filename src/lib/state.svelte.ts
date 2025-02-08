import type { View, TopicId, QuestionId, Mode } from "$lib/types";
import type { TopicsRecord } from "./pocketbase-types";

//currentView, selectedTopicId, questionId
export const userInput = $state<{
  currentMode: Mode;
  currentView: View;
  selectedTopicId: TopicId;
  questionId: QuestionId;
  practiceQuestions: QuestionId[];
  topic: TopicsRecord | null;
}>({
  currentMode: "menu",
  currentView: "topics",
  selectedTopicId: "",
  questionId: "",
  practiceQuestions: [],
  topic: {
    id: "",
  },
});

export const recordsData = $state<{
  topics: TopicsRecord[];
  questions: Question[];
}>({ topics: [], questions: [] });
