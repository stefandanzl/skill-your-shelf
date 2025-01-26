<script lang="ts">
  import type { CardsRecord } from "../lib/pocketbase-types";
  let { questionList, targetLevel }: { questionList: CardsRecord[]; targetLevel: number } = $props();

  function getColor(level: number | undefined): string {
    if (typeof level === "undefined") level = 0;
    const red = Math.max(0, 255 - (level / targetLevel) * 255);
    const green = Math.min(255, (level / targetLevel) * 255);
    return `rgb(${red}, ${green}, 0)`;
  }
</script>

<div class="overflow-x-auto mt-4">
  <table class="min-w-full">
    <thead>
      <tr>
        <th class="px-4 py-2">Question</th>
        <th class="px-4 py-2">Answer</th>
        <th class="px-4 py-2">Chapter</th>
        <th class="px-4 py-2">Level</th>
        <th class="px-4 py-2">Difficulty</th>
      </tr>
    </thead>
    <tbody>
      {#each questionList as question}
        <tr class="border-t"> </tr><tr class="border-t" style="background-color: {getColor(question.level)};">
          <td class="px-4 py-2">{question.question}</td>
          <td class="px-4 py-2">{question.answer}</td>
          <td class="px-4 py-2">{question.chapter}</td>
          <td class="px-4 py-2">{question.level}</td>
          <td class="px-4 py-2">{question.difficulty}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
