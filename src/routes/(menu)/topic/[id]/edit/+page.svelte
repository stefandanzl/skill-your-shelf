<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { handleDelete, loadTopic, pb } from "$lib/client.svelte";
  import type { TopicsRecord } from "$lib/pocketbase-types";
  import { userInput, recordsData } from "$lib/state.svelte";

  function onSave() {}

  let topicName = $state<string | undefined>("");
  let description = $state<string | undefined>("");
  let isLoading = $state(false);
  let topicId = $state<string | undefined>("");
  let targetLevel = $state<number | undefined>();

  let isNew = false;

  $effect(() => {
    if (page.params.id === "new") {
      isNew = true;
    } else {
      if (userInput.topic) {
        topicName = userInput.topic.name;
        description = userInput.topic.description;
        targetLevel = userInput.topic.targetLevel ?? 0;
        topicId = userInput.topic.id;
      } else {
        console.error("No Topic Daata");
      }
    }

    // }
  });

  export async function handleSubmit() {
    let response;
    try {
      isLoading = true;
      const data = {
        name: topicName,
        description,
        targetLevel,
      };
      if (!isNew) {
        response = await pb.collection("Topics").update(topicId as string, data);
      } else {
        response = await pb.collection("Topics").create(data);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save topic:", error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container">
  <div class="nav-buttons">
    <button
      class="nav-button"
      onclick={() => {
        userInput.currentView = "topics";
        history.back();
      }}
    >
      ← Back to Topic
    </button>
  </div>

  <form class="form">
    <div class="form-group">
      <label class="label" for="topicName">Topic Name</label>
      <input id="topicName" bind:value={topicName} required class="input" placeholder="Enter topic name" />
    </div>

    <div class="form-group-full">
      <label class="label" for="description">Description</label>
      <textarea
        id="description"
        bind:value={description}
        required
        class="textarea"
        placeholder="Enter topic description"
      ></textarea>
    </div>

    <div class="form-group">
      <label class="label" for="targetLevel">Target Level</label>
      <input
        type="number"
        id="targetLevel"
        bind:value={targetLevel}
        min="1"
        class="input"
        placeholder="Enter target level"
      />
    </div>

    <div class="button-group">
      <button
        type="submit"
        onclick={() => {
          handleSubmit();
        }}
        disabled={isLoading}
        class="button button-primary"
      >
        {topicId ? "Update" : "Create"} Topic
      </button>

      {#if topicId}
        <button
          type="button"
          onclick={() => {
            handleDelete(topicId);
          }}
          disabled={isLoading}
          class="button button-danger"
        >
          Delete Topic
        </button>
      {/if}
    </div>
  </form>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .nav-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .nav-button {
    color: #3b82f6;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
  }

  .nav-button:hover {
    background-color: #333333;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .form-group-full {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #e5e5e5;
    min-width: 100px;
  }

  .input,
  .textarea {
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
  .textarea:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .textarea {
    min-height: 100px;
    resize: vertical;
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
