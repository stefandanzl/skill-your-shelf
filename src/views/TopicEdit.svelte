<script lang="ts">
  import { preventDefault } from "../lib/util";
  import { pb } from "../lib/client";
  import type { TopicsRecord } from "../lib/pocketbase-types";

  import { userInput } from "../lib/state.svelte";

  function onSave() {}

  let topicName = $state<string | undefined>("");
  let description = $state<string | undefined>("");
  let isLoading = $state(false);
  let topicId = $state<string | undefined>("");
  let targetLevel = $state<number | undefined>();

  const formData = $state<{
    topicName: string | undefined;
    description: string | undefined;
    isLoading: false;
  }>({ topicName: "", description: "", isLoading: false });

  $effect(() => {
    if (userInput.selectedTopicId && !topicId) {
      topicId = userInput.selectedTopicId;
      loadTopic();
      console.log("JJJJ");
    }
  });

  async function loadTopic() {
    try {
      isLoading = true;
      const record = await pb.collection("Topics")?.getOne<TopicsRecord>(topicId!);
      topicName = record.name;
      description = record.description;
      targetLevel = record.targetLevel;

      console.log("RECORD:", record);
    } catch (error) {
      console.error("Failed to load topic:", error);
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit() {
    let response;
    try {
      isLoading = true;
      const data = {
        name: topicName,
        description,
        targetLevel,
      };
      if (topicId) {
        response = await pb.collection("Topics").update(topicId, data);
      } else {
        response = await pb.collection("Topics").create(data);
      }

      onSave();
    } catch (error) {
      console.error("Failed to save topic:", error);
    } finally {
      isLoading = false;
      alert(JSON.stringify(response, null, 2));
    }
  }

  async function handleDelete() {
    if (!topicId || !confirm("Are you sure you want to delete this topic?")) return;
    try {
      isLoading = true;
      const response = await pb.collection("Topics").delete(topicId);

      if (response) {
        userInput.currentView = "topicQuestions";
        userInput.selectedTopicId = "";
      } else {
        alert("Deletion failed");
      }
      onSave();
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
  }
</script>

<form class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-1" for="topicName">Topic Name</label>
    <input id="topicName" bind:value={topicName} required class="w-full p-2 border rounded" />
  </div>

  <div>
    <label class="block text-sm font-medium mb-1" for="description">Description</label>
    <textarea id="description" bind:value={description} required class="w-full p-2 border rounded" rows="3"></textarea>
  </div>
  <div>
    <label class="block text-sm font-medium mb-1" for="description">Target Level</label>
    <input type="number" id="description" bind:value={targetLevel} min="1" class="w-full p-2 border rounded" />
  </div>

  <div class="flex justify-between">
    <button
      onclick={handleSubmit}
      disabled={isLoading}
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {topicId ? "Update" : "Create"} Topic
    </button>

    {#if topicId}
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
