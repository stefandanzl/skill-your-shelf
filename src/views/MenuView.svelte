<script lang="ts">
  import TopicList from "./TopicList.svelte";
  import QuestionList from "./QuestionList.svelte";
  import Header from "./Header.svelte";
  import type { View } from "../lib/types";
  import QuestionEdit from "./QuestionEdit.svelte";
  import { userInput } from "../lib/state.svelte";
  import TopicEdit from "./TopicEdit.svelte";
</script>

<div class="app-container">
  <Header />

  <div class="content-wrapper">
    <div class="view-container">
      {#if userInput.currentView === "topics"}
        <TopicList />
      {/if}
      {#if (userInput.currentView === "allQuestions" && userInput.selectedTopicId) || userInput.currentView === "allQuestions" || userInput.currentView === "topicQuestions"}
        <QuestionList />
      {/if}
      {#if userInput.currentView === "questionEdit"}
        <QuestionEdit />
      {/if}
      {#if userInput.currentView === "topicEdit"}
        <TopicEdit />
      {/if}
    </div>
  </div>
</div>

<style>
  .app-container {
    min-height: 100vh;
    background-color: #1a1a1a;
    color: #e5e5e5;
  }

  .content-wrapper {
    width: 100%;
    max-width: clamp(350px, 90vw, 800px);
    margin: 0 auto;
    padding: clamp(0.5rem, 2vw, 1.5rem);
    display: flex;
    flex-direction: column;
    min-height: 80vh;
  }

  .view-container {
    background: #2a2a2a;
    border-radius: 1rem;
    padding: clamp(1rem, 3vw, 2rem);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: clamp(1rem, 4vw, 2rem);
  }
</style>
