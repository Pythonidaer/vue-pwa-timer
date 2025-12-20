<script setup lang="ts">
import TimerDisplay from './components/TimerDisplay.vue'
</script>

<template>
  <div class="app">
    <main class="app-main">
      <TimerDisplay />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Courier New', Courier, monospace;
  background: #000000; /* Black background to match timer panel */
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto; /* Content-sized, not 100% */
  min-height: 0;
  overflow: hidden; /* Use hidden instead of clip to prevent popover clipping */
}

.app {
  width: 100%;
  height: auto; /* Content-sized, not 100% */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: transparent;
}

.app-main {
  width: 280px; /* Match timer container width */
  min-height: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  justify-content: flex-start;
  background: transparent;
  overflow: visible;
  box-sizing: border-box;
}
</style>

