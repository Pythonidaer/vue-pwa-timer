import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import About from '../About.vue'

describe('About', () => {
  it('renders the about section title', () => {
    const wrapper = mount(About)
    expect(wrapper.text()).toContain('About Timer')
  })

  it('renders feature cards', () => {
    const wrapper = mount(About)
    expect(wrapper.text()).toContain('Always On Top')
    expect(wrapper.text()).toContain('Save Sessions')
    expect(wrapper.text()).toContain('Compact Design')
    expect(wrapper.text()).toContain('Cross-Platform')
  })
})

