<template>
  <div class="game-wrapper">
    <!-- Game Stats -->
    <div class="game-stats flex justify-between items-center mb-4 p-4 bg-black bg-opacity-50 rounded-lg">
      <div class="score-display">
        Score: {{ currentScore }}
      </div>
      <div class="time-display text-flower-yellow font-bold text-xl">
        Time: {{ timeLeft }}s
      </div>
    </div>
    
    <!-- Game Canvas Container -->
    <div 
      ref="gameContainer" 
      class="game-container mx-auto"
      :class="{ 'opacity-50': gameEnded }"
    ></div>
    
    <!-- Game Over Overlay -->
    <div 
      v-if="gameEnded" 
      class="game-over-overlay fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
        <div class="score-display text-2xl mb-6">
          Final Score: {{ finalScore }}
        </div>
        
        <!-- Score Submission Form -->
        <form @submit.prevent="submitScore" class="mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Enter your initials (3 letters):
            </label>
            <input
              v-model="playerInitials"
              type="text"
              maxlength="3"
              pattern="[A-Za-z]{3}"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-flower-pink uppercase text-center text-xl font-bold"
              placeholder="ABC"
              required
            />
          </div>
          <button
            type="submit"
            :disabled="submitting || playerInitials.length !== 3"
            class="game-button w-full mb-2"
          >
            {{ submitting ? 'Submitting...' : 'Submit Score' }}
          </button>
        </form>
        
        <div class="flex gap-2">
          <button @click="playAgain" class="game-button flex-1">
            Play Again
          </button>
          <button @click="viewLeaderboard" class="game-button flex-1 bg-leaf-green hover:bg-green-600">
            Leaderboard
          </button>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 text-red-600 text-sm">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Phaser from 'phaser'
import { PreloadScene } from '../phaser/PreloadScene'
import { MainScene } from '../phaser/MainScene'
import { gameApi } from '../api'

// Emits
const emit = defineEmits<{
  gameEnd: [score: number]
  showLeaderboard: []
}>()

// Reactive data
const gameContainer = ref<HTMLDivElement>()
const currentScore = ref(0)
const timeLeft = ref(60)
const gameEnded = ref(false)
const finalScore = ref(0)
const playerInitials = ref('')
const submitting = ref(false)
const errorMessage = ref('')

// Phaser game instance
let game: Phaser.Game | null = null
let mainScene: MainScene | null = null

// Game configuration
const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#228B22',
  scene: [PreloadScene, MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container'
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}

onMounted(async () => {
  await nextTick()
  initializeGame()
})

onBeforeUnmount(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})

const initializeGame = () => {
  if (!gameContainer.value) return

  // Create the game
  game = new Phaser.Game({
    ...gameConfig,
    parent: gameContainer.value
  })

  // Set up scene callbacks
  game.scene.start('PreloadScene')
  
  // Get reference to main scene when it starts
  game.events.on('ready', () => {
    const scenes = game?.scene.getScenes()
    mainScene = scenes?.find(scene => scene.scene.key === 'MainScene') as MainScene
    
    if (mainScene) {
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
    }
  })
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
    errorMessage.value = 'Failed to submit score. Please try again.'
  } finally {
    submitting.value = false
  }
}

const playAgain = () => {
  // Reset game state
  gameEnded.value = false
  currentScore.value = 0
  timeLeft.value = 60
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
</script>

<style scoped>
.game-wrapper {
  max-width: 100%;
  margin: 0 auto;
}

.game-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.game-over-overlay {
  backdrop-filter: blur(5px);
}

.time-display {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .game-container {
    max-width: 100%;
    padding: 0 10px;
  }
  
  .game-stats {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style> 