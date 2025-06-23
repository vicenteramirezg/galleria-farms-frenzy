# 🌸 Flower Farm Frenzy - Frontend

A modern, responsive Vue 3 frontend for the Flower Farm Frenzy game, celebrating **Galleria Farms' 25th Anniversary**. Built with cutting-edge web technologies and featuring a beautiful glassmorphism design system.

## 🏗️ Architecture Overview

### Tech Stack
- **Vue 3.5** with Composition API and `<script setup>` syntax
- **TypeScript** for type safety and better developer experience
- **Vite 6.2** for lightning-fast development and optimized builds
- **Phaser.js 3.90** for game engine and sprite management
- **Tailwind CSS 3.4** with custom design system and animations
- **Axios 1.10** for API communication with interceptors

### Project Structure
```
src/
├── api/                 # API integration layer
│   └── index.ts        # Axios configuration and game API
├── assets/             # Static assets
│   ├── base.css        # Base styles and CSS reset
│   ├── main.css        # Global styles and utilities
│   └── logo.svg        # SVG logo asset
├── components/         # Vue components
│   ├── GameCanvas.vue  # Main game component (800+ lines)
│   ├── Leaderboard.vue # Leaderboard with podium display
│   └── icons/          # Icon components
├── phaser/             # Phaser.js game engine
│   ├── MainScene.ts    # Core game logic and mechanics
│   └── PreloadScene.ts # Asset loading and sprite generation
├── router/             # Vue Router configuration
│   └── index.ts        # Route definitions
├── views/              # Page components
│   ├── HomeView.vue    # Home page
│   └── AboutView.vue   # About page
├── App.vue             # Root component
├── main.ts             # Application entry point
└── style.css           # Global styles and design system
```

## 🎨 Design System

### Glassmorphism UI
The frontend features a modern glassmorphism design with:
- **Backdrop blur effects** for depth and modern aesthetics
- **Semi-transparent containers** with subtle borders
- **Smooth animations** and micro-interactions
- **Gradient backgrounds** with animated mesh patterns

### Color Palette
```css
/* Primary Colors */
--flower-pink: #FF69B4      /* Primary brand color */
--flower-yellow: #FFD700    /* Accent color */
--leaf-green: #228B22       /* Secondary color */

/* Extended Palette */
--flower-rose: #FF1493      /* Darker pink variant */
--flower-orange: #FFA500    /* Warm accent */
--leaf-emerald: #50C878     /* Bright green */
--sky-blue: #87CEEB         /* Cool accent */
```

### Typography System
- **Game Headings**: Fredoka One (playful, bold)
- **Body Text**: Poppins (clean, modern)
- **Display Text**: Poppins (friendly, readable)

### Animation Library
Custom animations built with Tailwind CSS:
- `fade-in`, `fade-in-up`, `fade-in-down` - Entrance animations
- `scale-in` - Scale-based entrance
- `bounce-subtle` - Gentle bounce effect
- `float`, `wiggle` - Background element animations
- `pulse-soft` - Subtle pulsing effect

## 🎮 Game Architecture

### Phaser.js Integration
The game uses a clean separation between Vue.js UI and Phaser.js game logic:

#### PreloadScene.ts
- **Emoji-based sprites**: Creates sprites from emoji characters
- **Dynamic asset generation**: Programmatically creates game assets
- **Loading screen**: Beautiful loading animation with progress bar

#### MainScene.ts
- **Responsive grid system**: Adapts to different screen sizes
- **Difficulty system**: Easy, Normal, Hard modes with different spawn rates
- **Game mechanics**: Flower spawning, scoring, timer management
- **Mobile optimization**: Touch-friendly controls and sizing

### Component Architecture

#### GameCanvas.vue (Main Game Component)
**Features:**
- Phaser.js game integration with Vue lifecycle
- Difficulty selection overlay
- Game statistics display (score, timer)
- Game over modal with score submission
- Responsive design for all screen sizes

**Key Methods:**
```typescript
// Game lifecycle management
setupGame() // Initialize Phaser game
startGame() // Begin gameplay
endGame() // Handle game completion

// API integration
submitScore() // Submit score to backend
handleGameEnd() // Process game completion
```

#### Leaderboard.vue
**Features:**
- Podium display for top 3 players
- Statistics summary (player count, high score, average)
- Staggered entrance animations
- Error handling with retry functionality
- Responsive design with mobile optimization

**Data Management:**
```typescript
// Reactive state
const scores = ref<Score[]>([])
const loading = ref(false)
const error = ref('')

// API integration
const loadLeaderboard = async () => {
  // Fetch and display leaderboard data
}
```

## 🔧 Development Setup

### Prerequisites
- **Node.js 18+** (recommended: Node.js 20+)
- **npm 9+** or **yarn 1.22+**

### Installation
```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Available Scripts
```powershell
# Development
npm run dev          # Start dev server with hot reload
npm run type-check   # Run TypeScript type checking

# Building
npm run build        # Build for production
npm run build-only   # Build without type checking
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint and fix code with ESLint
npm run format       # Format code with Prettier
```

## 📱 Responsive Design

### Breakpoint Strategy
```css
/* Mobile First Approach */
/* Default: Mobile (< 640px) */
.mobile-styles { }

/* Tablet: sm (640px+) */
@media (min-width: 640px) { }

