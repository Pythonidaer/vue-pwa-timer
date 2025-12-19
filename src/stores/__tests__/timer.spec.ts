import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTimerStore } from '../timer'

describe('Timer Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const store = useTimerStore()
      
      expect(store.isRunning).toBe(false)
      expect(store.isPaused).toBe(false)
      expect(store.totalSeconds).toBe(0)
      expect(store.formattedTime).toBe('00:00')
      expect(store.savedTimes).toEqual([])
      expect(store.viewMode).toBe('girthy')
    })
  })

  describe('Timer Actions', () => {
    it('should start the timer', () => {
      const store = useTimerStore()
      
      store.start()
      
      expect(store.isRunning).toBe(true)
      expect(store.isPaused).toBe(false)
    })

    it('should increment seconds when running', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(5000) // 5 seconds
      
      expect(store.totalSeconds).toBe(5)
      expect(store.formattedTime).toBe('00:05')
    })

    it('should pause the timer', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(3000)
      store.pause()
      
      expect(store.isRunning).toBe(false)
      expect(store.isPaused).toBe(true)
      expect(store.totalSeconds).toBe(3)
    })

    it('should resume from pause', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(2000)
      store.pause()
      const pausedSeconds = store.totalSeconds
      
      store.start()
      vi.advanceTimersByTime(3000)
      
      expect(store.isRunning).toBe(true)
      expect(store.isPaused).toBe(false)
      expect(store.totalSeconds).toBe(pausedSeconds + 3)
    })

    it('should stop the timer', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(5000)
      store.stop()
      
      expect(store.isRunning).toBe(false)
      expect(store.isPaused).toBe(false)
      expect(store.totalSeconds).toBe(5) // Time remains but timer stops
    })

    it('should reset the timer', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(10000)
      store.reset()
      
      expect(store.isRunning).toBe(false)
      expect(store.isPaused).toBe(false)
      expect(store.totalSeconds).toBe(0)
      expect(store.formattedTime).toBe('00:00')
    })

    it('should format time correctly', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(125000) // 2 minutes 5 seconds
      
      expect(store.formattedTime).toBe('02:05')
    })
  })

  describe('Save Time', () => {
    it('should save current time with notes', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(65000) // 1 minute 5 seconds
      store.pause()
      store.saveTime('Test notes')
      
      expect(store.savedTimes).toHaveLength(1)
      expect(store.savedTimes[0].time).toBe('01:05')
      expect(store.savedTimes[0].notes).toBe('Test notes')
      expect(store.savedTimes[0].hidden).toBe(false)
      expect(store.savedTimes[0].id).toBeDefined()
    })

    it('should save time without notes', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(30000)
      store.pause()
      store.saveTime()
      
      expect(store.savedTimes).toHaveLength(1)
      expect(store.savedTimes[0].notes).toBe('')
    })

    it('should add saved times to the beginning of the array', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(10000)
      store.pause()
      store.saveTime('First')
      
      store.start()
      vi.advanceTimersByTime(20000)
      store.pause()
      store.saveTime('Second')
      
      expect(store.savedTimes).toHaveLength(2)
      expect(store.savedTimes[0].notes).toBe('Second')
      expect(store.savedTimes[1].notes).toBe('First')
    })
  })

  describe('Delete Saved Time', () => {
    it('should delete a saved time by id', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(10000)
      store.pause()
      store.saveTime('Test')
      
      const id = store.savedTimes[0].id
      store.deleteSavedTime(id)
      
      expect(store.savedTimes).toHaveLength(0)
    })

    it('should delete all saved times', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(10000)
      store.pause()
      store.saveTime('First')
      
      store.start()
      vi.advanceTimersByTime(20000)
      store.pause()
      store.saveTime('Second')
      
      store.deleteAllSavedTimes()
      
      expect(store.savedTimes).toHaveLength(0)
    })
  })

  describe('Toggle Hide Saved Time', () => {
    it('should toggle hidden state of saved time', () => {
      const store = useTimerStore()
      
      store.start()
      vi.advanceTimersByTime(10000)
      store.pause()
      store.saveTime('Test')
      
      const id = store.savedTimes[0].id
      expect(store.savedTimes[0].hidden).toBe(false)
      
      store.toggleHideSavedTime(id)
      expect(store.savedTimes[0].hidden).toBe(true)
      
      store.toggleHideSavedTime(id)
      expect(store.savedTimes[0].hidden).toBe(false)
    })
  })

  describe('Export Functions', () => {
    it('should export a single saved time', () => {
      const store = useTimerStore()
      const createElementSpy = vi.spyOn(document, 'createElement')
      const clickSpy = vi.fn()
      
      store.start()
      vi.advanceTimersByTime(10000)
      store.pause()
      store.saveTime('Test notes')
      
      const id = store.savedTimes[0].id
      store.exportSavedTime(id)
      
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    it('should export all saved times', () => {
      const store = useTimerStore()
      const createElementSpy = vi.spyOn(document, 'createElement')
      
      store.start()
      vi.advanceTimersByTime(10000)
      store.pause()
      store.saveTime('First')
      
      store.start()
      vi.advanceTimersByTime(20000)
      store.pause()
      store.saveTime('Second')
      
      store.exportAllSavedTimes()
      
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })
  })

  describe('View Mode', () => {
    it('should toggle view mode between compact and girthy', () => {
      const store = useTimerStore()
      
      expect(store.viewMode).toBe('girthy')
      
      store.toggleViewMode()
      expect(store.viewMode).toBe('compact')
      
      store.toggleViewMode()
      expect(store.viewMode).toBe('girthy')
    })
  })
})

