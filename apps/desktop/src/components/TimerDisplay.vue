<script setup lang="ts">
import { useTimerStore } from '@/stores/timer'
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import SavedTimesDrawer from './SavedTimesDrawer.vue'
import { getCurrentWindow, LogicalSize, LogicalPosition } from '@tauri-apps/api/window'

const timerStore = useTimerStore()
const notesInput = ref('')
const showNotesInput = ref(false)
const showDrawer = ref(false)

// Enable window dragging using Tauri API (more reliable than data-tauri-drag-region)
let dragCleanup: Array<() => void> = []

onMounted(async () => {
  try {
    const appWindow = getCurrentWindow()
    
    // Initial resize after DOM is fully ready
    // Use double nextTick + small delay to ensure all layout is complete
    await nextTick()
    await nextTick()
    // Small delay to let browser finish initial layout
    await new Promise(resolve => setTimeout(resolve, 50))
    await resizeToShell(0)
    
    const timerPanel = document.querySelector('.timer-panel') as HTMLElement
    const digitalDisplay = document.querySelector('.digital-display') as HTMLElement
    
    const setupDragHandler = (element: HTMLElement) => {
      let isDragging = false
      let startX = 0
      let startY = 0
      
      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        // Don't drag if clicking on buttons or controls
        if (target.closest('button') || target.closest('.btn') || target.closest('.controls')) {
          return
        }
        
        isDragging = false
        startX = e.clientX
        startY = e.clientY
        e.preventDefault()
      }
      
      const handleMouseMove = async (e: MouseEvent) => {
        if (startX === 0 && startY === 0) return
        
        const deltaX = Math.abs(e.clientX - startX)
        const deltaY = Math.abs(e.clientY - startY)
        
        // Start dragging if mouse moved more than 3 pixels
        if (!isDragging && (deltaX > 3 || deltaY > 3)) {
          isDragging = true
          try {
            await appWindow.startDragging()
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to start dragging:', error)
            }
          }
        }
      }
      
      const handleMouseUp = () => {
        isDragging = false
        startX = 0
        startY = 0
      }
      
      element.addEventListener('mousedown', handleMouseDown, { passive: false })
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp, { passive: true })
      
      // Store cleanup function
      dragCleanup.push(() => {
        element.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      })
    }
    
    if (timerPanel) {
      setupDragHandler(timerPanel)
    }
    
    if (digitalDisplay) {
      setupDragHandler(digitalDisplay)
    }
  } catch (error) {
    // Not in Tauri environment (e.g., during tests) - silently fail
  }
})

onUnmounted(() => {
  // Clean up event listeners
  dragCleanup.forEach(cleanup => cleanup())
  dragCleanup = []
})

// Single resize function - deterministic, no observers, no timeouts
// macOS-safe window anchoring: clamps position to prevent OS from repositioning window
async function resizeToShell(pad = 0) {
  try {
    const win = getCurrentWindow()
    const shell = document.querySelector('.timer-container') as HTMLElement | null
    
    if (!shell) {
      console.warn('.timer-container not found')
      return
    }
    
    const width = 280 // Fixed width matching window (reduced for more compact timer)
    const height = Math.ceil(shell.scrollHeight + pad)
    const finalHeight = Math.max(height, 64) // Minimum 64px (matches timer panel height with reduced padding)
    
    // Menu dropdown opens upward, so no need to add extra height for it
    
    // Validate height
    if (isNaN(finalHeight) || finalHeight <= 0 || finalHeight > 1000) {
      console.warn('Invalid height calculated:', finalHeight, 'skipping resize')
      return
    }
    
    // Get current position and size BEFORE any resize operations
    const pos = await win.outerPosition()
    const currentSize = await win.innerSize()
    
    // Validate position (prevent invalid coordinates)
    if (isNaN(pos.x) || isNaN(pos.y) || pos.x < -10000 || pos.y < -10000) {
      console.warn('Invalid window position:', pos, 'skipping resize')
      return
    }
    
    // Only resize if height actually changed (prevents unnecessary position updates)
    if (Math.abs(currentSize.height - finalHeight) < 1) {
      return // Already the correct size
    }
    
    // macOS-safe anchoring: only clamp Y if it's too close to top edge
    // Don't clamp if position is already valid (prevents jumping on startup)
    const safeTop = 16 // Safe margin below menu bar (adjust to 24 if menu bar auto-hides)
    const clampedY = pos.y < safeTop ? safeTop : pos.y
    
    // Resize first
    await win.setSize(new LogicalSize(width, finalHeight))
    
    // Only update position if we actually clamped it (prevents unnecessary position changes)
    if (pos.y < safeTop) {
      await win.setPosition(new LogicalPosition(pos.x, clampedY))
    }
  } catch (error) {
    console.error('Failed to resize window:', error)
  }
}

// Resize window when drawer opens/closes
async function toggleDrawer() {
  showDrawer.value = !showDrawer.value
  // Don't resize here - let transition hooks handle it
  // Resizing during transition causes glitches on macOS
}

// Transition hooks - no pre-resize needed
// Window anchoring in resizeToShell() prevents push-up effect

async function onAfterEnter() {
  // Resize to exact height after drawer is fully open
  // Use double nextTick + rAF to ensure DOM is fully settled and measured accurately
  await nextTick()
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(resolve))
  // Add 1px buffer to prevent gray border from showing
  await resizeToShell(1)
}

