<template>
  <div class="leaderboard-container max-w-2xl mx-auto p-6">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-flower-yellow mb-2">🏆 Leaderboard</h1>
      <p class="text-white text-lg">Top Flower Farm Frenzy Champions!</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-flower-yellow"></div>
      <p class="text-white mt-4">Loading leaderboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
      <button @click="loadLeaderboard" class="game-button">
        Try Again
      </button>
    </div>

    <!-- Leaderboard List -->
    <div v-else-if="scores.length > 0" class="space-y-3">
      <div
        v-for="(score, index) in scores"
        :key="index"
        class="leaderboard-item"
        :class="{
          'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black': index === 0,
          'bg-gradient-to-r from-gray-300 to-gray-400 text-black': index === 1,
          'bg-gradient-to-r from-yellow-600 to-yellow-800 text-white': index === 2,
          'bg-white bg-opacity-90 text-gray-800': index > 2
        }"
      >
        <div class="flex items-center">
          <!-- Rank -->
          <div class="text-2xl font-bold mr-4 w-8">
            <span v-if="index === 0">🥇</span>
            <span v-else-if="index === 1">🥈</span>
            <span v-else-if="index === 2">🥉</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          
          <!-- Initials -->
          <div class="font-bold text-xl mr-4">
            {{ score.initials }}
          </div>
        </div>

        <!-- Score and Date -->
        <div class="text-right">
          <div class="font-bold text-xl">
            {{ score.score.toLocaleString() }} pts
          </div>
          <div class="text-sm opacity-75">
            {{ formatDate(score.timestamp) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <div class="text-6xl mb-4">🌸</div>
      <h3 class="text-xl font-bold text-white mb-2">No scores yet!</h3>
      <p class="text-white opacity-75 mb-4">Be the first to set a high score!</p>
      <button @click="$emit('playGame')" class="game-button">
        Play Game
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 mt-8 justify-center">
      <button @click="loadLeaderboard" class="game-button bg-leaf-green hover:bg-green-600">
        🔄 Refresh
      </button>
      <button @click="$emit('playGame')" class="game-button">
        🎮 Play Game
      </button>
    </div>

    <!-- Last Updated -->
    <div v-if="lastUpdated" class="text-center mt-4 text-white opacity-50 text-sm">
      Last updated: {{ formatDate(lastUpdated) }}
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
}

.leaderboard-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.leaderboard-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animate list items */
.leaderboard-item {
  animation: slideInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.leaderboard-item:nth-child(1) { animation-delay: 0.1s; }
.leaderboard-item:nth-child(2) { animation-delay: 0.2s; }
.leaderboard-item:nth-child(3) { animation-delay: 0.3s; }
.leaderboard-item:nth-child(4) { animation-delay: 0.4s; }
.leaderboard-item:nth-child(5) { animation-delay: 0.5s; }
.leaderboard-item:nth-child(6) { animation-delay: 0.6s; }
.leaderboard-item:nth-child(7) { animation-delay: 0.7s; }
.leaderboard-item:nth-child(8) { animation-delay: 0.8s; }
.leaderboard-item:nth-child(9) { animation-delay: 0.9s; }
.leaderboard-item:nth-child(10) { animation-delay: 1.0s; }

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

/* Responsive adjustments */
@media (max-width: 768px) {
  .leaderboard-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .leaderboard-item > div {
    justify-content: center;
  }
}
</style> 