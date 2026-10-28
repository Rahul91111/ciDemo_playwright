import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test.describe('Sign in', () => {
  test('Sign in with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    // 1. Open https://www.saucedemo.com in a fresh browser context.
    await login.goto();
    await expect(login.usernameInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.loginButton).toBeVisible();
    await expect(login.acceptedUsernames).toContainText('standard_user');
    await expect(login.sharedPassword).toContainText('secret_sauce');

    // 2. Enter standard_user and secret_sauce, then select Login.
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.productsHeading).toBeVisible();
    await expect(inventory.productCards).toHaveCount(6);
    await expect(inventory.sortSelect).toBeVisible();
    await expect(inventory.cartButton).toHaveAccessibleName('Cart, empty');
  });

  test('Reject invalid credentials and allow correction', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    // 1. Enter standard_user with an incorrect password and submit the login form.
    await login.goto();
    await login.login('standard_user', 'wrong_password');
    await expect(page).toHaveURL(/\/$/);
    await expect(login.errorMessage).toBeVisible();

    // 2. Replace the password with secret_sauce and submit again.
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.productsHeading).toBeVisible();
    await expect(login.errorMessage).toHaveCount(0);
  });

  test('Reject a locked-out account', async ({ page }) => {
    const login = new LoginPage(page);

    // 1. Enter locked_out_user and secret_sauce on a fresh login page.
    await login.goto();
    await login.login('locked_out_user', 'secret_sauce');
    await expect(login.errorMessage).toContainText(/locked out/i);
    await expect(page).toHaveURL(/\/$/);
  });

  test('Validate required login fields', async ({ page }) => {
    const login = new LoginPage(page);

    // 1. Select Login without entering either field.
    await login.goto();
    await login.submit();
    await expect(login.errorMessage).toContainText(/username is required/i);

    // 2. Enter standard_user, leave the password blank, and select Login.
    await login.usernameInput.fill('standard_user');
    await login.submit();
    await expect(login.errorMessage).toContainText(/password is required/i);
  });
});