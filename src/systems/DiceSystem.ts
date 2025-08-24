export type DiceRoll = {
	die: number
	rolls: number[]
	natural: number
	modifier: number
	total: number
	isCritical: boolean
	isFumble: boolean
	rollType?: RollType
}

export type RollType = 'normal' | 'advantage' | 'disadvantage'

export type RollOptions = {
	rollType?: RollType
	modifier?: number
}

export class DiceSystem {
	static rollDie(sides: number): number {
		return Math.floor(Math.random() * sides) + 1
	}

	static rollD20(options: RollOptions = {}): DiceRoll {
		const { rollType = 'normal', modifier = 0 } = options

		let rolls: number[] = []
		let natural: number

		switch (rollType) {
			case 'advantage':
				rolls = [this.rollDie(20), this.rollDie(20)]
				natural = Math.max(...rolls)
				break
			case 'disadvantage':
				rolls = [this.rollDie(20), this.rollDie(20)]
				natural = Math.min(...rolls)
				break
			default:
				natural = this.rollDie(20)
				rolls = [natural]
		}

		const total = natural + modifier

		return {
			die: 20,
			rolls,
			natural: natural,
			modifier,
			total,
			isCritical: natural === 20,
			isFumble: natural === 1,
			rollType: rollType,
		}
	}

	static roll(diceCount: number, sides: number, modifier = 0): DiceRoll {
		const rolls: number[] = []
		let sum = 0

		for (let i = 0; i < diceCount; i++) {
			const role = this.rollDie(sides)
			rolls.push(role)
			sum += role
		}

		const total = sum + modifier

		return {
			die: sides,
			rolls,
			natural: sum,
			modifier,
			total,
			isCritical: false,
			isFumble: false,
		}
	}
}
