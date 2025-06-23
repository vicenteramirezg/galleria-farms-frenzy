<template>
  <div class="game-wrapper">
    <!-- Game Instructions - moved to top -->
    <div class="instructions-container animate-fade-in-up mb-6">
      <h3 class="instructions-title">How to Play</h3>
      
      <!-- Regular Items -->
      <div class="mb-4">
        <h4 class="text-white font-semibold mb-2 text-sm">Regular Items</h4>
        <div class="score-guide">
          <div class="score-item">
            <span class="icon">🌸</span>
            <span class="points positive">+10</span>
          </div>
          <div class="score-item">
            <span class="icon">🌻</span>
            <span class="points positive">+15</span>
          </div>
          <div class="score-item">
            <span class="icon">🌺</span>
            <span class="points positive">+20</span>
          </div>
          <div class="score-item">
            <span class="icon">🐛</span>
            <span class="points negative">-5</span>
          </div>
        </div>
      </div>

      <!-- Special Challenge Items -->
      <div class="mb-4">
        <h4 class="text-white font-semibold mb-2 text-sm">Special Challenge Items</h4>
        <div class="score-guide special-items">
          <div class="score-item">
            <span class="icon">🦋</span>
            <span class="points special">+50</span>
            <span class="description">Moves around!</span>
          </div>
          <div class="score-item">
            <span class="icon">🌿</span>
            <span class="points positive">+25</span>
            <span class="description">Spreads if ignored</span>
          </div>
          <div class="score-item">
            <span class="icon">🌟</span>
            <span class="points legendary">+100</span>
            <span class="description">Rare & fast!</span>
          </div>
          <div class="score-item">
            <span class="icon">💣</span>
            <span class="points bomb">-10</span>
            <span class="description">Click fast or explodes!</span>
          </div>
        </div>
      </div>

      <!-- Combo System -->
      <div class="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
        <h4 class="text-white font-semibold mb-2 text-sm flex items-center">
          <span class="mr-2">🔥</span>Combo System
        </h4>
        <div class="text-xs text-white/80 space-y-1">
          <div>• Chain good clicks for bonus points!</div>
          <div>• 3+ combo: <span class="text-yellow-300">1.5x points</span></div>
          <div>• 6+ combo: <span class="text-yellow-300">2x points</span></div>
          <div>• 10+ combo: <span class="text-yellow-300">2.5x points</span></div>
          <div>• 15+ combo: <span class="text-yellow-300">3x points</span></div>
          <div class="text-red-300">⚠️ Bad clicks reset your combo!</div>
        </div>
      </div>

      <p class="instructions-text">
        Celebrate Galleria Farms' 25th anniversary! Collect flowers, build combos, and master the special challenges! 
        <span class="block mt-2 text-yellow-300 text-xs">💡 Game gets progressively harder every 10 seconds!</span>
      </p>

      <!-- Let's Play Button -->
      <div class="mt-4 text-center">
        <button 
          @click="scrollToGame"
          class="btn-accent text-base px-6 py-3"
        >
          <span class="mr-2">🚀</span>
          Let's Play!
        </button>
      </div>
      
      <div v-if="!showDifficultySelection && selectedDifficulty !== 'normal'" class="mt-4 p-3 bg-white/10 rounded-lg">
        <div class="text-sm text-white/80">
          <div class="font-semibold mb-1 capitalize">{{ selectedDifficulty }} Mode Active</div>
          <div class="text-xs">
            <span v-if="selectedDifficulty === 'easy'">🌱 Gentle progression, 15% special items</span>
            <span v-else-if="selectedDifficulty === 'hard'">🔥 Aggressive scaling, 25% special items</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Game Stats -->
    <div class="game-stats-container mb-6 animate-fade-in-down">
      <div class="flex justify-center items-center gap-4 md:gap-8">
        <div class="stat-card score-card">
          <span class="stat-label">Score</span>
          <div class="stat-value">{{ currentScore.toLocaleString() }}</div>
        </div>
        
        <div class="stat-card time-card" :class="{ 'time-warning': timeLeft <= 10 && timeLeft > 0 }">
          <span class="stat-label">Time</span>
          <div class="stat-value">
            <span class="mr-1">⏰</span>
            {{ timeLeft }}s
          </div>
        </div>
      </div>
    </div>
    
    <!-- Game Canvas Container -->
    <div class="game-canvas-container animate-scale-in">
      <div 
        ref="gameContainer" 
        class="game-canvas phaser-container"
        :class="{ 'game-ended': gameEnded }"
      ></div>
      
      <!-- Difficulty Selection Overlay -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div 
          v-if="showDifficultySelection && !gameStarted && !gameEnded" 
          class="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center rounded-xl"
        >
                     <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-large p-6 text-center max-w-sm w-full">
             <div class="text-5xl mb-3 animate-bounce-subtle">🌸</div>
             <h3 class="text-2xl font-game text-white mb-3">Choose Your Challenge</h3>
             <p class="text-white/80 text-base mb-4">
               Celebrate <span class="text-yellow-400 font-bold">Galleria Farms' 25th Anniversary!</span>
             </p>
            
                         <!-- Difficulty Selection -->
             <div class="space-y-2 mb-4">
               <div 
                 v-for="(preset, key) in difficultyPresets" 
                 :key="key"
                 @click="selectedDifficulty = key"
                 class="difficulty-option"
                 :class="{ 'selected': selectedDifficulty === key }"
               >
                 <div class="text-center">
                   <div class="font-bold text-base capitalize">{{ key }}</div>
                   <div class="text-xs opacity-80">
                     <span v-if="key === 'easy'">🌱 Perfect for beginners</span>
                     <span v-else-if="key === 'normal'">🌸 Balanced challenge</span>
                     <span v-else-if="key === 'hard'">🔥 For experts only</span>
                   </div>
                 </div>
               </div>
             </div>
             
             <button 
               @click="startGame"
               class="btn-primary text-lg px-6 py-3 w-full"
             >
              <span class="mr-3">🎮</span>
              Start {{ selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1) }} Game
            </button>
          </div>
        </div>
      </Transition>

      <!-- Start Game Overlay (now only shows countdown) -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div 
          v-if="!showDifficultySelection && !gameStarted && !gameEnded" 
          class="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center rounded-xl"
        >
          <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-large p-8 text-center">
            <div class="text-6xl mb-4 animate-bounce-subtle">🌸</div>
            <h3 class="text-3xl font-game text-white mb-4">Ready to Celebrate?</h3>
            <p class="text-white/80 text-lg mb-6">
              Join us in celebrating<br>
              <span class="text-yellow-400 font-bold">Galleria Farms' 25th Anniversary!</span>
            </p>
            <div class="text-white/60 text-sm mb-4">
              Difficulty: <span class="text-yellow-400 font-bold capitalize">{{ selectedDifficulty }}</span>
            </div>
            <button 
              @click="startGame"
              class="btn-primary text-xl px-8 py-4"
            >
              <span class="mr-3">🎮</span>
              Start Game
            </button>
          </div>
        </div>
      </Transition>
      
      <!-- Countdown Overlay -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div 
          v-if="showCountdown" 
          class="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center rounded-xl"
        >
          <div class="text-center">
            <div class="text-8xl font-bold text-white mb-4 animate-pulse">
              {{ countdown }}
            </div>
            <p class="text-2xl text-white/80">Get ready...</p>
          </div>
        </div>
      </Transition>
    </div>
    
    <!-- Enhanced Game Over Overlay -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div 
        v-if="gameEnded" 
        class="game-over-overlay fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-large p-6 max-w-md w-full text-center animate-bounce-subtle">
          <!-- Game Over Header -->
          <div class="mb-6">
            <div class="text-6xl mb-4 animate-bounce-subtle">🏆</div>
            <h2 class="text-4xl font-game text-gradient mb-2">Game Over!</h2>
            <div class="text-3xl font-bold text-white mb-2">
              {{ finalScore.toLocaleString() }} Points!
            </div>
            <div class="text-white/60 text-sm mb-2">
              Difficulty: <span class="text-yellow-400 font-bold capitalize">{{ selectedDifficulty }}</span>
            </div>
            <div class="text-white/70 text-sm">
              {{ getScoreMessage() }}
            </div>
          </div>
          
          <!-- Score Submission Form -->
          <form @submit.prevent="submitScore" class="mb-6">
            <div class="mb-4">
              <label class="block text-white font-semibold mb-3 text-sm">
                Enter your initials to save your score:
              </label>
              <input
                v-model="playerInitials"
                type="text"
                maxlength="3"
                pattern="[A-Za-z]{3}"
                class="input-field w-full text-center text-2xl font-bold tracking-widest uppercase"
                placeholder="ABC"
                required
                @input="formatInitials"
              />
              <div class="text-xs text-white/50 mt-2">3 letters only</div>
            </div>
            
            <button
              type="submit"
              :disabled="submitting || playerInitials.length !== 3"
              class="btn-primary w-full mb-3 text-lg"
            >
              <span v-if="submitting" class="flex items-center justify-center">
                <div class="loading-spinner w-4 h-4 mr-2"></div>
                Submitting...
              </span>
              <span v-else class="flex items-center justify-center">
                <span class="mr-2">💾</span>
                Submit Score
              </span>
            </button>
          </form>
          
          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button @click="playAgain" class="btn-secondary flex-1">
              <span class="mr-2">🎮</span>
              Play Again
            </button>
            <button @click="viewLeaderboard" class="btn-accent flex-1">
              <span class="mr-2">🏆</span>
              Leaderboard
            </button>
          </div>
          
          <!-- Error Message -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
          >
            <div v-if="errorMessage" class="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm">
              <div class="flex items-center justify-center">
                <span class="mr-2">⚠️</span>
                {{ errorMessage }}
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import Phaser from 'phaser'
import { PreloadScene } from '../phaser/PreloadScene'
import { MainScene, DIFFICULTY_PRESETS } from '../phaser/MainScene'
import { gameApi } from '../api'

