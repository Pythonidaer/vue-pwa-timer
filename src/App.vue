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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: transparent;
  margin: 0;
  padding: 0;
  width: 260px;
  height: auto;
  min-width: 260px;
  max-width: 260px;
  overflow-x: hidden;
  overflow-y: auto;
}

.app {
  width: 260px;
  height: auto;
  min-width: 260px;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.app-main {
  width: 260px;
  height: auto;
  min-width: 260px;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  justify-content: flex-start;
  background: transparent;
}
</style>
