<template>
  <div class="leaderboard-container">
    <!-- Enhanced Header -->
    <div class="text-center mb-6 md:mb-8 animate-fade-in-down">
      <div class="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-large p-4 md:p-6 max-w-lg mx-auto">
        <div class="flex justify-center items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
          <span class="text-3xl md:text-5xl animate-bounce-subtle">🏆</span>
          <div>
            <h1 class="text-2xl md:text-4xl lg:text-5xl font-game text-white">Leaderboard</h1>
            <p class="text-white/70 text-sm md:text-lg font-display">Top Flower Farm Champions!</p>
          </div>
          <span class="text-3xl md:text-5xl animate-bounce-subtle" style="animation-delay: 0.5s">🏆</span>
        </div>
        
        <!-- Stats Summary -->
        <div class="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/20">
          <div class="text-center">
            <div class="text-lg md:text-2xl font-bold text-gradient">{{ scores.length }}</div>
            <div class="text-xs text-white/60">Players</div>
          </div>
          <div class="text-center">
            <div class="text-lg md:text-2xl font-bold text-white">{{ getHighestScore() }}</div>
            <div class="text-xs text-white/60">High Score</div>
          </div>
          <div class="text-center">
            <div class="text-lg md:text-2xl font-bold text-gradient-green">{{ getAverageScore() }}</div>
            <div class="text-xs text-white/60">Average</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 md:py-12 animate-fade-in">
      <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-large p-4 md:p-6 max-w-sm mx-auto">
        <div class="loading-spinner w-8 md:w-12 h-8 md:h-12 mx-auto mb-4"></div>
        <p class="text-white font-medium text-sm md:text-base">Loading champions...</p>
        <div class="flex justify-center space-x-2 mt-4">
          <span class="animate-bounce">🌸</span>
          <span class="animate-bounce" style="animation-delay: 0.1s">🌻</span>
          <span class="animate-bounce" style="animation-delay: 0.2s">🌺</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 md:py-12 animate-fade-in">
      <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-large p-4 md:p-6 max-w-md mx-auto">
        <div class="text-4xl md:text-6xl mb-4">😞</div>
        <h3 class="text-lg md:text-xl font-semibold text-white mb-3">Oops! Something went wrong</h3>
        <div class="bg-red-500/20 border border-red-500/30 rounded-xl p-3 md:p-4 mb-4 md:mb-6 backdrop-blur-sm">
          <div class="flex items-center justify-center text-red-300 text-sm md:text-base">
            <span class="mr-2">⚠️</span>
            {{ error }}
          </div>
        </div>
        <button @click="loadLeaderboard" class="btn-primary text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
          <span class="mr-2">🔄</span>
          Try Again
        </button>
      </div>
    </div>

    <!-- Leaderboard List -->
    <div v-else-if="scores.length > 0" class="space-y-3 md:space-y-4 animate-fade-in">
      <!-- Podium (Top 3) -->
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 mb-6 md:mb-8">
        <!-- Second Place -->
        <div v-if="scores.length > 1" class="order-2 md:order-1">
          <div class="leaderboard-podium second-place">
            <div class="podium-rank">🥈</div>
            <div class="podium-content">
              <div class="podium-initials">{{ scores[1].initials }}</div>
              <div class="podium-score">{{ scores[1].score.toLocaleString() }}</div>
              <div class="podium-date">{{ formatDate(scores[1].timestamp) }}</div>
            </div>
          </div>
        </div>
        
        <!-- First Place -->
        <div v-if="scores.length > 0" class="order-1 md:order-2">
          <div class="leaderboard-podium first-place">
            <div class="podium-crown">👑</div>
            <div class="podium-rank">🥇</div>
            <div class="podium-content">
              <div class="podium-initials">{{ scores[0].initials }}</div>
              <div class="podium-score">{{ scores[0].score.toLocaleString() }}</div>
              <div class="podium-date">{{ formatDate(scores[0].timestamp) }}</div>
            </div>
          </div>
        </div>
        
        <!-- Third Place -->
        <div v-if="scores.length > 2" class="order-3">
          <div class="leaderboard-podium third-place">
            <div class="podium-rank">🥉</div>
            <div class="podium-content">
              <div class="podium-initials">{{ scores[2].initials }}</div>
              <div class="podium-score">{{ scores[2].score.toLocaleString() }}</div>
              <div class="podium-date">{{ formatDate(scores[2].timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Rest of the leaderboard -->
      <div v-if="scores.length > 3" class="space-y-2 md:space-y-3">
        <h3 class="text-lg md:text-xl font-semibold text-white text-center mb-3 md:mb-4">Other Champions</h3>
        <div
          v-for="(score, index) in scores.slice(3)"
          :key="index + 3"
          class="leaderboard-item hover-lift"
          :style="{ animationDelay: `${(index + 3) * 0.1}s` }"
        >
          <div class="flex items-center">
            <!-- Rank -->
            <div class="rank-badge">
              {{ index + 4 }}
            </div>
            
            <!-- Player Info -->
            <div class="ml-3 md:ml-4">
              <div class="font-bold text-base md:text-lg text-white">
                {{ score.initials }}
              </div>
              <div class="text-xs md:text-sm text-white/60">
                {{ formatDate(score.timestamp) }}
              </div>
            </div>
          </div>

          <!-- Score -->
          <div class="text-right">
            <div class="font-bold text-lg md:text-xl text-white">
              {{ score.score.toLocaleString() }}
            </div>
            <div class="text-xs md:text-sm text-white/60">
              points
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 md:py-12 animate-fade-in">
      <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-large p-4 md:p-6 max-w-md mx-auto">
        <div class="text-6xl md:text-8xl mb-4 md:mb-6 animate-bounce-subtle">🌸</div>
        <h3 class="text-xl md:text-2xl font-game text-gradient mb-3 md:mb-4">No Champions Yet!</h3>
        <p class="text-white/70 text-base md:text-lg mb-4 md:mb-6 font-display">
          Be the first to bloom on the leaderboard! 
          <br>
          Start farming and claim your spot among the flower legends!
        </p>
        <button @click="$emit('playGame')" class="btn-primary text-base md:text-lg px-4 py-2 md:px-6 md:py-3">
          <span class="mr-2">🎮</span>
          Start Your Journey
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-12 justify-center animate-fade-in-up">
      <button @click="loadLeaderboard" class="btn-secondary text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
        <span class="mr-2">🔄</span>
        Refresh Leaderboard
      </button>
      <button @click="$emit('playGame')" class="btn-primary text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
        <span class="mr-2">🎮</span>
        Play Game
      </button>
    </div>

    <!-- Last Updated -->
    <div v-if="lastUpdated" class="text-center mt-6 md:mt-8 text-white/40 text-xs md:text-sm animate-fade-in">
      <div class="flex items-center justify-center space-x-2">
        <span>📅</span>
        <span>Last updated: {{ formatDate(lastUpdated) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gameApi, type Score } from '../api'

// Emits
const emit = defineEmits<{
  playGame: []
}>()

// Reactive data
const scores = ref<Score[]>([])
const loading = ref(false)
const error = ref('')
const lastUpdated = ref<string>('')

// Computed properties
const getHighestScore = () => {
  if (scores.value.length === 0) return '0'
  return scores.value[0].score.toLocaleString()
}

const getAverageScore = () => {
  if (scores.value.length === 0) return '0'
  const average = scores.value.reduce((acc, score) => acc + score.score, 0) / scores.value.length
  return Math.round(average).toLocaleString()
}

onMounted(() => {
  loadLeaderboard()
})

const loadLeaderboard = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const leaderboardData = await gameApi.getLeaderboard()
    scores.value = leaderboardData
    lastUpdated.value = new Date().toISOString()
  } catch (err) {
    console.error('Failed to load leaderboard:', err)
    error.value = 'Failed to load leaderboard. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

// Expose method to parent component
defineExpose({
  refresh: loadLeaderboard
})
</script>

<style scoped>
.leaderboard-container {
  min-height: 70vh;
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 0.5rem;
}

/* Podium Styles */
.leaderboard-podium {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  padding: 1rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (min-width: 768px) {
  .leaderboard-podium {
    padding: 1.5rem;
  }
}

.leaderboard-podium:hover {
  transform: scale(1.05);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

.first-place {
  background: linear-gradient(to bottom right, rgba(251, 191, 36, 0.3), rgba(217, 119, 6, 0.3));
  border-color: rgba(251, 191, 36, 0.5);
}

.second-place {
  background: linear-gradient(to bottom right, rgba(209, 213, 219, 0.3), rgba(107, 114, 128, 0.3));
  border-color: rgba(156, 163, 175, 0.5);
}

.third-place {
  background: linear-gradient(to bottom right, rgba(217, 119, 6, 0.3), rgba(146, 64, 14, 0.3));
  border-color: rgba(180, 83, 9, 0.5);
}

.podium-crown {
  position: absolute;
  top: -0.25rem;
  font-size: 1.5rem;
  animation: bounce-subtle 2s infinite;
}

@media (min-width: 768px) {
  .podium-crown {
    top: -0.5rem;
    font-size: 1.875rem;
  }
}

.podium-rank {
  font-size: 1.875rem;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .podium-rank {
    font-size: 2.25rem;
    margin-bottom: 0.75rem;
  }
}

.podium-initials {
  font-size: 1.125rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.25rem;
}

@media (min-width: 768px) {
  .podium-initials {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
}

.podium-score {
  font-size: 1rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.25rem;
}

@media (min-width: 768px) {
  .podium-score {
    font-size: 1.25rem;
  }
}

.podium-date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

@media (min-width: 768px) {
  .podium-date {
    font-size: 0.875rem;
  }
}

/* Rank Badge */
.rank-badge {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to));
  --tw-gradient-from: #ec4899;
  --tw-gradient-to: #be185d;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .rank-badge {
    width: 3rem;
    height: 3rem;
    font-size: 1.125rem;
  }
}

/* Enhanced leaderboard item */
.leaderboard-item {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  animation: slideInUp 0.5s ease-out;
  animation-fill-mode: both;
}

@media (min-width: 768px) {
  .leaderboard-item {
    padding: 1rem;
  }
}

.leaderboard-item:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile-specific improvements */
@media (max-width: 768px) {
  .leaderboard-container {
    padding: 0 0.75rem;
  }
  
  .first-place {
    transform: none;
    margin-bottom: 0;
  }
  
  /* Improve touch targets */
  .leaderboard-item {
    min-height: 60px;
    touch-action: manipulation;
  }
  
  .btn-primary,
  .btn-secondary {
    min-height: 44px; /* iOS recommended minimum touch target */
    touch-action: manipulation;
  }
}

@media (max-width: 480px) {
  .leaderboard-container {
    padding: 0 0.5rem;
  }
  
  .leaderboard-podium {
    min-height: 120px;
    padding: 0.75rem;
  }
  
  .leaderboard-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    padding: 1rem;
    min-height: 80px;
  }
  
  .leaderboard-item .flex {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .leaderboard-item .ml-3 {
    margin-left: 0;
  }
  
  .podium-rank {
    font-size: 2rem;
    margin-bottom: 0.25rem;
  }
  
  .podium-initials {
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }
  
  .podium-score {
    font-size: 1rem;
  }
}

/* Loading and error states */
.loading-spinner {
  border-top-color: #FF69B4;
}

/* Hover effects - only on non-touch devices */
@media (hover: hover) {
  .hover-lift:hover {
    transform: translateY(-4px) scale(1.02);
  }
}

/* Touch-friendly active states */
@media (pointer: coarse) {
  .leaderboard-item:active {
    transform: scale(0.98);
  }
  
  .btn-primary:active,
  .btn-secondary:active {
    transform: scale(0.95);
  }
}
</style> 