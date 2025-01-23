<script lang="ts">
  import { pb } from '../lib/client.svelte';
  import type {ListResult} from "pocketbase"
  import type { CardsRecord , CardsResponse, } from "../lib/pocketbase-types"
  
//   export let topicId: string | null = null;
  // let topicId: (string | null ) = $props()
  let {topicId }:{topicId: string | null} = $props();
  let questions = $state([]) as CardsRecord[];
  
  async function loadQuestions() {
    console.log(JSON.stringify(topicId))
    const filter = topicId ? `topic = "${topicId}"` : '';
    console.log(filter)
    const records : ListResult<CardsRecord> = await pb.collection('cards').getList(1, 50, {
      sort: 'created',
      filter
    })  ;
    questions  = records.items;
    console.log(JSON.stringify(records,null,2))
  }

  $effect(() => {
    loadQuestions();
  });
</script>

<div class="overflow-x-auto mt-4">
  <table class="min-w-full">
    <thead>
      <tr>
        <th class="px-4 py-2">Question</th>
        <th class="px-4 py-2">Chapter</th>
        <th class="px-4 py-2">Level</th>
        <th class="px-4 py-2">Difficulty</th>
        <th class="px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each questions as question}
        <tr class="border-t">
          <td class="px-4 py-2">{question.question}</td>
          <td class="px-4 py-2">{question.chapter}</td>
          <td class="px-4 py-2">{question.level}</td>
          <td class="px-4 py-2">{question.difficulty}</td>
          <td class="px-4 py-2">
            <button 
              class="px-3 py-1 rounded bg-blue-500 text-white">
              Edit
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>