<script lang="ts">
  import type { View } from "../lib/types";

  import { userInput } from "../lib/state.svelte";
  let { currentView, selectedTopicId, questionId } = $state(userInput);
</script>

<header class="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
  <div class="max-w-5xl w-full mx-auto p-4">
    <h1 class="text-2xl mb-4">SkillYourShelf</h1>

    <nav class="flex gap-4">
      <button
        class="px-4 py-2 rounded {currentView === 'topics' ? 'bg-blue-600 text-white' : 'bg-gray-200'}"
        onclick={() => (currentView = "topics")}
      >
        Topics
      </button>
      <button
        class="px-4 py-2 rounded {currentView === 'allQuestions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}"
        onclick={() => {
          currentView = "allQuestions";
          selectedTopicId = "";
        }}
      >
        All Questions
      </button>
      <button
        class="px-4 py-2 rounded {currentView === 'buckets' ? 'bg-blue-600 text-white' : 'bg-gray-200'}"
        onclick={() => {
          currentView = "buckets";
          selectedTopicId = "";
        }}
      >
        Bucket Overview
      </button>
    </nav>
  </div>
</header>

<div class="mt-32"></div>
