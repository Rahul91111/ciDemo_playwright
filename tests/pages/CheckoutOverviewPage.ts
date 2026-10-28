import { type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly heading: Locator;
  readonly summaryItems: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Checkout: Overview', { exact: true });
    this.summaryItems = page.locator('.cart_item');
    this.itemTotal = page.getByText(/^Item total:/);
    this.tax = page.getByText(/^Tax:/);
    this.total = page.getByText(/^Total:/);
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
