import { browser, by, element, ExpectedConditions } from 'protractor';
import { Auth } from 'aws-amplify';

export class LoginPage {
  private credentias = {
    username: 'hardeepcloud',
    password: 'FleetHawks@1302'
  };

  navigateTo() {
    //browser.ignoreSynchronization=true;
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  navigateToHomepage() {
    return browser.get('#/Map-Dashboard') as Promise<any>;
  }

  getTitleText() {
    return element(by.id('loginTitle')).getText() as Promise<string>;
  }

  fillCredentials(credentias: any = this.credentias) {
    element(by.css('[name="username"]')).sendKeys(credentias.username);
    element(by.css('[name="pwd"]')).sendKeys(credentias.password);
    element(by.id("btnsubmit")).click();
    //browser.ignoreSynchronization=true;
    
  }

  // logout() {
  //   let profileBtn = element(by.className('fa custom-caret'));
  //   var EC = ExpectedConditions;
  //   //   // // Waits for the element with id 'abc' to be visible on the dom.
  //   browser.wait(EC.visibilityOf(profileBtn), 10000);
  //   browser.actions().mouseMove(profileBtn).click().perform();

  //   let logoutBtn = element(by.id('lnkLogout'));
  //   browser.wait(EC.visibilityOf(logoutBtn), 10000);
  //   browser.actions().mouseMove(logoutBtn).click().perform();


  // }
}

