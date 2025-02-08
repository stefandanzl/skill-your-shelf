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

<div class="container">
  {#if !userInput.selectedTopicId}
    <div class="header">
      <h2 class="title">Select a Topic</h2>
      <div class="topic-list">
        {#each topics as topic}
          <button class="topic-card" onclick={() => handleTopicSelect(topic)}>
            <h3 class="topic-name">{topic.name}</h3>
            <p class="topic-description">{topic.description}</p>
            <p class="topic-level">Target Level: {topic.targetLevel ?? 0}</p>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="nav-buttons">
      <button class="nav-button" onclick={() => (userInput.selectedTopicId = "")}> ← Back to Topics </button>
      <button
        class="nav-button"
        onclick={() => {
          userInput.currentView = "topicEdit";
        }}
      >
        Edit Topic
      </button>
      <button
        class="nav-button"
        onclick={() => {
          userInput.currentView = "topicQuestions";
        }}
      >
        Edit Questions
      </button>
    </div>

    <h2 class="title">Select a Bucket</h2>
    <div class="bucket-list">
      {#each Array.from({ length: targetLevel + 1 }, (_, i) => i) as level}
        <button
          class="bucket-card"
          class:selected={selectedLevels.includes(level)}
          disabled={!bucketCounts[level?.toString()]}
          onclick={() => toggleLevel(level)}
        >
          <span class="bucket-title">Level {level}</span>
          <span class="bucket-count">{bucketCounts[level?.toString()] || 0} questions</span>
        </button>
      {/each}
    </div>
  {/if}

  {#if questionList.length > 0}
    <ShortList {questionList} {targetLevel} />
  {/if}
</div>

<style>
  .container {
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .header {
    margin-bottom: 2rem;
  }

  .title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #e5e5e5;
  }

  .topic-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .topic-card {
    background: #2a2a2a;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #404040;
    cursor: pointer;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .topic-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .topic-name {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #e5e5e5;
  }

  .topic-description {
    color: #a3a3a3;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .topic-level {
    color: #a3a3a3;
    font-size: 0.9rem;
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

  .bucket-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .bucket-card {
    background: #2a2a2a;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #404040;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .bucket-card:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .bucket-card.selected {
    background-color: #10b981;
    border-color: #059669;
  }

  .bucket-title {
    font-size: 1.1rem;
    color: #e5e5e5;
  }

  .bucket-count {
    font-size: 1.2rem;
    color: #e5e5e5;
  }
</style>
