import { type Locator, type Page } from '@playwright/test';

export class CheckoutInformationPage {
  readonly heading: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly errorMessage: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Checkout: Your Information', { exact: true });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCode = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.errorMessage = page.getByRole('alert');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
