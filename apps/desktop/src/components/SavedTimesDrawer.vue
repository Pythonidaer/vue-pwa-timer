<script setup lang="ts">
import { useTimerStore } from '@/stores/timer'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface Props {
  showNotesInput: boolean
  notesInput: string
}

interface Emits {
  (e: 'update:notesInput', value: string): void
  (e: 'save'): void
  (e: 'cancel'): void
  (e: 'request-resize'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const timerStore = useTimerStore()
const expandedNotes = ref<Set<string>>(new Set())
const showMenu = ref(false)
const notesInputEl = ref<HTMLTextAreaElement | null>(null)

// Auto-resize textarea as content grows
function autoResizeTextarea(textarea: HTMLTextAreaElement) {
  // Reset height to get accurate scrollHeight
  textarea.style.height = 'auto'
  // Calculate new height with a small buffer to ensure all text is visible
  const newHeight = Math.max(textarea.scrollHeight, textarea.clientHeight)
  textarea.style.height = `${newHeight}px`
  // Request resize after textarea height changes - use double nextTick to ensure DOM is updated
  nextTick().then(() => {
    nextTick().then(() => {
      emit('request-resize')
    })
  })
}

// Handle notes input changes
function handleNotesInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:notesInput', target.value)
  // Auto-resize textarea - use requestAnimationFrame to ensure text has wrapped
  requestAnimationFrame(() => {
    nextTick().then(() => {
      if (notesInputEl.value) {
        autoResizeTextarea(notesInputEl.value)
      }
    })
  })
}

// Watch for notes input appearing/disappearing and request resize
// Only emit if drawer is already visible (not during initial mount/transition)
watch(
  () => props.showNotesInput,
  async (newValue) => {
    await nextTick()
    // Only request resize if input is appearing (not disappearing)
    // and only if the drawer is already mounted (prevents double-resize during initial open)
    if (newValue) {
      emit('request-resize')
      // Focus input after resize completes (prevents layout jump during resize)
      // Small delay to ensure resize is complete
      setTimeout(() => {
        notesInputEl.value?.focus()
        // Auto-resize on mount
        if (notesInputEl.value) {
          autoResizeTextarea(notesInputEl.value)
        }
      }, 50)
    } else {
      // Input disappearing - still need to resize
      emit('request-resize')
    }
  }
)

async function toggleNotes(id: string) {
  if (expandedNotes.value.has(id)) {
    expandedNotes.value.delete(id)
  } else {
    expandedNotes.value.add(id)
  }
  // Request resize after notes expand/collapse
  await nextTick()
  emit('request-resize')
}

function toggleMenu() {
  showMenu.value = !showMenu.value
  // Menu opens upward, so no resize needed
}

function handleMenuAction(action: string) {
  showMenu.value = false
  if (action === 'export-all') {
    timerStore.exportAllSavedTimes()
  } else if (action === 'delete-all') {
    timerStore.deleteAllSavedTimes()
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (showMenu.value && !target.closest('.header-controls') && !target.closest('.menu-dropdown')) {
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
  <div class="drawer-container" :class="{ 'drawer-empty': visibleSavedTimes.length === 0 }">
    <!-- Drawer Header with Menu and Notes Input -->
    <div class="drawer-header" :class="{ 'header-no-content': visibleSavedTimes.length === 0 }">
      <div class="header-controls">
        <!-- Notes Input Section (when visible) -->
        <div v-if="showNotesInput" class="notes-input-group">
          <div class="notes-input-wrapper">
            <textarea
              ref="notesInputEl"
              :value="notesInput"
              @input="handleNotesInput"
              placeholder="Notes"
              class="notes-input"
              @keydown.enter.exact.prevent="emit('save')"
              @keyup.esc="emit('cancel')"
              rows="1"
            ></textarea>
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
        
        <!-- Globe Menu Button - Always on the right -->
        <button 
          class="btn-header btn-globe btn-globe-right"
          @click="toggleMenu"
          aria-label="Menu"
        >
          <i class="pi pi-globe"></i>
        </button>
                  <div v-if="showMenu" class="menu-dropdown">
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
          <div class="saved-times-list">
            <div
              v-for="savedTime in visibleSavedTimes"
              :key="savedTime.id"
              class="saved-time-item"
            >
        <div class="saved-time-main">
          <div class="saved-time-info">
            <span class="time">{{ savedTime.time }}</span>
          </div>
          <div class="saved-time-actions">
            <button
              v-if="savedTime.notes"
              class="btn-toggle-notes"
              @click="toggleNotes(savedTime.id)"
              :aria-label="expandedNotes.has(savedTime.id) ? 'Hide notes' : 'Show notes'"
            >
              <i :class="expandedNotes.has(savedTime.id) ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
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
  width: 280px; /* Match timer container width */
  background: #0a0a0a;
  border: 0.5px solid rgba(26, 26, 26, 0.5);
  border-top: none;
  border-radius: 0 0 3px 3px;
  padding: 0.3rem;
  box-shadow: none;
  /* Removed animation - Vue transition handles it */
  margin-top: 0;
  margin-bottom: 0; /* Removed bottom margin to even out spacing */
  position: relative;
  overflow: visible; /* Allow menu dropdown to overflow below drawer */
  box-sizing: border-box;
  min-height: 0;
  /* Ensure no visual artifacts during transition */
  will-change: max-height, opacity, transform;
}

/* Removed slideDown animation - Vue transition handles it */

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.3rem;
  border-bottom: 0.25px solid #1a1a1a;
  position: relative;
  width: 100%;
  z-index: 1;
  overflow: visible; /* Allow menu dropdown to overflow if needed */
}

.drawer-header.header-no-content {
  margin-bottom: 0; /* Remove bottom margin when drawer is empty */
  border-bottom: none; /* Remove border when drawer is empty */
  padding-bottom: 0; /* Remove padding when drawer is empty */
}

.drawer-container.drawer-empty {
  padding-bottom: 0.3rem; /* Match side padding when empty */
}

.header-controls {
  display: flex;
  gap: 0.4rem;
  position: relative; /* For absolute positioning of menu dropdown */
  width: 100%;
  align-items: center;
  z-index: 1;
  min-height: 2.5rem; /* Match the minimum height of notes input to keep consistent height */
}

.btn-header {
  padding: 0;
  background: transparent;
  color: #888;
  border: 1px solid transparent;
  border-radius: 50%; /* Perfect circle */
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 400;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px; /* Fixed width for perfect circle */
  height: 28px; /* Fixed height for perfect circle */
}

.btn-header i {
  font-size: 0.7rem; /* Smaller icons */
}

.btn-header:hover:not(:disabled) {
  background: #1a1a1a; /* Keep background dark */
  color: #ccc;
  border-color: #888; /* Bright border on hover */
}

.btn-header:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-header.btn-danger {
  color: #cc4444;
}

.btn-header.btn-danger:hover:not(:disabled) {
  background: #2a1a1a; /* Keep background dark */
  color: #ff6666;
  border-color: #cc6666; /* Bright border on hover for danger buttons */
}

.btn-globe-right {
  margin-left: auto; /* Always push globe to the right */
  /* Add padding to match notes input height when it's not visible */
  padding: 0.4rem 0.5rem; /* Match the vertical padding of notes input */
}

.menu-dropdown {
  position: absolute; /* Positioned relative to .header-controls */
  bottom: calc(100% + 6px); /* Position ABOVE the header controls */
  top: auto; /* Override any top positioning */
  right: 0; /* Align to right edge of header controls */
  background: #1a1a1a;
  border: 0.25px solid #2a2a2a;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  min-width: 120px;
  z-index: 10000; /* High z-index to appear above drawer content */
}

.menu-item {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
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
  align-items: flex-start; /* Align to top for textarea */
  width: 100%;
  flex: 1;
}

.notes-input {
  padding: 0.4rem 3.5rem 0.4rem 0.5rem; /* Increased top/bottom padding, right padding for button spacing */
  border: 1px solid #999; /* Slightly darker but still light */
  border-radius: 0; /* Square corners */
  font-size: 0.85rem;
  background: #1a1a1a;
  color: #ffffff;
  width: 100%;
  min-height: 2.5rem; /* Minimum height for single line */
  max-height: none; /* Remove max-height to allow full expansion */
  resize: none; /* Disable manual resize */
  overflow-y: hidden; /* Hide scrollbar - let window resize instead */
  white-space: pre-wrap; /* Wrap text */
  word-wrap: break-word; /* Break long words */
  overflow-wrap: break-word; /* Additional word breaking support */
  line-height: 1.7rem; /* Center text vertically: min-height (2.5rem) - top padding (0.4rem) - bottom padding (0.4rem) = 1.7rem */
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  font-family: inherit; /* Use same font as rest of app */
  box-sizing: border-box; /* Include padding in height calculation */
  vertical-align: middle; /* Help with text centering */
}

.notes-input:focus {
  outline: none;
  border-color: #fff;
  background: #222;
}

.btn-inside-input {
  position: absolute;
  right: 0.4rem; /* Add spacing from right edge */
  top: 50%; /* Center vertically with textarea content */
  transform: translateY(-50%); /* Perfect center alignment */
  padding: 0.2rem;
  min-width: 20px;
  width: 20px; /* Make it square first */
  height: 20px;
  border-radius: 50%; /* Make it circular */
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-inside-input:first-of-type {
  right: 1.75rem; /* Spacing between buttons (20px button + 0.4rem gap) */
}

.saved-times-list {
  display: flex;
  flex-direction: column;
  gap: 0; /* Remove gap since items now have margin */
}

.saved-time-item {
  background: #1a1a1a;
  border: 0.5px solid rgba(42, 42, 42, 0.5);
  border-radius: 3px;
  padding: 0.3rem 0.5rem;
  margin-bottom: 0.5rem; /* Bottom margin for saved time items */
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.saved-time-item:last-child {
  margin-bottom: 0; /* Remove bottom margin from last item to match drawer bottom padding */
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
  font-family: 'DSEG7-Classic', monospace;
  font-size: 0.95rem;
  font-weight: bold;
  color: #ffffff;
  min-width: 45px;
}

.btn-toggle-notes {
  background: transparent;
  border: 1px solid transparent;
  color: #ccc;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
  border-radius: 50%; /* Perfect circle */
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* Fixed width for perfect circle */
  height: 24px; /* Fixed height for perfect circle */
}

.btn-toggle-notes i {
  font-size: 0.7rem; /* Smaller icons */
}

.btn-toggle-notes:hover {
  background: #1a1a1a; /* Keep background dark */
  color: #fff;
  border-color: #888; /* Bright border on hover */
}

.saved-time-actions {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.btn-action {
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
  border-radius: 50%; /* Perfect circle */
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  color: #ccc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* Fixed width for perfect circle */
  height: 24px; /* Fixed height for perfect circle */
}

.btn-action i {
  font-size: 0.7rem; /* Smaller icons */
}

.btn-action:hover {
  background: #1a1a1a; /* Keep background dark */
  border-color: #888; /* Bright border on hover */
  color: #fff;
}

.btn-action.btn-delete {
  color: #cc4444;
}

.btn-action.btn-delete:hover {
  background: #2a1a1a; /* Keep background dark */
  border-color: #cc6666; /* Bright border on hover for delete buttons */
  color: #ff6666;
}

.saved-time-notes {
  margin-top: 0.4rem;
  padding: 0.4rem;
  border-top: none;
  background: #3b3b3b;
  color: #ffffff;
  font-size: 0.85rem;
  border-radius: 0 0 3px 3px;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap; /* Preserve line breaks but wrap long lines */
  word-wrap: break-word; /* Break long words */
  overflow-wrap: break-word; /* Additional word breaking support */
  word-break: break-word; /* Break very long words that don't fit */
  max-width: 100%; /* Ensure it doesn't exceed container width */
  overflow: hidden; /* Hide any overflow */
}
</style>
