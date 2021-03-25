import { browser, by, element, ElementFinder, ExpectedConditions, WebElementPromise } from 'protractor';
export class AssetListPage{
    navToAssetList(){
        browser.get('#/fleet/assets/list') as Promise<any>;
    }
    assetList(){
    this.waitForElement(element(by.css('tr:nth-of-type(3) > td:nth-of-type(10) > .dropdown.dropright > .bg-transparent.border-0 > .fa-ellipsis-v.fas')),4000).click();
        
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