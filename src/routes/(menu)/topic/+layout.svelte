<script lang="ts">
  // import { pb } from "$lib/client.svelte";
  import { type TopicsRecord, type CardsRecord } from "$lib/pocketbase-types";
  import type { ListResult } from "pocketbase";
  import { userInput } from "$lib/state.svelte";
  //   import QuestionList from "./QuestionList.svelte";
  let { children, ...rest } = $props();

  let topics = $state<TopicsRecord[]>([]);
  let bucketCounts = $state<Record<string, number>>({});
  let targetLevel = $state<number>(0);
  let selectedLevels = $state<number[]>([]);
  let questionList = $state<CardsRecord[]>([]);
</script>

<div class="container">
  {@render children()}
</div>

<style>
  .container {
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }
</style>
