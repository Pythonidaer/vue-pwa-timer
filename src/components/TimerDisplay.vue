<script setup lang="ts">
import { useTimerStore } from '@/stores/timer'
import { ref } from 'vue'
import SavedTimesDrawer from './SavedTimesDrawer.vue'
import { usePictureInPicture } from '@/composables/usePictureInPicture'

const timerStore = useTimerStore()
const notesInput = ref('')
const showNotesInput = ref(false)
const showDrawer = ref(false)
const { openPiP, isPiPOpen, isSupported } = usePictureInPicture()

function handleStart() {
  if (timerStore.isRunning) {
    timerStore.pause()
  } else if (timerStore.isPaused) {
    timerStore.start()
  } else {
    timerStore.start()
  }
}

function handleSave() {
  if (timerStore.totalSeconds > 0) {
    timerStore.saveTime(notesInput.value)
    notesInput.value = ''
    showNotesInput.value = false
  }
}

function handleSaveClick() {
  if (timerStore.totalSeconds > 0) {
    // Show notes input to allow optional notes
    if (!showNotesInput.value) {
      showNotesInput.value = true
    }
  }
}

function toggleDrawer() {
  showDrawer.value = !showDrawer.value
}
</script>

<template>
  <div class="timer-container">
    <!-- Timer Panel -->
    <div class="timer-panel" style="position: relative;">
      <!-- Digital Display -->
      <div class="digital-display">
        <span class="time-digits">{{ timerStore.formattedTime }}</span>
      </div>
      
      <!-- Control Buttons -->
      <div class="controls">
        <!-- Left Column: Play/Pause over Save -->
        <div class="button-column">
          <button
            class="btn btn-circle-full"
            :class="timerStore.isRunning ? 'btn-yellow' : 'btn-green'"
            @click="handleStart"
            :aria-label="timerStore.isRunning ? 'Pause' : 'Start'"
          >
            <i :class="timerStore.isRunning ? 'pi pi-pause' : 'pi pi-play'"></i>
          </button>
          <button
            class="btn btn-blue btn-circle-full"
            @click="handleSaveClick"
            aria-label="Save"
          >
            <i class="pi pi-save"></i>
          </button>
        </div>
        
        <!-- Right Column: Reset over Drawer Toggle -->
        <div class="button-column">
          <button
            class="btn btn-purple btn-circle-full"
            @click="timerStore.reset"
            aria-label="Reset"
          >
            <i class="pi pi-refresh"></i>
          </button>
          <button
            class="btn btn-drawer btn-circle-full"
            @click="toggleDrawer"
            :aria-label="showDrawer ? 'Close drawer' : 'Open drawer'"
          >
            <i :class="showDrawer ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
          </button>
        </div>
      </div>
      
      <!-- Picture-in-Picture Button -->
      <button
        v-if="isSupported"
        class="btn-pip"
        @click="openPiP"
        :aria-label="isPiPOpen ? 'Picture-in-Picture is open' : 'Open in Picture-in-Picture'"
        :title="isPiPOpen ? 'Picture-in-Picture is open' : 'Open in small floating window'"
      >
        <i class="pi pi-window-maximize"></i>
      </button>
    </div>
    
    <!-- Saved Times Drawer -->
    <transition name="drawer">
      <SavedTimesDrawer 
        v-if="showDrawer" 
        :show-notes-input="showNotesInput"
        :notes-input="notesInput"
        @update:notes-input="notesInput = $event"
        @save="handleSave"
        @cancel="showNotesInput = false"
      />
    </transition>
  </div>
</template>

<style scoped>
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0;
  width: fit-content;
}

.timer-panel {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border-radius: 4px;
  padding: 0.4rem 0.5rem;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 260px;
  border: 0.5px solid rgba(42, 42, 42, 0.5);
}

.digital-display {
  background: #0a0a0a;
  border-radius: 2px;
  padding: 0.3rem 0.25rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.9);
  flex: 1;
  border: 0.5px solid rgba(26, 26, 26, 0.5);
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-digits {
  font-family: 'DSEG7-Classic', monospace;
  font-size: 3rem;
  font-weight: normal;
  color: #ffffff;
  letter-spacing: 0.02em;
  line-height: 1;
  padding-right: 0;
  white-space: nowrap;
  display: block;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  min-width: fit-content;
}

.button-column {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
}

/* Base Button Styles with 3D Effect - Top Down Perspective */
.btn {
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5);
  transform: perspective(200px) rotateX(5deg);
}

.btn:active {
  transform: perspective(200px) rotateX(8deg) translateY(2px);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 1px 2px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.15),
    inset 0 -1px 2px rgba(0, 0, 0, 0.6);
}


.btn-green {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

.btn-green:hover {
  background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%);
  box-shadow: 
    0 5px 10px rgba(46, 125, 50, 0.4),
    0 2px 5px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5);
}

.btn-yellow {
  background: linear-gradient(135deg, #f9a825 0%, #f57f17 100%);
}

.btn-yellow:hover {
  background: linear-gradient(135deg, #ffb74d 0%, #f9a825 100%);
  box-shadow: 
    0 5px 10px rgba(249, 168, 37, 0.4),
    0 2px 5px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5);
}

.btn-circle-full {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}


.btn-blue {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
}

.btn-blue:hover {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  box-shadow: 
    0 5px 10px rgba(21, 101, 192, 0.4),
    0 2px 5px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5);
}

.btn-purple {
  background: linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%);
}

.btn-purple:hover {
  background: linear-gradient(135deg, #ba68c8 0%, #9c27b0 100%);
  box-shadow: 
    0 5px 10px rgba(156, 39, 176, 0.4),
    0 2px 5px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5);
}

.btn-drawer {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.btn-drawer:hover {
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
  box-shadow: 
    0 5px 10px rgba(42, 42, 42, 0.4),
    0 2px 5px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5);
}

/* Button Icons */
.btn i {
  font-size: 0.8rem;
  line-height: 1;
  color: white;
  filter: brightness(1);
  transform: translateZ(0);
  display: block;
}

/* Drawer transition */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.btn-pip {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: rgba(42, 42, 42, 0.6);
  border: 0.5px solid rgba(42, 42, 42, 0.5);
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.15s ease;
  z-index: 10;
}

.btn-pip:hover {
  background: rgba(42, 42, 42, 0.8);
  color: #ccc;
}

.btn-pip i {
  font-size: 0.7rem;
}
</style>
