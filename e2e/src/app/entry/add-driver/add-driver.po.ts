import { browser, by, element, ElementFinder, ExpectedConditions, WebElementPromise } from 'protractor';

export class AddDriverPage {
    navigateToDriverList() {

        let browserModule = browser.get("#/fleet/drivers/add") as Promise<any>;

    }


    //  gotoDriverBtn() {

    //      let addDriverbtn = element(by.class('')).click();
    //      browser.wait(addDriverbtn,5000);
    //  }


    basicDetailform() {
        let textreturn = element(by.id("lblBasicDetails")); 
        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(textreturn), 7000);



    }
    credentials() {

        element(by.id("txtEmpId")).sendKeys('12345698789556');
        element(by.css('[id="sltDriverStatus"]')).click();
        element(by.css('[value="InActive"]')).click();
        element(by.id("txtUserName")).sendKeys('nameet@123');
        element(by.id("txtFname")).sendKeys('naman');
        element(by.id("txtMiddleName")).sendKeys('optional');
        element(by.id("txtLastName")).sendKeys('jambla');
        element(by.id('sltDate')).click();
        element(by.css('[name="startDate"]')).sendKeys('4/3/2021');
        element(by.id("sltTerminationDate")).click();
        element(by.css('[name="terminationDate"]')).sendKeys('9/3/2021');
        element(by.id("txtPass")).sendKeys('nameet1234');
        element(by.id("txtCnfPass")).sendKeys('nameet1234');
        browser.sleep(5000);
        element(by.id("sltCitizen")).click();
        element(by.css('[value="67924700-5fae-11eb-8615-c1ce05c59008"]'));
        browser.sleep(5000);
        //element(by.className('optional')); //optional field
        //element(by.className('ng-input'));//optional field
        //element(by.className('form-control p-0 err')).click();
        // var imgPath='C:/Users/Fleet Hawks/OneDrive/Pictures/download.jpg';
        //element(by.id("loadDoc")).sendKeys(imgPath);//file upload
        element.all(by.css('[value="F"]')).click();//radio button
        element.all(by.id("sltDob")).click();
        element.all(by.css('[name="txtDob"]')).sendKeys('4/2/2021'); 
        element.all(by.css('[name="workPhone"]')).sendKeys('896485277');
        element.all(by.css('[name="workEmail"]')).sendKeys('nameetjambla@gmail.com');
        element.all(by.id("btnSaveNext")).click(); //save & next button


    }

    addressDetailForm() {
        var label = element(by.id("lblAddressDetails")).getText();
        expect(label).toEqual('Address Details');
        element(by.css('[id="sltAddress"]')).click();//optional
        element(by.css('[value="Home"]'));//optional field
        //element(by.id("typeAddress")).sendKeys('#69,Fleet hawks office,Ludhiana');//optional field
        //element(by.id("cancelBtn")).click();//optional
        //element(by.id("prev")).click();optional 
        element.all(by.id("btnSaveNext")).click();//save & next button

    }
    documentdetailsForm() {

       var docDetail =element(by.id('lblDocumentDetail'));
       expect(docDetail).toEqual("Document Details");
       element(by.id("sltDocType")).click();//data from api

        element(by.id("dcNumber")).sendKeys("4589464");
        //element(by.model("document.issuingCountry")).click();
        //element(by.model("document.issuingState")).click();
        element(by.id('documentissueDate')).click();//drop down
        element(by.css('[class="form-control"]')).sendKeys('4/3/2021');
        element(by.id("issueExpiryDate")).click();//dropdowm
        element(by.css('[type="text"]')).sendKeys('9/3/2021');
        //let attachDocument=element(by.id("attchDoc")).sendKeys('D:\nameet Jambla Folder\fh-cloud-app\e2e\src\app\entry\add-driver');
        // let addanotherdocument=element(by.id("add-document")).sendKeys('D:\nameet Jambla Folder\fh-cloud-app\e2e\src\app\entry\add-driver');
        //let cancleBtn=element(by.id("cancelBtn")).click();//optional
        //let previousBtn=element(by.id("prev")).click();optional 
        element(by.css('[class="btn btn-success btnNext ng-star-inserted"]')).click();
    }
    crossBorder() {
        //rest all optios are optional
        element(by.css('[class="btn btn-success btnNext ng-star-inserted"]')).click();
    }
    licenceDetailsForm() {
        element(by.id('cdlnumber')).sendKeys('786595');
        element(by.id('licenceExpiryDate')).click();
        element(by.css('[name="licenceDetails.licenceExpiry"]')).sendKeys("15/3/2021")
        element(by.model("document.issuingCountry")).click();//drop downmenu
        element(by.model("document.issuingState")).click();//drop down
        element(by.css('[class="btn btn-success btnNext ng-star-inserted"]')).click();
    }
    payMentForm() {

        element(by.id("paymentTypeForm")).click();
        element(by.css('[id="percent"]')).click();
        element(by.id('loadPayPercent')).sendKeys("10");
        element(by.css('[id="freightFees"]')).click();
        element(by.id("payPeriod")).click();
        element(by.css('[id="biWeekly"]')).click();
        element(by.id("sinNumber")).sendKeys("45856212");
        element(by.css('[class="btn btn-success btnNext ng-star-inserted"]')).click();
    }
    hosCompliance() {
        element(by.id("stausHos")).click();//dropdown
        element(by.css('[id="exempted"]')).click();
        //let homeTerminal=element(by.css('[name="hosDetails.homeTerminal"]')).s;
        element(by.css('[class="btn btn-success btnNext ng-star-inserted"]')).click();
    }
    emergencyForm() {
        element(by.id("cancelBtn")).click();
        element(by.id("prev"))
        element(by.css('[class="btn btn-success btnNext ng-star-inserted"]')).click();
    }
}

