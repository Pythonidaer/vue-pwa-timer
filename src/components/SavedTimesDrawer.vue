<script setup lang="ts">
import { useTimerStore } from '@/stores/timer'
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  showNotesInput: boolean
  notesInput: string
}

interface Emits {
  (e: 'update:notesInput', value: string): void
  (e: 'save'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const timerStore = useTimerStore()
const expandedNotes = ref<Set<string>>(new Set())
const showMenu = ref(false)

function toggleNotes(id: string) {
  if (expandedNotes.value.has(id)) {
    expandedNotes.value.delete(id)
  } else {
    expandedNotes.value.add(id)
  }
}

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function handleMenuAction(action: string) {
  showMenu.value = false
  if (action === 'toggle-view') {
    timerStore.toggleViewMode()
  } else if (action === 'export-all') {
    timerStore.exportAllSavedTimes()
  } else if (action === 'delete-all') {
    timerStore.deleteAllSavedTimes()
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (showMenu.value && !target.closest('.header-controls')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})


const visibleSavedTimes = computed(() => 
  timerStore.savedTimes
)
</script>

<template>
  <div class="drawer-container">
    <!-- Drawer Header with Menu and Notes Input -->
    <div class="drawer-header">
      <div class="header-controls">
        <!-- Notes Input Section (when visible) -->
        <div v-if="showNotesInput" class="notes-input-group">
          <div class="notes-input-wrapper">
            <input
              :value="notesInput"
              @input="emit('update:notesInput', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Notes"
              class="notes-input"
              @keyup.enter="emit('save')"
              @keyup.esc="emit('cancel')"
              autofocus
            />
            <button 
              class="btn-header btn-inside-input"
              @click="emit('save')"
              aria-label="Save"
            >
              <i class="pi pi-save"></i>
            </button>
            <button 
              class="btn-header btn-inside-input"
              @click="emit('cancel')"
              aria-label="Cancel"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
        
        <!-- Globe Menu Button -->
        <button 
          class="btn-header btn-globe"
          @click="toggleMenu"
          aria-label="Menu"
        >
          <i class="pi pi-globe"></i>
        </button>
        <div v-if="showMenu" class="menu-dropdown">
          <button 
            class="menu-item"
            @click="handleMenuAction('toggle-view')"
          >
            {{ timerStore.viewMode === 'compact' ? 'Girthy View' : 'Compact View' }}
          </button>
          <button 
            class="menu-item"
            @click="handleMenuAction('export-all')"
            :disabled="visibleSavedTimes.length === 0"
          >
            Export All
          </button>
          <button 
            class="menu-item menu-item-danger"
            @click="handleMenuAction('delete-all')"
            :disabled="visibleSavedTimes.length === 0"
          >
            Delete All
          </button>
        </div>
      </div>
    </div>
    
    <!-- Saved Times List -->
    <div 
      class="saved-times-list"
      :class="timerStore.viewMode"
    >
      <div
        v-for="savedTime in visibleSavedTimes"
        :key="savedTime.id"
        class="saved-time-item"
        :class="timerStore.viewMode"
      >
        <div class="saved-time-main">
          <div class="saved-time-info">
            <span class="time">{{ savedTime.time }}</span>
            <button
              v-if="savedTime.notes"
              class="btn-toggle-notes"
              @click="toggleNotes(savedTime.id)"
              :aria-label="expandedNotes.has(savedTime.id) ? 'Hide notes' : 'Show notes'"
            >
              <i :class="expandedNotes.has(savedTime.id) ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <div class="saved-time-actions">
            <button
              class="btn-action"
              @click="timerStore.exportSavedTime(savedTime.id)"
              aria-label="Export"
            >
              <i class="pi pi-download"></i>
            </button>
            <button
              class="btn-action btn-delete"
              @click="timerStore.deleteSavedTime(savedTime.id)"
              aria-label="Delete"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
        <div
          v-if="savedTime.notes && expandedNotes.has(savedTime.id)"
          class="saved-time-notes"
        >
          {{ savedTime.notes }}
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.drawer-container {
  width: 260px;
  background: #0a0a0a;
  border: 0.5px solid rgba(26, 26, 26, 0.5);
  border-top: none;
  border-radius: 0 0 3px 3px;
  padding: 0.75rem;
  box-shadow: none;
  animation: slideDown 0.3s ease;
  margin-top: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.3rem;
  border-bottom: 0.25px solid #1a1a1a;
  position: relative;
  width: 100%;
}

.header-controls {
  display: flex;
  gap: 0.4rem;
  position: relative;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.btn-header {
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: #888;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 400;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
}

.btn-header i {
  font-size: 0.85rem;
}

.btn-header:hover:not(:disabled) {
  background: #1a1a1a;
  color: #ccc;
  border-color: #2a2a2a;
}

.btn-header:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-header.btn-danger {
  color: #cc4444;
}

.btn-header.btn-danger:hover:not(:disabled) {
  background: #2a1a1a;
  color: #ff6666;
  border-color: #3a2a2a;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background: #1a1a1a;
  border: 0.25px solid #2a2a2a;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  min-width: 120px;
  z-index: 10;
}

.menu-item {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  text-align: left;
  transition: all 0.15s ease;
  border-bottom: 0.25px solid #2a2a2a;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover:not(:disabled) {
  background: #2a2a2a;
  color: #fff;
}

.menu-item:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.menu-item-danger {
  color: #cc4444;
}

.menu-item-danger:hover:not(:disabled) {
  background: #2a1a1a;
  color: #ff6666;
}

.notes-input-group {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: auto;
}

.notes-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1;
}

.notes-input {
  padding: 0.3rem 2.5rem 0.3rem 0.5rem;
  border: 0.5px solid rgba(42, 42, 42, 0.5);
  border-radius: 3px;
  font-size: 0.85rem;
  background: #3b3b3b;
  color: #0a0a0a;
  width: 100%;
  transition: all 0.15s ease;
}

.notes-input:focus {
  outline: none;
  border-color: #2196f3;
  background: #222;
}

.btn-inside-input {
  position: absolute;
  right: 0;
  padding: 0.2rem;
  min-width: 20px;
  height: 20px;
  margin: 0;
}

.btn-inside-input:first-of-type {
  right: 24px;
}

.saved-times-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.saved-times-list.compact {
  gap: 0.25rem;
}

.saved-times-list.girthy {
  gap: 0.6rem;
}

.saved-time-item {
  background: #1a1a1a;
  border: 0.5px solid rgba(42, 42, 42, 0.5);
  border-radius: 3px;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.saved-time-item.compact {
  padding: 0.3rem 0.5rem;
}

.saved-time-item.girthy {
  padding: 0.7rem;
}

.saved-time-item:hover {
  background: #222;
  border-color: #3a3a3a;
}

.saved-time-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.saved-time-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
}

.time {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  font-weight: bold;
  color: #ffffff;
  min-width: 45px;
}

.btn-toggle-notes {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.2rem;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
}

.btn-toggle-notes i {
  font-size: 0.85rem;
}

.btn-toggle-notes:hover {
  color: #ccc;
}

.saved-time-actions {
  display: flex;
  gap: 0.3rem;
}

.btn-action {
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.2rem;
  border-radius: 4px;
  transition: all 0.15s ease;
  color: #888;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
}

.btn-action i {
  font-size: 0.85rem;
}

.btn-action:hover {
  background: #1a1a1a;
  border-color: #2a2a2a;
  color: #999;
}

.btn-action.btn-delete {
  color: #cc4444;
}

.btn-action.btn-delete:hover {
  background: #2a1a1a;
  border-color: #3a2a2a;
  color: #cc4444;
}

.saved-time-notes {
  margin-top: 0.4rem;
  padding: 0.4rem;
  border-top: 0.5px solid rgba(42, 42, 42, 0.5);
  background: #3b3b3b;
  color: #0a0a0a;
  font-size: 0.85rem;
  border-radius: 0 0 3px 3px;
}
</style>
