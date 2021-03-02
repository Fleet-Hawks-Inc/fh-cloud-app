import { browser, by, element } from 'protractor';
export class LoginPage{
  private credentias = {
    username: 'e2etestcarrier',
    password: 'FleetHawks@2502'
  };

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  navigateToHomepage() {
    return browser.get('/Map-Dashboard') as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
  
  fillCredentials(credentias: any = this.credentias) {
    element(by.css('[name="username"]')).sendKeys(credentias.username);
    element(by.css('[name="pwd"]')).sendKeys(credentias.password);
    element(by.css('[href="#/onboard"]')).click();
  }
}
 
