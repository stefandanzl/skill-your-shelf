<script lang="ts">
  import type { View } from "$lib/types";
  import { userInput } from "$lib/state.svelte";
</script>

<header>
  <div class="header-content">
    <h1>SkillYourShelf</h1>

    <nav>
      <button
        class={userInput.currentView === "allQuestions" ? "active" : ""}
        onclick={() => {
          userInput.currentView = "allQuestions";
          userInput.selectedTopicId = "";
        }}
      >
        All Questions
      </button>
      <button
        class={userInput.currentView === "topics" ? "active" : ""}
        onclick={() => (userInput.currentView = "topics")}
      >
        All Topics
      </button>
      <button
        class={userInput.currentView === "buckets" ? "active" : ""}
        onclick={() => {
          userInput.currentView = "buckets";
          userInput.selectedTopicId = "";
        }}
      >
        Bucket Overview
      </button>
      {#if userInput.currentMode === "menu" && (["topicQuestions", "allQuestions", "buckets"] as View[]).includes(userInput.currentView) && userInput.practiceQuestions.length !== 0}
        <button
          class="practice-button"
          onclick={() => {
            userInput.currentMode = "practice";
          }}
        >
          Practice Selection
        </button>
      {/if}
    </nav>
  </div>
</header>

<div class="spacer"></div>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #2a2a2a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }

  .header-content {
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #e5e5e5;
  }

  nav {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: #333333;
    color: #e5e5e5;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #404040;
  }

  .active {
    background-color: #3b82f6;
    color: white;
  }

  .active:hover {
    background-color: #2563eb;
  }

  .practice-button {
    background-color: #10b981;
  }

  .practice-button:hover {
    background-color: #059669;
  }

  .spacer {
    margin-top: 8rem;
  }
</style>
