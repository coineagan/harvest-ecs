import { test, expect } from '@playwright/test'

test.describe('Tactical RPG App', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('should load the game page', async ({ page }) => {
		await expect(page).toHaveTitle('Tactical RPG')

		const gameContainer = page.locator('#game-container')
		await expect(gameContainer).toBeVisible()
	})
})
