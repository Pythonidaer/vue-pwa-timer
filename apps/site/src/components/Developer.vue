<script setup lang="ts">
</script>

<template>
  <section class="developer">
    <div class="container">
      <h2 class="section-title">Developer</h2>
      <p class="section-subtitle">
        Built by Jonathan Hammond
      </p>

      <div class="developer-content">
        <div class="developer-card">
          <div class="developer-header">
            <div class="developer-avatar">
              <span class="avatar-initials">JH</span>
            </div>
            <div class="developer-info">
              <h3 class="developer-name">Jonathan Hammond</h3>
              <p class="developer-tagline">Free App • Open to Work</p>
            </div>
          </div>

          <p class="developer-bio">
            Timer is a free, open-source application built with modern web technologies.
            I'm currently open to new opportunities and would love to connect!
          </p>

          <div class="developer-links">
            <a
              href="https://www.linkedin.com/in/jonamichahammo"
              target="_blank"
              rel="noopener noreferrer"
              class="link-button linkedin"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>

            <a
              href="https://venmo.com/jonamichahammo"
              target="_blank"
              rel="noopener noreferrer"
              class="link-button venmo"
            >
              <span style="font-size: 1.2rem; font-weight: 700;">V</span>
              <span>Venmo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.developer {
  padding: 8rem 2rem;
  background: #0a0a0a;
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

.developer-content {
  max-width: 600px;
  margin: 0 auto;
}

.developer-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
}

.developer-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.developer-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.avatar-initials {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0a0a0a;
  letter-spacing: 0.05em;
}

.developer-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.developer-tagline {
  font-size: 1.1rem;
  color: #888;
  font-weight: 500;
}

.developer-bio {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cccccc;
  margin-bottom: 2.5rem;
}

.developer-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.link-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.link-button.linkedin {
  background: #0077b5;
  color: #ffffff;
  border-color: #0077b5;
}

.link-button.linkedin:hover {
  background: #006399;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 119, 181, 0.3);
}

.link-button.venmo {
  background: #3d95ce;
  color: #ffffff;
  border-color: #3d95ce;
}

.link-button.venmo:hover {
  background: #2d7fb8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 149, 206, 0.3);
}

@media (max-width: 768px) {
  .developer {
    padding: 4rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .developer-card {
    padding: 2rem;
  }

  .developer-links {
    flex-direction: column;
  }

  .link-button {
    width: 100%;
    justify-content: center;
  }
}
</style>

