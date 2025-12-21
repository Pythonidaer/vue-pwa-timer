import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the navigation bar', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Timer')
    expect(wrapper.text()).toContain('About')
    expect(wrapper.text()).toContain('Developer')
    expect(wrapper.text()).toContain('Download')
  })

  it('renders all main sections', () => {
    const wrapper = mount(App)
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('has navigation links that scroll to sections', () => {
    const wrapper = mount(App)
    const buttons = wrapper.findAll('button.nav-link')
    
    expect(buttons.length).toBeGreaterThan(0)
    const buttonTexts = buttons.map(btn => btn.text())
    expect(buttonTexts).toContain('About')
    expect(buttonTexts).toContain('Download')
  })

  it('renders footer with copyright', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('2024 Timer Widget')
    expect(wrapper.text()).toContain('Free and open source')
  })
})

