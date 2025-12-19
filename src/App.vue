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

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: transparent;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  justify-content: flex-start;
  background: transparent;
}
</style>
