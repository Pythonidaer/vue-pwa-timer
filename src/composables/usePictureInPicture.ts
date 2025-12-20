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
              font-family: 'Courier New', Courier, monospace;
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
            .pip-menu-item:hover:not(:disabled) {
              background: #2a2a2a;
              color: #fff;
            }
            .pip-menu-item-danger:hover:not(:disabled) {
              background: #2a1a1a;
              color: #ff6666;
            }
            .pip-menu-item:disabled {
              opacity: 0.3;
              cursor: not-allowed;
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
            <div id="pip-drawer-container" style="display: none; width: 100%; margin-top: 0.2rem; max-height: 300px; overflow-y: auto; overflow-x: visible; position: relative;">
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
            // Open drawer if not already open
            if (!pipDrawerOpen) {
              openDrawer()
            }
            // Show notes input in drawer header
            const notesWrapper = pipDoc.getElementById('pip-notes-wrapper')
            const notesInput = pipDoc.getElementById('pip-notes-input') as HTMLInputElement
            if (notesWrapper && notesInput) {
              notesWrapper.style.visibility = 'visible'
              notesWrapper.style.opacity = '1'
              notesWrapper.style.height = 'auto'
              notesWrapper.style.overflow = 'visible'
              setTimeout(() => notesInput.focus(), 100)
            }
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
      
      const expandedNotes = new Set<string>()
      
      function openDrawer() {
        if (!drawerContainer || !drawerIcon) return
        pipDrawerOpen = true
        drawerIcon.className = 'pi pi-chevron-up'
        drawerContainer.style.display = 'block'
        drawerContainer.innerHTML = `
          <div style="background: #0a0a0a; border: 0.5px solid rgba(26, 26, 26, 0.5); border-radius: 0 0 3px 3px; padding: 0; font-size: 0.85rem; color: #888; position: relative; overflow: visible;">
            <div id="pip-drawer-header" style="margin: 0; padding: 0.4rem 0; border-bottom: 0.5px solid rgba(26, 26, 26, 0.5); display: flex; align-items: center; gap: 0; background: #0a0a0a; justify-content: flex-end; position: relative; min-height: 32px; z-index: 1; overflow: visible;">
              <div id="pip-notes-wrapper" style="flex: 1; position: relative; margin-right: auto; visibility: hidden; opacity: 0; height: 0; overflow: hidden;">
                <input type="text" id="pip-notes-input" placeholder="Notes" style="width: 100%; padding: 0.3rem 2rem 0.3rem 0.5rem; border: 1px solid #ccc; border-radius: 3px; font-size: 0.85rem; background: #1a1a1a; color: #ffffff; outline: none;" />
                <button id="pip-notes-save" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; padding: 0; background: #2a2a2a; border: 0.5px solid rgba(42, 42, 42, 0.8); border-radius: 50%; cursor: pointer; font-size: 0.65rem; display: flex; align-items: center; justify-content: center; color: #888;">
                  <i class="pi pi-save"></i>
                </button>
                <button id="pip-notes-cancel" style="position: absolute; right: 2px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; padding: 0; background: #2a2a2a; border: 0.5px solid rgba(42, 42, 42, 0.8); border-radius: 50%; cursor: pointer; font-size: 0.65rem; display: flex; align-items: center; justify-content: center; color: #888;">
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <button id="pip-globe" style="background: transparent; border: 1px solid transparent; color: #888; padding: 0.2rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem; min-width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: auto; position: relative; z-index: 2;">
                <i class="pi pi-globe"></i>
              </button>
              <div id="pip-globe-menu" style="display: none; position: fixed; background: #1a1a1a; border: 0.25px solid #2a2a2a; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5); flex-direction: column; min-width: 120px; width: auto; max-width: 260px; z-index: 10000; overflow: visible;">
                <button id="pip-menu-export-all" class="pip-menu-item" style="background: none; border: none; color: #ccc; cursor: pointer; font-size: 0.85rem; padding: 0.5rem 0.75rem; text-align: left; transition: all 0.15s ease; border-bottom: 0.25px solid #2a2a2a; ${timerStore.savedTimes.length === 0 ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
                  Export All
                </button>
                <button id="pip-menu-delete-all" class="pip-menu-item pip-menu-item-danger" style="background: none; border: none; color: #cc4444; cursor: pointer; font-size: 0.85rem; padding: 0.5rem 0.75rem; text-align: left; transition: all 0.15s ease; ${timerStore.savedTimes.length === 0 ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
                  Delete All
                </button>
              </div>
            </div>
            <div id="pip-saved-times" style="display: flex; flex-direction: column; gap: 0.25rem; padding: 0;">
            </div>
          </div>
        `
        updateSavedTimes()
        // Setup globe button menu
        let showGlobeMenu = false
        const globeBtn = pipDoc.getElementById('pip-globe')
        const globeMenu = pipDoc.getElementById('pip-globe-menu')
        const exportAllBtn = pipDoc.getElementById('pip-menu-export-all')
        const deleteAllBtn = pipDoc.getElementById('pip-menu-delete-all')
        
        if (globeBtn && globeMenu) {
          globeBtn.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation()
            showGlobeMenu = !showGlobeMenu
            if (showGlobeMenu) {
              // Position dropdown relative to the button in PiP window
              const rect = globeBtn.getBoundingClientRect()
              // Position below the button, aligned to the right edge
              globeMenu.style.top = `${rect.bottom + 4}px`
              globeMenu.style.right = `${(globeBtn.ownerDocument.defaultView || window).innerWidth - rect.right}px`
              globeMenu.style.left = 'auto' // Override any left positioning
              globeMenu.style.display = 'flex'
            } else {
              globeMenu.style.display = 'none'
            }
          })
        }
        
        if (exportAllBtn) {
          exportAllBtn.addEventListener('click', () => {
            if (timerStore.savedTimes.length > 0 && !exportAllBtn.hasAttribute('disabled')) {
              timerStore.exportAllSavedTimes()
            }
            showGlobeMenu = false
            if (globeMenu) globeMenu.style.display = 'none'
          })
        }
        
        if (deleteAllBtn) {
          deleteAllBtn.addEventListener('click', () => {
            if (timerStore.savedTimes.length > 0 && !deleteAllBtn.hasAttribute('disabled') && confirm('Delete all saved times?')) {
              timerStore.deleteAllSavedTimes()
            }
            showGlobeMenu = false
            if (globeMenu) globeMenu.style.display = 'none'
          })
        }
        
        // Close menu when clicking outside
        pipDoc.addEventListener('click', (e: MouseEvent) => {
          const target = e.target as HTMLElement
          if (showGlobeMenu && !target.closest('#pip-globe') && !target.closest('#pip-globe-menu')) {
            showGlobeMenu = false
            if (globeMenu) globeMenu.style.display = 'none'
          }
        })
        // Setup notes input handlers in drawer
        setupNotesInputInDrawer()
      }
      
      function setupNotesInputInDrawer() {
        const notesWrapper = pipDoc.getElementById('pip-notes-wrapper')
        const notesInput = pipDoc.getElementById('pip-notes-input') as HTMLInputElement
        const notesSaveBtn = pipDoc.getElementById('pip-notes-save')
        const notesCancelBtn = pipDoc.getElementById('pip-notes-cancel')
        
        if (notesSaveBtn && notesInput) {
          notesSaveBtn.addEventListener('click', () => {
            if (timerStore.totalSeconds > 0) {
              timerStore.saveTime(notesInput.value || '')
              notesInput.value = ''
              if (notesWrapper) {
                notesWrapper.style.visibility = 'hidden'
                notesWrapper.style.opacity = '0'
                notesWrapper.style.height = '0'
                notesWrapper.style.overflow = 'hidden'
              }
              updateSavedTimes()
            }
          })
        }
        
        if (notesCancelBtn && notesInput) {
          notesCancelBtn.addEventListener('click', () => {
            notesInput.value = ''
            if (notesWrapper) {
              notesWrapper.style.visibility = 'hidden'
              notesWrapper.style.opacity = '0'
              notesWrapper.style.height = '0'
              notesWrapper.style.overflow = 'hidden'
            }
          })
        }
        
        if (notesInput) {
          notesInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && notesSaveBtn) {
              (notesSaveBtn as HTMLElement).click()
            } else if (e.key === 'Escape' && notesCancelBtn) {
              (notesCancelBtn as HTMLElement).click()
            }
          })
        }
      }
      
      function updateSavedTimes() {
        const savedTimesContainer = pipDoc.getElementById('pip-saved-times')
        if (savedTimesContainer && pipDrawerOpen) {
          if (timerStore.savedTimes.length === 0) {
            savedTimesContainer.innerHTML = ''
          } else {
            savedTimesContainer.innerHTML = timerStore.savedTimes.map(st => {
              const isExpanded = expandedNotes.has(st.id)
              return `
              <div style="background: #151515; border: 0.5px solid rgba(42, 42, 42, 0.5); border-radius: 3px; padding: 0.3rem 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; gap: 0.6rem; align-items: center; flex: 1;">
                    <span style="font-family: 'DSEG7-Classic', monospace; color: #fff; font-size: 0.95rem; min-width: 45px;">${st.time}</span>
                  </div>
                  <div style="display: flex; gap: 0.3rem; align-items: center;">
                    ${st.notes ? `<button id="pip-toggle-notes-${st.id}" style="background: transparent; border: 1px solid transparent; color: #ccc; padding: 0.2rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;"><i class="pi ${isExpanded ? 'pi-eye-slash' : 'pi-eye'}"></i></button>` : ''}
                    <button id="pip-export-${st.id}" style="background: transparent; border: 1px solid transparent; color: #ccc; padding: 0.2rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                      <i class="pi pi-download"></i>
                    </button>
                    <button id="pip-delete-${st.id}" style="background: transparent; border: 1px solid transparent; color: #cc4444; padding: 0.2rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>
                ${st.notes && isExpanded ? `<div style="margin-top: 0.4rem; padding: 0.4rem; border-top: none; background: #3b3b3b; color: #ffffff; font-size: 0.85rem; border-radius: 0 0 3px 3px; font-family: 'Courier New', Courier, monospace;">${st.notes}</div>` : ''}
              </div>
            `
            }).join('')
            
            // Add toggle listeners for notes, export, and delete
            timerStore.savedTimes.forEach(st => {
              if (st.notes) {
                const toggleBtn = pipDoc.getElementById(`pip-toggle-notes-${st.id}`)
                if (toggleBtn) {
                  toggleBtn.addEventListener('click', () => {
                    if (expandedNotes.has(st.id)) {
                      expandedNotes.delete(st.id)
                    } else {
                      expandedNotes.add(st.id)
                    }
                    updateSavedTimes()
                  })
                }
              }
              
              // Export button
              const exportBtn = pipDoc.getElementById(`pip-export-${st.id}`)
              if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                  timerStore.exportSavedTime(st.id)
                })
              }
              
              // Delete button
              const deleteBtn = pipDoc.getElementById(`pip-delete-${st.id}`)
              if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                  timerStore.deleteSavedTime(st.id)
                })
              }
            })
          }
        }
      }
      
      if (drawerBtn && drawerIcon && drawerContainer) {
        drawerBtn.addEventListener('click', () => {
          if (pipDrawerOpen) {
            // Close drawer
            pipDrawerOpen = false
            drawerIcon.className = 'pi pi-chevron-down'
            drawerContainer.style.display = 'none'
          } else {
            // Open drawer
            openDrawer()
          }
        })
      }
      
      // Watch for saved times changes
      const savedTimesWatcher = watch(
        () => timerStore.savedTimes,
        () => {
          updateSavedTimes()
          // Update menu button states
          const exportAllBtn = pipDoc.getElementById('pip-menu-export-all')
          const deleteAllBtn = pipDoc.getElementById('pip-menu-delete-all')
          if (exportAllBtn) {
            if (timerStore.savedTimes.length === 0) {
              exportAllBtn.setAttribute('disabled', '')
              exportAllBtn.style.opacity = '0.3'
              exportAllBtn.style.cursor = 'not-allowed'
            } else {
              exportAllBtn.removeAttribute('disabled')
              exportAllBtn.style.opacity = '1'
              exportAllBtn.style.cursor = 'pointer'
            }
          }
          if (deleteAllBtn) {
            if (timerStore.savedTimes.length === 0) {
              deleteAllBtn.setAttribute('disabled', '')
              deleteAllBtn.style.opacity = '0.3'
              deleteAllBtn.style.cursor = 'not-allowed'
            } else {
              deleteAllBtn.removeAttribute('disabled')
              deleteAllBtn.style.opacity = '1'
              deleteAllBtn.style.cursor = 'pointer'
            }
          }
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
      
      // Focus the PiP window
      newWindow.focus()

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

