<script lang="ts">
  import type { ListResult } from "pocketbase";
  import { pb } from "../lib/client";
  import type { CardsRecord } from "../lib/pocketbase-types";
  import { userInput } from "../lib/state.svelte";
  import type { QuestionId } from "../lib/types";
  import { pan, swipe, type PanCustomEvent, type GestureCustomEvent, type SwipeCustomEvent } from "svelte-gestures";

  let questions = $state<CardsRecord[]>([]);
  let currentIndex = $state(0);
  let showAnswer = $state(false);
  let isLoading = $state(false);

  //   async function loadQuestions(topicId?: string) {
  //     try {
  //       isLoading = true;
  //       const filter = topicId ? `topic = "${topicId}"` : "";
  //       const records = await pb.collection("Cards").getFullList<CardsRecord>({ filter });
  //       questions = shuffleArray([...records]);
  //     } finally {
  //       isLoading = false;
  //     }
  //   }
  /**
   *   https://www.npmjs.com/package/svelte-gestures
   */
  function handleSwipe(event: SwipeCustomEvent) {
    const { direction } = event.detail;
    if (direction === "left") {
      nextQuestion();
    } else if (direction === "right") {
      previousQuestion();
    }
  }

  async function loadQuestions() {
    try {
      isLoading = true;
      let array = [];
      let filter = "";

      userInput.practiceQuestions.forEach((qu: QuestionId) => {
        filter += `id = '${qu}'||`;
      });
      filter = `(${filter.slice(0, filter.length - 2)})`;

      //   const filter = topicId ? `topic = "${topicId}"` : "";
      const records = await pb.collection("Cards").getFullList<CardsRecord>({ filter });
      questions = shuffleArray([...records]);
    } finally {
      isLoading = false;
    }
  }

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function updateLevel(change: number) {
    const current = questions[currentIndex];
    if (!current) return;

    try {
      if (typeof current.level === "undefined" || typeof current.levelChanges === "undefined") {
        alert("Something ain'tn't right ma dude(ette)");
        return;
      }

      (await pb.collection("Cards").update(current.id, {
        level: Math.max(0, current.level + change),
        levelChanges: current.levelChanges + 1,
      })) as ListResult<CardsRecord>;
      nextQuestion();
    } catch (error) {
      console.error("Failed to update level:", error);
    }
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      showAnswer = false;
    }
  }

  function previousQuestion() {
    if (currentIndex > 0) {
      currentIndex--;
      showAnswer = false;
    }
  }

  function skipQuestion() {
    nextQuestion();
  }
</script>

<div use:swipe={() => ({ timeframe: 300, minSwipeDistance: 60 })} onswipe={handleSwipe} class="max-w-2xl mx-auto p-4">
  <nav class="flex gap-4">
    <!-- {#if userInput.currentMode === "menu" && ["topicQuestions", "allQuestions"].includes(userInput.currentView)} -->
    <button
      onclick={() => {
        userInput.currentMode = "menu";
      }}
    >
      Exit Practice Selection
    </button>
    <!-- {/if} -->
  </nav>

  {#if questions.length === 0}
    <div class="text-center">
      <button onclick={() => loadQuestions()} class="px-4 py-2 bg-blue-500 text-white rounded" disabled={isLoading}>
        Start Study Session
      </button>
    </div>
  {:else if questions[currentIndex]}
    <div class="space-y-6">
      <div class="text-sm text-gray-500">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <div class="p-4 bg-white rounded shadow">
        <div class="font-medium mb-4">{questions[currentIndex].question}</div>

        {#if !showAnswer}
          <button onclick={() => (showAnswer = true)} class="w-full py-2 text-blue-500 border border-blue-500 rounded">
            Show Answer
          </button>
        {:else}
          <div class="p-4 bg-gray-50 rounded">
            {questions[currentIndex].answer}
          </div>

          <div class="flex gap-4 mt-4">
            <button onclick={() => updateLevel(1)} class="flex-1 py-2 bg-green-500 text-white rounded">
              Knew It (+1)
            </button>
            <button onclick={() => updateLevel(-1)} class="flex-1 py-2 bg-red-500 text-white rounded">
              Didn't Know (-1)
            </button>
          </div>
        {/if}
      </div>

      <div class="flex justify-between">
        <button
          onclick={previousQuestion}
          disabled={currentIndex === 0}
          class="px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <!-- <button onclick={skipQuestion} class="px-4 py-2 text-gray-600"> Skip </button> -->
        <button
          onclick={nextQuestion}
          disabled={currentIndex === questions.length - 1}
          class="px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  {/if}
</div>
