import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { NavigationMenu } from './pages/NavigationMenu';

test.describe('Sign out', () => {
  test('Sign out from the authenticated storefront', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const menu = new NavigationMenu(page);

    // 1. Sign in as standard_user / secret_sauce and open the navigation menu.
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await inventory.openMenu();
    await expect(menu.allItemsLink).toBeVisible();
    await expect(menu.dynamicCatalogLink).toBeVisible();
    await expect(menu.aboutLink).toBeVisible();
    await expect(menu.logoutLink).toBeVisible();
    await expect(menu.resetAppStateLink).toBeVisible();
    await expect(menu.closeMenuControl).toBeVisible();

    // 2. Select Logout.
    await menu.logout();
    await expect(login.usernameInput).toBeVisible();
    await expect(inventory.productsHeading).toHaveCount(0);

    // 3. Use browser Back to attempt to revisit the inventory page.
    await page.goBack();
    await expect(login.usernameInput).toBeVisible();
    await expect(inventory.productsHeading).toHaveCount(0);
  });
});