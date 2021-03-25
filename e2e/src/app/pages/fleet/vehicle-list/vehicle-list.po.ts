// import { browser, by, element, ElementFinder, ExpectedConditions, WebElementPromise } from 'protractor';
// export class DeleteDriverList{
//     navToDriverList(){
//         browser.get('#/fleet/vehicles/list') as Promise<any>;
//         browser.sleep(4000);
        
        
//     }
//     driverList(){

//         this.waitForElement(element(by.css('.table-responsive tr:nth-of-type(1) [class="bg-transparent border-0"]')),4000).click();
        
//         this.waitForElement(element(by.css('[aria-labelledby="dropdownMenuButton-0"] .dropdown-item:nth-of-type(2)')),80000).click();
    
//         browser.switchTo().alert().accept();
//         browser.sleep(4000);
//     }
//     private waitForElement(element: any, time = 100000): ElementFinder {

//         var EC = ExpectedConditions;
//         browser.wait(EC.visibilityOf(element), time);
//         return element;

//     }
// }