import { browser, by, element } from "protractor";
//step1. In this we have check as well filling the credentials of add user
describe('Fleet Hawks Dashboard', function () {
    it('add account test and fill details', function () {
        browser.get('http://cloudapp.fleethawks.com/#/onboard')
        let heading = element(by.class('text-dark font-weight-bold'));
        element(by.model('firstName')).sendkeys('Nameet ');
        element(by.model('carrierBusinessName')).sendKeys("Fleethawks");
        element(by.model('lasttName')).sendKeys('jambla');
        element(by.model('email')).sendKeys('namanjambla99@gmail.com');
        element(by.model('phone')).sendKeys('8968831488')
        element(by.model('combobox')).sendKeys('email');

    });
    //Step 2.verify and enter the details of password.
    it('set password', function () {
        element(by.model('userName')).sendKeys('Nameet Jambla');
        element(by.model('password')).sendKeys('0786');
        element(by.model('confirmPassword')).sendKeys('0786');

    });

    //step 3. Now check working of reset & next button what actions did they perform 
    it('checking button', function () {
        element(by.class('[btn btn-default mr-1]')).click();
        browser.sleep(5000);

    });

});
