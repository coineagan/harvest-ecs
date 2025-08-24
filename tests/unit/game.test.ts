import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Math Utilities', () => {
	it('should add two numbers correctly', () => {
		const add = (a: number, b: number) => a + b
		expect(add(2, 3)).toBe(5)
		expect(add(-1, 1)).toBe(0)
		expect(add(0, 0)).toBe(0)
	})
})
