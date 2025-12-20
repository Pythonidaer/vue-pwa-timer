import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export interface SavedTime {
  id: string
  date: Date
  time: string // Format: "MM:SS"
  notes: string
  hidden: boolean
}

export type ViewMode = 'compact' | 'girthy'

export const useTimerStore = defineStore('timer', () => {
  // Timer state
  const isRunning = ref(false)
  const isPaused = ref(false)
  const totalSeconds = ref(0) // Total elapsed time in seconds
  const intervalId = ref<number | null>(null)
  
  // Load saved times from localStorage
  function loadSavedTimes(): SavedTime[] {
    try {
      const stored = localStorage.getItem('timer-saved-times')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.map((st: any) => ({
          ...st,
          date: new Date(st.date)
        }))
      }
    } catch (e) {
      console.error('Failed to load saved times:', e)
    }
    return []
  }
  
  // Save times to localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem('timer-saved-times', JSON.stringify(savedTimes.value))
    } catch (e) {
      console.error('Failed to save times:', e)
    }
  }
  
  // Saved times
  const savedTimes = ref<SavedTime[]>(loadSavedTimes())
  const viewMode = ref<ViewMode>('compact')
  
  // Watch for changes and save to localStorage
  watch(savedTimes, () => {
    saveToLocalStorage()
  }, { deep: true })
  
  // Computed: Format time as MM:SS
  const formattedTime = computed(() => {
    const minutes = Math.floor(totalSeconds.value / 60)
    const seconds = totalSeconds.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })
  
  // Timer actions
  function start() {
    if (isPaused.value) {
      // Resume from pause
      isPaused.value = false
    } else {
      // Start fresh
      totalSeconds.value = 0
    }
    isRunning.value = true
    
    intervalId.value = window.setInterval(() => {
      totalSeconds.value++
    }, 1000)
  }
  
  function pause() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    isRunning.value = false
    isPaused.value = true
  }
  
  function stop() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    isRunning.value = false
    isPaused.value = false
    // Don't reset totalSeconds on stop, only on reset
  }
  
  function reset() {
    stop()
    totalSeconds.value = 0
  }
  
  // Save current time
  function saveTime(notes: string = '') {
    const savedTime: SavedTime = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: new Date(),
      time: formattedTime.value,
      notes,
      hidden: false
    }
    savedTimes.value.unshift(savedTime) // Add to beginning
  }
  
  // Delete saved time
  function deleteSavedTime(id: string) {
    const index = savedTimes.value.findIndex(st => st.id === id)
    if (index > -1) {
      savedTimes.value.splice(index, 1)
    }
  }
  
  // Delete all saved times
  function deleteAllSavedTimes() {
    savedTimes.value = []
  }
  
  // Toggle hide/show saved time
  function toggleHideSavedTime(id: string) {
    const savedTime = savedTimes.value.find(st => st.id === id)
    if (savedTime) {
      savedTime.hidden = !savedTime.hidden
    }
  }
  
  // Export single saved time
  function exportSavedTime(id: string) {
    const savedTime = savedTimes.value.find(st => st.id === id)
    if (!savedTime) return
    
    const data = {
      time: savedTime.time,
      notes: savedTime.notes
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timer-${savedTime.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // Export all saved times
  function exportAllSavedTimes() {
    const data = savedTimes.value.map(st => ({
      time: st.time,
      notes: st.notes
    }))
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timer-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // Toggle view mode
  function toggleViewMode() {
    viewMode.value = viewMode.value === 'compact' ? 'girthy' : 'compact'
  }
  
  return {
    // State
    isRunning,
    isPaused,
    totalSeconds,
    formattedTime,
    savedTimes,
    viewMode,
    // Actions
    start,
    pause,
    stop,
    reset,
    saveTime,
    deleteSavedTime,
    deleteAllSavedTimes,
    toggleHideSavedTime,
    exportSavedTime,
    exportAllSavedTimes,
    toggleViewMode
  }
})


