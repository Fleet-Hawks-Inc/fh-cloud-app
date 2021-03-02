
import { browser, logging } from 'protractor';
import { LoginPage } from './login.po';


describe('Login Tests', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    loginPage = new LoginPage();
  });

  it('when login is successful', () => {
    loginPage.navigateTo();
    loginPage.fillCredentials();
    loginPage.navigateToHomepage();
  });
});