async function onBeforeLeave() {
  // Resize window immediately to collapsed height when drawer starts closing
  // This prevents grey background from showing during the transition
  // Calculate the expected collapsed height (container without drawer)
  try {
    const win = getCurrentWindow()
    const width = 280
    
    // Measure the timer panel to get the collapsed height
    // This matches what resizeToShell will measure after the drawer is removed
    const timerPanel = document.querySelector('.timer-panel') as HTMLElement | null
    if (!timerPanel) {
      return
    }
    
    // Use scrollHeight to match resizeToShell's measurement method
    // Measure the timer panel's scrollHeight (this is what the container will be after drawer removal)
    const timerPanelHeight = Math.ceil(timerPanel.scrollHeight)
    const collapsedHeight = Math.max(timerPanelHeight, 64)
    
    // Get current position to maintain it
    const pos = await win.outerPosition()
    const safeTop = 16
    const clampedY = pos.y < safeTop ? safeTop : pos.y
    
    // Immediately resize to expected collapsed height
    await win.setSize(new LogicalSize(width, collapsedHeight))
    
    // Only update position if we actually clamped it
    if (pos.y < safeTop) {
      await win.setPosition(new LogicalPosition(pos.x, clampedY))
    }
  } catch (error) {
    // Silently fail if not in Tauri environment
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to resize window on drawer close:', error)
    }
  }
}

async function onAfterLeave() {
  // Final resize after drawer fully closes
  // Use the same measurement as onBeforeLeave (timer panel scrollHeight)
  // to ensure perfect consistency and eliminate height flicker
  await nextTick()
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(resolve))
  
  // Measure timer panel directly (same as onBeforeLeave) for consistency
  try {
    const win = getCurrentWindow()
    const width = 280
    const timerPanel = document.querySelector('.timer-panel') as HTMLElement | null
    
    if (timerPanel) {
      const timerPanelHeight = Math.ceil(timerPanel.scrollHeight)
      const finalHeight = Math.max(timerPanelHeight, 64)
      
      // Only resize if different from current size (prevents unnecessary resize)
      const currentSize = await win.innerSize()
      if (Math.abs(currentSize.height - finalHeight) >= 1) {
        await win.setSize(new LogicalSize(width, finalHeight))
      }
    } else {
      // Fallback to resizeToShell if timer panel not found
      await resizeToShell(0)
    }
  } catch (error) {
    // Fallback to resizeToShell on error
    await resizeToShell(0)
  }
}

// Handle resize requests from drawer (e.g., notes expand/collapse, notes input appears, menu opens/closes)
async function handleResizeRequest() {
  await nextTick()
  await nextTick() // Double nextTick to ensure DOM is fully updated (especially for menu visibility)
  await resizeToShell(0)
}

// Watch for changes in saved times list
watch(
  () => timerStore.savedTimes.length,
  async () => {
    await nextTick()
    await resizeToShell(0)
  }
)

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

function handleCancel() {
  showNotesInput.value = false
  // If there are no saved times, close the drawer too
  if (timerStore.savedTimes.length === 0) {
    showDrawer.value = false
  }
}

async function handleSaveClick() {
  if (timerStore.totalSeconds <= 0) return

  const wasDrawerOpen = showDrawer.value

  // Open drawer if not already open
  showDrawer.value = true
  // Show notes input
  showNotesInput.value = true

  // Only resize if drawer was already open (no transition hook will fire)
  // If drawer was closed, onAfterEnter will handle the resize after transition
  if (wasDrawerOpen) {
    // Wait for DOM to update with notes input
    await nextTick()
    await nextTick()
    await resizeToShell(0)
  }
  // If drawer was closed, don't resize here - let onAfterEnter handle it
}
</script>

<template>
  <div class="timer-container">
    <!-- Timer Panel -->
    <div class="timer-panel" data-tauri-drag-region>
      <!-- Digital Display -->
      <div class="digital-display" data-tauri-drag-region>
        <span class="time-digits">{{ timerStore.formattedTime }}</span>
      </div>
      
      <!-- Control Buttons (not draggable) -->
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
    </div>
    
    <!-- Saved Times Drawer -->
    <transition 
      name="drawer"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @after-leave="onAfterLeave"
    >
      <SavedTimesDrawer 
        v-if="showDrawer" 
        :show-notes-input="showNotesInput"
        :notes-input="notesInput"
        @update:notes-input="notesInput = $event"
        @save="handleSave"
            @cancel="handleCancel"
        @request-resize="handleResizeRequest"
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
  width: 280px; /* Reduced width for more compact timer */
  min-height: fit-content;
  height: auto;
  overflow: visible;
  background: transparent;
}

.timer-panel {
  background: #000000; /* Black background */
  padding: 0.2rem; /* Reduced top/bottom padding, slightly reduced horizontal */
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.25rem; /* Reduced gap for more compact layout */
  width: 280px; /* Reduced width for more compact timer */
  border: none; /* Removed dark border */
  cursor: move;
  user-select: none;
  -webkit-user-select: none;
}

.digital-display {
  background: #0a0a0a;
  border-radius: 2px;
  padding: 0.2rem 0.15rem; /* Reduced padding for more compact display */
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.9);
  flex: 1;
  border: none; /* Removed dark border */
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
  -webkit-user-select: none;
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
  user-select: none;
  -webkit-user-select: none;
  padding: 0.2rem 0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  min-width: fit-content;
  pointer-events: auto; /* Ensure controls are interactive */
}

.button-column {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
}

/* Base Button Styles with 3D Effect */
.btn {
  border: none;
  cursor: pointer !important; /* Ensure pointer cursor on buttons */
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
  pointer-events: auto; /* Ensure buttons are clickable */
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
  transition: opacity 0.15s ease, transform 0.15s ease;
  /* No overflow: hidden or max-height - allows popovers to be visible */
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  /* No max-height - window resize handles actual height */
}
</style>
