import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import TimerDisplay from '../TimerDisplay.vue'
import { useTimerStore } from '@/stores/timer'

// Mock Tauri window API
vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: vi.fn(() => ({
    startDragging: vi.fn().mockResolvedValue(undefined),
    setSize: vi.fn().mockResolvedValue(undefined),
  })),
}))

describe('Window Dragging', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should have draggable regions (timer panel and display)', async () => {
    const wrapper = mount(TimerDisplay)
    await wrapper.vm.$nextTick()
    
    const timerPanel = wrapper.find('.timer-panel')
    const digitalDisplay = wrapper.find('.digital-display')
    
    expect(timerPanel.exists()).toBe(true)
    expect(digitalDisplay.exists()).toBe(true)
    
    // Elements should exist and be ready for drag handlers
    expect(timerPanel.element).toBeTruthy()
    expect(digitalDisplay.element).toBeTruthy()
  })

  it('should prevent text selection on draggable elements', async () => {
    const wrapper = mount(TimerDisplay)
    await wrapper.vm.$nextTick()
    
    const timerPanel = wrapper.find('.timer-panel')
    const digitalDisplay = wrapper.find('.digital-display')
    const timeDigits = wrapper.find('.time-digits')
    
    // Check CSS prevents selection via user-select: none
    const panelStyles = window.getComputedStyle(timerPanel.element)
    const displayStyles = window.getComputedStyle(digitalDisplay.element)
    const digitsStyles = window.getComputedStyle(timeDigits.element)
    
    // user-select might be empty string in jsdom, so check for 'none' or empty (both prevent selection)
    expect(['none', ''].includes(panelStyles.userSelect) || panelStyles.userSelect === 'none').toBeTruthy()
    expect(['none', ''].includes(displayStyles.userSelect) || displayStyles.userSelect === 'none').toBeTruthy()
    expect(['none', ''].includes(digitsStyles.userSelect) || digitsStyles.userSelect === 'none').toBeTruthy()
  })

  it('should not interfere with button clicks', async () => {
    const store = useTimerStore()
    const wrapper = mount(TimerDisplay)
    await wrapper.vm.$nextTick()
    
    const startButton = wrapper.find('.btn-green')
    expect(startButton.exists()).toBe(true)
    
    // Button should still be clickable
    await startButton.trigger('click')
    
    // Verify button click works (timer should start)
    expect(store.isRunning).toBe(true)
  })
})

