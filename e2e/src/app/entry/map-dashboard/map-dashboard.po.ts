import { browser, by, element, ExpectedConditions } from 'protractor';
export class MapDashBoardPage {



    navigateToDashBoard() {
        return browser.get('#/Map-Dashboard') as Promise<any>;
    }

    getTitleText() {
        let titleText = element(by.id('txtdashboard'));
        var EC = ExpectedConditions;
        // // Waits for the element with id 'abc' to be visible on the dom.
        browser.wait(EC.visibilityOf(titleText), 10000);
        //return titletext.getText();
        return titleText.getText();

    }

}

