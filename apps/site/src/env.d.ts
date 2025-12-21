/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Ensure JSX types are available for Vue templates
declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any
  }
}

// Vue template type support
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // Allow template variables to be recognized
    [key: string]: any
  }
}

