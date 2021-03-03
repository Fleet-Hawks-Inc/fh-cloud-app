
import { MapDashBoardPage } from 'e2e/src/map-dashboard/map-dashboard.po';
import { browser, logging } from 'protractor';
import { LoginPage } from './login.po';


describe('Login/Logout Tests', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    loginPage = new LoginPage();
  });

  // it('when login is successful', () => {
  //   loginPage.navigateTo();
  //   loginPage.fillCredentials();
  //   loginPage.navigateToHomepage();
  // });
  it('when user clicks logout , app logs out successfully', () => {

    loginPage.navigateTo();
    loginPage.fillCredentials();
    loginPage.navigateToHomepage();
    loginPage.logout();
    let logintext =loginPage.getTitleText();
    expect(logintext).toEqual('LOGIN');
      
  });
});

