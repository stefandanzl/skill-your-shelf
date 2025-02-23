<script lang="ts">
  import { showToast } from "$lib/util";
  import { pb } from "$lib/client.svelte";
  import type { CardsRecord, TopicsRecord } from "$lib/pocketbase-types";
  import { userInput } from "$lib/state.svelte";
  import BoolModal from "$lib/BoolModal.svelte";
  import { goto } from "$app/navigation";

  function onSave() {
    showToast("Question saved successfully!");
  }

  let question = $state<string | undefined>("");
  let answer = $state<string | undefined>("");
  let isReversible = $state<boolean | undefined>(false);
  let difficulty = $state<number | undefined>(1);
  let isLoading = $state(false);
  let topicId = $state<string | undefined>("");
  let topicName = $state<string | undefined>("");
  let topics = $state<TopicsRecord[]>([]);
  let modalData = $state({ show: false, text: "", result: undefined });

  $effect(() => {
    $inspect(userInput);
    if (userInput.questionId) {
      loadQuestion();
    } else if (userInput.selectedTopicId) {
      topicId = userInput.selectedTopicId;
      loadTopicName();
    }
    // Load topics when component mounts
    loadTopics();
  });

  async function loadTopics() {
    try {
      const records = await pb.collection("Topics").getFullList<TopicsRecord>();
      topics = records;
    } catch (error) {
      console.error("Failed to load topics:", error);
    }
  }

  async function showModal(text: string) {
    modalData.text = text;
    modalData.show = true;
  }

  function closeModal() {}

  async function loadTopicName() {
    if (!topicId) return;
    const topicRecord = await pb.collection("Topics")?.getOne<TopicsRecord>(topicId);
    topicName = topicRecord.name;
  }

  async function loadQuestion() {
    try {
      isLoading = true;
      const record = await pb.collection("Cards")?.getOne<CardsRecord>(userInput.questionId!);
      question = record.question;
      answer = record.answer;
      isReversible = record.isReversible;
      difficulty = record.difficulty;
      topicId = record.topicId;

      if (topicId) {
        await loadTopicName();
      }
      console.log("RECORD:", record);
    } catch (error) {
      console.error("Failed to load question:", error);
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit() {
    let response;
    try {
      isLoading = true;
      const data = {
        question,
        answer,
        isReversible,
        difficulty,
        topicId: topicId,
      };
      if (userInput.questionId) {
        response = await pb.collection("Cards").update(userInput.questionId, data);
      } else {
        response = await pb.collection("Cards").create(data);
        userInput.questionId = response.id;
        try {
          loadQuestion();
        } catch (error) {
          console.log("Error creating question", error);
        }
      }

      onSave();
    } catch (error) {
      console.error("Failed to save question:", error);
    } finally {
      isLoading = false;
    }
  }

  function showDeleteModal() {
    if (!userInput.questionId) {
      return;
    } else {
      showModal("Are you sure you want to delete this question?");
    }
  }

  async function handleDelete() {
    if (!userInput.questionId) {
      return;
    }
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

  function confirmDelete(bool: boolean) {
    modalData.show = false;
    if (bool) {
      handleDelete();
    }
  }

  function handleTopicChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    topicId = select.value;
    const selectedTopic = topics.find((t) => t.id === topicId);
    topicName = selectedTopic?.name || "";
  }
</script>

<div>
  <div class="nav-buttons">
    <button
      class="nav-button"
      onclick={() => {
        userInput.currentView = "topicQuestions";
        history.back();
      }}
    >
      ← Back to Questions
    </button>
  </div>
  <div class="form-container">
    <form class="form">
      <div class="form-group">
        <label class="label" for="question">Question</label>
        <textarea id="question" bind:value={question} required class="textarea" placeholder="Enter your question"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="label" for="answer">Answer</label>
        <textarea id="answer" bind:value={answer} required class="textarea" placeholder="Enter the answer"></textarea>
      </div>

      <div class="form-group">
        <label class="label" for="topic">Topic</label>
        <select id="topic" bind:value={topicId} onchange={handleTopicChange} class="select" required>
          <option value="">Select a topic</option>
          {#each topics as topic}
            <option value={topic.id}>{topic.name}</option>
          {/each}
        </select>
      </div>

      <div class="checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={isReversible} class="checkbox" />
          <span>Reversible</span>
        </label>

        <div class="difficulty-group">
          <label class="label" for="difficulty">Difficulty:</label>
          <input id="difficulty" type="number" bind:value={difficulty} min="1" max="5" class="input difficulty-input" />
        </div>
      </div>

      <div class="button-group">
        <button type="submit" onclick={handleSubmit} disabled={isLoading} class="button button-primary">
          {userInput.questionId ? "Update" : "Create"} Question
        </button>

        {#if userInput.questionId}
          <button type="button" onclick={showDeleteModal} disabled={isLoading} class="button button-danger">
            Delete
          </button>
        {/if}
      </div>
    </form>

    {#if modalData.show}
      <bool-modal text={modalData.text} onyes={() => confirmDelete(true)} onno={() => confirmDelete(false)}
      ></bool-modal>
    {/if}
  </div>
</div>

<style>
  .form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #e5e5e5;
  }

  .input,
  .textarea,
  .select {
    padding: 0.75rem 1rem;
    background-color: #2a2a2a;
    border: 1px solid #404040;
    border-radius: 0.5rem;
    color: #e5e5e5;
    font-size: 1rem;
    transition: border-color 0.2s;
    width: 100%;
  }

  .input:focus,
  .textarea:focus,
  .select:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e5e5e5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.5em;
    padding-right: 2.5rem;
  }

  .textarea {
    min-height: 100px;
    resize: vertical;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #e5e5e5;
    cursor: pointer;
  }

  .checkbox {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    border: 2px solid #404040;
    appearance: none;
    background-color: #2a2a2a;
    cursor: pointer;
    transition: all 0.2s;
  }

  .checkbox:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  .difficulty-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .difficulty-input {
    width: 4rem;
    text-align: center;
    padding: 0.5rem;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
  }

  .button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-primary {
    background-color: #3b82f6;
    color: white;
  }

  .button-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .button-danger {
    background-color: #ef4444;
    color: white;
  }

  .button-danger:hover:not(:disabled) {
    background-color: #dc2626;
  }
</style>
