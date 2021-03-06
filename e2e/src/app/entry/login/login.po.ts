<<<<<<< HEAD:e2e/src/app/entry/login/login.po.ts
import { browser, by, element } from 'protractor';
export class Dashboard{}
export class LoginPage{
=======
import { browser, by, element, ExpectedConditions } from 'protractor';
import { Auth } from 'aws-amplify';

export class LoginPage {
>>>>>>> f98f9d1e876f85f59a99a8d99ecb10700b47df69:e2e/src/app/entry/onboard/login/login.po.ts
  private credentias = {
    username: 'param',
    password: 'FleetHawks@1302'
  };

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  navigateToHomepage() {
<<<<<<< HEAD:e2e/src/app/entry/login/login.po.ts
    return browser.get('/Map-Dashboard') as Promise<any>;
  }  
  fillCredentials(credentias: any = this.credentias) {
    element(by.css('[name="username"]')).sendKeys(credentias.username);
    element(by.css('[name="pwd"]')).sendKeys(credentias.password);
    element(by.id('btnLogin')).click();
=======
    return browser.get('#/Map-Dashboard') as Promise<any>;
  }

  getTitleText() {
    return element(by.id('loginTitle')).getText() as Promise<string>;
  }

  fillCredentials(credentias: any = this.credentias) {
    element(by.css('[name="username"]')).sendKeys(credentias.username);
    element(by.css('[name="pwd"]')).sendKeys(credentias.password);
    element(by.id("btnsubmit")).click();
  }

  logout() {
    let profileBtn = element(by.className('fa custom-caret'));
    var EC = ExpectedConditions;
    // // Waits for the element with id 'abc' to be visible on the dom.
    browser.wait(EC.visibilityOf(profileBtn), 10000);
    browser.actions().mouseMove(profileBtn).click().perform();
    
    let logoutBtn = element(by.id('lnkLogout'));
    browser.wait(EC.visibilityOf(logoutBtn), 10000);
    browser.actions().mouseMove(logoutBtn).click().perform();


>>>>>>> f98f9d1e876f85f59a99a8d99ecb10700b47df69:e2e/src/app/entry/onboard/login/login.po.ts
  }
}