// Emits
const emit = defineEmits<{
  gameEnd: [score: number]
  showLeaderboard: []
}>()

// Reactive data
const gameContainer = ref<HTMLDivElement>()
const currentScore = ref(0)
const timeLeft = ref(DIFFICULTY_PRESETS.normal.gameTime)
const gameEnded = ref(false)
const gameStarted = ref(false)
const countdown = ref(0)
const showCountdown = ref(false)
const finalScore = ref(0)
const playerInitials = ref('')
const submitting = ref(false)
const errorMessage = ref('')
const selectedDifficulty = ref('normal')
const showDifficultySelection = ref(true)

// Add mobile-specific reactive data
const isMobile = ref(false)
const gameWidth = ref(800)
const gameHeight = ref(600)

// Phaser game instance
let game: Phaser.Game | null = null
let mainScene: MainScene | null = null

// Mobile detection and responsive sizing
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  updateGameDimensions()
}

const updateGameDimensions = () => {
  if (isMobile.value) {
    // For mobile, use a portrait aspect ratio that fits phone screens better
    const screenWidth = window.innerWidth - 32 // Account for padding
    const screenHeight = window.innerHeight - 200 // Account for UI elements
    const aspectRatio = 3/4 // Portrait ratio (3:4) instead of landscape
    
    gameWidth.value = Math.min(screenWidth, 450) // Max width of 450 on mobile
    gameHeight.value = Math.min(Math.round(gameWidth.value / aspectRatio), screenHeight)
  } else {
    // Desktop dimensions - slightly more portrait oriented
    gameWidth.value = 600 // Reduced width
    gameHeight.value = 700 // Increased height
  }
}