/* Desktop: md (768px+) */
@media (min-width: 768px) { }

/* Large Desktop: lg (1024px+) */
@media (min-width: 1024px) { }
```

### Mobile Optimizations
- **Touch-friendly buttons**: Minimum 44px tap targets
- **Readable text sizes**: Minimum 16px for body text
- **Optimized game canvas**: Responsive sizing with mobile-specific grid
- **Simplified navigation**: Streamlined mobile interface

## 🔌 API Integration

### Axios Configuration
```typescript
// API instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request/Response interceptors for logging and error handling
```

### API Methods
```typescript
// Game API interface
export const gameApi = {
  submitScore(scoreData: { initials: string; score: number }): Promise<Score>
  getLeaderboard(): Promise<Score[]>
  healthCheck(): Promise<boolean>
}
```

### Error Handling
- **Network errors**: Graceful degradation with retry options
- **Validation errors**: User-friendly error messages
- **Timeout handling**: 10-second timeout with proper feedback

## 🎯 Performance Optimization

### Build Optimizations
- **Vite optimization**: Tree shaking and code splitting
- **Tailwind purging**: Unused CSS automatically removed
- **Asset optimization**: Images and fonts optimized
- **Lazy loading**: Components loaded on demand

### Runtime Performance
- **Vue 3 reactivity**: Efficient reactive system
- **Phaser.js optimization**: Proper sprite management and cleanup
- **Animation performance**: CSS transforms for smooth animations
- **Memory management**: Proper cleanup of game objects

## 🧪 Code Quality

### TypeScript Integration
- **Strict mode enabled**: Maximum type safety
- **Component props typing**: Proper prop validation
- **API response typing**: Type-safe API interactions
- **Event handling**: Typed event handlers

### ESLint Configuration
```typescript
// Key rules enabled:
- Vue 3 best practices
- TypeScript strict rules
- Accessibility guidelines
- Code formatting with Prettier
```

### Development Tools
- **Vue DevTools**: Browser extension for debugging
- **Vite DevTools**: Development server insights
- **TypeScript Language Server**: IDE integration

## 🔍 Testing Strategy

### Current Testing Setup
- **ESLint**: Code quality and consistency
- **TypeScript**: Compile-time error checking
- **Manual testing**: Comprehensive game testing

### Recommended Testing Additions
```powershell
# Unit tests (to be added)
npm install --save-dev @vue/test-utils vitest jsdom

# E2E tests (future enhancement)
npm install --save-dev cypress playwright
```

## 🚀 Deployment

### Build Process
```powershell
# Production build
npm run build

# Output directory: dist/
# Files are optimized and ready for deployment
```

### Environment Configuration
```env
# .env file
VITE_API_URL=https://your-api-domain.com/api

# Development
# VITE_API_URL=http://localhost:8000/api
```

### Deployment Targets
- **Static hosting**: Vercel, Netlify, GitHub Pages
- **CDN deployment**: CloudFront, CloudFlare
- **Railway**: Integrated with backend deployment

## 🔧 Customization

### Adding New Components
```vue
<script setup lang="ts">
// Use Composition API with TypeScript
import { ref, computed, onMounted } from 'vue'

// Define props and emits
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  update: [value: number]
}>()
</script>

<template>
  <!-- Use Tailwind classes for styling -->
  <div class="glass-container p-6 rounded-2xl">
    <h2 class="text-2xl font-game text-white">{{ title }}</h2>
    <!-- Component content -->
  </div>
</template>
```

### Extending the Design System
```css
/* Add to tailwind.config.js */
theme: {
  extend: {
    colors: {
      'custom-color': '#YOUR_COLOR'
    },
    animation: {
      'custom-animation': 'customKeyframe 1s ease-in-out'
    }
  }
}
```

## 🐛 Common Issues & Solutions

### Game Not Loading
```typescript
// Check Phaser initialization
console.log('Phaser version:', Phaser.VERSION)

// Verify game container
const gameContainer = document.getElementById('game-container')
if (!gameContainer) {
  console.error('Game container not found')
}
```

### API Connection Issues
```typescript
// Check network connectivity
const healthCheck = await gameApi.healthCheck()
console.log('API Health:', healthCheck)

// Verify CORS configuration
// Ensure backend allows frontend origin
```

### Performance Issues
```typescript
// Monitor component renders
import { onUpdated } from 'vue'

onUpdated(() => {
  console.log('Component updated')
})

// Check for memory leaks in Phaser
// Ensure proper cleanup in game scenes
```

## 🎉 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Follow coding standards**: ESLint + Prettier
4. **Test thoroughly**: Manual testing required
5. **Submit pull request**: Include screenshots for UI changes

### Code Style Guidelines
- **Vue 3 Composition API**: Use `<script setup>` syntax
- **TypeScript**: Strict typing required
- **Tailwind CSS**: Utility-first styling
- **Component naming**: PascalCase for components
- **File naming**: kebab-case for files

## 📚 Resources

### Documentation
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Phaser.js Documentation](https://phaser.io/phaser3)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### Tools & Extensions
- **VS Code Extensions**:
  - Volar (Vue Language Features)
  - TypeScript Vue Plugin
  - Tailwind CSS IntelliSense
  - ESLint + Prettier

---

**Built with modern web technologies and love for Galleria Farms!** 🌸

*For questions or contributions, please refer to the main project README.*
