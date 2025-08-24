import Phaser from 'phaser'

export class MainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenu' })
	}

	create() {
		const centerX = this.cameras.main.width / 2
		const centerY = this.cameras.main.height / 2

		// Title
		this.add
			.text(centerX, centerY - 100, 'Tactical RPG', {
				fontSize: '64px',
				color: '#ffffff',
				fontFamily: 'Arial',
			})
			.setOrigin(0.5)

		// New Game Button
		const button = this.add
			.rectangle(centerX, centerY + 50, 250, 60, 0x4a5568)
			.setInteractive({ useHandCursor: true })
			.on('pointerover', () => button.setFillStyle(0x5a6578))
			.on('pointerout', () => button.setFillStyle(0x4a5568))
			.on('pointerdown', () => this.startNewGame())

		this.add
			.text(centerX, centerY + 50, 'New Game', {
				fontSize: '32px',
				color: '#ffffff',
				fontFamily: 'Arial',
			})
			.setOrigin(0.5)
	}

	startNewGame() {
		console.log('Starting new game...')
	}
}
