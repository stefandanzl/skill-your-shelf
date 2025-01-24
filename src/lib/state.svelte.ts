import type { View, TopicId, QuestionId, Mode } from "../lib/types";

//currentView, selectedTopicId, questionId
export const userInput = $state<{
  currentMode: Mode;
  currentView: View;
  selectedTopicId: TopicId;
  questionId: QuestionId;
}>({
  currentMode: "menu",
  currentView: "topics",
  selectedTopicId: "",
  questionId: "",
});

if (true) {
  const a = 2;
}
