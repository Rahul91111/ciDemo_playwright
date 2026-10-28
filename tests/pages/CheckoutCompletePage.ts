import { type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly heading: Locator;
  readonly dispatchMessage: Locator;
  readonly cartButton: Locator;
  readonly backHomeButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.dispatchMessage = page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    this.cartButton = page.getByRole('button', { name: /^Cart/ });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
