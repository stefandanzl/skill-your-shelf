<script lang="ts">
  import TopicList from "./menu/TopicList.svelte";
  import QuestionList from "./menu/QuestionList.svelte";
  import BucketView from "./menu/BucketView.svelte";
  import Header from "./menu/Header.svelte";
  import type { View } from "./lib/types";
  import QuestionEdit from "./menu/QuestionEdit.svelte";

  import { userInput } from "./lib/state.svelte";
  let { currentView, selectedTopicId, questionId } = $state(userInput);

  $inspect(currentView, selectedTopicId);
</script>

<Header />

<main class="max-w-5xl w-full mx-auto p-4">
  {#if currentView === "topics" || currentView === "topicQuestions"}
    <TopicList />
  {/if}
  {#if (currentView === "allQuestions" && selectedTopicId) || currentView === "allQuestions"}
    <QuestionList />
  {/if}
  {#if currentView === "buckets"}
    <BucketView />
  {/if}
  {#if currentView === "edit"}
    <QuestionEdit />
  {/if}
</main>
