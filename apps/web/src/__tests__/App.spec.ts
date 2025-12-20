import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import { mount } from "@vue/test-utils";
import App from "../App.vue";

describe("App", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("mounts renders properly", () => {
    const wrapper = mount(App);
    expect(wrapper.find('.timer-container').exists()).toBe(true);
  });
});
