<script setup lang="ts">
</script>

<template>
  <section class="about">
    <div class="container">
      <h2 class="section-title">About Timer</h2>
      <p class="section-subtitle">
        A modern desktop timer widget built with Tauri
      </p>

      <div class="about-content">
        <div class="about-text">
          <p class="about-paragraph">
            Timer is a sleek, minimalist timer application designed for your desktop.
            Built with modern web technologies and packaged as a native desktop app,
            it provides a distraction-free way to track time.
          </p>
          <p class="about-paragraph">
            Whether you're timing work sessions, breaks, or any activity,
            Timer stays out of your way while keeping time visible and accessible.
            The compact design ensures it never gets in the way of your workflow.
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-number">01</div>
            <h3 class="feature-title">Always On Top</h3>
            <p class="feature-description">
              Keep the timer visible above all other windows for constant access.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-number">02</div>
            <h3 class="feature-title">Save Sessions</h3>
            <p class="feature-description">
              Save your timer sessions with optional notes for later reference.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-number">03</div>
            <h3 class="feature-title">Compact Design</h3>
            <p class="feature-description">
              Minimal footprint that expands only when you need to view saved times.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-number">04</div>
            <h3 class="feature-title">Cross-Platform</h3>
            <p class="feature-description">
              Available for macOS, Windows, and Linux with native performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 8rem 2rem;
  background: #0f0f0f;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #888;
  text-align: center;
  margin-bottom: 4rem;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.about-text {
  max-width: 800px;
  margin: 0 auto;
}

.about-paragraph {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cccccc;
  margin-bottom: 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
}

.feature-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #888;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #ffffff;
}

.feature-description {
  color: #aaaaaa;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .about {
    padding: 4rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>

