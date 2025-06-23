import Phaser from 'phaser'

interface GameItem {
  sprite: Phaser.GameObjects.Sprite
  type: 'flower1' | 'flower2' | 'flower3' | 'thorn' | 'butterfly' | 'weed' | 'golden' | 'bomb'
  row: number
  col: number
  points: number
  special?: boolean
  moveTimer?: Phaser.Time.TimerEvent
  bombTimer?: Phaser.Time.TimerEvent
  spreadTimer?: Phaser.Time.TimerEvent
}

// Add difficulty interface
export interface DifficultySettings {
  spawnDelayMin: number
  spawnDelayMax: number
  itemLifetimeMin: number
  itemLifetimeMax: number
  caterpillarRatio: number
  gameTime: number
  // Progressive difficulty settings
  progressiveScaling: {
    spawnRateIncrease: number // Multiplier applied every 10 seconds
    lifetimeDecrease: number  // Multiplier applied every 10 seconds
    caterpillarIncrease: number // Added to ratio every 10 seconds
  }
  // Special items settings
  specialItemChance: number // Chance for special items to spawn
}

// Define difficulty presets
export const DIFFICULTY_PRESETS: Record<string, DifficultySettings> = {
  easy: {
    spawnDelayMin: 1000,
    spawnDelayMax: 2000,
    itemLifetimeMin: 3000,
    itemLifetimeMax: 4500,
    caterpillarRatio: 0.25, // 25% caterpillars
    gameTime: 30,
    progressiveScaling: {
      spawnRateIncrease: 0.95, // 5% faster every 10s
      lifetimeDecrease: 0.9,   // 10% shorter every 10s
      caterpillarIncrease: 0.05 // +5% caterpillars every 10s
    },
    specialItemChance: 0.15 // 15% chance for special items
  },
  normal: {
    spawnDelayMin: 500,
    spawnDelayMax: 1000,
    itemLifetimeMin: 1500,
    itemLifetimeMax: 2500,
    caterpillarRatio: 0.35, // 35% caterpillars
    gameTime: 30,
    progressiveScaling: {
      spawnRateIncrease: 0.9,  // 10% faster every 10s
      lifetimeDecrease: 0.85,  // 15% shorter every 10s
      caterpillarIncrease: 0.08 // +8% caterpillars every 10s
    },
    specialItemChance: 0.2 // 20% chance for special items
  },
  hard: {
    spawnDelayMin: 300,
    spawnDelayMax: 700,
    itemLifetimeMin: 1000,
    itemLifetimeMax: 1800,
    caterpillarRatio: 0.45, // 45% caterpillars
    gameTime: 30,
    progressiveScaling: {
      spawnRateIncrease: 0.85, // 15% faster every 10s
      lifetimeDecrease: 0.8,   // 20% shorter every 10s
      caterpillarIncrease: 0.1  // +10% caterpillars every 10s
    },
    specialItemChance: 0.25 // 25% chance for special items
  }
}

export class MainScene extends Phaser.Scene {
  private score = 0
  private timeLeft = 30
  private gameActive = false
  private grid: (GameItem | null)[][] = []
  private gridSize = { rows: 8, cols: 8 }
  private cellSize = 80
  private spawnTimer?: Phaser.Time.TimerEvent
  private gameTimer?: Phaser.Time.TimerEvent
  private gameStarted = false

  // Difficulty settings
  private difficulty: DifficultySettings = DIFFICULTY_PRESETS.normal
  private baseDifficulty: DifficultySettings = DIFFICULTY_PRESETS.normal
  private gameStartTime = 0
  private currentDifficultyLevel = 0

  // Combo system
  private combo = 0
  private maxCombo = 0
  private comboMultiplier = 1
  private lastClickTime = 0
  private comboTimeWindow = 3000 // 3 seconds to maintain combo
  private comboTimer?: Phaser.Time.TimerEvent

  // Responsive properties
  private gameWidth = 800
  private gameHeight = 600
  private isMobile = false

  // Game callbacks to communicate with Vue
  private onScoreUpdate?: (score: number) => void
  private onTimeUpdate?: (time: number) => void
  private onGameEnd?: (finalScore: number) => void
  private onComboUpdate?: (combo: number, multiplier: number) => void

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // Get actual game dimensions
    this.gameWidth = this.cameras.main.width
    this.gameHeight = this.cameras.main.height
    this.isMobile = this.gameWidth <= 600

