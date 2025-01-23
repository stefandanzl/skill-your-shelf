<script lang="ts">
  import { pb } from '../lib/client.svelte';
  import { type TopicsRecord, type CardsRecord} from "../lib/pocketbase-types";
  
  
  let topics = $state([]) as TopicsRecord[];
  let selectedTopicId: string = $state("");
  let bucketCounts = $state<Record<number, number>>({});
  
  async function loadTopics() {
    const records = await pb.collection('topics').getList(1, 50, {
      sort: 'name'
    });
    topics = records.items;
  }
const a: Record<string,string> = {};

  async function loadBucketCounts(topicId: string) {
    const records = await pb.collection('cards').getList(1, 500, {
      filter: `topic = "${topicId}"`,
    });

    // Initialize counts
    bucketCounts = records.items.reduce((acc, card) => {
        //@ts-ignore
      acc[card.level] = (acc[card.level] || 0) + 1;
      return acc;
    }, {});
  }

  $effect(() => {
    loadTopics();
  });

  $effect(() => {
    if (selectedTopicId) {
      loadBucketCounts(selectedTopicId);
    }
  });
</script>

<div class="p-4">
  {#if !selectedTopicId}
    <h2 class="text-xl mb-4">Select a Topic</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each topics as topic}
        <button 
          class="p-4 border rounded hover:bg-gray-100"
          onclick={() => selectedTopicId = topic.id}>
          <h3 class="font-bold">{topic.name}</h3>
          <p class="text-sm text-gray-600">{topic.description}</p>
          <p class="text-sm">Target Level: {topic.targetLevel}</p>
        </button>
      {/each}
    </div>
  {:else}
    <div class="mb-4">
      <button 
        class="text-blue-500 hover:underline"
        onclick={() => selectedTopicId = ""}>
        ← Back to Topics
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {#each Object.entries(bucketCounts) as [level, count]}
        <div class="p-4 border rounded bg-white shadow">
          <h3 class="text-lg font-bold">Level {level}</h3>
          <p class="text-2xl">{count}</p>
          <p class="text-sm text-gray-600">questions</p>
        </div>
      {/each}
    </div>
  {/if}
</div>