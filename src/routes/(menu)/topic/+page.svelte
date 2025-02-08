<script lang="ts">
  import { pb, loadTopics } from "$lib/client.svelte";
  import { type TopicsRecord, type CardsRecord } from "$lib/pocketbase-types";
  import type { ListResult } from "pocketbase";
  import { userInput, recordsData } from "$lib/state.svelte";
  //   import QuestionList from "./QuestionList.svelte";
  import ShortList from "$lib/ShortList.svelte";
  import { goto } from "$app/navigation";

  // let topics = $state<TopicsRecord[]>([]);
  let bucketCounts = $state<Record<string, number>>({});
  let targetLevel = $state<number>(0);
  let selectedLevels = $state<number[]>([]);
  let questionList = $state<CardsRecord[]>([]);

  function handleTopicSelect(topic: TopicsRecord) {
    userInput.topic = topic;
    userInput.selectedTopicId = topic.id;
    console.log("TOPIC:", topic);
    targetLevel = topic.targetLevel ?? 0;
    selectedLevels = [];
    questionList = [];
  }

  $effect(() => {
    console.log("loadTopics");
    loadTopics();
  });
</script>

<div class="header">
  <h2 class="title">Select a Topic</h2>
  <div class="topic-list">
    {#each recordsData.topics as topic}
      <button
        class="topic-card"
        onclick={() => {
          handleTopicSelect(topic);
          goto(`/topic/${topic.id}/`);
        }}
      >
        <h3 class="topic-name">{topic.name}</h3>
        <p class="topic-description">{topic.description}</p>
        <p class="topic-level">Target Level: {topic.targetLevel ?? 0}</p>
      </button>
    {/each}
  </div>
  <h2 class="title">More</h2>
  <div class="topic-list">
    <button
      class="topic-card"
      onclick={() => {
        userInput.currentView = "allQuestions";
        userInput.selectedTopicId = "";
      }}
    >
      <h3 class="topic-name">All Questions</h3>
    </button>
    <button
      class="topic-card"
      onclick={() => {
        userInput.currentView = "topicEdit";
        userInput.selectedTopicId = "";
      }}
    >
      <h3 class="topic-name">+ Add Topic</h3>
    </button>
  </div>
</div>

<style>
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
    margin-bottom: 2rem;
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
</style>
