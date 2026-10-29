import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly heading: Locator;
  readonly cartItems: Locator;
  readonly cartButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Your Cart', { exact: true });
    this.cartItems = page.locator('.cart_item');
    this.cartButton = page.getByRole('button', { name: /^Cart/ });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  item(name: string): Locator {
    return this.cartItems.filter({ hasText: name });
  }

  async removeItem(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
