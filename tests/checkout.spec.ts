import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutInformationPage } from './pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from './pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from './pages/CheckoutCompletePage';

const backpack = 'Sauce Labs Backpack';

async function openCheckout(page: import('@playwright/test').Page): Promise<{ inventory: InventoryPage; cart: CartPage; information: CheckoutInformationPage }> {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const information = new CheckoutInformationPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await inventory.addProduct(backpack);
  await inventory.openCart();
  await cart.checkout();
  return { inventory, cart, information };
}

test.describe('Complete checkout', () => {
  test('Complete a valid order and verify confirmation', async ({ page }) => {
    const { inventory, information } = await openCheckout(page);
    const overview = new CheckoutOverviewPage(page);
    const complete = new CheckoutCompletePage(page);

    // 1. Sign in, add Sauce Labs Backpack, open the cart, and select Checkout.
    await expect(information.heading).toBeVisible();
    await expect(information.firstName).toBeVisible();
    await expect(information.lastName).toBeVisible();
    await expect(information.postalCode).toBeVisible();
    await expect(information.cancelButton).toBeVisible();
    await expect(information.continueButton).toBeVisible();

    // 2. Enter Taylor, Tester, and 12345, then select Continue.
    await information.fillInformation('Taylor', 'Tester', '12345');
    await information.continue();
    await expect(overview.heading).toBeVisible();
    await expect(overview.summaryItems).toContainText(backpack);
    await expect(overview.itemTotal).toHaveText('Item total: $29.99');
    await expect(overview.tax).toHaveText('Tax: $2.40');
    await expect(overview.total).toHaveText('Total: $32.39');

    // 3. Select Finish.
    await overview.finish();
    await expect(complete.heading).toBeVisible();
    await expect(complete.dispatchMessage).toBeVisible();
    await expect(complete.cartButton).toHaveAccessibleName('Cart, empty');

    // 4. Select Back Home.
    await complete.backHome();
    await expect(inventory.productsHeading).toBeVisible();
    await expect(inventory.cartButton).toHaveAccessibleName('Cart, empty');
  });

  test('Validate required checkout fields', async ({ page }) => {
    const { information } = await openCheckout(page);

    // 1. Open checkout information and leave all three fields blank.
    await expect(information.heading).toBeVisible();

    // 2. Select Continue without entering information.
    await information.continue();
    await expect(information.errorMessage).toContainText(/First Name is required/);
    await expect(page).toHaveURL(/checkout-step-one\.html$/);

    // 3. Enter only a first name and select Continue.
    await information.firstName.fill('Taylor');
    await information.continue();
    await expect(information.errorMessage).toContainText(/Last Name is required/);

    // 4. Enter a last name but leave Zip/Postal Code blank, then select Continue.
    await information.lastName.fill('Tester');
    await information.continue();
    await expect(information.errorMessage).toContainText(/Postal Code is required/);
  });

  test('Cancel checkout without placing an order', async ({ page }) => {
    const { cart, information } = await openCheckout(page);

    // 1. Start checkout for a product and select Cancel on the information form.
    await expect(information.heading).toBeVisible();
    await information.cancel();

    // Verify that the order was not placed and the cart item was preserved.
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(cart.cartItems).toHaveCount(1);
    await expect(cart.item(backpack)).toContainText(backpack);
  });
});