import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

export class AddDriverPage {
    navigateToDriverPage() {
    
        return browser.get(`${browser.baseUrl}#/fleet/drivers/list`) as Promise<any>;
    }
    clickAddDriverBtn() {
        var EC = ExpectedConditions;
        let addDriverbtn=element(by.id("btnAddDriver"));
        
        // // Waits for the element with id 'abc' to be visible on the dom.
        browser.wait(EC.visibilityOf(addDriverbtn), 10000);
        browser.actions().mouseMove(addDriverbtn).click().perform();

    
    }

    getTitleText() {
        let titleText = element(by.id("Add Driver"));
        var EC = ExpectedConditions;
        // // Waits for the element with id 'abc' to be visible on the dom.
        browser.wait(EC.visibilityOf(titleText), 3000);
        browser.actions().mouseMove(titleText).click().perform();



    }
    basicDetailform() {
        let textreturn = element(by.id("basic details"));
        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(textreturn), 3000);
        browser.actions().mouseMove(textreturn).click().perform();


    }
    credentials() {
        let driverType = element(by.id("employe")).click();
        let employeeid = element(by.id("empid")).sendKeys('12345698789556');
        let status = element(by.model("statusdriver")).click();//drop down menu
        let uname = element(by.id("uname")).sendKeys('nameet@123');
        let firstN = element(by.id("fname")).sendKeys('naman');
        let middleN = element(by.id("middleN")).sendKeys('optional');
        let lastN = element(by.id("lastN")).sendKeys('jambla');
        let startD = element(by.model("driverData.contractStart")).sendKeys('4/3/2021');//drop down menu
        let terminationD = element(by.model("driverData.contractEnd")).sendKeys('9/3/2021');//drop down menu
        let password = element(by.id("pass")).sendKeys('nameet1234');
        let cnfrmpass = element(by.id("cnfrm")).sendKeys('nameet1234');
        let citizen = element(by.id('nginput'));//drop down menu
        //let assignVehicle=element(by.className('optional')); optional field
        //let group=element(by.className('ng-input'));optional field
        //let fileupload= element(by.className('form-control p-0 err')).sendKeys('D:\nameet Jambla Folder\fh-cloud-app\e2e\src\app\entry\add-driver');
        let gender = element(by.model('driverData.gender'));//do google for radio button 
        let birthdate = element(by.id('date')).sendKeys('4/3/2021');//drop down menu
        let workmobile = element(by.id('workphonee')).sendKeys('123968575');
        let workmail = element(by.id('mailwork')).sendKeys('nameet@gmail.com');
        let returnbtn = element(by.id('save&btn')).click();
        // let cancelbutton=element(by.className('btn btn-default btnPrevious mr-2')).click();

    }

    addressDetailForm() {
        //let addressType=element(by.model('item.addressType')).sendKeys('[value="Home"]');//optional
        let addAddress = element(by.model('item.userLocation')).sendKeys('#69,Fleet hawks office');
        //let cancleBtn=element(by.id("cancelBtn")).click();//optional
        //let previousBtn=element(by.id("prev")).click();optional 
        let saveBtn = element(by.id("save&btn")).click();

    }
    documentdetailsForm() {
        let documentType = element(by.model('document.documentType')).click();//dropdownmenu
        let documentnumber = element(by.id("dcNumber")).sendKeys("4589464");
        let issuingCountry = element(by.model("document.issuingCountry")).click();//drop downmenu
        let issuingState = element(by.model("document.issuingState")).click();//drop down
        let issueDate = element(by.model('document.issueDate')).sendKeys('4/3/2021');//drop down
        let expiryDate = element(by.model("expDate")).sendKeys('9/3/2021');//dropdowm
        //let attachDocument=element(by.id("attchDoc")).sendKeys('D:\nameet Jambla Folder\fh-cloud-app\e2e\src\app\entry\add-driver');
        // let addanotherdocument=element(by.id("add-document")).sendKeys('D:\nameet Jambla Folder\fh-cloud-app\e2e\src\app\entry\add-driver');
        //let cancleBtn=element(by.id("cancelBtn")).click();//optional
        //let previousBtn=element(by.id("prev")).click();optional 
        let saveBtn = element(by.id("save&btn")).click();
    }
    crossBorder() {
        //rest all optios are optional
        return element(by.id("save&btn")).click();
    }
    licenceDetailsForm() {
        let cdlNumber = element(by.id('cdlnumber')).sendKeys('786595');
        let licenceExpire = element(by.id('"epiryl"')).sendKeys("15/3/2021")
        let issuingCountry = element(by.model("document.issuingCountry")).click();//drop downmenu
        let issuingState = element(by.model("document.issuingState")).click();//drop down
        let saveBtn = element(by.id("save&btn")).click();
    }
    payMentForm() {
        let paymetType = element(by.id("paymentTypeForm")).click();
        let payPeriod = element(by.id("payP")).click();
        let sinNumber = element(by.id("sinNumber")).sendKeys("45856212");
        let saveBtn = element(by.id("save&btn")).click();
    }
    hosCompliance() {
        let status = element(by.id("sts")).click();//dropdown
        let driverType = element(by.id("tyyP")).click();
        // let hometerminal=
        let saveBtn = element(by.id("save&btn")).click();
    }
    emergencyForm() {
        let cancelbutton = element(by.id("cancelBtn")).click();
        let previousbutton = element(by.id("prev"))
        let saveBtn = element(by.id("save&btn")).click();
        return saveBtn;
    }
}

