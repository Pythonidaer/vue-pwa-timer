<script setup lang="ts">
import { ref } from 'vue'
import Hero from './components/Hero.vue'
import About from './components/About.vue'
import Developer from './components/Developer.vue'
import Downloads from './components/Downloads.vue'

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">Timer</div>
        <div class="nav-links">
          <button @click="scrollTo('about')" class="nav-link">About</button>
          <button @click="scrollTo('developer')" class="nav-link">Developer</button>
          <button @click="scrollTo('downloads')" class="nav-link">Download</button>
        </div>
      </div>
    </nav>

    <main>
      <Hero @scroll-to="scrollTo" />
      <About id="about" />
      <Developer id="developer" />
      <Downloads id="downloads" />
    </main>

    <footer class="footer">
      <p>&copy; 2024 Timer Widget. Free and open source.</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  background: none;
  border: none;
  color: #cccccc;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #ffffff;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

main {
  flex: 1;
  margin-top: 80px;
}

.footer {
  background: #0a0a0a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  text-align: center;
  color: #888;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.9rem;
  }
}
</style>

