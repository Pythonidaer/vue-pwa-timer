import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Developer from '../Developer.vue'

describe('Developer', () => {
  it('renders developer name', () => {
    const wrapper = mount(Developer)
    expect(wrapper.text()).toContain('Jonathan Hammond')
  })

  it('renders tagline', () => {
    const wrapper = mount(Developer)
    expect(wrapper.text()).toContain('Free App')
    expect(wrapper.text()).toContain('Open to Work')
  })

  it('has LinkedIn link', () => {
    const wrapper = mount(Developer)
    const linkedinLink = wrapper.find('a[href*="linkedin.com"]')
    expect(linkedinLink.exists()).toBe(true)
    expect(linkedinLink.attributes('href')).toContain('jonamichahammo')
  })

  it('has Venmo link', () => {
    const wrapper = mount(Developer)
    const venmoLink = wrapper.find('a[href*="venmo.com"]')
    expect(venmoLink.exists()).toBe(true)
    expect(venmoLink.attributes('href')).toContain('jonamichahammo')
  })
})

