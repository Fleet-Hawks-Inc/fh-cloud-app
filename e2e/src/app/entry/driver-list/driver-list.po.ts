import { browser, by, element, ElementFinder, ExpectedConditions, WebElementPromise } from 'protractor';
export class DeleteDriverList{
    navToDriverList(){
        browser.get('#/fleet/drivers/list') as Promise<any>;
    }
    driverList(){
        this.waitForElement(element(by.css('table#diverTbl > tbody > tr:nth-of-type(1) .bg-transparent.border-0 > .fa-ellipsis-v.fas')),4000).click();
        
        this.waitForElement(element(by.css('.dropdown-menu.show > a:nth-of-type(2)')),80000).click();
    
        browser.switchTo().alert().accept();
        browser.sleep(4000);
    }
    private waitForElement(element: any, time = 100000): ElementFinder {

        var EC = ExpectedConditions;
        browser.wait(EC.visibilityOf(element), time);
        return element;

    }
}