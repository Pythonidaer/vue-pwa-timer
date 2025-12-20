import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero from '../Hero.vue'

describe('Hero', () => {
  it('renders the hero title', () => {
    const wrapper = mount(Hero)
    expect(wrapper.text()).toContain('Timer')
    expect(wrapper.text()).toContain('Desktop Widget')
  })

  it('renders call-to-action buttons', () => {
    const wrapper = mount(Hero)
    expect(wrapper.text()).toContain('Download Now')
    expect(wrapper.text()).toContain('Learn More')
  })

  it('renders feature items', () => {
    const wrapper = mount(Hero)
    expect(wrapper.text()).toContain('Precise Timing')
    expect(wrapper.text()).toContain('Save Sessions')
    expect(wrapper.text()).toContain('Always On Top')
  })
})

