import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Create simple colored rectangles as placeholders for flowers and weeds
    this.load.image('background', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
    
    // Create flower sprite (pink circle)
    this.createFlowerSprite()
    
    // Create weed sprite (dark green square)
    this.createWeedSprite()
    
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

  private createFlowerSprite() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0xFF69B4) // Hot pink
    graphics.fillCircle(25, 25, 20)
    graphics.fillStyle(0xFFD700) // Gold center
    graphics.fillCircle(25, 25, 8)
    graphics.generateTexture('flower', 50, 50)
    graphics.destroy()
  }

  private createWeedSprite() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0x2F4F2F) // Dark green
    graphics.fillRect(10, 10, 30, 30)
    graphics.fillStyle(0x228B22) // Lighter green accent
    graphics.fillRect(15, 15, 20, 20)
    graphics.generateTexture('weed', 50, 50)
    graphics.destroy()
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