    // Calculate responsive grid and cell sizes
    this.calculateResponsiveDimensions()

    // Set white background
    this.cameras.main.setBackgroundColor('#FFFFFF')
    
    // Set up the game grid background
    this.createGrid()
    
    // Set up UI
    this.createUI()
    
    // Initialize empty grid
    this.initializeGrid()
    
    // Set up input
    this.input.on('pointerdown', this.handleClick, this)
    
    // Don't start the game automatically - wait for user to click start
  }

  private calculateResponsiveDimensions() {
    // Adjust grid size and cell size based on screen dimensions
    if (this.isMobile) {
      // For mobile, use a portrait-oriented grid (taller than wide) with more columns
      this.gridSize = { rows: 10, cols: 7 }
      
      // Calculate cell size to fit the screen with less padding for tighter fit
      const availableWidth = this.gameWidth * 0.95 // 95% of width (reduced padding)
      const availableHeight = this.gameHeight * 0.8 // 80% of height (more vertical space)
      
      const cellSizeByWidth = Math.floor(availableWidth / this.gridSize.cols)
      const cellSizeByHeight = Math.floor(availableHeight / this.gridSize.rows)
      
      this.cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, 60) // Max 60px on mobile (slightly smaller)
    } else {
      // Desktop dimensions - portrait orientation with more columns
      this.gridSize = { rows: 8, cols: 8 }
      this.cellSize = 80
      
      // Ensure it fits on smaller desktop screens too with less padding
      const availableWidth = this.gameWidth * 0.95 // 95% of width (reduced padding)
      const availableHeight = this.gameHeight * 0.85
      
      const cellSizeByWidth = Math.floor(availableWidth / this.gridSize.cols)
      const cellSizeByHeight = Math.floor(availableHeight / this.gridSize.rows)
      
      this.cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, 75) // Slightly smaller max size
    }

    console.log(`Responsive dimensions: ${this.gameWidth}x${this.gameHeight}, Mobile: ${this.isMobile}, Grid: ${this.gridSize.rows}x${this.gridSize.cols}, Cell: ${this.cellSize}`)
  }

  private createGrid() {
    const totalGridWidth = this.gridSize.cols * this.cellSize
    const totalGridHeight = this.gridSize.rows * this.cellSize
    const startX = (this.gameWidth - totalGridWidth) / 2
    const startY = (this.gameHeight - totalGridHeight) / 2
    
    for (let row = 0; row < this.gridSize.rows; row++) {
      for (let col = 0; col < this.gridSize.cols; col++) {
        const x = startX + col * this.cellSize
        const y = startY + row * this.cellSize
        
        const cell = this.add.sprite(x, y, 'gridCell')
        cell.setOrigin(0, 0)
        cell.setAlpha(0.5)
        
        // Scale the grid cell to match our calculated cell size
        const scaleX = this.cellSize / cell.width
        const scaleY = this.cellSize / cell.height
        cell.setScale(scaleX, scaleY)
      }
    }
  }

  private createUI() {
    // Remove in-game UI since it's handled by Vue component
    // We only keep references for the internal score/timer tracking
    // but don't display them in the game canvas
  }

  private initializeGrid() {
    this.grid = Array(this.gridSize.rows).fill(null).map(() => 
      Array(this.gridSize.cols).fill(null)
    )
  }

  private startGame() {
    console.log('MainScene.startGame() called, gameStarted:', this.gameStarted, 'gameActive:', this.gameActive)
    
    if (this.gameStarted && this.gameActive) {
      console.log('Game already started and active, returning')
      return
    }
    
    this.gameStarted = true
    this.gameActive = true
    this.score = 0
    this.timeLeft = this.difficulty.gameTime
    
    // Initialize progressive difficulty
    this.gameStartTime = this.time.now
    this.currentDifficultyLevel = 0
    this.baseDifficulty = { ...this.difficulty }
    
    // Reset combo system
    this.combo = 0
    this.maxCombo = 0
    this.comboMultiplier = 1
    this.lastClickTime = 0
    
    console.log('Starting game timers and spawning with difficulty:', this.difficulty)
    
    this.updateScore()
    this.updateTimer()
    this.updateCombo()
    
    // Spawn items based on difficulty settings
    this.scheduleNextSpawn()
    
    // Game timer (count down)
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateGameTimer,
      callbackScope: this,
      loop: true
    })
    
    // Combo timer to check for timeouts
    this.comboTimer = this.time.addEvent({
      delay: 100,
      callback: this.checkComboTimeout,
      callbackScope: this,
      loop: true
    })
    
    console.log('Game started successfully')
  }

  private scheduleNextSpawn() {
    if (!this.gameActive) return
    
    const delay = Phaser.Math.Between(this.difficulty.spawnDelayMin, this.difficulty.spawnDelayMax)
    this.spawnTimer = this.time.delayedCall(delay, () => {
      this.spawnItem()
      this.scheduleNextSpawn() // Schedule the next spawn
    })
  }

  private spawnItem() {
    if (!this.gameActive) return
    
    // Find empty cells
    const emptyCells: { row: number, col: number }[] = []
    for (let row = 0; row < this.gridSize.rows; row++) {
      for (let col = 0; col < this.gridSize.cols; col++) {
        if (!this.grid[row][col]) {
          emptyCells.push({ row, col })
        }
      }
    }
    
    if (emptyCells.length === 0) return
    
    // Pick random empty cell
    const randomCell = Phaser.Utils.Array.GetRandom(emptyCells)
    
    // Determine item type with special items
    let spriteKey: GameItem['type']
    let points: number
    let special = false
    
    // Check for special items first
    if (Math.random() < this.difficulty.specialItemChance) {
      const specialType = Math.random()
      if (specialType < 0.4) {
        spriteKey = 'butterfly' // 40% of special items
        points = 50
        special = true
      } else if (specialType < 0.7) {
        spriteKey = 'weed' // 30% of special items
        points = 25
        special = true
      } else if (specialType < 0.9) {
        spriteKey = 'bomb' // 20% of special items
        points = -10
        special = true
      } else {
        spriteKey = 'golden' // 10% of special items
        points = 100
        special = true
      }
    } else {
      // Regular items
      const isFlower = Math.random() > this.difficulty.caterpillarRatio
      
      if (isFlower) {
        const flowerType = Math.random()
        if (flowerType < 0.5) {
          spriteKey = 'flower1'
          points = 10
        } else if (flowerType < 0.8) {
          spriteKey = 'flower2'
          points = 15
        } else {
          spriteKey = 'flower3'
          points = 20
        }
      } else {
        spriteKey = 'thorn'
        points = -5
      }
    }
    
    // Calculate position
    const totalGridWidth = this.gridSize.cols * this.cellSize
    const totalGridHeight = this.gridSize.rows * this.cellSize
    const startX = (this.gameWidth - totalGridWidth) / 2
    const startY = (this.gameHeight - totalGridHeight) / 2
    const x = startX + randomCell.col * this.cellSize + this.cellSize / 2
    const y = startY + randomCell.row * this.cellSize + this.cellSize / 2
    
    // Create sprite
    const sprite = this.add.sprite(x, y, spriteKey)
    sprite.setInteractive()
    
    // Responsive scaling for different items
    let baseScale = this.isMobile ? 0.6 : 0.8
    let scale = baseScale
    
    // Adjust scale based on item type
    switch (spriteKey) {
      case 'flower2': scale = baseScale * 1.125; break
      case 'flower3': scale = baseScale * 1.25; break
      case 'thorn': scale = baseScale * 0.875; break
      case 'butterfly': scale = baseScale * 1.1; break
      case 'weed': scale = baseScale * 0.9; break
      case 'golden': scale = baseScale * 1.3; break
      case 'bomb': scale = baseScale * 1.0; break
    }
    
    sprite.setScale(scale)
    
    // Add special effects for special items
    if (special) {
      if (spriteKey === 'golden') {
        // Golden glow effect
        sprite.setTint(0xFFD700)
        this.tweens.add({
          targets: sprite,
          alpha: 0.7,
          duration: 500,
          yoyo: true,
          repeat: -1
        })
      } else if (spriteKey === 'bomb') {
        // Red warning glow
        sprite.setTint(0xFF4444)
        this.tweens.add({
          targets: sprite,
          scale: scale * 1.1,
          duration: 200,
          yoyo: true,
          repeat: -1
        })
      }
    }
    
    // Add to grid
    const gameItem: GameItem = {
      sprite,
      type: spriteKey,
      row: randomCell.row,
      col: randomCell.col,
      points,
      special
    }
    
    this.grid[randomCell.row][randomCell.col] = gameItem
    
    // Special item behaviors
    if (spriteKey === 'butterfly') {
      this.setupButterflyMovement(gameItem)
    } else if (spriteKey === 'weed') {
      this.setupWeedSpread(gameItem)
    } else if (spriteKey === 'bomb') {
      this.setupBombTimer(gameItem)
    }
    
    // Auto-remove timing based on difficulty (with mobile adjustment)
    let minLifetime = this.difficulty.itemLifetimeMin
    let maxLifetime = this.difficulty.itemLifetimeMax
    
    // Special items have different lifetimes
    if (special) {
      if (spriteKey === 'golden') {
        minLifetime = Math.round(minLifetime * 0.5) // Golden flowers disappear faster
        maxLifetime = Math.round(maxLifetime * 0.6)
      } else if (spriteKey === 'bomb') {
        minLifetime = 3000 // Bombs have fixed 3-5 second timer
        maxLifetime = 5000
      }
    }
    
    // Slightly longer on mobile for easier tapping
    if (this.isMobile && !special) {
      minLifetime = Math.round(minLifetime * 1.3)
      maxLifetime = Math.round(maxLifetime * 1.3)
    }
    
    const removeDelay = Phaser.Math.Between(minLifetime, maxLifetime)
    
    this.time.delayedCall(removeDelay, () => {
      this.removeItem(gameItem)
    })
    
    // Add spawn animation
    const targetScale = sprite.scale
    sprite.setScale(0)
    this.tweens.add({
      targets: sprite,
      scale: targetScale,
      duration: 300,
      ease: 'Back.easeOut'
    })
  }

  private handleClick(pointer: Phaser.Input.Pointer) {
    if (!this.gameActive) return
    
    // Find what was clicked
    const clicked = this.input.hitTestPointer(pointer)
    for (const gameObject of clicked) {
      if (gameObject instanceof Phaser.GameObjects.Sprite) {
        // Find the game item
        for (let row = 0; row < this.gridSize.rows; row++) {
          for (let col = 0; col < this.gridSize.cols; col++) {
            const item = this.grid[row][col]
            if (item && item.sprite === gameObject) {
              this.clickItem(item)
              return
            }
          }
        }
      }
    }
  }

  private clickItem(item: GameItem) {
    const currentTime = this.time.now
    let pointsEarned = item.points
    let isGoodClick = false
    
    // Handle different item types
    if (item.type === 'thorn' || item.type === 'bomb') {
      // Bad items - reset combo and apply negative points
      this.combo = 0
      this.comboMultiplier = 1
      this.score = Math.max(0, this.score + pointsEarned)
      this.createFloatingText(item.sprite.x, item.sprite.y, `${pointsEarned}`, '#FF0000')
      
      // Special bomb explosion effect
      if (item.type === 'bomb') {
        this.explodeBomb(item)
        return // Don't remove normally, explosion handles it
      }
    } else {
      // Good items - increase combo
      isGoodClick = true
      this.combo++
      this.maxCombo = Math.max(this.maxCombo, this.combo)
      this.lastClickTime = currentTime
      
      // Calculate combo multiplier
      this.comboMultiplier = this.calculateComboMultiplier()
      
      // Apply combo bonus to points
      const finalPoints = Math.round(pointsEarned * this.comboMultiplier)
      this.score += finalPoints
      
      // Show points with combo indicator
      const comboText = this.combo > 2 ? ` (x${this.comboMultiplier.toFixed(1)})` : ''
      this.createFloatingText(item.sprite.x, item.sprite.y, `+${finalPoints}${comboText}`, '#00FF00')
      
      // Special effects for high combos
      if (this.combo >= 5) {
        this.createComboEffect(item.sprite.x, item.sprite.y)
      }
    }
    
    this.updateScore()
    this.updateCombo()
    
    // Clean up special item timers
    if (item.moveTimer) item.moveTimer.destroy()
    if (item.bombTimer) item.bombTimer.destroy()
    if (item.spreadTimer) item.spreadTimer.destroy()
    
    // Remove item with animation
    this.tweens.add({
      targets: item.sprite,
      scale: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.removeItem(item)
      }
    })
  }

  private createFloatingText(x: number, y: number, text: string, color: string) {
    const floatingText = this.add.text(x, y, text, {
      fontSize: '20px',
      color: color,
      fontFamily: 'Courier New',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    this.tweens.add({
      targets: floatingText,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        floatingText.destroy()
      }
    })
  }

  private removeItem(item: GameItem) {
    if (this.grid[item.row][item.col] === item) {
      this.grid[item.row][item.col] = null
      if (item.sprite && item.sprite.scene) {
        item.sprite.destroy()
      }
    }
  }

  private updateGameTimer() {
    this.timeLeft--
    this.updateTimer()
    
    // Update progressive difficulty
    this.updateProgressiveDifficulty()
    
    if (this.timeLeft <= 0) {
      this.endGame()
    }
  }

  private updateScore() {
    this.onScoreUpdate?.(this.score)
  }

  private updateTimer() {
    this.onTimeUpdate?.(this.timeLeft)
  }

  private updateCombo() {
    this.onComboUpdate?.(this.combo, this.comboMultiplier)
  }

  private checkComboTimeout() {
    if (!this.gameActive) return
    
    const currentTime = this.time.now
    if (this.combo > 0 && currentTime - this.lastClickTime > this.comboTimeWindow) {
      this.combo = 0
      this.comboMultiplier = 1
      this.updateCombo()
      console.log('Combo reset due to timeout')
    }
  }

  private updateProgressiveDifficulty() {
    const gameTimeElapsed = this.time.now - this.gameStartTime
    const newLevel = Math.floor(gameTimeElapsed / 10000) // Every 10 seconds
    
    if (newLevel > this.currentDifficultyLevel) {
      this.currentDifficultyLevel = newLevel
      const scaling = this.baseDifficulty.progressiveScaling
      
      // Apply progressive scaling
      this.difficulty.spawnDelayMin = Math.max(100, 
        this.baseDifficulty.spawnDelayMin * Math.pow(scaling.spawnRateIncrease, newLevel))
      this.difficulty.spawnDelayMax = Math.max(200, 
        this.baseDifficulty.spawnDelayMax * Math.pow(scaling.spawnRateIncrease, newLevel))
      
      this.difficulty.itemLifetimeMin = Math.max(500, 
        this.baseDifficulty.itemLifetimeMin * Math.pow(scaling.lifetimeDecrease, newLevel))
      this.difficulty.itemLifetimeMax = Math.max(800, 
        this.baseDifficulty.itemLifetimeMax * Math.pow(scaling.lifetimeDecrease, newLevel))
      
      this.difficulty.caterpillarRatio = Math.min(0.8, 
        this.baseDifficulty.caterpillarRatio + (scaling.caterpillarIncrease * newLevel))
      
      console.log(`Difficulty increased to level ${newLevel}:`, this.difficulty)
    }
  }

  private calculateComboMultiplier(): number {
    if (this.combo < 3) return 1
    if (this.combo < 6) return 1.5
    if (this.combo < 10) return 2
    if (this.combo < 15) return 2.5
    return 3 // Maximum multiplier
  }

  private setupButterflyMovement(item: GameItem) {
    // Butterfly moves to random adjacent cells every 2 seconds
    item.moveTimer = this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.gameActive && this.grid[item.row][item.col] === item) {
          this.moveButterflyToAdjacentCell(item)
        }
      },
      callbackScope: this,
      loop: true
    })
  }

  private moveButterflyToAdjacentCell(item: GameItem) {
    const adjacentCells: { row: number, col: number }[] = []
    
    // Find adjacent empty cells
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const newRow = item.row + dr
        const newCol = item.col + dc
        
        if (newRow >= 0 && newRow < this.gridSize.rows && 
            newCol >= 0 && newCol < this.gridSize.cols && 
            !this.grid[newRow][newCol]) {
          adjacentCells.push({ row: newRow, col: newCol })
        }
      }
    }
    
    if (adjacentCells.length > 0) {
      const newCell = Phaser.Utils.Array.GetRandom(adjacentCells)
      
      // Clear old position
      this.grid[item.row][item.col] = null
      
      // Update item position
      item.row = newCell.row
      item.col = newCell.col
      this.grid[newCell.row][newCell.col] = item
      
      // Calculate new screen position
      const totalGridWidth = this.gridSize.cols * this.cellSize
      const totalGridHeight = this.gridSize.rows * this.cellSize
      const startX = (this.gameWidth - totalGridWidth) / 2
      const startY = (this.gameHeight - totalGridHeight) / 2
      const newX = startX + newCell.col * this.cellSize + this.cellSize / 2
      const newY = startY + newCell.row * this.cellSize + this.cellSize / 2
      
      // Animate movement
      this.tweens.add({
        targets: item.sprite,
        x: newX,
        y: newY,
        duration: 500,
        ease: 'Power2'
      })
    }
  }

  private setupWeedSpread(item: GameItem) {
    // Weed spreads to adjacent cells every 5 seconds if not clicked
    item.spreadTimer = this.time.addEvent({
      delay: 5000,
      callback: () => {
        if (this.gameActive && this.grid[item.row][item.col] === item) {
          this.spreadWeed(item)
        }
      },
      callbackScope: this,
      loop: true
    })
  }

  private spreadWeed(item: GameItem) {
    const adjacentCells: { row: number, col: number }[] = []
    
    // Find adjacent empty cells
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const newRow = item.row + dr
        const newCol = item.col + dc
        
        if (newRow >= 0 && newRow < this.gridSize.rows && 
            newCol >= 0 && newCol < this.gridSize.cols && 
            !this.grid[newRow][newCol]) {
          adjacentCells.push({ row: newRow, col: newCol })
        }
      }
    }
    
    if (adjacentCells.length > 0) {
      const spreadCell = Phaser.Utils.Array.GetRandom(adjacentCells)
      
      // Create new weed at spread location
      const totalGridWidth = this.gridSize.cols * this.cellSize
      const totalGridHeight = this.gridSize.rows * this.cellSize
      const startX = (this.gameWidth - totalGridWidth) / 2
      const startY = (this.gameHeight - totalGridHeight) / 2
      const x = startX + spreadCell.col * this.cellSize + this.cellSize / 2
      const y = startY + spreadCell.row * this.cellSize + this.cellSize / 2
      
      const sprite = this.add.sprite(x, y, 'weed')
      sprite.setInteractive()
      const scale = (this.isMobile ? 0.6 : 0.8) * 0.9
      sprite.setScale(scale)
      
      const newWeed: GameItem = {
        sprite,
        type: 'weed',
        row: spreadCell.row,
        col: spreadCell.col,
        points: 25,
        special: true
      }
      
      this.grid[spreadCell.row][spreadCell.col] = newWeed
      this.setupWeedSpread(newWeed) // New weed can also spread
      
      // Auto-remove after some time
      this.time.delayedCall(Phaser.Math.Between(8000, 12000), () => {
        this.removeItem(newWeed)
      })
      
      // Spawn animation
      sprite.setScale(0)
      this.tweens.add({
        targets: sprite,
        scale: scale,
        duration: 300,
        ease: 'Back.easeOut'
      })
    }
  }

  private setupBombTimer(item: GameItem) {
    // Bomb explodes after 3-5 seconds if not clicked
    const explodeDelay = Phaser.Math.Between(3000, 5000)
    item.bombTimer = this.time.delayedCall(explodeDelay, () => {
      if (this.gameActive && this.grid[item.row][item.col] === item) {
        this.explodeBomb(item)
      }
    })
  }

  private explodeBomb(item: GameItem) {
    // Create explosion effect
    const explosion = this.add.circle(item.sprite.x, item.sprite.y, 20, 0xFF4444)
    explosion.setAlpha(0.8)
    
    this.tweens.add({
      targets: explosion,
      radius: 80,
      alpha: 0,
      duration: 500,
      onComplete: () => explosion.destroy()
    })
    
    // Remove nearby items in explosion radius
    const explosionRadius = 1 // 1 cell radius
    for (let dr = -explosionRadius; dr <= explosionRadius; dr++) {
      for (let dc = -explosionRadius; dc <= explosionRadius; dc++) {
        const checkRow = item.row + dr
        const checkCol = item.col + dc
        
        if (checkRow >= 0 && checkRow < this.gridSize.rows && 
            checkCol >= 0 && checkCol < this.gridSize.cols) {
          const nearbyItem = this.grid[checkRow][checkCol]
          if (nearbyItem && nearbyItem !== item) {
            this.removeItem(nearbyItem)
          }
        }
      }
    }
    
    // Remove the bomb itself
    this.removeItem(item)
    
    // Reset combo due to explosion
    this.combo = 0
    this.comboMultiplier = 1
    this.updateCombo()
  }

  private createComboEffect(x: number, y: number) {
    // Create sparkle effect for high combos
    for (let i = 0; i < 5; i++) {
      const sparkle = this.add.circle(
        x + Phaser.Math.Between(-30, 30),
        y + Phaser.Math.Between(-30, 30),
        3,
        0xFFD700
      )
      
      this.tweens.add({
        targets: sparkle,
        y: y - 50,
        alpha: 0,
        scale: 0,
        duration: 800,
        delay: i * 100,
        onComplete: () => sparkle.destroy()
      })
    }
  }

  private endGame() {
    this.gameActive = false
    
    // Stop timers
    if (this.spawnTimer) {
      this.spawnTimer.destroy()
    }
    if (this.gameTimer) {
      this.gameTimer.destroy()
    }
    if (this.comboTimer) {
      this.comboTimer.destroy()
    }
    
    // Clear grid and clean up special item timers
    for (let row = 0; row < this.gridSize.rows; row++) {
      for (let col = 0; col < this.gridSize.cols; col++) {
        const item = this.grid[row][col]
        if (item) {
          if (item.moveTimer) item.moveTimer.destroy()
          if (item.bombTimer) item.bombTimer.destroy()
          if (item.spreadTimer) item.spreadTimer.destroy()
          this.removeItem(item)
        }
      }
    }
    
    // Notify Vue component (game over UI is handled by Vue)
    this.onGameEnd?.(this.score)
  }

  // Methods to set callbacks from Vue
  public setScoreCallback(callback: (score: number) => void) {
    this.onScoreUpdate = callback
  }

  public setTimeCallback(callback: (time: number) => void) {
    this.onTimeUpdate = callback
  }

  public setGameEndCallback(callback: (finalScore: number) => void) {
    this.onGameEnd = callback
  }

  public setComboCallback(callback: (combo: number, multiplier: number) => void) {
    this.onComboUpdate = callback
  }

  // Method to start game (called from Vue component)
  public beginGame() {
    this.startGame()
  }

  // Method to set difficulty
  public setDifficulty(difficultyKey: string) {
    if (DIFFICULTY_PRESETS[difficultyKey]) {
      this.difficulty = DIFFICULTY_PRESETS[difficultyKey]
      console.log('Difficulty set to:', difficultyKey, this.difficulty)
    }
  }

  // Method to restart game
  public restartGame() {
    console.log('Restarting MainScene')
    
    // Reset game state before restarting scene
    this.gameStarted = false
    this.gameActive = false
    this.score = 0
    this.timeLeft = this.difficulty.gameTime
    
    // Reset combo system
    this.combo = 0
    this.maxCombo = 0
    this.comboMultiplier = 1
    this.lastClickTime = 0
    
    // Reset progressive difficulty
    this.gameStartTime = 0
    this.currentDifficultyLevel = 0
    
    // Clear any existing timers
    if (this.spawnTimer) {
      this.spawnTimer.destroy()
      this.spawnTimer = undefined
    }
    if (this.gameTimer) {
      this.gameTimer.destroy()
      this.gameTimer = undefined
    }
    if (this.comboTimer) {
      this.comboTimer.destroy()
      this.comboTimer = undefined
    }
    
    this.scene.restart()
  }
} 