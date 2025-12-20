<script setup lang="ts">
const platforms = [
  {
    name: 'macOS',
    icon: '🍎',
    description: 'Download for Mac',
    placeholder: true,
    url: '#'
  },
  {
    name: 'Windows',
    icon: '🪟',
    description: 'Download for Windows',
    placeholder: true,
    url: '#'
  },
  {
    name: 'Linux',
    icon: '🐧',
    description: 'Download for Linux',
    placeholder: true,
    url: '#'
  }
]
</script>

<template>
  <section class="downloads">
    <div class="container">
      <h2 class="section-title">Download</h2>
      <p class="section-subtitle">
        Available for all major platforms
      </p>

      <div class="downloads-grid">
        <div
          v-for="platform in platforms"
          :key="platform.name"
          class="download-card"
        >
          <div class="platform-icon">{{ platform.icon }}</div>
          <h3 class="platform-name">{{ platform.name }}</h3>
          <p class="platform-description">{{ platform.description }}</p>
          <button
            :class="['download-button', { 'placeholder': platform.placeholder }]"
            :disabled="platform.placeholder"
          >
            {{ platform.placeholder ? 'Coming Soon' : 'Download' }}
          </button>
          <p v-if="platform.placeholder" class="placeholder-note">
            Downloads will be available after the first release
          </p>
        </div>
      </div>

      <div class="download-info">
        <p class="info-text">
          All downloads will be available from
          <a
            href="https://github.com/YOUR_USERNAME/vue-pwa-timer/releases"
            target="_blank"
            rel="noopener noreferrer"
            class="info-link"
          >
            GitHub Releases
          </a>
          once the desktop app is built and signed.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.downloads {
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

.downloads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.download-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.download-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
}

.platform-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.platform-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.platform-description {
  color: #888;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.download-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #0a0a0a;
  margin-bottom: 1rem;
}

.download-button:hover:not(:disabled) {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.download-button.placeholder {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  cursor: not-allowed;
}

.download-button:disabled {
  cursor: not-allowed;
}

.placeholder-note {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.download-info {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-text {
  color: #aaaaaa;
  line-height: 1.8;
  font-size: 1rem;
}

.info-link {
  color: #ffffff;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.info-link:hover {
  color: #cccccc;
}

@media (max-width: 768px) {
  .downloads {
    padding: 4rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .downloads-grid {
    grid-template-columns: 1fr;
  }
}
</style>

