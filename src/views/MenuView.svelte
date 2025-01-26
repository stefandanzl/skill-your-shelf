<script lang="ts">
  import TopicList from "./TopicList.svelte";
  import QuestionList from "./QuestionList.svelte";
  import BucketView from "./BucketView.svelte";
  import Header from "./Header.svelte";
  import type { View } from "../lib/types";
  import QuestionEdit from "./QuestionEdit.svelte";

  import { userInput } from "../lib/state.svelte";
  import TopicEdit from "./TopicEdit.svelte";

  //   $inspect(userInput.currentView, userInput.selectedTopicId);
</script>

<div>
  <Header />

  <div class="max-w-5xl w-full mx-auto p-4">
    {#if userInput.currentView === "topics"}
      <TopicList />
    {/if}
    {#if (userInput.currentView === "allQuestions" && userInput.selectedTopicId) || userInput.currentView === "allQuestions" || userInput.currentView === "topicQuestions"}
      <QuestionList />
    {/if}
    {#if userInput.currentView === "buckets"}
      <BucketView />
    {/if}
    {#if userInput.currentView === "questionEdit"}
      <QuestionEdit />
    {/if}
    {#if userInput.currentView === "topicEdit"}
      <TopicEdit />
    {/if}
  </div>
</div>
