import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Downloads from '../Downloads.vue'

describe('Downloads', () => {
  it('renders download section title', () => {
    const wrapper = mount(Downloads)
    expect(wrapper.text()).toContain('Download')
  })

  it('renders all platform options', () => {
    const wrapper = mount(Downloads)
    expect(wrapper.text()).toContain('macOS')
    expect(wrapper.text()).toContain('Windows')
    expect(wrapper.text()).toContain('Linux')
  })

  it('shows download buttons for available platforms', () => {
    const wrapper = mount(Downloads)
    const buttons = wrapper.findAll('button')
    const downloadButtons = buttons.filter(btn => btn.text().includes('Download'))
    expect(downloadButtons.length).toBeGreaterThan(0)
    expect(downloadButtons.length).toBe(3) // macOS, Windows, Linux
  })
})