// Make difficulty presets available to template
const difficultyPresets = computed(() => DIFFICULTY_PRESETS)

// Computed property for responsive game config
const gameConfig = computed(() => ({
  type: Phaser.AUTO,
  width: gameWidth.value,
  height: gameHeight.value,
  parent: gameContainer.value,
  backgroundColor: '#228B22',
  scene: [PreloadScene, MainScene],
  dom: {
    createContainer: false
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameWidth.value,
    height: gameHeight.value
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  render: {
    pixelArt: false,
    antialias: true
  }
}))

// Watch for difficulty changes to update time display
watch(selectedDifficulty, (newDifficulty) => {
  if (!gameStarted.value && !gameEnded.value) {
    timeLeft.value = DIFFICULTY_PRESETS[newDifficulty].gameTime
  }
})

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  await nextTick()
  setTimeout(() => {
    initializeGame()
  }, 100)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  if (game) {
    game.destroy(true)
    game = null
  }
})

const initializeGame = () => {
  if (!gameContainer.value) return

  // Destroy any existing game instance
  if (game) {
    game.destroy(true)
    game = null
  }

  // Clear any existing content in the container
  gameContainer.value.innerHTML = ''

  // Create the game with responsive configuration
  game = new Phaser.Game(gameConfig.value)

  // Set up scene callbacks - try multiple approaches to get the scene reference
  const setupSceneCallbacks = () => {
    // Try to get the MainScene directly
    const scenes = game?.scene.getScenes()
    const foundMainScene = scenes?.find(scene => scene.scene.key === 'MainScene') as MainScene
    
    if (foundMainScene) {
      mainScene = foundMainScene
      console.log('MainScene found and callbacks set up')
      
      // Set up callbacks
      mainScene.setScoreCallback((score: number) => {
        currentScore.value = score
      })
      
      mainScene.setTimeCallback((time: number) => {
        timeLeft.value = time
      })
      
      mainScene.setGameEndCallback((score: number) => {
        finalScore.value = score
        gameEnded.value = true
        emit('gameEnd', score)
      })
    } else {
      console.log('MainScene not found, retrying...')
      // Retry after a short delay
      setTimeout(setupSceneCallbacks, 100)
    }
  }

  // Try to set up callbacks when the game is ready
  game.events.on('ready', setupSceneCallbacks)
  
  // Also try after a short delay as a fallback
  setTimeout(setupSceneCallbacks, 200)
}

