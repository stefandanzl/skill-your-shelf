<script lang="ts">
  import { pb } from "../lib/client";
  import { type TopicsRecord, type CardsRecord } from "../lib/pocketbase-types";
  import type { ListResult } from "pocketbase";
  import { userInput } from "../lib/state.svelte";
  import QuestionList from "./QuestionList.svelte";
  import ShortList from "./ShortList.svelte";

  let topics = $state<TopicsRecord[]>([]);
  let bucketCounts = $state<Record<string, number>>({});
  let targetLevel = $state<number>(0);
  let selectedLevels = $state<number[]>([]);
  let questionList = $state<CardsRecord[]>([]);

  async function loadTopics() {
    const records = await pb.collection("topics").getList<TopicsRecord>(1, 50, {
      sort: "name",
    });
    topics = records.items;
  }

  $inspect("BUCKET Counts", bucketCounts);

  async function loadBucketCounts(topicId: string) {
    const records = await pb.collection("cards").getList<CardsRecord>(1, 500, {
      filter: `topicId = "${topicId}"`,
      sort: "level",
    });

    bucketCounts = records.items.reduce(
      (acc, card) => {
        let level = "";
        if (typeof card.level !== "undefined") {
          if (card.level < targetLevel) {
            level = card.level.toString();
          } else {
            level = targetLevel.toString();
          }
        } else {
          level = "0";
        }

        acc[level] = (acc[level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log("BUCKET Counts", bucketCounts);
  }

  async function loadLevelQuestions() {
    if (selectedLevels.length === 0) {
      questionList = [];
      userInput.practiceQuestions = [];
      return;
    }

    const levelFilters = selectedLevels
      .filter((lv) => lv <= targetLevel)
      .map((lv) => `level = ${lv}`)
      .join("||");
    let filter = `topicId = "${userInput.selectedTopicId}" && (${levelFilters}`; //)
    if (selectedLevels.includes(targetLevel)) {
      filter += `|| level >= ${targetLevel})`;
    } else {
      filter += `)`;
    }

    const records = await pb.collection("cards").getList<CardsRecord>(1, 500, {
      filter,
      sort: "level",
    });
    questionList = records.items;
    // userInput.practiceQuestions = [];
    const list: string[] = [];
    questionList.forEach((qu) => {
      list.push(qu.id);
    });
    userInput.practiceQuestions = list;
  }

  function handleTopicSelect(topic: TopicsRecord) {
    userInput.selectedTopicId = topic.id;
    targetLevel = topic.targetLevel ?? 0;
    selectedLevels = [];
    questionList = [];
  }

  function toggleLevel(level: number) {
    if (selectedLevels.includes(level)) {
      selectedLevels = selectedLevels.filter((l) => l !== level);
    } else {
      selectedLevels = [...selectedLevels, level];
    }
    loadLevelQuestions();
  }

  $effect(() => {
    loadTopics();
  });

  $effect(() => {
    if (userInput.selectedTopicId) {
      loadBucketCounts(userInput.selectedTopicId);
    } else {
      userInput.practiceQuestions = [];
      bucketCounts = {};
      selectedLevels = [];
      questionList = [];
    }
  });
</script>

<div class="p-4">
  {#if !userInput.selectedTopicId}
    <h2 class="text-xl mb-4">Select a Topic</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each topics as topic}
        <button class="p-4 border rounded hover:bg-gray-100" onclick={() => handleTopicSelect(topic)}>
          <h3 class="font-bold">{topic.name}</h3>
          <p class="text-sm text-gray-600">{topic.description}</p>
          <p class="text-sm">Target Level: {topic.targetLevel ?? 0}</p>
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
      {#each Array.from({ length: targetLevel + 1 }, (_, i) => i) as level}
        <button
          class="p-4 border rounded bg-white hover:bg-gray-100"
          style="background-color: {selectedLevels.includes(level) ? 'green' : ''}"
          disabled={!bucketCounts[level?.toString()]}
          onclick={() => toggleLevel(level)}
        >
          <h3 class="font-bold">Level {level}</h3>
          <p class="text-2xl">{bucketCounts[level?.toString()] || 0} questions</p>
        </button>
      {/each}
    </div>
  {/if}
  {#if questionList.length > 0}
    <ShortList {questionList} {targetLevel} />
  {/if}
</div>
