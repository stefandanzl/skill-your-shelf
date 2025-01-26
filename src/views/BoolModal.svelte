<svelte:options customElement="bool-modal" />

<style>
  .outer {
    /* position: fixed;
    bottom: 30%; 
    left: "50%"; */

    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    /* background-color: grey; */
    border-radius: 5px;
    border-color: black;
    border-width: 2px;
    padding: 10px;
  }

  .inner {
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
  }

  .yes {
    padding: 10px 20px;
    background-color: #48bb78;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .no {
    padding: 10px 20px;
    background-color: #f56565;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>

<script lang="ts">
  let { text }: { text: string } = $props();

  function dispatch(type: any) {
    $host().dispatchEvent(new CustomEvent(type));
  }
</script>

<div class="outer">
  <div class="inner">
    <p>
      {text}
    </p>
    <div class="buttons">
      <button class="yes" onclick={() => dispatch("yes")}>Yes</button>
      <button class="no" onclick={() => dispatch("no")}>No</button>
    </div>
  </div>
</div>
