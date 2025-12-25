// ============================================
// CHRISTMAS MINI-GAME - JAVASCRIPT
// ============================================

// Configuration
const PASSWORD = "moon"
const MESSAGE =
  "We may not have met yet, but somehow you've found a quiet place in my thoughts. This Christmas, I simply wish you a life filled with happiness, peace, and good health. Wherever you are, I hope warmth finds you, and that gentle moments make you smile."

// State
let currentScreen = "password-screen"
let musicEnabled = false
let clickedWishes = 0
const totalWishes = 6

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initSnowfall()
  initPasswordScreen()
  initLandingScreen()
  initLevel1()
  initLevel2()
  initLevel3()
  initFinalScreen()
})

// ============================================
// SNOWFALL ANIMATION
// ============================================
function initSnowfall() {
  const canvas = document.getElementById("snowfall")
  const ctx = canvas.getContext("2d")

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const snowflakes = []
  const snowflakeCount = 100

  // Create snowflakes
  for (let i = 0; i < snowflakeCount; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      drift: Math.random() * 0.5 - 0.25,
    })
  }

  function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.beginPath()

    snowflakes.forEach((flake) => {
      ctx.moveTo(flake.x, flake.y)
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
    })

    ctx.fill()
    updateSnowflakes()
  }

  function updateSnowflakes() {
    snowflakes.forEach((flake) => {
      flake.y += flake.speed
      flake.x += flake.drift

      if (flake.y > canvas.height) {
        flake.y = -10
        flake.x = Math.random() * canvas.width
      }

      if (flake.x > canvas.width) {
        flake.x = 0
      } else if (flake.x < 0) {
        flake.x = canvas.width
      }
    })
  }

  function animate() {
    drawSnowflakes()
    requestAnimationFrame(animate)
  }

  animate()

  // Resize handler
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

// ============================================
// PASSWORD SCREEN
// ============================================
function initPasswordScreen() {
  const input = document.getElementById("password-input")
  const submitBtn = document.getElementById("password-submit")
  const errorText = document.getElementById("password-error")

  const checkPassword = () => {
    const value = input.value.trim().toLowerCase()

    if (value === PASSWORD) {
      errorText.textContent = ""
      switchScreen("landing-screen")
    } else {
      errorText.textContent = "❌ Incorrect password. Try again!"
      input.value = ""
      input.style.animation = "shake 0.5s"
      setTimeout(() => {
        input.style.animation = ""
      }, 500)
    }
  }

  submitBtn.addEventListener("click", checkPassword)
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkPassword()
    }
  })
}

// ============================================
// LANDING SCREEN
// ============================================
function initLandingScreen() {
  const startBtn = document.getElementById("start-game")
  const musicToggle = document.getElementById("music-toggle")

  startBtn.addEventListener("click", () => {
    switchScreen("level1-screen")
    startTypingAnimation()
  })

  musicToggle.addEventListener("click", () => {
    musicEnabled = !musicEnabled
    musicToggle.textContent = musicEnabled ? "🔊" : "🔇"
    // In production, you would play/pause background music here
  })
}

// ============================================
// LEVEL 1 - MESSAGE SCREEN
// ============================================
function initLevel1() {
  const nextBtn = document.getElementById("level1-next")

  nextBtn.addEventListener("click", () => {
    switchScreen("level2-screen")
  })
}

function startTypingAnimation() {
  const textElement = document.getElementById("typing-text")
  const nextBtn = document.getElementById("level1-next")
  let index = 0

  textElement.textContent = ""
  nextBtn.classList.add("hidden")

  function type() {
    if (index < MESSAGE.length) {
      textElement.textContent += MESSAGE.charAt(index)
      index++
      setTimeout(type, 30)
    } else {
      textElement.classList.add("complete")
      setTimeout(() => {
        nextBtn.classList.remove("hidden")
      }, 500)
    }
  }

  type()
}

