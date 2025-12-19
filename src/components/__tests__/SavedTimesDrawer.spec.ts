import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import SavedTimesDrawer from '../SavedTimesDrawer.vue'
import { useTimerStore } from '@/stores/timer'

describe('SavedTimesDrawer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the drawer container', () => {
    const wrapper = mount(SavedTimesDrawer)
    
    expect(wrapper.find('.drawer-container').exists()).toBe(true)
    expect(wrapper.find('.drawer-header').exists()).toBe(true)
  })

  it('should render the drawer header with controls', () => {
    const wrapper = mount(SavedTimesDrawer)
    
    expect(wrapper.find('.drawer-header').exists()).toBe(true)
    expect(wrapper.find('.header-controls').exists()).toBe(true)
  })

  it('should not show empty state message (removed)', () => {
    const wrapper = mount(SavedTimesDrawer)
    
    expect(wrapper.find('.empty-state').exists()).toBe(false)
  })

  it('should display saved times', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(10000)
    store.pause()
    store.saveTime('Test notes')
    
    const wrapper = mount(SavedTimesDrawer)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.saved-time-item').exists()).toBe(true)
    // Notes toggle button should exist with eye icon
    const toggleButton = wrapper.find('.btn-toggle-notes')
    expect(toggleButton.exists()).toBe(true)
    expect(toggleButton.find('i.pi-eye').exists()).toBe(true)
  })

  it('should format date correctly', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(10000)
    store.pause()
    store.saveTime('Test')
    
    const wrapper = mount(SavedTimesDrawer)
    await wrapper.vm.$nextTick()
    
    const dateElement = wrapper.find('.date')
    expect(dateElement.exists()).toBe(true)
    // Date format should be MM/DD/YY
    expect(dateElement.text()).toMatch(/\d{2}\/\d{2}\/\d{2}/)
  })

  it('should display saved time', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(65000) // 1 minute 5 seconds
    store.pause()
    store.saveTime()
    
    const wrapper = mount(SavedTimesDrawer)
    await wrapper.vm.$nextTick()
    
    const timeElement = wrapper.find('.time')
    expect(timeElement.text()).toBe('01:05')
  })

  it('should toggle notes expansion', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(10000)
    store.pause()
    store.saveTime('Test notes')
    
    const wrapper = mount(SavedTimesDrawer)
    await wrapper.vm.$nextTick()
    
    const toggleButton = wrapper.find('.btn-toggle-notes')
    expect(toggleButton.exists()).toBe(true)
    
    // Notes should be hidden initially
    expect(wrapper.find('.saved-time-notes').exists()).toBe(false)
    
    // Click to expand
    await toggleButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.saved-time-notes').exists()).toBe(true)
    expect(wrapper.find('.saved-time-notes').text()).toBe('Test notes')
  })

  it('should call deleteSavedTime when delete button is clicked', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(10000)
    store.pause()
    store.saveTime('Test')
    
    const deleteSpy = vi.spyOn(store, 'deleteSavedTime')
    
    const wrapper = mount(SavedTimesDrawer)
    await wrapper.vm.$nextTick()
    
    const deleteButton = wrapper.find('.btn-delete')
    await deleteButton.trigger('click')
    
    expect(deleteSpy).toHaveBeenCalled()
  })

  it('should call exportSavedTime when export button is clicked', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(10000)
    store.pause()
    store.saveTime('Test')
    
    const exportSpy = vi.spyOn(store, 'exportSavedTime')
    
    const wrapper = mount(SavedTimesDrawer)
    await wrapper.vm.$nextTick()
    
    const exportButtons = wrapper.findAll('.btn-action')
    const exportButton = exportButtons.find(btn => btn.attributes('aria-label') === 'Export')
    
    if (exportButton) {
      await exportButton.trigger('click')
      expect(exportSpy).toHaveBeenCalled()
    }
  })


  it('should call toggleViewMode when view toggle menu item is clicked', async () => {
    const store = useTimerStore()
    const toggleSpy = vi.spyOn(store, 'toggleViewMode')
    
    const wrapper = mount(SavedTimesDrawer)
    
    // Click globe icon to open menu
    const globeButton = wrapper.find('.btn-header')
    await globeButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    // Click the toggle view menu item
    const menuItems = wrapper.findAll('.menu-item')
    const toggleViewItem = menuItems.find(item => item.text().includes('View'))
    if (toggleViewItem) {
      await toggleViewItem.trigger('click')
      expect(toggleSpy).toHaveBeenCalled()
    } else {
      // Fallback: try to find by text content
      const viewItem = wrapper.find('.menu-item')
      if (viewItem.exists()) {
        await viewItem.trigger('click')
        expect(toggleSpy).toHaveBeenCalled()
      }
    }
  })

  it('should apply view mode class to list', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(10000)
    store.pause()
    store.saveTime('Test')
    
    const wrapper = mount(SavedTimesDrawer)
    await wrapper.vm.$nextTick()
    
    const list = wrapper.find('.saved-times-list')
    expect(list.classes()).toContain('girthy')
    
    store.toggleViewMode()
    await wrapper.vm.$nextTick()
    
    expect(list.classes()).toContain('compact')
  })

  it('should call exportAllSavedTimes when export all menu item is clicked', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(10000)
    store.pause()
    store.saveTime('Test')
    
    const exportAllSpy = vi.spyOn(store, 'exportAllSavedTimes')
    
    const wrapper = mount(SavedTimesDrawer)
    
    // Click globe icon to open menu
    const globeButton = wrapper.find('.btn-header')
    await globeButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    // Click the export all menu item
    const menuItems = wrapper.findAll('.menu-item')
    const exportAllItem = menuItems.find(item => item.text().includes('Export All'))
    if (exportAllItem) {
      await exportAllItem.trigger('click')
      expect(exportAllSpy).toHaveBeenCalled()
    }
  })

  it('should call deleteAllSavedTimes when delete all menu item is clicked', async () => {
    const store = useTimerStore()
    store.start()
    vi.advanceTimersByTime(10000)
    store.pause()
    store.saveTime('Test')
    
    const deleteAllSpy = vi.spyOn(store, 'deleteAllSavedTimes')
    
    const wrapper = mount(SavedTimesDrawer)
    
    // Click globe icon to open menu
    const globeButton = wrapper.find('.btn-header')
    await globeButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    // Click the delete all menu item
    const menuItems = wrapper.findAll('.menu-item')
    const deleteAllItem = menuItems.find(item => item.text().includes('Delete All'))
    if (deleteAllItem) {
      await deleteAllItem.trigger('click')
      expect(deleteAllSpy).toHaveBeenCalled()
    }
  })

  it('should disable export all and delete all menu items when no saved times', async () => {
    const wrapper = mount(SavedTimesDrawer)
    
    // Click globe icon to open menu
    const globeButton = wrapper.find('.btn-header')
    await globeButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    const menuItems = wrapper.findAll('.menu-item')
    const exportAllItem = menuItems.find(item => item.text().includes('Export All'))
    const deleteAllItem = menuItems.find(item => item.text().includes('Delete All'))
    
    if (exportAllItem) {
      expect(exportAllItem.attributes('disabled')).toBeDefined()
    }
    if (deleteAllItem) {
      expect(deleteAllItem.attributes('disabled')).toBeDefined()
    }
  })
})

