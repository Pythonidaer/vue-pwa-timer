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
  background: transparent;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: transparent;
}

.app-main {
  width: 260px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  justify-content: flex-start;
  background: transparent;
}
</style>
