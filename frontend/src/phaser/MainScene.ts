import Phaser from 'phaser'

interface GameItem {
  sprite: Phaser.GameObjects.Sprite
  type: 'flower1' | 'flower2' | 'flower3' | 'thorn'
  row: number
  col: number
  points: number
}

// Add difficulty interface
export interface DifficultySettings {
  spawnDelayMin: number
  spawnDelayMax: number
  itemLifetimeMin: number
  itemLifetimeMax: number
  caterpillarRatio: number
  gameTime: number
}

// Define difficulty presets
export const DIFFICULTY_PRESETS: Record<string, DifficultySettings> = {
  easy: {
    spawnDelayMin: 1000,
    spawnDelayMax: 2000,
    itemLifetimeMin: 3000,
    itemLifetimeMax: 4500,
    caterpillarRatio: 0.25, // 25% caterpillars
    gameTime: 60
  },
  normal: {
    spawnDelayMin: 500,
    spawnDelayMax: 1000,
    itemLifetimeMin: 1500,
    itemLifetimeMax: 2500,
    caterpillarRatio: 0.35, // 35% caterpillars
    gameTime: 60
  },
  hard: {
    spawnDelayMin: 300,
    spawnDelayMax: 700,
    itemLifetimeMin: 1000,
    itemLifetimeMax: 1800,
    caterpillarRatio: 0.45, // 45% caterpillars
    gameTime: 60
  }
}

export class MainScene extends Phaser.Scene {
  private score = 0
  private timeLeft = 60
  private gameActive = false
  private grid: (GameItem | null)[][] = []
  private gridSize = { rows: 6, cols: 8 }
  private cellSize = 80
  private spawnTimer?: Phaser.Time.TimerEvent
  private gameTimer?: Phaser.Time.TimerEvent
  private gameStarted = false

  // Difficulty settings
  private difficulty: DifficultySettings = DIFFICULTY_PRESETS.normal

  // Responsive properties
  private gameWidth = 800
  private gameHeight = 600
  private isMobile = false

  // Game callbacks to communicate with Vue
  private onScoreUpdate?: (score: number) => void
  private onTimeUpdate?: (time: number) => void
  private onGameEnd?: (finalScore: number) => void

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
      // For mobile, use a smaller grid to ensure good visibility
      this.gridSize = { rows: 5, cols: 6 }
      
      // Calculate cell size to fit the screen with some padding
      const availableWidth = this.gameWidth * 0.9 // 90% of width
      const availableHeight = this.gameHeight * 0.7 // 70% of height (leave room for UI)
      
      const cellSizeByWidth = Math.floor(availableWidth / this.gridSize.cols)
      const cellSizeByHeight = Math.floor(availableHeight / this.gridSize.rows)
      
      this.cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, 70) // Max 70px on mobile
    } else {
      // Desktop dimensions
      this.gridSize = { rows: 6, cols: 8 }
      this.cellSize = 80
      
      // Ensure it fits on smaller desktop screens too
      const availableWidth = this.gameWidth * 0.9
      const availableHeight = this.gameHeight * 0.8
      
      const cellSizeByWidth = Math.floor(availableWidth / this.gridSize.cols)
      const cellSizeByHeight = Math.floor(availableHeight / this.gridSize.rows)
      
      this.cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, 80)
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
    
    console.log('Starting game timers and spawning with difficulty:', this.difficulty)
    
    this.updateScore()
    this.updateTimer()
    
    // Spawn items based on difficulty settings
    this.scheduleNextSpawn()
    
    // Game timer (count down)
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateGameTimer,
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
    
    // Flower vs caterpillar chance based on difficulty
    const isFlower = Math.random() > this.difficulty.caterpillarRatio
    let spriteKey: 'flower1' | 'flower2' | 'flower3' | 'thorn'
    let points: number
    
    if (isFlower) {
      // Random flower type
      const flowerType = Math.random()
      if (flowerType < 0.5) {
        spriteKey = 'flower1' // 50% chance - common (🌸)
        points = 10
      } else if (flowerType < 0.8) {
        spriteKey = 'flower2' // 30% chance - uncommon (🌻)
        points = 15
      } else {
        spriteKey = 'flower3' // 20% chance - rare (🌺)
        points = 20
      }
    } else {
      spriteKey = 'thorn' // Actually caterpillar (🐛)
      points = -5
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
    if (spriteKey === 'flower2') scale = baseScale * 1.125 // 0.9 desktop, 0.675 mobile
    if (spriteKey === 'flower3') scale = baseScale * 1.25  // 1.0 desktop, 0.75 mobile
    if (spriteKey === 'thorn') scale = baseScale * 0.875   // 0.7 desktop, 0.525 mobile (caterpillar)
    
    sprite.setScale(scale)
    
    // Add to grid
    const gameItem: GameItem = {
      sprite,
      type: spriteKey,
      row: randomCell.row,
      col: randomCell.col,
      points
    }
    
    this.grid[randomCell.row][randomCell.col] = gameItem
    
    // Auto-remove timing based on difficulty (with mobile adjustment)
    let minLifetime = this.difficulty.itemLifetimeMin
    let maxLifetime = this.difficulty.itemLifetimeMax
    
    // Slightly longer on mobile for easier tapping
    if (this.isMobile) {
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
    if (item.type !== 'thorn') {
      // It's a flower
      this.score += item.points
      this.createFloatingText(item.sprite.x, item.sprite.y, `+${item.points}`, '#00FF00')
    } else {
      // It's a caterpillar
      this.score = Math.max(0, this.score + item.points)
      this.createFloatingText(item.sprite.x, item.sprite.y, `${item.points}`, '#FF0000')
    }
    
    this.updateScore()
    
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

  private endGame() {
    this.gameActive = false
    
    // Stop timers
    if (this.spawnTimer) {
      this.spawnTimer.destroy()
    }
    if (this.gameTimer) {
      this.gameTimer.destroy()
    }
    
    // Clear grid
    for (let row = 0; row < this.gridSize.rows; row++) {
      for (let col = 0; col < this.gridSize.cols; col++) {
        if (this.grid[row][col]) {
          this.removeItem(this.grid[row][col]!)
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
    
    // Clear any existing timers
    if (this.spawnTimer) {
      this.spawnTimer.destroy()
      this.spawnTimer = undefined
    }
    if (this.gameTimer) {
      this.gameTimer.destroy()
      this.gameTimer = undefined
    }
    
    this.scene.restart()
  }
} 