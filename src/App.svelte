// src/App.svelte
<script lang="ts">
  // import { type State } from '@tsconfig/svelte';
  import TopicList from './menu/TopicList.svelte';
  import QuestionList from './menu/QuestionList.svelte';
  import BucketView from './menu/BucketView.svelte';

  let currentView = $state('topics'); // Can be 'topics', 'allQuestions', 'topicQuestions', 'buckets'
  let selectedTopicId: string = $state("");
</script>

<main class="container mx-auto p-4">
  <h1 class="text-2xl mb-4">SkillYourShelf</h1>
  
  <div class="flex gap-4 mb-4">
    <button 
      class="px-4 py-2 rounded bg-blue-500 text-white"
      onclick={() => currentView = 'topics'}>
      Show Topics
    </button>
    <button 
      class="px-4 py-2 rounded bg-blue-500 text-white"
      onclick={() => {
        currentView = 'allQuestions';
        selectedTopicId = "";
      }}>
      Show All Questions
    </button>
    <button 
      class="px-4 py-2 rounded bg-blue-500 text-white"
      onclick={() => {
        currentView = 'buckets';
        selectedTopicId = "";
      }}>
      Bucket Overview
    </button>
  </div>

  {#if currentView === 'topics' || currentView === 'topicQuestions'}
    <TopicList 
      on:topicSelect={(e) => {
        selectedTopicId = e.detail;
        currentView = 'topicQuestions';
      }} 
    />
  {/if}

  {#if currentView === 'allQuestions' || (currentView === 'topicQuestions' && selectedTopicId)}
    <QuestionList topicId={selectedTopicId} />
  {/if}

  {#if currentView === 'buckets'}
    <BucketView />
  {/if}
</main>