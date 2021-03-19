import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
 export class AddAssetPage {
     navigateToAssetPage(){
        let browserModule=browser.get("#/fleet/assets/add");
     }
//--------------------------Basic details------------------//
     basicDetailsAsset(){
        element(by.id("txtAssetName")).sendKeys(6998645449);
        browser.sleep(4000);
     }
     assetDetails(){
         element(by.css('ng-select#assetType > .ng-has-value.ng-select-container input[role="combobox"]')).click();
         element(by.css('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(2)')).click();
         browser.sleep(4000);
         element(by.css('div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]')).click();
         element(by.css('.ng-dropdown-panel.ng-select-top.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(3)')).click();
         browser.sleep(4000);
         element(by.css('div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]')).click();
         element(by.css('div:nth-of-type(2) > .ng-option-label.ng-star-inserted')).click();//
         browser.sleep(4000);
         
     }
     additionalDetails(){
        var path = require('path');
        var fileToUpload = 'C:/Users/Fleet Hawks/OneDrive/Desktop',
            absolutePath = path.resolve(__dirname, fileToUpload);
        element(by.css('input[type="file"]')).sendKeys(absolutePath);
        browser.sleep(7000);
        element(by.css("txtVinNumber")).sendKeys('985555085');//vinNumber
        browser.sleep(4000);
        element(by.id('sltDateStart')).click();
        element(by.css('[name="startDate"]')).sendKeys('1/3/2021');
        browser.sleep(4000);
        element(by.css('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]')).click();
        element(by.css('div:nth-of-type(1) > .ng-option-label.ng-star-inserted')).click();//issue country
        browser.sleep(4000);
        element(by.css('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]')).click();
        element(by.css('div:nth-of-type(1) > .ng-option-label.ng-star-inserted')).click();//licence provider
        browser.sleep(4000);
        element(by.id('txtPlateNumber')).sendKeys('78121546');//plate nUmber
        browser.sleep(4000);
        element(by.id('sltSafetydate')).click();
        element(by.css('[name="assetDetails.annualSafetyDate"]')).sendKeys('3/3/2021');//safetyDate
        var path = require('path');
        var fileToUpload = 'C:/Users/Fleet Hawks/OneDrive/Pictures',
            absolutePath = path.resolve(__dirname, fileToUpload);
        element(by.css('input[type="file"]')).sendKeys(absolutePath);
        browser.sleep(7000);
        let saveNxtBtn = element(by.css('[class="col-lg-11 text-right"] #nextBtn'));
        let EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn), 15000);
        browser.actions().mouseMove(saveNxtBtn).click().perform();
        browser.sleep(10000);

     }
 }