const getScoreMessage = () => {
  const score = finalScore.value
  const difficulty = selectedDifficulty.value
  
  // Adjust score thresholds based on difficulty
  let multiplier = 1
  if (difficulty === 'easy') multiplier = 0.7
  if (difficulty === 'hard') multiplier = 1.4
  
  const adjustedThresholds = {
    legendary: Math.round(1000 * multiplier),
    excellent: Math.round(500 * multiplier),
    great: Math.round(250 * multiplier),
    good: Math.round(100 * multiplier)
  }
  
  if (score >= adjustedThresholds.legendary) return "🌟 Legendary Farmer! You're a flower-picking champion!"
  if (score >= adjustedThresholds.excellent) return "🌺 Excellent! You have a green thumb!"
  if (score >= adjustedThresholds.great) return "🌸 Great job! You're getting the hang of it!"
  if (score >= adjustedThresholds.good) return "🌻 Good effort! Keep practicing!"
  return "🌱 Not bad for a start! Try again to improve!"
}

const submitScore = async () => {
  if (playerInitials.value.length !== 3) return
  
  submitting.value = true
  errorMessage.value = ''
  
  try {
    await gameApi.submitScore({
      initials: playerInitials.value.toUpperCase(),
      score: finalScore.value
    })
    
    // Show success and redirect to leaderboard
    emit('showLeaderboard')
  } catch (error) {
    console.error('Failed to submit score:', error)
    errorMessage.value = 'Failed to submit score. Please check your connection and try again.'
  } finally {
    submitting.value = false
  }
}