// ============================================
// LEVEL 2 - INTERACTIVE WISHES
// ============================================
function initLevel2() {
  const floatingItems = document.querySelectorAll(".floating-item")
  const wishDisplay = document.getElementById("wish-display")
  const nextBtn = document.getElementById("level2-next")

  floatingItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("clicked")) {
        item.classList.add("clicked")
        const wish = item.getAttribute("data-wish")

        // Display wish
        wishDisplay.textContent = wish
        wishDisplay.style.animation = "none"
        setTimeout(() => {
          wishDisplay.style.animation = "pulse 0.5s ease"
        }, 10)

        // Add sparkle effect
        createSparkle(item)

        // Fade out item
        item.style.opacity = "0.3"
        item.style.transform = "scale(0.8)"
        item.style.pointerEvents = "none"

        clickedWishes++

        if (clickedWishes >= totalWishes) {
          setTimeout(() => {
            nextBtn.classList.remove("hidden")
          }, 1000)
        }
      }
    })
  })

  nextBtn.addEventListener("click", () => {
    switchScreen("level3-screen")
    // Reset for replay
    clickedWishes = 0
    floatingItems.forEach((item) => {
      item.classList.remove("clicked")
      item.style.opacity = "1"
      item.style.transform = "scale(1)"
      item.style.pointerEvents = "auto"
    })
    nextBtn.classList.add("hidden")
  })
}

function createSparkle(element) {
  const rect = element.getBoundingClientRect()
  const sparkle = document.createElement("div")
  sparkle.textContent = "✨"
  sparkle.style.position = "fixed"
  sparkle.style.left = rect.left + rect.width / 2 + "px"
  sparkle.style.top = rect.top + rect.height / 2 + "px"
  sparkle.style.fontSize = "2rem"
  sparkle.style.pointerEvents = "none"
  sparkle.style.zIndex = "1000"
  sparkle.style.animation = "sparkleFloat 1s ease-out forwards"

  document.body.appendChild(sparkle)

  setTimeout(() => {
    sparkle.remove()
  }, 1000)
}

// ============================================
// LEVEL 3 - PLAYLIST
// ============================================
function initLevel3() {
  const playButtons = document.querySelectorAll(".play-button")
  const nextBtn = document.getElementById("level3-next")

  playButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()

      // Toggle play state
      const isPlaying = button.classList.contains("playing")

      // Stop all other songs
      playButtons.forEach((btn) => {
        btn.classList.remove("playing")
        btn.textContent = "▶"
      })

      if (!isPlaying) {
        button.classList.add("playing")
        button.textContent = "⏸"
        // In production, you would play the actual song here
      }
    })
  })

  // Click anywhere on song item to play
  document.querySelectorAll(".song-item").forEach((item) => {
    item.addEventListener("click", () => {
      const playButton = item.querySelector(".play-button")
      playButton.click()
    })
  })

  nextBtn.addEventListener("click", () => {
    switchScreen("final-screen")
  })
}

// ============================================
// FINAL SCREEN
// ============================================
function initFinalScreen() {
  const replayBtn = document.getElementById("replay-game")

  replayBtn.addEventListener("click", () => {
    // Reset to landing screen
    switchScreen("landing-screen")

    // Reset all states
    clickedWishes = 0
    document.getElementById("password-input").value = ""
    document.getElementById("password-error").textContent = ""

    // Reset level 2
    document.querySelectorAll(".floating-item").forEach((item) => {
      item.classList.remove("clicked")
      item.style.opacity = "1"
      item.style.transform = "scale(1)"
      item.style.pointerEvents = "auto"
    })
    document.getElementById("level2-next").classList.add("hidden")

    // Reset playlist
    document.querySelectorAll(".play-button").forEach((btn) => {
      btn.classList.remove("playing")
      btn.textContent = "▶"
    })
  })
}

// ============================================
// SCREEN MANAGEMENT
// ============================================
function switchScreen(screenId) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active")
  })

  // Show target screen
  setTimeout(() => {
    document.getElementById(screenId).classList.add("active")
    currentScreen = screenId
  }, 300)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Add shake animation to CSS dynamically
const style = document.createElement("style")
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`
document.head.appendChild(style)
