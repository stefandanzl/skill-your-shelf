// src/components/TopicList.svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { pb } from '../lib/client';
  
  const dispatch = createEventDispatcher();
  
  let topics = $state([]);
  
  async function loadTopics() {
    const records = await pb.collection('topics').getList(1, 50, {
      sort: 'name'
    });
    topics = records.items;
  }

  $effect(() => {
    loadTopics();
  });
</script>

<div class="overflow-x-auto">
  <table class="min-w-full">
    <thead>
      <tr>
        <th class="px-4 py-2">Name</th>
        <th class="px-4 py-2">Description</th>
        <th class="px-4 py-2">Target Level</th>
        <th class="px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each topics as topic}
        <tr class="border-t">
          <td class="px-4 py-2">{topic.name}</td>
          <td class="px-4 py-2">{topic.description}</td>
          <td class="px-4 py-2">{topic.targetLevel}</td>
          <td class="px-4 py-2">
            <button 
              class="px-3 py-1 rounded bg-green-500 text-white"
              onclick={() => dispatch('topicSelect', topic.id)}>
              View Questions
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>