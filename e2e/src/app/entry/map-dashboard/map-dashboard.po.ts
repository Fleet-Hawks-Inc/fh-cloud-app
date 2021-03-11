import { browser, by, element, ExpectedConditions } from 'protractor';
export class MapDashBoardPage {



    navigateToDashBoard() {
        return browser.get('#/Map-Dashboard') as Promise<any>;
    }

    getTitleText() {
        
        let titleText = element(by.id("textDashboard"));
        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(titleText), 10000);
        return titleText.getText();
       
       
       
        // // Waits for the element with id 'abc' to be visible on the dom.
        //console.log('before time',4000);
        setInterval(function(){
            titleText
        },5000);
        //
        //console.log('passed time',6000);
        //return titletext.getText();
        

    }

}

