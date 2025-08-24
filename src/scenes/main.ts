import Phaser from 'phaser'
import { MainMenu } from './MainMenuScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1920,
	height: 1080,
	parent: 'game-container',
	backgroundColor: '#1a1a2e',
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [MainMenu],
}

const game = new Phaser.Game(config)

export default game
