<script lang="ts">
  import type { ListResult } from "pocketbase";
  import { pb } from "../lib/client";
  import type { CardsRecord } from "../lib/pocketbase-types";
  import { userInput } from "../lib/state.svelte";
  import type { QuestionId } from "../lib/types";
  import { pan, swipe, type PanCustomEvent, type GestureCustomEvent, type SwipeCustomEvent } from "svelte-gestures";
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";

  let questions = $state<CardsRecord[]>([]);
  let currentIndex = $state(0);
  let isAnswerBlurred = $state(true);
  let isLoading = $state(false);
  let showShortcuts = $state(false);
  let direction = $state<"forward" | "backward">("forward");

  let knowBtn = $state<HTMLButtonElement>();
  let notKnowBtn = $state<HTMLButtonElement>();

  onMount(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return; // Ignore if user is typing in an input
    }

    switch (event.key.toLowerCase()) {
      case "k":
      case " ":
        event.preventDefault();
        toggleAnswer();
        break;
      case "l":
        event.preventDefault();
        nextQuestion();
        break;
      case "j":
        event.preventDefault();
        previousQuestion();
        break;
      case "m":
        event.preventDefault();
        if (!isAnswerBlurred) knowBtn?.click();
        break;
      case "n":
        event.preventDefault();
        if (!isAnswerBlurred) notKnowBtn?.click();
        break;
      case "?":
        event.preventDefault();
        showShortcuts = !showShortcuts;
        break;
    }
  }

  function handleSwipe(event: SwipeCustomEvent) {
    const { direction: swipeDirection } = event.detail;
    if (swipeDirection === "left") {
      nextQuestion();
    } else if (swipeDirection === "right") {
      previousQuestion();
    }
  }

  function toggleAnswer() {
    isAnswerBlurred = !isAnswerBlurred;
  }

  async function loadQuestions() {
    try {
      isLoading = true;
      let filter = "";

      userInput.practiceQuestions.forEach((qu: QuestionId) => {
        filter += `id = '${qu}'||`;
      });
      filter = `(${filter.slice(0, filter.length - 2)})`;

      const records = await pb.collection("Cards").getFullList<CardsRecord>({ filter });
      questions = shuffleArray([...records]);
    } finally {
      isLoading = false;
    }
  }

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function updateLevel(change: number) {
    direction = "forward";
    const current = questions[currentIndex];
    if (!current) return;

    try {
      if (typeof current.level === "undefined" || typeof current.levelChanges === "undefined") {
        alert("Something ain'tn't right ma dude(ette)");
        return;
      }

      await pb.collection("Cards").update(current.id, {
        level: Math.max(0, current.level + change),
        levelChanges: current.levelChanges + 1,
      });
      nextQuestion();
    } catch (error) {
      console.error("Failed to update level:", error);
    }
  }

  function exitPractice() {
    userInput.currentMode = "menu";
    userInput.practiceQuestions = [];
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      direction = "forward";
      currentIndex++;
      isAnswerBlurred = true;
    } else {
      exitPractice();
    }
  }

  function previousQuestion() {
    if (currentIndex > 0) {
      direction = "backward";
      currentIndex--;
      isAnswerBlurred = true;
    }
  }
</script>

