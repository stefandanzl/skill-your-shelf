<script lang="ts">
  import { pb } from "../lib/client";
  import type { CardsRecord } from "../lib/pocketbase-types";
  import { userInput } from "../lib/state.svelte";

  let { questionId, topicId } = userInput ;
// let { onSave } = $props()

//     questionId: string | null;
//     topicId: string;
//     onSave: () => void;
//   } = $props();

  let question = $state<string|undefined>("")
  let answer = $state<string|undefined>("");
  let isReversible = $state<boolean|undefined>(false);
  let difficulty = $state<number|undefined>(1);
  let isLoading = $state(false);

  $effect(() => {
    if (questionId) loadQuestion();
  });

  async function loadQuestion() {
    try {
      isLoading = true;
      const record = await pb.collection("Cards")?.getOne<CardsRecord>(questionId!);
      question = record.question;
      answer = record.answer;
      isReversible = record.isReversible;
      difficulty = record.difficulty;
    } catch (error) {
      console.error("Failed to load question:", error);
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit() {
    try {
      isLoading = true;
      const data = {
        question,
        answer,
        isReversible,
        difficulty,
        topic: topicId,
        level: 0,
        levelChanges: 0,
      };

      if (questionId) {
        await pb.collection("Cards").update(questionId, data);
      } else {
        await pb.collection("Cards").create(data);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save question:", error);
    } finally {
      isLoading = false;
    }
  }

  async function handleDelete() {
    if (
      !questionId ||
      !confirm("Are you sure you want to delete this question?")
    )
      return;
    try {
      isLoading = true;
      await pb.collection("Cards").delete(questionId);
      onSave();
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  }
</script>

<form class="space-y-4" onsubmit={handleSubmit}>
  <div>
    <label class="block text-sm font-medium mb-1" for="question">Question</label
    >
    <textarea>
      id="question" bind:value={question}
      required class="w-full p-2 border rounded" rows="3"
    </textarea>
  </div>

  <div>
    <label class="block text-sm font-medium mb-1" for="answer">Answer</label>
    <textarea>
      id="answer" bind:value={answer}
      required class="w-full p-2 border rounded" rows="3"
    </textarea>
  </div>

  <div class="flex items-center gap-4">
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={isReversible} />
      <span class="text-sm">Reversible</span>
    </label>

    <div class="flex items-center gap-2">
      <label class="text-sm" for="difficulty">Difficulty:</label>
      <input
        id="difficulty"
        type="number"
        bind:value={difficulty}
        min="1"
        max="5"
        class="w-16 p-1 border rounded"
      />
    </div>
  </div>

  <div class="flex justify-between">
    <button
      type="submit"
      disabled={isLoading}
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {questionId ? "Update" : "Create"} Question
    </button>

    {#if questionId}
      <button
        type="button"
        onclick={handleDelete}
        disabled={isLoading}
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        Delete
      </button>
    {/if}
  </div>
</form>
