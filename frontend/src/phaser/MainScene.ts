import Phaser from 'phaser'

interface GameItem {
  sprite: Phaser.GameObjects.Sprite
  type: 'flower' | 'weed'
  row: number
  col: number
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
  private scoreText?: Phaser.GameObjects.Text
  private timerText?: Phaser.GameObjects.Text
  private gameStarted = false

  // Game callbacks to communicate with Vue
  private onScoreUpdate?: (score: number) => void
  private onTimeUpdate?: (time: number) => void
  private onGameEnd?: (finalScore: number) => void

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // Set up the game grid background
    this.createGrid()
    
    // Set up UI
    this.createUI()
    
    // Initialize empty grid
    this.initializeGrid()
    
    // Set up input
    this.input.on('pointerdown', this.handleClick, this)
    
    // Start the game
    this.startGame()
  }

  private createGrid() {
    const startX = (this.cameras.main.width - (this.gridSize.cols * this.cellSize)) / 2
    const startY = 100
    
    for (let row = 0; row < this.gridSize.rows; row++) {
      for (let col = 0; col < this.gridSize.cols; col++) {
        const x = startX + col * this.cellSize
        const y = startY + row * this.cellSize
        
        const cell = this.add.sprite(x, y, 'gridCell')
        cell.setOrigin(0, 0)
        cell.setAlpha(0.5)
      }
    }
  }

  private createUI() {
    // Score display
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: '#FFD700',
      fontFamily: 'Courier New',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    })

    // Timer display
    this.timerText = this.add.text(this.cameras.main.width - 20, 20, 'Time: 60s', {
      fontSize: '24px',
      color: '#FFD700',
      fontFamily: 'Courier New',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 0)

    // Instructions
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height - 50,
      'Click flowers to gain points! Avoid weeds!',
      {
        fontSize: '18px',
        color: '#FFFFFF',
        fontFamily: 'Courier New',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      }
    ).setOrigin(0.5)
  }

  private initializeGrid() {
    this.grid = Array(this.gridSize.rows).fill(null).map(() => 
      Array(this.gridSize.cols).fill(null)
    )
  }

  private startGame() {
    if (this.gameStarted) return
    
    this.gameStarted = true
    this.gameActive = true
    this.score = 0
    this.timeLeft = 60
    
    this.updateScore()
    this.updateTimer()
    
    // Spawn items every 1-2 seconds
    this.spawnTimer = this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000),
      callback: this.spawnItem,
      callbackScope: this,
      loop: true
    })
    
    // Game timer (count down)
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateGameTimer,
      callbackScope: this,
      loop: true
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
    
    // 80% chance for flower, 20% chance for weed
    const isFlower = Math.random() < 0.8
    const spriteKey = isFlower ? 'flower' : 'weed'
    
    // Calculate position
    const startX = (this.cameras.main.width - (this.gridSize.cols * this.cellSize)) / 2
    const startY = 100
    const x = startX + randomCell.col * this.cellSize + this.cellSize / 2
    const y = startY + randomCell.row * this.cellSize + this.cellSize / 2
    
    // Create sprite
    const sprite = this.add.sprite(x, y, spriteKey)
    sprite.setInteractive()
    sprite.setScale(0.8)
    
    // Add to grid
    const gameItem: GameItem = {
      sprite,
      type: isFlower ? 'flower' : 'weed',
      row: randomCell.row,
      col: randomCell.col
    }
    
    this.grid[randomCell.row][randomCell.col] = gameItem
    
    // Auto-remove after 3-5 seconds if not clicked
    this.time.delayedCall(Phaser.Math.Between(3000, 5000), () => {
      this.removeItem(gameItem)
    })
    
    // Add spawn animation
    sprite.setScale(0)
    this.tweens.add({
      targets: sprite,
      scale: 0.8,
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
    if (item.type === 'flower') {
      this.score += 10
      this.createFloatingText(item.sprite.x, item.sprite.y, '+10', '#00FF00')
    } else {
      this.score = Math.max(0, this.score - 5)
      this.createFloatingText(item.sprite.x, item.sprite.y, '-5', '#FF0000')
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
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`)
    }
    this.onScoreUpdate?.(this.score)
  }

  private updateTimer() {
    if (this.timerText) {
      this.timerText.setText(`Time: ${this.timeLeft}s`)
    }
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
    
    // Show game over text
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      `Game Over!\nFinal Score: ${this.score}`,
      {
        fontSize: '32px',
        color: '#FFD700',
        fontFamily: 'Courier New',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 },
        align: 'center'
      }
    ).setOrigin(0.5)
    
    // Notify Vue component
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

  // Method to restart game
  public restartGame() {
    this.scene.restart()
  }
} 