<div use:swipe={() => ({ timeframe: 300, minSwipeDistance: 60 })} onswipe={handleSwipe} class="practice-container">
  <div class="shortcuts-list" class:visible={showShortcuts}>
    <div>Keyboard Shortcuts:</div>
    <div><kbd>k</kbd> or <kbd>space</kbd> - Toggle Answer</div>
    <div><kbd>l</kbd> - Next Question</div>
    <div><kbd>j</kbd> - Previous Question</div>
    <div><kbd>m</kbd> - Knew It (+1)</div>
    <div><kbd>n</kbd> - Didn't Know (-1)</div>
    <div><kbd>?</kbd> - Toggle This Help</div>
  </div>

  <div class="content-wrapper">
    <nav>
      <button onclick={exitPractice} class="nav-button"> Exit Practice Selection </button>
    </nav>

    {#if questions.length === 0}
      <div class="card center-card">
        <button onclick={() => loadQuestions()} class="button button-primary" disabled={isLoading}>
          Start Study Session
        </button>
      </div>
    {:else if questions[currentIndex]}
      <div class="practice-content">
        <div class="progress-text">
          Question {currentIndex + 1} of {questions.length}
        </div>

        <div class="animation-container">
          {#key currentIndex}
            <div
              class="animation-slide"
              in:fly|local={{ x: direction === "forward" ? 1000 : -1000, duration: 500 }}
              out:fly|local={{ x: direction === "forward" ? -1000 : 1000, duration: 500 }}
            >
              <div class="card question-card">
                <div class="question-text">
                  {questions[currentIndex].question}
                </div>
              </div>

              <div class="card answer-card" onclick={toggleAnswer}>
                <div class="answer-text" class:blurred={isAnswerBlurred}>
                  {questions[currentIndex].answer}
                </div>
              </div>
            </div>
          {/key}
        </div>
      </div>

      <div class="fixed-bottom">
        <div class="button-container">
          <button bind:this={knowBtn} onclick={() => updateLevel(-1)} class="button button-danger">
            DRILL
            <span class="shortcut-hint">n</span>
          </button>
          <button bind:this={notKnowBtn} onclick={() => updateLevel(1)} class="button button-success">
            SKILL
            <span class="shortcut-hint">m</span>
          </button>
        </div>

        <div class="navigation-buttons">
          <button onclick={previousQuestion} disabled={currentIndex === 0} class="nav-button">
            Previous
            <span class="shortcut-hint">j</span>
          </button>
          <button onclick={nextQuestion} disabled={currentIndex === questions.length - 1} class="nav-button">
            Next
            <span class="shortcut-hint">l</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .animation-container {
    position: relative;
    min-height: clamp(200px, 40vh, 400px);
  }

  .animation-slide {
    position: absolute;
    width: 100%;
  }

  .practice-container {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a1a1a;
    padding: clamp(0.5rem, 2vw, 1.5rem);
    padding-bottom: calc(clamp(0.5rem, 2vw, 1.5rem) + 160px);
  }

  .content-wrapper {
    width: 100%;
    max-width: clamp(350px, 90vw, 800px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 80vh;
    position: relative;
  }

  .card {
    background: #2a2a2a;
    border-radius: 1rem;
    padding: clamp(1rem, 3vw, 2rem);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: clamp(0.5rem, 2vw, 1rem) 0;
    overflow: hidden;
  }

  .question-card {
    min-height: clamp(100px, 20vh, 200px);
    display: flex;
    align-items: center;
  }

  .answer-card {
    min-height: clamp(80px, 15vh, 160px);
    display: flex;
    align-items: center;
  }

  .center-card {
    display: flex;
    justify-content: center;
  }

  .question-text {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    text-align: left;
    line-height: 1.5;
    color: #e5e5e5;
    width: 100%;
  }

  .answer-text {
    width: 100%;
    color: #e5e5e5;
    font-size: clamp(0.875rem, 2vw, 1.25rem);
    cursor: pointer;
    transition: filter 0.3s ease;
  }

  .answer-text.blurred {
    filter: blur(5px);
  }

  .answer-text:hover {
    opacity: 0.9;
  }

  .fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1a1a1a;
    padding: 1rem clamp(1rem, 5vw, 2rem);
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: clamp(350px, 90vw, 800px);
    margin: 0 auto;
  }

  .button-container {
    display: flex;
    gap: clamp(0.5rem, 2vw, 1rem);
  }

  .button {
    flex: 1;
    padding: clamp(0.5rem, 2vw, 0.75rem);
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.1s;
    font-size: clamp(0.875rem, 1.5vw, 1rem);
  }

  .button:active {
    transform: translateY(1px);
  }

  .button.full-width {
    width: 100%;
  }

  .button-primary {
    background-color: #3b82f6;
    color: white;
  }

  .button-primary:hover {
    background-color: #2563eb;
  }

  .button-success {
    background-color: #10b981;
    color: white;
  }

  .button-success:hover {
    background-color: #059669;
  }

  .button-danger {
    background-color: #ef4444;
    color: white;
  }

  .button-danger:hover {
    background-color: #dc2626;
  }

  .nav-button {
    padding: clamp(0.375rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
    color: #e5e5e5;
    border-radius: 0.5rem;
    background: transparent;
    transition: background-color 0.2s;
    font-size: clamp(0.875rem, 1.5vw, 1rem);
  }

  .nav-button:hover {
    background-color: #333333;
  }

  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .progress-text {
    text-align: center;
    color: #a3a3a3;
    font-size: clamp(0.75rem, 1.5vw, 0.875rem);
    margin-bottom: clamp(0.75rem, 2vw, 1rem);
  }

  .navigation-buttons {
    display: flex;
    justify-content: space-between;
    padding: 0 clamp(0.25rem, 1vw, 0.5rem);
  }

  .shortcut-hint {
    font-size: 0.75rem;
    opacity: 0.6;
    margin-left: 0.5rem;
  }

  .shortcuts-list {
    position: fixed;
    top: 1rem;
    right: 1rem;
    background: #2a2a2a;
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #a3a3a3;
    display: none;
    z-index: 10;
  }

  .shortcuts-list.visible {
    display: block;
  }

  .shortcuts-list kbd {
    background: #333333;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    margin: 0 0.25rem;
    color: #e5e5e5;
  }

  @media (min-width: 768px) {
    .shortcuts-list {
      display: block;
    }
  }

  @keyframes drill-glow {
    0% {
      box-shadow:
        0 0 40px #ef4444,
        0 0 80px #ef4444,
        0 0 120px #ef4444,
        0 0 160px #ef4444;
    }
    100% {
      box-shadow:
        0 0 80px #ef4444,
        0 0 160px #ef4444,
        0 0 240px #ef4444,
        0 0 320px #ef4444;
    }
  }

  @keyframes skill-glow {
    0% {
      box-shadow:
        0 0 40px #10b981,
        0 0 80px #10b981,
        0 0 120px #10b981,
        0 0 160px #10b981;
    }
    100% {
      box-shadow:
        0 0 80px #10b981,
        0 0 160px #10b981,
        0 0 240px #10b981,
        0 0 320px #10b981;
    }
  }

  .button-danger:active {
    animation: drill-glow 2s ease-in-out;
  }

  .button-success:active {
    animation: skill-glow 2s ease-in-out;
  }
</style>
