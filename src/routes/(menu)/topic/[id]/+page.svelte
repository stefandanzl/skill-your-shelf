<script lang="ts">
  import { pb } from "$lib/client.svelte";
  import { type TopicsRecord, type CardsRecord } from "$lib/pocketbase-types";
  import type { ListResult } from "pocketbase";
  import { userInput } from "$lib/state.svelte";
  //   import QuestionList from "./QuestionList.svelte";
  import ShortList from "$lib/ShortList.svelte";
  // let { topics, ...rest } = $props();
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  //   let topics = $state<TopicsRecord[]>([]);
  let bucketCounts = $state<Record<string, number>>({});
  let targetLevel = $state<number>(0);
  let selectedLevels = $state<number[]>([]);
  let questionList = $state<CardsRecord[]>([]);

  $effect(() => {
    console.log("ID = ", page.params.id);
    console.log("loadBucketCounts");
    if (userInput.selectedTopicId) {
      loadBucketCounts(userInput.selectedTopicId);
    } else {
      userInput.practiceQuestions = [];
      bucketCounts = {};
      selectedLevels = [];
      questionList = [];
    }
  });

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
    let filter = `topicId = "${userInput.selectedTopicId}" && (${levelFilters}`;
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
    const list: string[] = [];
    questionList.forEach((qu) => {
      list.push(qu.id);
    });
    userInput.practiceQuestions = list;
  }

  function toggleLevel(level: number) {
    if (selectedLevels.includes(level)) {
      selectedLevels = selectedLevels.filter((l) => l !== level);
    } else {
      selectedLevels = [...selectedLevels, level];
    }
    loadLevelQuestions();
  }

  function toggleAllLevels() {
    const availableLevels = Array.from({ length: targetLevel + 1 }, (_, i) => i).filter(
      (level) => bucketCounts[level?.toString()],
    );
    if (selectedLevels.length === availableLevels.length) {
      selectedLevels = [];
    } else {
      selectedLevels = availableLevels;
    }
    loadLevelQuestions();
  }

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
  }
</script>

<div class="nav-buttons">
  <button
    class="nav-button"
    onclick={() => {
      userInput.selectedTopicId = "";
      history.back();
    }}
  >
    ← Back
  </button>
  <button
    class="nav-button"
    onclick={() => {
      userInput.currentView = "topicEdit";
      goto(`/topic/${page.params.id}/edit`);
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

  <button
    class="practice-button"
    class:enabled={userInput.practiceQuestions.length !== 0}
    disabled={userInput.practiceQuestions.length === 0}
    onclick={() => {
      userInput.currentMode = "practice";
    }}
  >
    Practice Selection
  </button>
</div>

<h2 class="title">Select a Bucket</h2>

<div class="bucket-list">
  <button class="all-bucket" onclick={toggleAllLevels}>
    <span class="all-bucket-title">Level:</span>
    <span class="all-bucket-title">Count:</span>
  </button>
  {#each Array.from({ length: targetLevel + 1 }, (_, i) => i) as level}
    <button
      class="bucket-card"
      class:selected={selectedLevels.includes(level)}
      disabled={!bucketCounts[level?.toString()]}
      onclick={() => toggleLevel(level)}
    >
      <span class="bucket-title">{level}</span>
      <span class="bucket-count">{bucketCounts[level?.toString()] || 0}</span>
    </button>
  {/each}
</div>
{#if questionList.length > 0}
  <ShortList {questionList} {targetLevel} />
{/if}

<style>
  .title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #e5e5e5;
  }

  .nav-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
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
    justify-content: center; /* Center the buckets */
    gap: 1rem;
    flex-wrap: wrap; /* Allow wrapping if needed */
    margin: 0 auto; /* Center the container */
  }

  .bucket-card {
    background: #2a2a2a;
    color: #3b82f6;
    height: 5rem;
    width: 3rem; /* Fixed width */
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #404040;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .bucket-card:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
    font-size: 2rem;
    /* color: #e5e5e5; */
    color: #3b82f6;
    margin-bottom: 0.5rem;
  }

  .bucket-count {
    font-size: 1rem;
    color: #a3a3a3;
  }

  .all-bucket {
    background: #3b82f6;
    border-color: #2563eb;
    height: 5rem;
    width: 5rem; /* Fixed width */
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #404040;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .all-bucket-title {
    font-size: 1.1rem;
    color: #e5e5e5;
    margin-bottom: 0.5rem;
  }

  .all-bucket:hover:not(:disabled) {
    background: #2563eb;
  }

  .practice-button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    color: #e5e5e5;
    background-color: #2a2a2a;
  }

  .practice-button.enabled {
    background-color: #10b981;
    border-color: #059669;
  }

  .practice-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
