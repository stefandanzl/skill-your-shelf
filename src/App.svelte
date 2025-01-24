<script lang="ts">
  import { userInput } from "./lib/state.svelte";
  import MenuView from "./views/MenuView.svelte";
  import PracticeView from "./views/PracticeView.svelte";
</script>

<main>
  {#if userInput.currentMode === "menu"}
    <MenuView />
  {/if}
  {#if userInput.currentMode === "practice"}
    <PracticeView />
  {/if}
</main>
