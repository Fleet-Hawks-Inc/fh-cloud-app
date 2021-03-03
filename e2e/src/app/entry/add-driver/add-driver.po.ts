import { browser, by, element, ExpectedConditions } from 'protractor';
import { __values } from 'tslib';
export class AddDriverPage {
public data={

}


    navigateToAddDriverPage() {
        return browser.get('#/fleet/drivers/add') as Promise<any>;
    }

    getTitleText() {
        let titleText = element(by.id("Add Driver"));
        var EC = ExpectedConditions;
        // // Waits for the element with id 'abc' to be visible on the dom.
        browser.wait(EC.visibilityOf(titleText), 10000);
        //return titletext.getText();
        return titleText.getText();



    }
    basicDetailform() {
        let textreturn = element(by.id("basic details"));
        var EC = ExpectedConditions;
        // // Waits for the element with id 'abc' to be visible on the dom.
        browser.wait(EC.visibilityOf(textreturn), 10000);
        //return titletext.getText();
        return textreturn.getText();

    }
    getcredentials() {
        let employeeid = element(by.id("empid")).sendKeys('1234');
        let status=  element(by.model('driverData.driverStatus')).click(); //doubt ask from kunal sir
        let uname = element(by.id("uname")).sendKeys('nameet@123');
        let firstN = element(by.id("fname")).sendKeys('naman');
        let middleN = element(by.id("middleN")).sendKeys('optional');
        let lastN = element(by.id("lastN")).sendKeys('jambla');
        let startD=element(by.id("startdate")).sendKeys('4/3/2021');
        let terminationD=element(by.id("termin")).sendKeys('9/3/2021');
        let password = element(by.id("pass")).sendKeys('nameet1234');
        let cnfrmpass = element(by.id("cnfrm")).sendKeys('nameet1234');
        let returnbtn= element(by.id('save&btn')).click();
    }

}

