import { browser, by, element, ElementFinder, ExpectedConditions, WebDriver } from 'protractor';
import { WebdriverWebElement } from 'protractor/built/element';
 export class AddAssetPage {
     navigateToAssetPage(){
        let browserModule=browser.get("#/fleet/assets/add");
     }
//--------------------------Basic details------------------//
     basicDetailsAsset(){

        element(by.id('txtAssetName')).sendKeys(6998645449);//assetName
        element(by.css('ng-select#assetType > .ng-has-value.ng-select-container input[role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(2) .ng-star-inserted')).click();//asset Type
        
        element(by.css('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]')).click();
        element(by.css('div:nth-of-type(2) [role="option"]:nth-of-type(3)')).click();//year
        ~
        element(by.css('[class] [class="col-lg-5 offset-lg-1"]:nth-of-type(2) [class="row mt-2"]:nth-of-type(2) [class="col-lg-5"]:nth-of-type(2) [role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(2) .ng-star-inserted')).click();//status
       var path=require('path');
        var photoToUpload = 'D:/FleetHawks/fh-cloud-app/e2e/src/app/pages/fleet/assets/add-assets/load1.pdf',
            absolutePath = path.resolve(__dirname, photoToUpload);
        element(by.css('input[type="file"]')).sendKeys(absolutePath);

        element(by.id("txtVinNumber")).sendKeys('985555085');//vinNumber
        
        element(by.id('sltDateStart')).click();
        element(by.css('[name="startDate"]')).sendKeys('2021/3/3');//start date
        
        
        element(by.css('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]')).click();
       
        element(by.css('div:nth-of-type(1) > .ng-option-label.ng-star-inserted')).click();//issue country
      
        element(by.css('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]')).click();
        browser.sleep(4000);
        element(by.css('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(1)')).click();//licence provider
        var path = require('path');
        
       element(by.id('txtPlateNumber')).sendKeys('78121546');//plate nUmber
        element(by.id('sltSafetydate')).click();
        element(by.css('[name="assetDetails.annualSafetyDate"]')).sendKeys('3/3/2021');//safetyDate
        // var path = require('path');
        // var fileToUpload = 'C:/Users/Fleet Hawks/OneDrive/Pictures/Eld_meeting.txt',
        //     absolutePath = path.resolve(__dirname, fileToUpload);
        // element(by.css('input[type="file"]')).sendKeys(absolutePath);
        // browser.sleep(7000);
    //    element(by.css('a#nextBtn')).click();
       
        
    

}
private waitForElement(element: any, time = 100000): ElementFinder {

    var EC = ExpectedConditions;
    browser.wait(EC.visibilityOf(element), time);
    return element;

}
 }