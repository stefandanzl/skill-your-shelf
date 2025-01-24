<script lang="ts">
  import { preventDefault } from "../lib/util";
  import { pb } from "../lib/client";
  import type { CardsRecord, TopicsRecord } from "../lib/pocketbase-types";

  import { userInput } from "../lib/state.svelte";

  function onSave() {}

  let question = $state<string | undefined>("");
  let answer = $state<string | undefined>("");
  let isReversible = $state<boolean | undefined>(false);
  let difficulty = $state<number | undefined>(1);
  let isLoading = $state(false);
  let topicId = $state<string | undefined>("");
  let topicName = $state<string | undefined>("");

  const formData = $state<{
    question: string | undefined;
    answer: string | undefined;
    isReversible: boolean | undefined;
    difficulty: number | undefined;
    isLoading: false;
  }>({ question: "", answer: "", isReversible: false, difficulty: 1, isLoading: false });

  $effect(() => {
    console.log("EDIT");
    $inspect(userInput);
    if (userInput.questionId) {
      loadQuestion();
    }
  });

  async function loadQuestion() {
    try {
      isLoading = true;
      const record = await pb.collection("Cards")?.getOne<CardsRecord>(userInput.questionId!);
      question = record.question;
      answer = record.answer;
      isReversible = record.isReversible;
      difficulty = record.difficulty;
      topicId = record.topicId;

      const topicRecord = await pb.collection("Topics")?.getOne<TopicsRecord>(record.topicId!);
      topicName = topicRecord.name;
      console.log("RECORD:", record);
    } catch (error) {
      console.error("Failed to load question:", error);
    } finally {
      isLoading = false;
    }
  }

  //   export type CardsRecord = {
  // 	answer?: string
  // 	answerMedia?: string[]
  // 	chapter?: string
  // 	created?: IsoDateString
  // 	difficulty?: number
  // 	id: string
  // 	isReversible?: boolean
  // 	level?: number
  // 	levelChanges?: number
  // 	quesitonMedia?: string[]
  // 	question?: string
  // 	topic: RecordIdString
  // 	updated?: IsoDateString
  // }

  async function handleSubmit() {
    let response;
    try {
      isLoading = true;
      const data = {
        question,
        answer,
        isReversible,
        difficulty,
        topicId,
      };
      if (userInput.questionId) {
        response = await pb.collection("Cards").update(userInput.questionId, data);
      } else {
        response = await pb.collection("Cards").create(data);
      }

      onSave();
    } catch (error) {
      console.error("Failed to save question:", error);
    } finally {
      isLoading = false;
      alert(JSON.stringify(response, null, 2));
    }
  }

  async function handleDelete() {
    if (!userInput.questionId || !confirm("Are you sure you want to delete this question?")) return;
    try {
      isLoading = true;
      const response = await pb.collection("Cards").delete(userInput.questionId);

      if (response) {
        userInput.currentView = "allQuestions";
        userInput.questionId = "";
      } else {
        alert("Deletion failed");
      }
      onSave();
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  }
</script>

<form class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-1" for="question">Question</label>

    <textarea id="question" bind:value={question} required class="w-full p-2 border rounded" rows="3"></textarea>
  </div>

  <div>
    <label class="block text-sm font-medium mb-1" for="answer">Answer</label>
    <textarea id="answer" bind:value={answer} required class="w-full p-2 border rounded" rows="3"></textarea>
  </div>

  <div>
    <label class="block text-sm font-medium mb-1" for="answer">Topic: {topicName}</label>
  </div>

  <div class="flex items-center gap-4">
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={isReversible} />
      <span class="text-sm">Reversible</span>
    </label>

    <div class="flex items-center gap-2">
      <label class="text-sm" for="difficulty">Difficulty:</label>
      <input id="difficulty" type="number" bind:value={difficulty} min="1" max="5" class="w-16 p-1 border rounded" />
    </div>
  </div>

  <div class="flex justify-between">
    <button
      onclick={handleSubmit}
      disabled={isLoading}
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {userInput.questionId ? "Update" : "Create"} Question
    </button>

    {#if userInput.questionId}
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
