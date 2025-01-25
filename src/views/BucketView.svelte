<script lang="ts">
  import { pb } from "../lib/client";
  import { type TopicsRecord, type CardsRecord } from "../lib/pocketbase-types";
  import type { ListResult } from "pocketbase";
  import { userInput } from "../lib/state.svelte";
  import QuestionList from "./QuestionList.svelte";

  let topics = $state([]) as TopicsRecord[];
  let bucketCounts = $state<Record<number, number>>({});
  let targetLevel = $state<number>();
  // let levelBuckets = $state([]) as { count: number; ids: string[] }[];
  let selectedLevels = $state([]) as number[];
  let questionList = $state<CardsRecord[]>([]);
  let levelBuckets = $state<Record<number, boolean>>({});

  async function loadTopics() {
    const records = await pb.collection("topics").getList(1, 50, {
      sort: "name",
    });
    topics = records.items;
  }
  const a: Record<string, string> = {};

  async function loadBucketCounts(topicId: string) {
    const records = (await pb.collection("cards").getList(1, 500, {
      filter: `topicId = "${topicId}"`,
      sort: "level",
    })) as ListResult<CardsRecord>;

    // Initialize counts
    bucketCounts = records.items.reduce((acc, card) => {
      //@ts-ignore
      acc[card.level] = (acc[card.level] || 0) + 1;
      return acc;
    }, {});

    records.items.forEach((v: CardsRecord) => {
      if (typeof v.level === "undefined") {
        v.level = 0;
      }
      // if (!levelBuckets[v.level].ids) {
      // levelBuckets[v.level].ids ?? [];
      levelBuckets[v.level] = levelBuckets[v.level] ?? { count: 0, ids: [] };
      // }
      console.log(levelBuckets[v.level]);
      levelBuckets[v.level].ids.push(v.id);
    });
  }

  async function loadLevelQuestions() {
    if (selectedLevels.length === 0) return;
    let filter = "";
    selectedLevels.forEach((lv: number) => {
      filter += `level = '${lv}'||`;
    });
    filter = `(${filter.slice(0, filter.length - 2)})`;

    const records = await pb.collection("cards").getList(1, 500, {
      filter: `topicId = "${userInput.selectedTopicId}" && ${filter}`,
      sort: "level",
    });
    questionList = records.items;
  }
  $effect(() => {
    loadTopics();
  });

  $effect(() => {
    if (userInput.selectedTopicId) {
      loadBucketCounts(userInput.selectedTopicId);
    } else {
      userInput.practiceQuestions = [];
    }
  });
</script>

<div class="p-4">
  {#if !userInput.selectedTopicId}
    <h2 class="text-xl mb-4">Select a Topic</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each topics as topic}
        <button
          class="p-4 border rounded hover:bg-gray-100"
          onclick={() => {
            userInput.selectedTopicId = topic.id;
            targetLevel = topics.filter((v, i, a) => topic.id === v.id)[0].targetLevel;

            levelBuckets = [];
            if (typeof targetLevel !== "undefined") {
              for (let i = 0; i <= targetLevel; i++) {
                levelBuckets[i].ids.push(topic.id);
              }
            }
          }}
        >
          <h3 class="font-bold">{topic.name}</h3>
          <p class="text-sm text-gray-600">{topic.description}</p>
          <p class="text-sm">Target Level: {topic.targetLevel}</p>
        </button>
      {/each}
    </div>
  {:else}
    <div class="mb-4">
      <button class="text-blue-500 hover:underline" onclick={() => (userInput.selectedTopicId = "")}>
        ← Back to Topics
      </button>
    </div>
    <h2 class="text-xl mb-4">Select a Bucket</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- {#each Object.entries(levelBuckets) as [level, data]} -->
      {#each [...Array(targetLevel).keys()] as level (level)}
        <button
          class="p-4 border rounded {selectedLevels.includes(level) ? 'bg-white' : 'hover:bg-gray-100'}"
          disabled={!bucketCounts[level]}
          onclick={() => {
            if (selectedLevels.includes(level)) {
              selectedLevels = selectedLevels.filter((l) => l !== level);
            } else {
              selectedLevels.push(level);
              selectedLevels = [...selectedLevels];
            }
            loadLevelQuestions();
            // console.log(selectedLevels.includes(level));
          }}
        >
          <!-- // userInput.practiceQuestions = > -->
          <h3 class="font-bold">Level {level}</h3>
          <!-- <p class="text-sm text-gray-600">{topic.description}</p>
          <p class="text-sm">Target Level: {topic.targetLevel}</p> -->
          <p class="text-2xl">{bucketCounts[level] || 0} questions</p>
        </button>
      {/each}
    </div>
  {/if}
  {#if questionList.length > 0}
    <QuestionList />
  {/if}
</div>
