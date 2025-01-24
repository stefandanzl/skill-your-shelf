import type { View, TopicId, QuestionId } from "../lib/types";

//currentView, selectedTopicId, questionId
export const userInput = $state<{ currentView: View; selectedTopicId: TopicId; questionId: QuestionId }>({
  currentView: "topics",
  selectedTopicId: "",
  questionId: "",
});

if (true) {
  const a = 2;
}
