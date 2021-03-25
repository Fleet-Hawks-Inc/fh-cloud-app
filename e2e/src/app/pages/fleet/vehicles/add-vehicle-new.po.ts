import { WSA_E_CANCELLED } from 'constants';
import { browser, by, element, ElementFinder, ExpectedConditions, WebDriver } from 'protractor';
import { WebdriverWebElement } from 'protractor/built/element';
export class AddVehiclePage {
    navigateToVehiclePage() {
        let browserModule = browser.get("#/fleet/vehicles/add");
        
    }
    basicIdentificationDetails() {


        element(by.id('txtVehicleName')).sendKeys('75896548668');//name
        element(by.css('div#details > div > div:nth-of-type(1) > div:nth-of-type(2) > div > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]')).click();

        element(by.css('[role="option"]:nth-of-type(2) .ng-star-inserted')).click();//vehicle type
        element(by.id('txtVinNumber')).sendKeys('7895641212544');//vin number

        element(by.css('#details [class="col-lg-5"]:nth-of-type(4) [role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(4) .ng-star-inserted')).click();//year

        element(by.id('txtPlateNumber')).sendKeys('Nameet@1999');//plate number

        element(by.css('#details [class="col-lg-10"]:nth-of-type(6) [role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(4) .ng-star-inserted')).click();//make

        element(by.css('#details [class="col-lg-10"]:nth-of-type(10) [role="combobox"]')).click();
        element(by.css('div:nth-of-type(2) [role="option"]:nth-of-type(1)')).click();//country

        element(by.css('#details [class="col-lg-10"]:nth-of-type(11) [role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(3) .ng-star-inserted')).click();//state

        // element(by.css('ng-select#main_driver > .ng-has-value.ng-select-container input[role="combobox"]')).click();
        // element(by.css('div:nth-of-type(2) [role="option"]:nth-of-type(1)')).click();//assign driver(optional)

        // element(by.css('ng-select#team_driver > .ng-has-value.ng-select-container input[role="combobox"]')).click();
        // element(by.css('[role="option"]:nth-of-type(1) .ng-star-inserted')).click();//Driver team(optional)

        element(by.css('div#details > div > div:nth-of-type(2) > div:nth-of-type(2) ng-select[role="listbox"] input[role="combobox"]')).click();
        element(by.css('div:nth-of-type(2) [role="option"]:nth-of-type(1)')).click();//service Program(optional)

        // element(by.css('div#details > div > div:nth-of-type(2) input[name="annualSafetyDate"]')).click();
        // element(by.css('')).sendKeys()// discuss with gaurav paji

        element(by.css('div#details > div > div:nth-of-type(3) > div:nth-of-type(2) > .row > div:nth-of-type(1) > ng-select[role="listbox"] > .ng-has-value.ng-select-container')).click();
        element(by.css('[role="option"]:nth-of-type(3) .ng-star-inserted')).click();//status(optional)

        element(by.css('div:nth-of-type(3) > div:nth-of-type(3) ng-select[role="listbox"] input[role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(3) .ng-star-inserted')).click();//ownership(optional)

        element(by.css('div:nth-of-type(3) > div:nth-of-type(2) > div > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(2) .ng-star-inserted')).click();//group(optional)


        element(by.css('input[name="iftaReporting"]')).click();//enable IFTA reporting

        element(by.id('txtVehicleColor')).sendKeys('Golden');


        var path = require('path');
        var photoToUpload = 'D:/FleetHawks/fh-cloud-app/e2e/src/app/pages/fleet/assets/add-assets/load1.pdf',
            absolutePath = path.resolve(__dirname, photoToUpload);
        element(by.css('input[type="file"]')).sendKeys(absolutePath);


        element(by.css('.btn.btn-success.mt-4.ng-star-inserted')).click();

    }

