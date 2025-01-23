<script lang="ts">

  import { createEventDispatcher } from 'svelte';
  import { pb } from '../lib/client.svelte';
  import type {TopicsRecord} from "../lib/pocketbase-types"
  import type {View} from "../lib/types"

  
  // const dispatch = createEventDispatcher();
  
  let topics = $state([]) as TopicsRecord[];
  let {selectedTopicId = $bindable() ,currentView = $bindable(),  ...rest } :{selectedTopicId: string, currentView: View} = $props();
    
  
  async function loadTopics() {
    const records = await pb.collection('topics').getList(1, 50, {
      sort: 'name'
    });
    topics = records.items;
  }

  // function dispatch(type) {
	// 	$host().dispatchEvent(new CustomEvent(type));
	// }

  function setView(){
    currentView = "allQuestions"
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
              onclick={() =>{ selectedTopicId = topic.id;
              setView()}}>
              View Questions
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>