import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Create simple colored rectangles as placeholders for flowers and thorns
    this.load.image('background', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
    
    // Create emoji-based sprites to match the GameCanvas component
    this.createEmojiSprite('flower1', '🌸') // Cherry Blossom - 10 points
    this.createEmojiSprite('flower2', '🌻') // Sunflower - 15 points
    this.createEmojiSprite('flower3', '🌺') // Hibiscus - 20 points
    this.createEmojiSprite('thorn', '🐛')   // Caterpillar - negative points
    
    // Special challenge items
    this.createEmojiSprite('butterfly', '🦋') // Moving target - 50 points
    this.createEmojiSprite('weed', '🌿')      // Spreads if not clicked - 25 points
    this.createEmojiSprite('golden', '🌟')    // Rare golden flower - 100 points
    this.createEmojiSprite('bomb', '💣')      // Bomb flower - must click quickly
    
    // Create grid cell sprite (light brown rectangle)
    this.createGridCellSprite()
    
    // Loading text
    const loadingText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Loading Flower Farm Frenzy...',
      {
        fontSize: '24px',
        color: '#228B22',
        fontFamily: 'Courier New'
      }
    ).setOrigin(0.5)
    
    // Progress bar
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(this.cameras.main.centerX - 160, this.cameras.main.centerY + 50, 320, 50)
    
    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0xFFD700, 1)
      progressBar.fillRect(this.cameras.main.centerX - 150, this.cameras.main.centerY + 60, 300 * value, 30)
    })
    
    this.load.on('complete', () => {
      loadingText.destroy()
      progressBar.destroy()
      progressBox.destroy()
      this.scene.start('MainScene')
    })
  }

  private createEmojiSprite(key: string, emoji: string) {
    // Create a canvas to render the emoji
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    // Set canvas size
    canvas.width = 80
    canvas.height = 80
    
    // Set font and draw emoji
    ctx.font = '60px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, 40, 40)
    
    // Convert canvas to texture
    this.load.image(key, canvas.toDataURL())
  }

  private createGridCellSprite() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0x8B4513, 0.3) // Semi-transparent brown
    graphics.fillRect(0, 0, 80, 80)
    graphics.lineStyle(2, 0x654321, 1) // Darker brown border
    graphics.strokeRect(0, 0, 80, 80)
    graphics.generateTexture('gridCell', 80, 80)
    graphics.destroy()
  }
} 