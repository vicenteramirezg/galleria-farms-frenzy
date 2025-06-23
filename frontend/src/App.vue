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
const isLoaded = ref(false)
const isInitialLoading = ref(true)

onMounted(() => {
  // Show loading screen for at least 2 seconds
  setTimeout(() => {
    isInitialLoading.value = false
    // Add a small delay for smooth entrance animation after loading
    setTimeout(() => {
      isLoaded.value = true
    }, 100)
  }, 2000)
  
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
  <!-- Loading Screen -->
  <div 
    v-if="isInitialLoading" 
    class="fixed inset-0 bg-white flex items-center justify-center z-50"
  >
    <div class="text-center animate-pulse">
      <img 
        src="/25th-logo_Black.png" 
        alt="Galleria Farms 25th Anniversary" 
        class="h-32 md:h-48 mx-auto animate-bounce-subtle"
      >
      <div class="mt-8">
        <div class="w-12 h-12 border-4 border-gray-300 border-t-4 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-600 mt-4 text-lg font-medium">Loading...</p>
      </div>
    </div>
  </div>

  <div v-else id="app" class="min-h-screen w-full" style="background: #211f20;">
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 text-4xl animate-float opacity-20">🌸</div>
      <div class="absolute top-32 right-20 text-3xl animate-bounce-subtle opacity-20" style="animation-delay: 0.5s">🌻</div>
      <div class="absolute bottom-20 left-32 text-3xl animate-float opacity-20" style="animation-delay: 1s">🌺</div>
      <div class="absolute bottom-32 right-10 text-4xl animate-bounce-subtle opacity-20" style="animation-delay: 1.5s">🌷</div>
      <div class="absolute top-1/2 left-1/4 text-2xl animate-wiggle opacity-10" style="animation-delay: 2s">🍀</div>
      <div class="absolute top-1/3 right-1/3 text-2xl animate-float opacity-10" style="animation-delay: 2.5s">🌱</div>
    </div>

    <!-- Main Container -->
    <div class="relative z-10 min-h-screen" :class="{ 'animate-fade-in-up': isLoaded }">
      
      <!-- Game View -->
      <div v-if="currentView === 'game'" class="min-h-screen flex flex-col">
        <!-- Header with Title -->
        <header class="text-center py-4 md:py-8">
          <div class="animate-fade-in-down">
            <div class="flex flex-col items-center space-y-4 mb-2 md:mb-4">
              <!-- 25th Anniversary Logo above title -->
              <img src="/25th-logo_White.png" alt="25th Anniversary Logo" class="h-32 md:h-48 lg:h-64 animate-bounce-subtle">
              
              <!-- Title and celebration banner -->
              <div>
                <h1 class="text-3xl md:text-5xl lg:text-7xl font-game text-white font-bold">
                  Flower Farm Frenzy
                </h1>
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 md:px-4 md:py-2 rounded-xl font-bold text-sm md:text-lg lg:text-xl mb-4 inline-block mt-2">
                  🎉 Celebrating 25 Years! 🎉
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Game Section - Centered -->
        <main class="flex-1 flex items-center justify-center px-2 md:px-4 py-4 md:py-8">
          <div class="w-full max-w-4xl mx-auto">
            <div class="animate-scale-in">
              <GameCanvas 
                @game-end="handleGameEnd"
                @show-leaderboard="showLeaderboard"
              />
            </div>
          </div>
        </main>

        <!-- Bottom Navigation -->
        <div class="text-center py-4 md:py-8">
          <div class="animate-fade-in-up">
            <button 
              @click="showLeaderboard"
              class="btn-secondary text-lg md:text-xl px-6 py-3 md:px-8 md:py-4"
            >
              <span class="mr-2 md:mr-3">🏆</span>
              View Leaderboard
            </button>
          </div>
        </div>
      </div>

      <!-- Leaderboard View -->
      <div v-else-if="currentView === 'leaderboard'" class="min-h-screen flex flex-col animate-fade-in">
        <!-- Leaderboard Header -->
        <header class="text-center py-4 md:py-8">
          <div class="animate-fade-in-down">
            <div class="flex flex-col items-center space-y-4 mb-2 md:mb-4">
              <!-- 25th Anniversary Logo above title -->
              <img src="/25th-logo_White.png" alt="25th Anniversary Logo" class="h-16 md:h-24 animate-bounce-subtle">
              
              <!-- Title and subtitle -->
              <div>
                <h1 class="text-3xl md:text-5xl lg:text-7xl font-game text-white font-bold">
                  Leaderboard
                </h1>
                <p class="text-white/80 text-lg md:text-xl lg:text-2xl font-display mt-2">
                  Top Flower Farm Champions
                </p>
              </div>
            </div>
          </div>
        </header>

        <!-- Leaderboard Content -->
        <main class="flex-1 px-2 md:px-4">
          <Leaderboard 
            ref="leaderboardRef"
            @play-game="showGame"
          />
        </main>

        <!-- Back to Game Button -->
        <div class="text-center py-4 md:py-8">
          <div class="animate-fade-in-up">
            <button 
              @click="showGame"
              class="btn-primary text-lg md:text-xl px-6 py-3 md:px-8 md:py-4"
            >
              <span class="mr-2 md:mr-3">🎮</span>
              Back to Game
            </button>
          </div>
        </div>
      </div>

      <!-- Footer with Logo -->
      <footer class="mt-8 py-6 md:py-8 text-center border-t border-white/10">
        <div class="flex flex-col items-center space-y-4 animate-fade-in-up">
          <img 
            src="/logo_white.png" 
            alt="Galleria Farms Logo" 
            class="h-12 md:h-16 opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
          <div class="text-white/60 text-sm">
            <p>© 2025 Galleria Farms. All rights reserved.</p>
            <p class="text-xs mt-1">Celebrating 25 Years of Excellence</p>
          </div>
        </div>
      </footer>
    </div>

    <!-- Enhanced Connection Status -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div 
        v-if="showConnectionStatus" 
        :class="[
          'fixed bottom-4 right-4 md:bottom-6 md:right-6 px-3 py-2 md:px-4 md:py-3 rounded-xl text-white text-xs md:text-sm font-medium shadow-large backdrop-blur-sm border border-white/20 z-50',
          connectionStatus === 'online' ? 'status-online' : 'status-offline'
        ]"
      >
        <div class="flex items-center space-x-2">
          <div :class="[
            'w-2 h-2 rounded-full',
            connectionStatus === 'online' ? 'bg-green-300 animate-pulse' : 'bg-red-300'
          ]"></div>
          <span>{{ connectionStatus === 'online' ? 'Connected' : 'Offline' }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Component-specific styles */
#app {
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Enhanced animations */
.animate-fade-in-left {
  animation: fadeInLeft 0.8s ease-out;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Smooth page transitions */
.game-view, .leaderboard-view {
  animation: pageSlideIn 0.5s ease-out;
}

@keyframes pageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading state improvements */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Enhanced responsive design */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem !important;
  }
  
  .text-6xl {
    font-size: 2rem !important;
  }
  
  /* Reduce padding for mobile */
  .py-8 {
    @apply py-4;
  }
  
  .px-4 {
    @apply px-2;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.75rem !important;
  }
  
  .text-6xl {
    font-size: 1.75rem !important;
  }
  
  .btn-primary,
  .btn-secondary {
    @apply text-base px-4 py-2;
  }
  
  /* Make celebration banner smaller on mobile */
  .bg-gradient-to-r {
    @apply text-xs px-2 py-1;
  }
}

/* Touch-friendly improvements */
@media (pointer: coarse) {
  .btn-primary,
  .btn-secondary {
    @apply min-h-[48px]; /* Ensure minimum touch target size */
  }
}

/* Loading screen animations */
.animate-bounce-subtle {
  animation: bounceSubtle 2s ease-in-out infinite;
}

@keyframes bounceSubtle {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>

