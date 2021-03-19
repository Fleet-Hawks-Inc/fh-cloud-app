import { browser, by, element, ElementFinder, ExpectedConditions, WebElementPromise } from 'protractor';
declare var $: any;
export class AddDriverPage {
    navigateToDriverList() {

        let browserModule = browser.get("#/fleet/drivers/add") as Promise<any>;

    }


    //  gotoDriverBtn() {

    //      let addDriverbtn = element(by.class('')).click();
    //      browser.wait(addDriverbtn,5000);
    //  }


    basicDetailform() {
        let textreturn = element(by.css('ul#driver-tabs > li:nth-of-type(1) > .nav-link'));
        expect(textreturn).toEqual('Basic Details');
    }
    credentials() {
        element(by.id("txtEmpId")).sendKeys('12345698789556');
        element(by.css('#sltDriverStatus .ng-arrow-wrapper')).click();
        element(by.css('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(1)')).click();
        element(by.id("txtUserName")).sendKeys('nameet@123');;
        element(by.id("txtFname")).sendKeys("naman");
        element(by.id("txtMiddleName")).sendKeys("optional");
        element(by.id("txtLastName")).sendKeys("jambla");
        element(by.id("sltDate")).click();
        element(by.css('[name="startDate"]')).sendKeys('4/3/2021');
        // element(by.id("sltTerminationDate")).click();
        // element(by.css('[name="terminationDate"]')).sendKeys('9/3/2021');
        element(by.id("txtPass")).sendKeys('nameet1234');
        this.waitForElement(element(by.id("txtCnfPass")), 3000).sendKeys('nameet1234');
        element(by.id("sltCitizen")).click();
        this.waitForElement(element(by.css('[role="option"]:nth-of-type(4) .ng-star-inserted')), 3000).click();
        //element(by.className('optional')); //optional field
        //element(by.className('ng-input'));//optional field
        //element(by.className('form-control p-0 err')).click();
        var path = require('path');
        var fileToUpload = 'C:/Users/Fleet Hawks/OneDrive/Desktop/method.txt',
            absolutePath = path.resolve(__dirname, fileToUpload);
        this.waitForElement(element(by.css('input[type="file"]')), 5000).sendKeys(absolutePath);
        // element.all(by.css('input#driver_female')).click();//radio button[role] [role='row']:nth-of-type(4) [role='gridcell']:nth-of-type(2) .ng-star-inserted
        //browser.sleep(3000);
        element.all(by.id("sltDob")).click();
        element.all(by.css('[name="txtDob"]')).sendKeys('4/2/2021');
        element(by.css('[name="workPhone"]')).sendKeys('8968831488');
        element(by.id('txtWorkMail')).sendKeys('testjambla.11709303@gmail.com');
        browser.sleep(5000);
        let saveNxtBtn = element(by.css('form#driverForm .btn.btn-success.btnNext.ng-star-inserted'));
        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn), 12000);
        browser.actions().mouseMove(saveNxtBtn).click().perform();

    }
    addressDetailForm() {
        this.waitForElement(element(by.css('ul#driver-tabs > li:nth-of-type(2) > .nav-link')), 3000).click();//label
        this.waitForElement(element(by.css('ng-select#sltAddress > .ng-select-container input[role="combobox"]')),2000).click();//optional
        element(by.css('.ng-dropdown-panel-items [ng-reflect-ng-item-label="Maiing Address"]')).click();//optional field
        element(by.css('[class="form-group row border-bottom-0"] [placeholder="Type Address"]')).sendKeys('69,Fleet hawks office,Ludhiana');//optional field
        let saveNxtBtn1 = element(by.css('form#driverForm .btn.btn-success.btnNext.ng-star-inserted'));
        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn1), 12000);
        browser.actions().mouseMove(saveNxtBtn1).click().perform();
        // element(by.id("cancelBtn")).click();//optional
        // element(by.id("prev")).click();optional 

    }
    documentdetailsForm() {

        this.waitForElement(element(by.css('ul#driver-tabs > li:nth-of-type(3) > .nav-link')), 4000).click();
        element(by.id('sltDocType')).click();
        element(by.css('[role="option"]:nth-of-type(1) .ng-star-inserted')).click();//slect documen
        this.waitForElement(element(by.id('sltIssuingCountry')), 3000).click();
        element(by.css('div:nth-of-type(226) > .ng-option-label.ng-star-inserted')).click();//issue country
        element(by.id("sltIssueState")).click();
        this.waitForElement(element(by.css('div:nth-of-type(2) > .ng-option-label.ng-star-inserted')), 3000).click();//issue state
        var path = require('path');
        let docToUpload = 'C:/Users/Fleet Hawks/OneDrive/Desktop/method.txt',
            absolutePath = path.resolve(__dirname, docToUpload);
        element(by.css('input[id="attachDocFile"]')).sendKeys(absolutePath);
        element(by.id('txtDocumentNumber')).sendKeys("4589464");
        element(by.id('sltIssueDate')).click();
        this.waitForElement(element(by.css('[class="form-control"]')), 5000).sendKeys('9/3/2021');//issue Date
        element(by.id("sltdateExpiry")).click();
        this.waitForElement(element(by.css('[class="form-control"]')), 5000).sendKeys('31/3/2021');//expiry date
        let saveNxtBtn2 = element(by.css('form#driverForm .btn.btn-success.btnNext.ng-star-inserted'));

        let EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn2), 12000);
        browser.actions().mouseMove(saveNxtBtn2).click().perform();

        //element(by.id("issueExpiryDate")).click();
        //element(by.css('[type="text"]')).sendKeys('9/3/2021');
        //let cancleBtn=element(by.id("cancelBtn")).click();//optional
        //let previousBtn=element(by.id("prev")).click();optional 

    }
    crossBorder() {
        //rest all optios are optional
        element(by.css('ul#driver-tabs > li:nth-of-type(4) > .nav-link')).click();
        let saveNxtBtn3 = element(by.css('form#driverForm .btn.btn-success.btnNext.ng-star-inserted'));
        let EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn3), 12000);
        browser.actions().mouseMove(saveNxtBtn3).click().perform();

    }
    licenceDetailsForm() {
     element(by.css('ul#driver-tabs > li:nth-of-type(5) > .nav-link')).click();
        element(by.id('txtCdl')).sendKeys('786595');
        element(by.id('sltlicenseExpiry')).click();
        this.waitForElement(element(by.css('[name="licenceDetails.licenceExpiry"]')),4000).sendKeys('24/3/21');
       
        element(by.css('[class] #licence [class="col-lg-5"]:nth-of-type(1) [role="combobox"]')).click();
        this.waitForElement(element(by.css('div:nth-of-type(2) > .ng-option-label.ng-star-inserted')),4000).click();//issue country
       
        element(by.css('[class] #licence [class="col-lg-5"]:nth-of-type(2) [role="combobox"]')).click();
       this.waitForElement(element(by.css('div:nth-of-type(6) > .ng-option-label.ng-star-inserted')),4000).click();//issue state
     
        let saveNxtBtn4 = element(by.css('form#driverForm .btn.btn-success.btnNext.ng-star-inserted'));
        let EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn4), 12000);
        browser.actions().mouseMove(saveNxtBtn4).click().perform();


    }
    payMentForm() {
         element(by.css('ul#driver-tabs > li:nth-of-type(6) > .nav-link')).click();

        
        element(by.css('[class] #payment [class="col-lg-5 offset-lg-1"]:nth-of-type(2) [role="combobox"]')).click();
        this.waitForElement(element(by.css('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(2)')),4000).click();//paymentType
    
        element(by.id('txtSinNumber')).sendKeys('896883148');//sin Number
        
        element(by.id('inputTxtPercentage')).sendKeys('6');//load percent
        
        element(by.css('#payPercentageForm [role="combobox"]')).click();
        element(by.css('div:nth-of-type(2) > .ng-option-label.ng-star-inserted')).click();//of
        
        element(by.css('.form-group.row > div:nth-of-type(3) > div:nth-of-type(2) > .row  ng-select[role="listbox"] input[role="combobox"]')).click();
        this.waitForElement(element(by.css('div:nth-of-type(2) > .ng-option-label.ng-star-inserted')),4000).click();//payPeriod
        
        let saveNxtBtn5 = element(by.css('form#driverForm .btn.btn-success.btnNext.ng-star-inserted'));
        let EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn5), 12000);
        browser.actions().mouseMove(saveNxtBtn5).click().perform();

    }
    hosCompliance() {
       element(by.css('ul#driver-tabs > li:nth-of-type(7) > .nav-link')).click();

        element(by.css('[class] #Driverhos [class="col-lg-5 offset-lg-1"]:nth-of-type(2) [role="combobox"]')).click();
        element(by.css('div:nth-of-type(2) > .ng-option-label.ng-star-inserted')).click();//status
        browser.sleep(4000);
        element(by.css('[class] [class="col-lg-10"]:nth-of-type(2) [role="combobox"]')).click();
        element(by.css('div[role="option"]  div')).click();//home terminal
        let saveNxtBtn6 = element(by.css('form#driverForm .btn.btn-success.btnNext.ng-star-inserted'));
        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn6), 12000);
        browser.actions().mouseMove(saveNxtBtn6).click().perform();

    }
    emergencyForm() {
        element(by.css('ul#driver-tabs > li:nth-of-type(8) > .nav-link')).click();
        
        let saveNxtBtn7 = element(by.css('form#driverForm .btn.btn-success.btnNext.ng-star-inserted'));
        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(saveNxtBtn7), 12000);
        browser.actions().mouseMove(saveNxtBtn7).click().perform();

        // element(by.id("prev"))
        // element(by.css('[class="btn btn-success btnNext ng-star-inserted"]')).click();
    }
    private waitForElement(element: any, time = 100000): ElementFinder {

        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(element), time);
        return element;

    }
}

