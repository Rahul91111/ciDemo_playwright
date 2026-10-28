import { type Locator, type Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly detailsContainer: Locator;
  readonly productName: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly backToProductsButton: Locator;
  readonly cartButton: Locator;

  constructor(private readonly page: Page) {
    this.detailsContainer = page.locator('div.inventory_details');
    this.productName = this.detailsContainer.getByText('Sauce Labs Backpack', { exact: true });
    this.description = this.detailsContainer.getByText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
    this.price = this.detailsContainer.getByText('$29.99', { exact: true });
    this.addToCartButton = this.detailsContainer.getByRole('button', { name: 'Add to cart' });
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
    this.cartButton = page.getByRole('button', { name: /^Cart/ });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