const startGame = async () => {
  console.log('Starting game, mainScene:', mainScene)
  
  // Hide difficulty selection
  showDifficultySelection.value = false
  
  showCountdown.value = true
  countdown.value = 3
  
  // Countdown from 3 to 1
  for (let i = 3; i > 0; i--) {
    countdown.value = i
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  showCountdown.value = false
  gameStarted.value = true
  
  // Set difficulty and start the actual game - with fallback logic
  if (mainScene) {
    console.log('Setting difficulty and calling beginGame on mainScene')
    mainScene.setDifficulty(selectedDifficulty.value)
    mainScene.beginGame()
  } else {
    console.log('MainScene not available, trying to find it again')
    // Try to find the scene again
    const scenes = game?.scene.getScenes()
    const foundMainScene = scenes?.find(scene => scene.scene.key === 'MainScene') as MainScene
    
    if (foundMainScene) {
      mainScene = foundMainScene
      console.log('Found MainScene on retry, starting game')
      
      // Set up callbacks if not already set
      mainScene.setScoreCallback((score: number) => {
        currentScore.value = score
      })
      
      mainScene.setTimeCallback((time: number) => {
        timeLeft.value = time
      })
      
      mainScene.setGameEndCallback((score: number) => {
        finalScore.value = score
        gameEnded.value = true
        emit('gameEnd', score)
      })
      
      mainScene.setDifficulty(selectedDifficulty.value)
      mainScene.beginGame()
    } else {
      console.error('Could not find MainScene to start the game')
      // Reset the UI state since we can't start the game
      gameStarted.value = false
      errorMessage.value = 'Failed to start game. Please refresh and try again.'
    }
  }
}

const playAgain = () => {
  // Reset game state
  gameEnded.value = false
  gameStarted.value = false
  showDifficultySelection.value = true
  currentScore.value = 0
  timeLeft.value = DIFFICULTY_PRESETS[selectedDifficulty.value].gameTime
  finalScore.value = 0
  playerInitials.value = ''
  errorMessage.value = ''
  
  // Restart the Phaser scene
  if (mainScene) {
    mainScene.restartGame()
  }
}

const viewLeaderboard = () => {
  emit('showLeaderboard')
}

// Format initials input
const formatInitials = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = target.value.replace(/[^A-Za-z]/g, '').toUpperCase()
  playerInitials.value = target.value
}

// Scroll to game canvas
const scrollToGame = () => {
  if (gameContainer.value) {
    gameContainer.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    })
  }
}
</script>

<style scoped>
/* Game-specific styles */
.game-wrapper {
  @apply max-w-4xl mx-auto px-4;
}

/* Stats container */
.game-stats-container {
  @apply flex justify-center items-center mb-8;
}

.stat-card {
  @apply min-w-[120px] text-center;
}

.stat-card.score-card {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-4 border-2 border-white/20;
}

.stat-card.time-card {
  @apply bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 rounded-xl shadow-lg p-4 border-2 border-white/20;
}

.stat-card.time-card.time-warning {
  @apply bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse;
  animation: wiggle 0.5s ease-in-out infinite, pulse 1s ease-in-out infinite;
}

.stat-label {
  @apply block text-sm font-medium opacity-90 mb-1;
}

.stat-value {
  @apply text-2xl font-bold flex items-center justify-center;
}

/* Game canvas */
.game-canvas-container {
  @apply bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 mb-8;
  position: relative;
  z-index: 1;
}

.game-canvas {
  @apply w-full mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-green-600 to-green-700 shadow-inner;
  position: relative;
  /* Use portrait aspect ratio to better fit mobile screens */
  aspect-ratio: 3/4;
  max-width: 600px;
  max-height: 800px;
}

