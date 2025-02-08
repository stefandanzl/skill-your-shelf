<script lang="ts">
  import type { CardsRecord } from "../lib/pocketbase-types";
  let { questionList, targetLevel }: { questionList: CardsRecord[]; targetLevel: number } = $props();

  function getLevelColor(level: number | undefined): string {
    if (typeof level === "undefined") return "#2a2a2a";

    // Different color schemes based on level
    const colorSchemes = [
      "#2a2a2a", // Level 0 - Dark gray
      "#374151", // Level 1 - Slate
      "#1e3a8a", // Level 2 - Dark blue
      "#065f46", // Level 3 - Dark green
      "#7c2d12", // Level 4 - Dark orange
      "#581c87", // Level 5+ - Dark purple
    ];

    return colorSchemes[Math.min(level, colorSchemes.length - 1)];
  }
</script>

<div class="scroll-container">
  <table class="question-table">
    <thead>
      <tr>
        <th class="table-header">Question</th>
        <th class="table-header">Answer</th>
        <th class="table-header">Chapter</th>
        <th class="table-header">Level</th>
        <th class="table-header">Difficulty</th>
      </tr>
    </thead>
    <tbody>
      {#each questionList as question}
        <tr class="table-row" style="background-color: {getLevelColor(question.level)};">
          <td class="table-cell question-cell">{question.question}</td>
          <td class="table-cell answer-cell">{question.answer}</td>
          <td class="table-cell meta-cell">{question.chapter || "-"}</td>
          <td class="table-cell meta-cell">{question.level || "0"}</td>
          <td class="table-cell meta-cell">{question.difficulty || "-"}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .question-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.5rem;
    margin: 1rem 0;
  }

  .table-header {
    text-align: left;
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.75rem 1rem;
  }

  .table-row {
    transition: transform 0.2s;
  }

  .table-row:hover {
    transform: translateX(4px);
  }

  .table-cell {
    padding: 1rem;
    color: #e5e5e5;
    border-top: 1px solid #404040;
  }

  .question-cell {
    max-width: 300px;
    font-weight: 500;
  }

  .answer-cell {
    max-width: 300px;
    color: #94a3b8;
  }

  .meta-cell {
    text-align: center;
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .scroll-container {
    overflow-x: auto;
    margin-top: 1rem;
    border-radius: 0.5rem;
    background: #1a1a1a;
    padding: 1rem;
  }
</style>
