<script lang="ts">
  import { pb } from "../lib/client";
  import type { ListResult } from "pocketbase";
  import type { CardsRecord, CardsResponse } from "../lib/pocketbase-types";
  import { userInput } from "../lib/state.svelte";

  let { key = "" } = $props();
  let questions = $state([]) as CardsRecord[];

  async function loadQuestions() {
    const filter = userInput.selectedTopicId ? `topicId = "${userInput.selectedTopicId}"` : "";
    const records: ListResult<CardsRecord> = await pb.collection("cards").getList(1, 50, {
      sort: "created",
      filter,
    });
    questions = records.items;

    userInput.practiceQuestions = [];
    questions.forEach((q) => {
      userInput.practiceQuestions.push(q.id);
    });
  }

  $effect(() => {
    loadQuestions();
  });
</script>

<div>
  <div class="nav-buttons">
    <button class="nav-button" onclick={() => (userInput.currentView = "topics")}> ← Back to Topic </button>
  </div>
  <div class="table-container">
    <table class="question-table">
      <thead>
        <tr>
          <th class="table-header">Question</th>
          <th class="table-header">Answer</th>
          <th class="table-header">Chapter</th>
          <th class="table-header">Level</th>
          <th class="table-header">Difficulty</th>
          <th class="table-header"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="add-button-row">
          <td colspan="6">
            <button
              onclick={() => {
                userInput.currentView = "questionEdit";
                userInput.questionId = "";
              }}
              class="add-button"
            >
              + Add Question
            </button>
          </td>
        </tr>
        {#each questions as question}
          <tr class="table-row">
            <td class="table-cell">{question.question}</td>
            <td class="table-cell">{question.answer}</td>
            <td class="table-cell">{question.chapter}</td>
            <td class="table-cell">{question.level}</td>
            <td class="table-cell">{question.difficulty}</td>
            <td class="table-cell">
              <button
                onclick={() => {
                  userInput.currentView = "questionEdit";
                  userInput.questionId = question.id;
                }}
                class="edit-button"
              >
                Edit
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .table-container {
    overflow-x: auto;
    margin-top: 1rem;
    border-radius: 0.5rem;
    background: #1a1a1a;
    padding: 1rem;
  }

  .question-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  .table-header {
    text-align: left;
    color: #94a3b8;
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    font-weight: 500;
  }

  .table-row {
    border-top: 1px solid #404040;
    transition: background-color 0.2s;
  }

  .table-row:hover {
    background-color: #2a2a2a;
  }

  .table-cell {
    padding: 1rem;
    color: #e5e5e5;
  }

  .add-button-row {
    text-align: center;
    border-top: 1px solid #404040;
  }

  .add-button {
    padding: 0.75rem 1.5rem;
    color: #3b82f6;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    width: 100%;
  }

  .add-button:hover {
    background-color: #2a2a2a;
  }

  .edit-button {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .edit-button:hover {
    background-color: #2563eb;
  }
</style>