/* Ensure Phaser canvas is contained */
.phaser-container {
  /* Force containment of child elements */
  contain: layout;
}

/* Target the Phaser canvas directly */
.game-canvas > canvas {
  @apply rounded-xl;
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
  touch-action: manipulation; /* Prevent zoom on touch */
}

.game-canvas.game-ended {
  @apply opacity-50 pointer-events-none;
}

/* Instructions */
.instructions-container {
  @apply bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto border border-white/20;
}

.instructions-title {
  @apply text-xl font-bold text-white mb-4 text-center;
}

.score-guide {
  @apply flex justify-center items-center gap-6 mb-4;
}

.score-item {
  @apply flex items-center gap-2;
}

.score-item .icon {
  @apply text-2xl;
}

.score-item .points {
  @apply font-semibold text-lg;
}

.score-item .points.positive {
  @apply text-green-300;
}

.score-item .points.negative {
  @apply text-red-300;
}

.score-item .points.special {
  @apply text-blue-300;
}

.score-item .points.legendary {
  @apply text-yellow-300 font-bold;
}

.score-item .points.bomb {
  @apply text-red-400 font-bold;
}

.score-item .description {
  @apply text-xs text-white/60 ml-1;
}

.instructions-text {
  @apply text-white/80 text-sm text-center;
}

/* Game over overlay improvements */
.game-over-overlay {
  backdrop-filter: blur(10px);
}

/* Loading improvements */
.loading-spinner {
  border-top-color: currentColor;
}

/* Enhanced animations */
@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.05);
  }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

/* Enhanced mobile-responsive game canvas */
@media (max-width: 768px) {
  .game-wrapper {
    @apply px-2;
  }
  
  .game-canvas-container {
    @apply p-2;
  }
  
  .game-canvas {
    /* On mobile, optimize for portrait orientation */
    width: 100%;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 300px); /* Leave room for UI elements */
    aspect-ratio: 3/4; /* Maintain portrait ratio */
  }
  
  .stat-card {
    @apply min-w-[90px] p-2;
  }
  
  .stat-value {
    @apply text-lg;
  }
  
  .stat-label {
    @apply text-xs;
  }
}

@media (max-width: 480px) {
  .game-canvas {
    max-width: calc(100vw - 16px);
    max-height: calc(100vh - 250px); /* Adjusted for smaller screens */
  }
  
  .game-stats-container {
    @apply mb-4;
  }
  
  .stat-card {
    @apply min-w-[80px] p-2;
  }
  
  .stat-value {
    @apply text-base;
  }
  
  .instructions-container {
    @apply p-4;
  }
  
  .score-guide {
    @apply gap-2 flex-wrap;
  }
  
  .score-guide.special-items {
    @apply grid grid-cols-2 gap-2;
  }
  
  .score-item {
    @apply flex-col text-center;
  }
  
  .score-item .icon {
    @apply text-lg;
  }
  
  .score-item .points {
    @apply text-sm;
  }
  
  .score-item .description {
    @apply text-xs leading-tight;
  }
}

/* Focus improvements for accessibility */
.input-field:focus {
  @apply ring-2 ring-flower-pink ring-offset-2 ring-offset-transparent;
}

/* Button hover effects */
.btn-primary:hover,
.btn-secondary:hover,
.btn-accent:hover {
  transform: translateY(-2px) scale(1.02);
}

.btn-primary:active,
.btn-secondary:active,
.btn-accent:active {
  transform: translateY(0) scale(0.98);
}

/* Score message styling */
.score-message {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Difficulty selection styling */
.difficulty-option {
  @apply bg-white/10 border border-white/20 rounded-lg p-3 cursor-pointer transition-all duration-200 text-white;
}

.difficulty-option:hover {
  @apply bg-white/20 border-white/30 transform scale-105;
}

.difficulty-option.selected {
  @apply bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400/50 ring-2 ring-purple-400/50;
}
</style> 