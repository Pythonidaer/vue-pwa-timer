import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import TimerDisplay from '../TimerDisplay.vue'
import { useTimerStore } from '@/stores/timer'

describe('TimerDisplay', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the timer display', () => {
    const wrapper = mount(TimerDisplay)
    
    expect(wrapper.find('.digital-display').exists()).toBe(true)
    expect(wrapper.find('.time-digits').exists()).toBe(true)
  })

  it('should display formatted time', () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(65000) // 1 minute 5 seconds
    
    const wrapper = mount(TimerDisplay)
    
    expect(wrapper.find('.time-digits').text()).toContain('01:05')
  })

  it('should show start button when timer is not running', () => {
    const wrapper = mount(TimerDisplay)
    const startButton = wrapper.find('.btn-green')
    
    expect(startButton.exists()).toBe(true)
    expect(startButton.attributes('aria-label')).toContain('Start')
  })

  it('should show yellow button when timer is running', async () => {
    const store = useTimerStore()
    store.start()
    
    const wrapper = mount(TimerDisplay)
    await wrapper.vm.$nextTick()
    
    const pauseButton = wrapper.find('.btn-yellow')
    expect(pauseButton.exists()).toBe(true)
    expect(pauseButton.attributes('aria-label')).toContain('Pause')
  })

  it('should call start when green button is clicked and timer is not running', async () => {
    const store = useTimerStore()
    const startSpy = vi.spyOn(store, 'start')
    
    const wrapper = mount(TimerDisplay)
    const startButton = wrapper.find('.btn-green')
    
    await startButton.trigger('click')
    
    expect(startSpy).toHaveBeenCalled()
  })

  it('should call pause when yellow button is clicked and timer is running', async () => {
    const store = useTimerStore()
    store.start()
    const pauseSpy = vi.spyOn(store, 'pause')
    
    const wrapper = mount(TimerDisplay)
    await wrapper.vm.$nextTick()
    
    const pauseButton = wrapper.find('.btn-yellow')
    expect(pauseButton.exists()).toBe(true)
    await pauseButton.trigger('click')
    
    expect(pauseSpy).toHaveBeenCalled()
  })

  it('should toggle between start and pause with the button', async () => {
    const store = useTimerStore()
    const wrapper = mount(TimerDisplay)
    
    // Initially not running, should show green button with Start label
    const startButton = wrapper.find('.btn-green')
    expect(startButton.exists()).toBe(true)
    expect(startButton.attributes('aria-label')).toContain('Start')
    
    // Start timer
    await startButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    // Now running, should show yellow button with Pause label
    const pauseButton = wrapper.find('.btn-yellow')
    expect(pauseButton.exists()).toBe(true)
    expect(pauseButton.attributes('aria-label')).toContain('Pause')
  })

  it('should show notes input when save button is clicked', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(5000)
    store.pause()
    
    const wrapper = mount(TimerDisplay)
    const saveButton = wrapper.find('.btn-blue')
    
    await saveButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    // Drawer should now be open automatically after clicking save
    const drawer = wrapper.findComponent({ name: 'SavedTimesDrawer' })
    expect(drawer.exists()).toBe(true)
    expect(drawer.find('.notes-input').exists()).toBe(true)
  })

  it('should save time with notes when save button in notes input is clicked', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(5000)
    store.pause()
    const saveTimeSpy = vi.spyOn(store, 'saveTime')
    
    const wrapper = mount(TimerDisplay)
    const saveButton = wrapper.find('.btn-blue')
    
    await saveButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    // Drawer should now be open automatically after clicking save
    const drawer = wrapper.findComponent({ name: 'SavedTimesDrawer' })
    expect(drawer.exists()).toBe(true)
    
    const notesInput = drawer.find('.notes-input')
    await notesInput.setValue('Test notes')
    
    const saveNotesButton = drawer.find('.btn-header')
    await saveNotesButton.trigger('click')
    
    expect(saveTimeSpy).toHaveBeenCalledWith('Test notes')
  })

  it('should not disable save button (buttons are never disabled)', () => {
    const wrapper = mount(TimerDisplay)
    const saveButton = wrapper.find('.btn-blue')
    
    expect(saveButton.attributes('disabled')).toBeUndefined()
  })

  it('should enable save button when timer is greater than 00:00', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(1000) // 1 second
    
    const wrapper = mount(TimerDisplay)
    await wrapper.vm.$nextTick()
    
    const saveButton = wrapper.find('.btn-blue')
    expect(saveButton.attributes('disabled')).toBeUndefined()
  })

  it('should call reset when power button is clicked and timer is running', async () => {
    const store = useTimerStore()
    store.start()
    const resetSpy = vi.spyOn(store, 'reset')
    
    const wrapper = mount(TimerDisplay)
    const powerButton = wrapper.find('.btn-purple')
    
    await powerButton.trigger('click')
    
    expect(resetSpy).toHaveBeenCalled()
  })
})

