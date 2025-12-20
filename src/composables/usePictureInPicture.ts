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
        height: 200, // Increased to accommodate drawer
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
              min-height: 100%;
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
            .pip-button-column {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
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
            .pip-btn-drawer {
              background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
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
                <div class="pip-button-column">
                  <button class="pip-btn" id="pip-play-pause" aria-label="Play/Pause">
                    <i class="pi pi-play"></i>
                  </button>
                  <button class="pip-btn pip-btn-blue" id="pip-save" aria-label="Save">
                    <i class="pi pi-save"></i>
                  </button>
                </div>
                <div class="pip-button-column">
                  <button class="pip-btn pip-btn-purple" id="pip-reset" aria-label="Reset">
                    <i class="pi pi-refresh"></i>
                  </button>
                  <button class="pip-btn pip-btn-drawer" id="pip-drawer" aria-label="Toggle drawer">
                    <i class="pi pi-chevron-down" id="pip-drawer-icon"></i>
                  </button>
                </div>
              </div>
            </div>
            <div id="pip-drawer-container" style="display: none; width: 100%; margin-top: 0.2rem;">
              <!-- Drawer will be rendered here when opened -->
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
      const drawerBtn = pipDoc.getElementById('pip-drawer')
      const drawerIcon = pipDoc.getElementById('pip-drawer-icon')

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

      const drawerContainer = pipDoc.getElementById('pip-drawer-container')
      let pipDrawerOpen = false
      
      if (drawerBtn && drawerIcon && drawerContainer) {
        drawerBtn.addEventListener('click', () => {
          pipDrawerOpen = !pipDrawerOpen
          drawerIcon.className = pipDrawerOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'
          
          if (pipDrawerOpen) {
            // Show drawer in PiP window
            drawerContainer.style.display = 'block'
            // Create a simple drawer content (you can enhance this later)
            drawerContainer.innerHTML = `
              <div style="background: #0a0a0a; border: 0.5px solid rgba(26, 26, 26, 0.5); border-radius: 0 0 3px 3px; padding: 0.75rem; font-size: 0.85rem; color: #888;">
                <div style="margin-bottom: 0.5rem; padding-bottom: 0.3rem; border-bottom: 0.5px solid rgba(26, 26, 26, 0.5);">
                  <button id="pip-globe" style="background: transparent; border: 1px solid transparent; color: #888; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                    <i class="pi pi-globe"></i>
                  </button>
                </div>
                <div id="pip-saved-times" style="display: flex; flex-direction: column; gap: 0.4rem;">
                  ${timerStore.savedTimes.length === 0 ? '<div style="color: #666; text-align: center; padding: 1rem;">No saved times yet</div>' : ''}
                </div>
              </div>
            `
            // Update saved times list
            updateSavedTimes()
          } else {
            drawerContainer.style.display = 'none'
          }
        })
      }
      
      function updateSavedTimes() {
        const savedTimesContainer = pipDoc.getElementById('pip-saved-times')
        if (savedTimesContainer && pipDrawerOpen) {
          if (timerStore.savedTimes.length === 0) {
            savedTimesContainer.innerHTML = '<div style="color: #666; text-align: center; padding: 1rem;">No saved times yet</div>'
          } else {
            savedTimesContainer.innerHTML = timerStore.savedTimes.map(st => `
              <div style="background: #1a1a1a; border: 0.5px solid rgba(42, 42, 42, 0.5); border-radius: 3px; padding: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 0.6rem; align-items: center;">
                  <span style="color: #888; font-size: 0.85rem; min-width: 65px;">${st.date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}</span>
                  <span style="font-family: monospace; color: #fff; font-size: 0.95rem; min-width: 45px;">${st.time}</span>
                </div>
                <div style="display: flex; gap: 0.3rem;">
                  <button style="background: transparent; border: 1px solid transparent; color: #888; padding: 0.2rem; border-radius: 4px; cursor: pointer;" onclick="navigator.clipboard.writeText(JSON.stringify({date: '${st.date.toLocaleDateString()}', time: '${st.time}', notes: '${st.notes}'}, null, 2))">
                    <i class="pi pi-download"></i>
                  </button>
                  <button style="background: transparent; border: 1px solid transparent; color: #cc4444; padding: 0.2rem; border-radius: 4px; cursor: pointer;" onclick="window.dispatchEvent(new CustomEvent('pip-delete-time', {detail: '${st.id}'}))">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </div>
            `).join('')
          }
        }
      }
      
      // Watch for saved times changes
      const savedTimesWatcher = watch(
        () => timerStore.savedTimes,
        () => {
          updateSavedTimes()
        },
        { deep: true }
      )
      
      // Listen for delete events
      window.addEventListener('pip-delete-time', ((e: CustomEvent) => {
        timerStore.deleteSavedTime(e.detail)
      }) as EventListener)
      
      // Clean up saved times watcher
      newWindow.addEventListener('pagehide', () => {
        savedTimesWatcher()
      })

      // Clean up when window closes
      newWindow.addEventListener('pagehide', () => {
        stopWatcher()
        savedTimesWatcher()
        pipWindow.value = null
        isPiPOpen.value = false
        // Dispatch event to show main window content again
        window.dispatchEvent(new CustomEvent('pip-closed'))
      })
      
      // Dispatch event to hide main window content
      window.dispatchEvent(new CustomEvent('pip-opened'))

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
      // Dispatch event to show main window content again
      window.dispatchEvent(new CustomEvent('pip-closed'))
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

