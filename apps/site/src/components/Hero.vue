<script setup lang="ts">
defineEmits<{
  scrollTo: [id: string]
}>()

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">
        Timer
        <span class="hero-subtitle">Desktop Widget</span>
      </h1>
      <p class="hero-description">
        A sleek, minimalist timer application for your desktop.
        <br>
        Always on top, always accessible.
      </p>
      <div class="hero-buttons">
        <button @click="scrollTo('downloads')" class="btn btn-primary">
          Download Now
        </button>
        <button @click="scrollTo('about')" class="btn btn-secondary">
          Learn More
        </button>
      </div>
      <div class="hero-features">
        <div class="feature-item">
          <div class="feature-icon">⏱️</div>
          <span>Precise Timing</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💾</div>
          <span>Save Sessions</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🪟</div>
          <span>Always On Top</span>
        </div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="timer-preview">
        <div class="timer-display">00:00</div>
        <div class="timer-controls">
          <div class="control-btn"></div>
          <div class="control-btn"></div>
          <div class="control-btn"></div>
          <div class="control-btn"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 4rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.hero-subtitle {
  display: block;
  font-size: 1.5rem;
  font-weight: 400;
  color: #888;
  margin-top: 0.5rem;
  letter-spacing: 0.02em;
}

.hero-description {
  font-size: 1.25rem;
  color: #cccccc;
  line-height: 1.8;
  margin-bottom: 2.5rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 4rem;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.btn-primary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.hero-features {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #888;
  font-size: 0.95rem;
}

.feature-icon {
  font-size: 1.5rem;
}

.hero-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-preview {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 300px;
}

.timer-display {
  font-family: 'Courier New', monospace;
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 0.1em;
}

.timer-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 968px) {
  .hero {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-features {
    justify-content: center;
  }
}
</style>

