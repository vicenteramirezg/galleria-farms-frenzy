<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameCanvas from './components/GameCanvas.vue'
import Leaderboard from './components/Leaderboard.vue'
import { gameApi } from './api'

// Reactive data
const currentView = ref<'game' | 'leaderboard'>('game')
const connectionStatus = ref<'online' | 'offline'>('offline')
const showConnectionStatus = ref(false)
const leaderboardRef = ref<InstanceType<typeof Leaderboard>>()

onMounted(() => {
  checkConnection()
  // Check connection every 30 seconds
  setInterval(checkConnection, 30000)
})

const checkConnection = async () => {
  try {
    const isOnline = await gameApi.healthCheck()
    connectionStatus.value = isOnline ? 'online' : 'offline'
    
    // Show connection status for 3 seconds when it changes
    showConnectionStatus.value = true
    setTimeout(() => {
      showConnectionStatus.value = false
    }, 3000)
  } catch (error) {
    connectionStatus.value = 'offline'
    showConnectionStatus.value = true
    setTimeout(() => {
      showConnectionStatus.value = false
    }, 3000)
  }
}

const handleGameEnd = (score: number) => {
  console.log('Game ended with score:', score)
  // The GameCanvas component will handle the score submission
}

const showLeaderboard = () => {
  currentView.value = 'leaderboard'
  // Refresh leaderboard when showing it
  if (leaderboardRef.value) {
    leaderboardRef.value.refresh()
  }
}

const showGame = () => {
  currentView.value = 'game'
}
</script>

<template>
  <div id="app" class="min-h-screen bg-gradient-to-b from-leaf-green to-green-800">
    <!-- Header -->
    <header class="bg-black bg-opacity-30 text-white py-4 px-6">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <span class="text-3xl">🌸</span>
          <h1 class="text-2xl font-bold">Flower Farm Frenzy</h1>
        </div>
        
        <nav class="space-x-4">
          <button 
            @click="currentView = 'game'"
            :class="['px-4 py-2 rounded-lg transition-colors', 
                     currentView === 'game' ? 'bg-flower-pink text-white' : 'bg-white bg-opacity-20 hover:bg-opacity-30']"
          >
            🎮 Play
          </button>
          <button 
            @click="currentView = 'leaderboard'"
            :class="['px-4 py-2 rounded-lg transition-colors',
                     currentView === 'leaderboard' ? 'bg-flower-pink text-white' : 'bg-white bg-opacity-20 hover:bg-opacity-30']"
          >
            🏆 Leaderboard
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Game View -->
      <div v-if="currentView === 'game'" class="game-view">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">Ready to Farm?</h2>
          <p class="text-white opacity-80 text-lg">
            Click the flowers to score points, but watch out for weeds! You have 60 seconds!
          </p>
        </div>
        
        <GameCanvas 
          @game-end="handleGameEnd"
          @show-leaderboard="showLeaderboard"
        />
      </div>

      <!-- Leaderboard View -->
      <div v-else-if="currentView === 'leaderboard'" class="leaderboard-view">
        <Leaderboard 
          ref="leaderboardRef"
          @play-game="showGame"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-black bg-opacity-30 text-white py-6 px-6 mt-12">
      <div class="max-w-6xl mx-auto text-center">
        <p class="text-lg mb-2">🌻 Flower Farm Frenzy 🌻</p>
        <p class="text-sm opacity-70">
          Click flowers, avoid weeds, beat the clock! Made with Vue 3 + Phaser.js
        </p>
        <div class="mt-4 space-x-4">
          <span class="text-xs opacity-50">Backend: Django + PostgreSQL</span>
          <span class="text-xs opacity-50">Frontend: Vue 3 + TypeScript + Tailwind</span>
        </div>
      </div>
    </footer>

    <!-- Connection Status -->
    <div 
      v-if="showConnectionStatus" 
      :class="[
        'fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white text-sm',
        connectionStatus === 'online' ? 'bg-green-600' : 'bg-red-600'
      ]"
    >
      {{ connectionStatus === 'online' ? '🟢 Connected' : '🔴 Offline' }}
    </div>
  </div>
</template>

<style>
/* Global styles that complement Tailwind */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(34, 139, 34, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 105, 180, 0.7);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 105, 180, 1);
}

/* Smooth transitions */
* {
  transition: color 0.2s ease, background-color 0.2s ease;
}

/* Focus styles for accessibility */
button:focus,
input:focus {
  outline: 2px solid #FF69B4;
  outline-offset: 2px;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
