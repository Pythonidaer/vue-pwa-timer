import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "primeicons/primeicons.css";
import "dseg/css/dseg.css";

const app = createApp(App);

app.use(createPinia());

app.mount("#app");

// Set PWA window size to fit content (for desktop PWAs)
if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
  // Resize window to fit content (Chrome/Edge desktop PWAs)
  setTimeout(() => {
    const contentWidth = Math.max(260, document.documentElement.scrollWidth);
    const contentHeight = document.documentElement.scrollHeight;
    
    // Try to resize window (only works in some PWA contexts)
    if ((window as any).resizeTo) {
      try {
        (window as any).resizeTo(contentWidth + 20, contentHeight + 40);
      } catch (e) {
        // Resize may not be allowed in all contexts
      }
    }
  }, 100);
}
