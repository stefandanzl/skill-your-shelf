import type { View, TopicId, QuestionId, Mode } from "../lib/types";

//currentView, selectedTopicId, questionId
export const userInput = $state<{
  currentMode: Mode;
  currentView: View;
  selectedTopicId: TopicId;
  questionId: QuestionId;
  practiceQuestions: QuestionId[];
}>({
  currentMode: "menu",
  currentView: "topics",
  selectedTopicId: "",
  questionId: "",
  practiceQuestions: [],
});

if (true) {
  const a = 2;
}
