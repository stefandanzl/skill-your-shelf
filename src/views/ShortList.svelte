<script lang="ts">
  import type { CardsRecord } from "../lib/pocketbase-types";
  let { questionList, targetLevel }: { questionList: CardsRecord[]; targetLevel: number } = $props();

  function getColor(level: number | undefined): string {
    if (typeof level === "undefined") level = 0;
    const startColor = "#482D2D"; // default start color (white)
    const endColor = "#345634"; // default end color (black)
    function hexToRgb(hex: string) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    }

    function rgbToHex(r: number, g: number, b: number) {
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    const startRgb = hexToRgb(startColor);
    const endRgb = hexToRgb(endColor);

    const r = Math.round(startRgb[0] + (endRgb[0] - startRgb[0]) * (level / targetLevel));
    const g = Math.round(startRgb[1] + (endRgb[1] - startRgb[1]) * (level / targetLevel));
    const b = Math.round(startRgb[2] + (endRgb[2] - startRgb[2]) * (level / targetLevel));

    return rgbToHex(r, g, b);
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
