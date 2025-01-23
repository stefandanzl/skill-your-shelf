<script lang="ts">
  import TopicList from './menu/TopicList.svelte';
  import QuestionList from './menu/QuestionList.svelte';
  import BucketView from './menu/BucketView.svelte';
  import Header from './menu/Header.svelte';
  import type { View } from "./lib/types";

  let currentView = $state<View>('topics'); 
  let selectedTopicId = $state("");

  $inspect(currentView, selectedTopicId)
</script>

<Header bind:currentView bind:selectedTopicId />

<main class="max-w-5xl w-full mx-auto p-4">
  {#if currentView === 'topics' || currentView === 'topicQuestions'}
    <TopicList bind:selectedTopicId bind:currentView />
  {/if}
  {#if (currentView === 'allQuestions' && selectedTopicId) || currentView === 'allQuestions'}
    <QuestionList topicId={selectedTopicId} />
  {/if}
  {#if currentView === 'buckets'}
    <BucketView />
  {/if}
</main>