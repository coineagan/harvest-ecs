import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DiceSystem } from '../../src/systems/DiceSystem'

describe('DiceSystem', () => {
	// Mock Math.random for predictable testing
	beforeEach(() => {
		vi.spyOn(Math, 'random')
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('rollDie', () => {
		it('should return 1 when Math.random returns 0', () => {
			vi.mocked(Math.random).mockReturnValue(0)
			expect(DiceSystem.rollDie(6)).toBe(1)
		})

		it('should return max value when Math.random returns close to 1', () => {
			vi.mocked(Math.random).mockReturnValue(0.999)
			expect(DiceSystem.rollDie(6)).toBe(6)
			expect(DiceSystem.rollDie(20)).toBe(20)
		})

		it('should return correct value for mid-range random', () => {
			vi.mocked(Math.random).mockReturnValue(0.5)
			expect(DiceSystem.rollDie(6)).toBe(4) // floor(0.5 * 6) + 1 = 3 + 1 = 4
			expect(DiceSystem.rollDie(20)).toBe(11) // floor(0.5 * 20) + 1 = 10 + 1 = 11
		})

		it('should handle different die sizes correctly', () => {
			vi.mocked(Math.random).mockReturnValue(0.25)
			expect(DiceSystem.rollDie(4)).toBe(2) // floor(0.25 * 4) + 1 = 1 + 1 = 2
			expect(DiceSystem.rollDie(8)).toBe(3) // floor(0.25 * 8) + 1 = 2 + 1 = 3
			expect(DiceSystem.rollDie(12)).toBe(4) // floor(0.25 * 12) + 1 = 3 + 1 = 4
		})
	})

	describe('rollD20', () => {
		describe('normal roll', () => {
			it('should return correct structure for normal roll', () => {
				vi.mocked(Math.random).mockReturnValue(0.5) // Will roll 11

				const result = DiceSystem.rollD20()

				expect(result).toMatchObject({
					die: 20,
					rolls: [11],
					natural: 11,
					modifier: 0,
					total: 11,
					isCritical: false,
					isFumble: false,
					rollType: 'normal',
				})
			})

			it('should apply modifier correctly', () => {
				vi.mocked(Math.random).mockReturnValue(0.5) // Will roll 11

				const result = DiceSystem.rollD20({ modifier: 5 })

				expect(result).toMatchObject({
					die: 20,
					rolls: [11],
					natural: 11,
					modifier: 5,
					total: 16,
					isCritical: false,
					isFumble: false,
					rollType: 'normal',
				})
			})

			it('should handle negative modifier', () => {
				vi.mocked(Math.random).mockReturnValue(0.5) // Will roll 11

				const result = DiceSystem.rollD20({ modifier: -3 })

				expect(result).toMatchObject({
					total: 8,
					modifier: -3,
				})
			})

			it('should detect critical hit (natural 20)', () => {
				vi.mocked(Math.random).mockReturnValue(0.99) // Will roll 20

				const result = DiceSystem.rollD20()

				expect(result).toMatchObject({
					natural: 20,
					isCritical: true,
					isFumble: false,
				})
			})

			it('should detect fumble (natural 1)', () => {
				vi.mocked(Math.random).mockReturnValue(0) // Will roll 1

				const result = DiceSystem.rollD20()

				expect(result).toMatchObject({
					natural: 1,
					isCritical: false,
					isFumble: true,
				})
			})
		})

		describe('advantage roll', () => {
			it('should roll two dice and take the higher value', () => {
				// First roll: 8, Second roll: 15
				vi.mocked(Math.random).mockReturnValueOnce(0.35).mockReturnValueOnce(0.7)

				const result = DiceSystem.rollD20({ rollType: 'advantage' })

				expect(result).toMatchObject({
					die: 20,
					rolls: [8, 15],
					natural: 15,
					modifier: 0,
					total: 15,
					isCritical: false,
					isFumble: false,
					rollType: 'advantage',
				})
			})

			it('should detect critical on advantage roll', () => {
				// First roll: 15, Second roll: 20
				vi.mocked(Math.random).mockReturnValueOnce(0.7).mockReturnValueOnce(0.99)

				const result = DiceSystem.rollD20({ rollType: 'advantage' })

				expect(result).toMatchObject({
					rolls: [15, 20],
					natural: 20,
					isCritical: true,
					isFumble: false,
				})
			})

			it('should not detect fumble if only one die is 1', () => {
				// First roll: 1, Second roll: 10
				vi.mocked(Math.random).mockReturnValueOnce(0).mockReturnValueOnce(0.45)

				const result = DiceSystem.rollD20({ rollType: 'advantage' })

				expect(result).toMatchObject({
					rolls: [1, 10],
					natural: 10,
					isCritical: false,
					isFumble: false,
				})
			})

			it('should detect fumble if both dice are 1', () => {
				// Both rolls: 1
				vi.mocked(Math.random).mockReturnValue(0)

				const result = DiceSystem.rollD20({ rollType: 'advantage' })

				expect(result).toMatchObject({
					rolls: [1, 1],
					natural: 1,
					isCritical: false,
					isFumble: true,
				})
			})
		})

		describe('disadvantage roll', () => {
			it('should roll two dice and take the lower value', () => {
				// First roll: 15, Second roll: 8
				vi.mocked(Math.random).mockReturnValueOnce(0.7).mockReturnValueOnce(0.35)

				const result = DiceSystem.rollD20({ rollType: 'disadvantage' })

				expect(result).toMatchObject({
					die: 20,
					rolls: [15, 8],
					natural: 8,
					modifier: 0,
					total: 8,
					isCritical: false,
					isFumble: false,
					rollType: 'disadvantage',
				})
			})

			it('should detect fumble on disadvantage roll', () => {
				// First roll: 10, Second roll: 1
				vi.mocked(Math.random).mockReturnValueOnce(0.45).mockReturnValueOnce(0)

				const result = DiceSystem.rollD20({ rollType: 'disadvantage' })

				expect(result).toMatchObject({
					rolls: [10, 1],
					natural: 1,
					isCritical: false,
					isFumble: true,
				})
			})

			it('should not detect critical if only one die is 20', () => {
				// First roll: 20, Second roll: 10
				vi.mocked(Math.random).mockReturnValueOnce(0.99).mockReturnValueOnce(0.45)

				const result = DiceSystem.rollD20({ rollType: 'disadvantage' })

				expect(result).toMatchObject({
					rolls: [20, 10],
					natural: 10,
					isCritical: false,
					isFumble: false,
				})
			})

			it('should detect critical if both dice are 20', () => {
				// Both rolls: 20
				vi.mocked(Math.random).mockReturnValue(0.99)

				const result = DiceSystem.rollD20({ rollType: 'disadvantage' })

				expect(result).toMatchObject({
					rolls: [20, 20],
					natural: 20,
					isCritical: true,
					isFumble: false,
				})
			})
		})
	})

	describe('roll', () => {
		it('should roll single die correctly', () => {
			vi.mocked(Math.random).mockReturnValue(0.5) // Will roll 4 on d6

			const result = DiceSystem.roll(1, 6)

			expect(result).toMatchObject({
				die: 6,
				rolls: [4],
				natural: 4,
				modifier: 0,
				total: 4,
				isCritical: false,
				isFumble: false,
			})
		})

		it('should roll multiple dice correctly', () => {
			// Rolls: 2, 5, 1
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.33) // 2 on d6 (floor(0.33 * 6) + 1 = 1 + 1 = 2)
				.mockReturnValueOnce(0.83) // 5 on d6 (floor(0.83 * 6) + 1 = 4 + 1 = 5)
				.mockReturnValueOnce(0) // 1 on d6 (floor(0 * 6) + 1 = 0 + 1 = 1)

			const result = DiceSystem.roll(3, 6)

			expect(result).toMatchObject({
				die: 6,
				rolls: [2, 5, 1],
				natural: 8,
				modifier: 0,
				total: 8,
				isCritical: false,
				isFumble: false,
			})
		})

		it('should apply modifier correctly', () => {
			vi.mocked(Math.random).mockReturnValue(0.5) // Will roll 4 on d6

			const result = DiceSystem.roll(1, 6, 3)

			expect(result).toMatchObject({
				natural: 4,
				modifier: 3,
				total: 7,
			})
		})

		it('should handle negative modifier', () => {
			vi.mocked(Math.random).mockReturnValue(0.5) // Will roll 4 on d6

			const result = DiceSystem.roll(1, 6, -2)

			expect(result).toMatchObject({
				natural: 4,
				modifier: -2,
				total: 2,
			})
		})

		it('should work with different die sizes', () => {
			vi.mocked(Math.random).mockReturnValue(0.5)

			const d4Result = DiceSystem.roll(1, 4)
			const d8Result = DiceSystem.roll(1, 8)
			const d12Result = DiceSystem.roll(1, 12)

			expect(d4Result.die).toBe(4)
			expect(d4Result.natural).toBe(3) // floor(0.5 * 4) + 1 = 3

			expect(d8Result.die).toBe(8)
			expect(d8Result.natural).toBe(5) // floor(0.5 * 8) + 1 = 5

			expect(d12Result.die).toBe(12)
			expect(d12Result.natural).toBe(7) // floor(0.5 * 12) + 1 = 7
		})

		it('should handle zero dice count', () => {
			const result = DiceSystem.roll(0, 6)

			expect(result).toMatchObject({
				die: 6,
				rolls: [],
				natural: 0,
				modifier: 0,
				total: 0,
				isCritical: false,
				isFumble: false,
			})
		})

		it('should never set critical or fumble flags', () => {
			// Even with d20 rolls, the roll() method should not set critical/fumble
			vi.mocked(Math.random).mockReturnValue(0.99) // Would be 20 on d20

			const critResult = DiceSystem.roll(1, 20)
			expect(critResult.isCritical).toBe(false)

			vi.mocked(Math.random).mockReturnValue(0) // Would be 1 on d20

			const fumbleResult = DiceSystem.roll(1, 20)
			expect(fumbleResult.isFumble).toBe(false)
		})
	})

	describe('integration tests', () => {
		it('should produce consistent results with same random seed', () => {
			// Test multiple calls with same mock values
			vi.mocked(Math.random).mockReturnValue(0.75)

			const roll1 = DiceSystem.rollD20()
			vi.mocked(Math.random).mockReturnValue(0.75)
			const roll2 = DiceSystem.rollD20()

			expect(roll1.natural).toBe(roll2.natural)
		})

		it('should handle edge cases gracefully', () => {
			// Test with extreme modifier values
			vi.mocked(Math.random).mockReturnValue(0.5)

			const largeModifier = DiceSystem.rollD20({ modifier: 1000 })
			expect(largeModifier.total).toBe(1011) // 11 + 1000

			const negativeModifier = DiceSystem.rollD20({ modifier: -50 })
			expect(negativeModifier.total).toBe(-39) // 11 - 50
		})
	})

	describe('type safety', () => {
		it('should accept valid roll types', () => {
			const normalRoll = DiceSystem.rollD20({ rollType: 'normal' })
			const advantageRoll = DiceSystem.rollD20({ rollType: 'advantage' })
			const disadvantageRoll = DiceSystem.rollD20({ rollType: 'disadvantage' })

			expect(normalRoll.rollType).toBe('normal')
			expect(advantageRoll.rollType).toBe('advantage')
			expect(disadvantageRoll.rollType).toBe('disadvantage')
		})

		it('should return proper DiceRoll structure', () => {
			vi.mocked(Math.random).mockReturnValue(0.5)

			const result = DiceSystem.rollD20()

			// Type checking - these should not cause TypeScript errors
			expect(typeof result.die).toBe('number')
			expect(Array.isArray(result.rolls)).toBe(true)
			expect(typeof result.natural).toBe('number')
			expect(typeof result.modifier).toBe('number')
			expect(typeof result.total).toBe('number')
			expect(typeof result.isCritical).toBe('boolean')
			expect(typeof result.isFumble).toBe('boolean')
			expect(typeof result.rollType).toBe('string')
		})
	})

	describe('real randomness tests', () => {
		// These tests use actual randomness to ensure the system works in practice
		beforeEach(() => {
			vi.restoreAllMocks() // Remove mocks for these tests
		})

		it('should produce values within expected range for rollDie', () => {
			for (let i = 0; i < 100; i++) {
				const result = DiceSystem.rollDie(6)
				expect(result).toBeGreaterThanOrEqual(1)
				expect(result).toBeLessThanOrEqual(6)
			}
		})

		it('should produce values within expected range for rollD20', () => {
			for (let i = 0; i < 100; i++) {
				const result = DiceSystem.rollD20()
				expect(result.natural).toBeGreaterThanOrEqual(1)
				expect(result.natural).toBeLessThanOrEqual(20)
				expect(result.rolls.length).toBe(1)
			}
		})

		it('should produce two rolls for advantage/disadvantage', () => {
			const advResult = DiceSystem.rollD20({ rollType: 'advantage' })
			const disadvResult = DiceSystem.rollD20({ rollType: 'disadvantage' })

			expect(advResult.rolls.length).toBe(2)
			expect(disadvResult.rolls.length).toBe(2)

			// For advantage, natural should be max of rolls
			expect(advResult.natural).toBe(Math.max(...advResult.rolls))
			// For disadvantage, natural should be min of rolls
			expect(disadvResult.natural).toBe(Math.min(...disadvResult.rolls))
		})
	})
})
