import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly productsHeading: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productDescriptions: Locator;
  readonly productImages: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;
  readonly sortSelect: Locator;
  readonly cartButton: Locator;
  readonly menuButton: Locator;

  constructor(private readonly page: Page) {
    this.productsHeading = page.getByText('Products', { exact: true });
    this.productCards = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productDescriptions = page.locator('.inventory_item_desc');
    this.productImages = page.locator('.inventory_item_img img');
    this.productPrices = page.locator('.inventory_item_price');
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    this.sortSelect = page.getByRole('combobox', { name: 'Sort products' });
    this.cartButton = page.getByRole('button', { name: /^Cart/ });
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
  }

  productCard(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  async addProduct(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProduct(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Remove' }).click();
  }

  async openProduct(name: string): Promise<void> {
    await this.productCard(name)
      .getByRole('button', { name: `View details for ${name}`, exact: true })
      .first()
      .click();
  }

  async sortBy(label: string): Promise<void> {
    const values: Record<string, string> = {
      'Name (A to Z)': 'az',
      'Name (Z to A)': 'za',
      'Price (low to high)': 'lohi',
      'Price (high to low)': 'hilo',
    };
    const value = values[label];
    if (!value) throw new Error(`Unsupported inventory sort option: ${label}`);
    await this.sortSelect.selectOption(value);
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }
}
