import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';

const backpack = 'Sauce Labs Backpack';

test.describe('Browse products', () => {
  test('Browse inventory and inspect product details', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const details = new ProductDetailsPage(page);

    // 1. Sign in as standard_user / secret_sauce.
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await expect(inventory.productsHeading).toBeVisible();
    await expect(inventory.productCards).toHaveCount(6);
    await expect(inventory.productNames).toHaveCount(6);
    await expect(inventory.productDescriptions).toHaveCount(6);
    await expect(inventory.productImages).toHaveCount(6);
    await expect(inventory.productImages.first()).toHaveAttribute('alt', /.+/);
    await expect(inventory.productPrices).toHaveCount(6);
    await expect(inventory.addToCartButtons).toHaveCount(6);

    // 2. Open Sauce Labs Backpack by selecting its product image or View details control.
    await inventory.openProduct(backpack);
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(details.detailsContainer).toBeVisible();
    await expect(details.productName).toBeVisible();
    await expect(details.description).toBeVisible();
    await expect(details.price).toBeVisible();
    await expect(details.addToCartButton).toBeVisible();

    // 3. Select Back to products.
    await details.backToProducts();
    await expect(inventory.productsHeading).toBeVisible();
    await expect(inventory.cartButton).toHaveAccessibleName('Cart, empty');
  });

  test('Sort inventory by name and price', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    // 1. Sign in as standard_user / secret_sauce and select each of the four sort choices.
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await expect(inventory.productNames).toHaveCount(6);

    const originalNames = await inventory.productNames.allTextContents();
    const originalPrices = await inventory.productPrices.allTextContents();
    const nameAscending = [...originalNames].sort((a, b) => a.localeCompare(b));
    const nameDescending = [...nameAscending].reverse();
    const pricesAscending = [...originalPrices].sort((a, b) => Number(a.replace('$', '')) - Number(b.replace('$', '')));
    const pricesDescending = [...pricesAscending].reverse();

    await inventory.sortBy('Name (A to Z)');
    await expect(inventory.sortSelect).toHaveValue('az');
    await expect(inventory.productNames).toHaveText(nameAscending);

    await inventory.sortBy('Name (Z to A)');
    await expect(inventory.sortSelect).toHaveValue('za');
    await expect(inventory.productNames).toHaveText(nameDescending);

    await inventory.sortBy('Price (low to high)');
    await expect(inventory.sortSelect).toHaveValue('lohi');
    const actualAscendingPrices = (await inventory.productPrices.allTextContents()).map(price => Number(price.replace('$', '')));
    expect(actualAscendingPrices).toEqual(pricesAscending.map(price => Number(price.replace('$', ''))));
    expect(actualAscendingPrices).toEqual([...actualAscendingPrices].sort((a, b) => a - b));

    await inventory.sortBy('Price (high to low)');
    await expect(inventory.sortSelect).toHaveValue('hilo');
    const actualDescendingPrices = (await inventory.productPrices.allTextContents()).map(price => Number(price.replace('$', '')));
    expect(actualDescendingPrices).toEqual(pricesDescending.map(price => Number(price.replace('$', ''))));
    expect(actualDescendingPrices).toEqual([...actualDescendingPrices].sort((a, b) => b - a));
  });
});