import { test, expect } from '@playwright/test'

test.describe('Tactical RPG App', () => {
	test('should load the game page', async ({ page }) => {
		await page.goto('/')
		const gameContainer = page.locator('#game-container')
		await expect(gameContainer).toBeVisible()
	})
})
