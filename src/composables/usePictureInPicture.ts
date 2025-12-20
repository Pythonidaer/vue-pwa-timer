import { ref, watch } from 'vue'
import { useTimerStore } from '@/stores/timer'

export function usePictureInPicture() {
  const pipWindow = ref<Window | null>(null)
  const isPiPOpen = ref(false)
  const timerStore = useTimerStore()

  async function openPiP() {
    // Check if Document Picture-in-Picture API is supported
    if (!('documentPictureInPicture' in window)) {
      alert('Picture-in-Picture is not supported in this browser. Please use Chrome/Edge.')
      return
    }

    try {
      const pip = (window as any).documentPictureInPicture
      const newWindow = await pip.requestWindow({
        width: 280,
        height: 120,
      })

      pipWindow.value = newWindow
      isPiPOpen.value = true

      // Set up PiP window document
      const pipDoc = newWindow.document
      pipDoc.documentElement.innerHTML = `
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Timer</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/primeicons@7.0.0/primeicons.css">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: transparent;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            .pip-timer-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 0.5rem;
              background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
              border-radius: 4px;
              width: 100%;
              height: 100%;
            }
            .pip-timer-panel {
              display: flex;
              align-items: center;
              gap: 0.4rem;
              width: 100%;
            }
            .pip-digital-display {
              background: #0a0a0a;
              border-radius: 2px;
              padding: 0.3rem 0.25rem;
              flex: 1;
              border: 0.5px solid rgba(26, 26, 26, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .pip-time-digits {
              font-family: 'DSEG7-Classic', monospace;
              font-size: 2rem;
              color: #ffffff;
              letter-spacing: 0.02em;
              line-height: 1;
            }
            .pip-controls {
              display: flex;
              gap: 0.25rem;
              flex-shrink: 0;
            }
            .pip-btn {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: none;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 0.8rem;
              transition: all 0.15s ease;
            }
            .pip-btn-green {
              background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
            }
            .pip-btn-yellow {
              background: linear-gradient(135deg, #f9a825 0%, #f57f17 100%);
            }
            .pip-btn-blue {
              background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
            }
            .pip-btn-purple {
              background: linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%);
            }
            .pip-btn:hover {
              opacity: 0.9;
            }
            .pip-btn:active {
              transform: scale(0.95);
            }
          </style>
        </head>
        <body>
          <div class="pip-timer-container">
            <div class="pip-timer-panel">
              <div class="pip-digital-display">
                <span class="pip-time-digits" id="pip-time">00:00</span>
              </div>
              <div class="pip-controls">
                <button class="pip-btn" id="pip-play-pause" aria-label="Play/Pause">
                  <i class="pi pi-play"></i>
                </button>
                <button class="pip-btn pip-btn-blue" id="pip-save" aria-label="Save">
                  <i class="pi pi-save"></i>
                </button>
                <button class="pip-btn pip-btn-purple" id="pip-reset" aria-label="Reset">
                  <i class="pi pi-refresh"></i>
                </button>
              </div>
            </div>
          </div>
        </body>
      `

      // Import DSEG font and PrimeIcons
      const dsegLink = pipDoc.createElement('link')
      dsegLink.rel = 'stylesheet'
      dsegLink.href = 'https://cdn.jsdelivr.net/npm/dseg@0.46.0/css/dseg.css'
      pipDoc.head.appendChild(dsegLink)

      // Get elements
      const timeDisplay = pipDoc.getElementById('pip-time')
      const playPauseBtn = pipDoc.getElementById('pip-play-pause')
      const saveBtn = pipDoc.getElementById('pip-save')
      const resetBtn = pipDoc.getElementById('pip-reset')

      // Update time display
      function updateTime() {
        if (timeDisplay) {
          timeDisplay.textContent = timerStore.formattedTime
        }
      }

      // Update button state
      function updateButton() {
        if (playPauseBtn) {
          const icon = playPauseBtn.querySelector('i')
          if (icon) {
            icon.className = timerStore.isRunning ? 'pi pi-pause' : 'pi pi-play'
          }
          playPauseBtn.className = `pip-btn ${timerStore.isRunning ? 'pip-btn-yellow' : 'pip-btn-green'}`
        }
      }

      // Watch for timer changes
      const stopWatcher = watch(
        () => [timerStore.formattedTime, timerStore.isRunning],
        () => {
          updateTime()
          updateButton()
        },
        { immediate: true }
      )

      // Button handlers
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
          if (timerStore.isRunning) {
            timerStore.pause()
          } else {
            timerStore.start()
          }
        })
      }

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          if (timerStore.totalSeconds > 0) {
            timerStore.saveTime('')
          }
        })
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          timerStore.reset()
        })
      }

      // Clean up when window closes
      newWindow.addEventListener('pagehide', () => {
        stopWatcher()
        pipWindow.value = null
        isPiPOpen.value = false
      })

      // Initial update
      updateTime()
      updateButton()
    } catch (error) {
      console.error('Failed to open Picture-in-Picture:', error)
      alert('Failed to open Picture-in-Picture window. Please check browser permissions.')
    }
  }

  function closePiP() {
    if (pipWindow.value) {
      pipWindow.value.close()
      pipWindow.value = null
      isPiPOpen.value = false
    }
  }

  return {
    pipWindow,
    isPiPOpen,
    openPiP,
    closePiP,
    isSupported: 'documentPictureInPicture' in window,
  }
}

