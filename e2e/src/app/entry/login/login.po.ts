import { browser, by, element } from 'protractor';
export class Dashboard{}
export class LoginPage{
  private credentias = {
    username: 'param',
    password: 'FleetHawks@1302'
  };

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  navigateToHomepage() {
    return browser.get('/Map-Dashboard') as Promise<any>;
  }  
  fillCredentials(credentias: any = this.credentias) {
    element(by.id('userName')).sendKeys(credentias.username);
    element(by.css('[name="pwd"]')).sendKeys(credentias.password);
    element(by.id('btnLogin')).click();
  }
}
 
