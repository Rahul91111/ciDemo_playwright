import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly acceptedUsernames: Locator;
  readonly sharedPassword: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
    this.acceptedUsernames = page.getByRole('heading', { name: 'Accepted usernames are:' }).locator('..');
    this.sharedPassword = page.getByRole('heading', { name: 'Password for all users:' }).locator('..');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submit();
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }
}