    lifeCycle() {
        this.waitForElement(element(by.css('ul#top-tabs > li:nth-of-type(2) > .nav-link')), 3000).click()//label lifecyle button

        //element(by.css('div:nth-of-type(1) > div:nth-of-type(3) input[name="lifeCycle.inServiceOdometer"]')).click();
        element(by.id('txtOdoMeter')).sendKeys('7896');

        element(by.id('txtserviceLife')).sendKeys('5');//service life in years

        element(by.id('txtServiceLifeMonth')).sendKeys('10');//service life in month

        element(by.id('txtServiceLifeMile')).sendKeys('10000');//service life in mile

        element(by.id('txtOosOdoometer')).sendKeys('205896');//out-of-service-ododmeter

        element(by.css('.btn.btn-success.mt-4.ng-star-inserted')).click();//save btn



    }
    specification() {
        element(by.css('[class="p-2"] .nav-item:nth-of-type(3) [href]')).click();//spec-label

        element(by.id('txtHeight')).sendKeys('45');//height


        element(by.css('#specifications [class="col-lg-5 offset-lg-1"]:nth-of-type(2) [role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(2) .ng-option-label')).click();//type of height


        element(by.id('txtTareWeight')).sendKeys('4500');//tare weight(optional)

        element(by.id('txtgroundClearence')).sendKeys('5500');//ground clearence(optional)

        element(by.css('div#specifications > div > div:nth-of-type(1) > div:nth-of-type(3) > .row > .col-lg-5 ng-select[role="listbox"] input[role="combobox"]')).click();//optional ground

        element(by.css('[role="option"]:nth-of-type(1) .ng-option-label')).click();//optional ground

        element(by.id('txtGrossVehicleRating')).sendKeys('86094');//grossVehicleRating(optional)


        element(by.css('[class="col-lg-12 pr-5 text-right pb-4"] a')).click();//next btn
    }
    insuranceForm() {

        element(by.css('[class="p-2"] .nav-item:nth-of-type(4) [href]')).click();//label

        //<----------------------------------All Fields are Optional---------------------------------------------------------->

        element(by.css('[class="col-lg-12 pr-5 text-right pb-4"] a')).click();//next btn

    }
    fluidsForm() {
        element(by.css('[class="p-2"] .nav-item:nth-of-type(5) [href]')).click();//Label

        element(by.css('#fluids [class="row pt-3"]:nth-of-type(1) [class="col-lg-5 offset-lg-1"]:nth-of-type(2) [role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(2) .ng-option-label')).click();//fuel type


        element(by.id('txtFueltank1')).sendKeys('150');//fuel tank 1
        element(by.css('#fluids [class="row pt-3"]:nth-of-type(1) [class="col-lg-5 offset-lg-1"]:nth-of-type(3) [class="col-lg-10"]:nth-of-type(1) [role="combobox"]')).click();
        element(by.css('div:nth-of-type(2) [role="option"]:nth-of-type(1)')).click();//tank type

        element(by.id('txtFueltank2')).sendKeys('250');//fuel tank 2
        element(by.css('div#fluids > div > div:nth-of-type(1) > div:nth-of-type(3) > .row > div:nth-of-type(2) ng-select[role="listbox"] input[role="combobox"]')).click();
        element(by.css('[role="option"]:nth-of-type(1) .ng-option-label')).click();//tank type

        element(by.id('txtOil')).sendKeys('8962');//oil capacity
        element(by.css('#fluids [class="row pt-3"]:nth-of-type(2) [class="col-lg-5 offset-lg-1"]:nth-of-type(2) .ng-select-container')).click();
        element(by.css('div:nth-of-type(2) [role="option"]:nth-of-type(2)')).click();//oil capacity type


        element(by.id('txtDefCapacity')).sendKeys('750');
        element(by.css('div#fluids > div > div:nth-of-type(2) > div:nth-of-type(3) > .row ng-select[role="listbox"] .ng-input')).click();
        element(by.css('[role="option"]:nth-of-type(2) .ng-option-label')).click();//DEF capacity


        element(by.css('[class="col-lg-12 pr-5 text-right pb-4"] a')).click();//savetxt
    }
    wheelsTyres() {
        element(by.css('ul#top-tabs > li:nth-of-type(6) > .nav-link')).click();//label

        //<----------------------------------All Fields are Optional---------------------------------------------------------->

        element(by.css('[class="col-lg-12 pr-5 text-right pb-4"] a')).click();//savetxt
    }
    engineTransmission(){
        element(by.css('ul#top-tabs > li:nth-of-type(7) > .nav-link')).click();//label
          
        //<----------------------------------All Fields are Optional---------------------------------------------------------->

        element(by.css('[class="col-lg-12 pr-5 text-right pb-4"] a')).click();//savetxt

    }
    purchaseForm(){
        element(by.css('ul#top-tabs > li:nth-of-type(8) > .nav-link')).click();//label

        //<----------------------------------All Fields are Optional---------------------------------------------------------->
         
        element(by.css('[class="col-lg-12 pr-5 text-right pb-4"] a')).click();//savetxt


    }
    loanForm(){
        element(by.css('ul#top-tabs > li:nth-of-type(9) > .nav-link')).click();

        //<----------------------------------All Fields are Optional---------------------------------------------------------->

        element(by.css('[class="col-lg-12 pr-5 text-right pb-4"] a')).click();//Save Form

    }


    private waitForElement(element: any, time = 100000): ElementFinder {

        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(element), time);
        return element;

    }
}