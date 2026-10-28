import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';

const backpack = 'Sauce Labs Backpack';
const bikeLight = 'Sauce Labs Bike Light';

async function signInAndAddTwoProducts(page: import('@playwright/test').Page): Promise<InventoryPage> {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await inventory.addProduct(backpack);
  await inventory.addProduct(bikeLight);
  return inventory;
}

test.describe('Manage cart', () => {
  test('Add two products and verify cart contents', async ({ page }) => {
    const inventory = await signInAndAddTwoProducts(page);
    const cart = new CartPage(page);

    // 1. Sign in as standard_user / secret_sauce and add Backpack and Bike Light.
    await expect(inventory.productCard(backpack).getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(inventory.productCard(bikeLight).getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(inventory.cartButton).toHaveAccessibleName('Cart, 2 items');

    // 2. Open the cart.
    await inventory.openCart();
    await expect(cart.heading).toBeVisible();
    await expect(cart.cartItems).toHaveCount(2);
    await expect(cart.item(backpack)).toContainText(backpack);
    await expect(cart.item(backpack)).toContainText('$29.99');
    await expect(cart.item(backpack)).toContainText('1');
    await expect(cart.item(bikeLight)).toContainText(bikeLight);
    await expect(cart.item(bikeLight)).toContainText('$9.99');
    await expect(cart.item(bikeLight)).toContainText('1');
    await expect(cart.cartButton).toHaveAccessibleName('Cart, 2 items');
    await expect(cart.continueShoppingButton).toBeVisible();
    await expect(cart.checkoutButton).toBeVisible();
  });

  test('Remove an item and continue shopping', async ({ page }) => {
    const inventory = await signInAndAddTwoProducts(page);
    const cart = new CartPage(page);

    // 1. Add Backpack and Bike Light, then open the cart.
    await inventory.openCart();
    await expect(cart.cartItems).toHaveCount(2);

    // 2. Remove Sauce Labs Bike Light.
    await cart.removeItem(bikeLight);
    await expect(cart.item(bikeLight)).toHaveCount(0);
    await expect(cart.item(backpack)).toHaveCount(1);
    await expect(cart.cartButton).toHaveAccessibleName('Cart, 1 items');

    // 3. Select Continue Shopping and remove Sauce Labs Backpack from the inventory.
    await cart.continueShopping();
    await expect(inventory.productsHeading).toBeVisible();
    await expect(inventory.cartButton).toHaveAccessibleName('Cart, 1 items');
    await inventory.removeProduct(backpack);
    await expect(inventory.cartButton).toHaveAccessibleName('Cart, empty');
    await expect(inventory.productCard(backpack).getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });
});