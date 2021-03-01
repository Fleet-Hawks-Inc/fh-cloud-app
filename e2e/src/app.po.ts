import { browser, by, element } from 'protractor';
export class AppPage {
  private credentias = {
    username: '',
    password: 'FleetHawks@1302'
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
 
