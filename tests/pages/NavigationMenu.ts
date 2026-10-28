import { type Locator, type Page } from '@playwright/test';

export class NavigationMenu {
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;
  readonly dynamicCatalogLink: Locator;
  readonly aboutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly closeMenuControl: Locator;

  constructor(private readonly page: Page) {
    this.logoutLink = page.getByRole('button', { name: 'Logout' });
    this.allItemsLink = page.getByRole('button', { name: 'All Items' });
    this.dynamicCatalogLink = page.getByRole('button', { name: 'Dynamic Catalog' });
    this.aboutLink = page.getByRole('link', { name: 'About' });
    this.resetAppStateLink = page.getByRole('button', { name: 'Reset App State' });
    this.closeMenuControl = page.getByText('Close Menu', { exact: true });
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
