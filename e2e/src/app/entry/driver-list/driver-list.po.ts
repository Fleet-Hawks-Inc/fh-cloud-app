
import { browser, element, by, ExpectedConditions, ElementArrayFinder, } from 'protractor';
export class DriverListPage {



  navigateToDriverListPage() {
    return browser.get('#/fleet/drivers/list') as Promise<any>;
    browser.sleep(5000);

  }
  searchForm() {
    element(by.css('[class="col-md-2 col-lg-3"] .form-control')).click();
    browser.sleep(5000);

    element(by.id('txtsearchdriver')).sendKeys('nameet');
    browser.sleep(5000);


    element(by.css('.result-suggestions .ng-star-inserted')).click();
    browser.sleep(7000);
    //make any one required

  }
  selectType() {
    element(by.css('[class="col-md-2 col-lg-2"] [role="combobox"]')).click();
    element(by.css('[role="option"]:nth-of-type(2) .ng-star-inserted')).click();
    browser.sleep(5000);
  }

  searchReset() {
    element(by.id('btnsearch')).click();
    browser.sleep(3000);
    
    element(by.id('btnreset')).click();
    browser.sleep(3000);
  }

  columnVisibility() {
    element(by.css('[class="col-md-5 col-lg-5 pr-1 text-right page-buttons"] .flex-wrap:nth-of-type(1) [data-toggle]')).click();
    browser.sleep(2000);

    element(by.css('.show [role] [class="dropdown-item text-1"]:nth-of-type(2)')).click();
    browser.sleep(2000);
  }

  mapView() {
    element(by.css('[class="col-md-5 col-lg-5 pr-1 text-right page-buttons"] [type="button"]:nth-child(2)')).click();
    browser.sleep(5000);
  }

  listView() {
    element(by.css('[class] [type="button"]:nth-child(3)')).click();
    browser.sleep(3000);
  }


  actionPage() {
    element(by.css('[class="btn-group btn-group1 flex-wrap mr-2"] .dropdown-toggle')).click();
    browser.sleep(3000);

  }

  //  getLables() {
  //   let nameLabel = element(by.css('.col1.minWidth200')).getText();
  //   expect(nameLabel).toEqual('Name');
  //   browser.sleep(5000);

  //   let dutyStatusLabel = element(by.css('.col2.minWidth120')).getText();
  //   expect(dutyStatusLabel).toEqual('Duty Status');
  //   browser.sleep(5000);

  //   const driverLocationLable = element(by.css('.col18.minWidth200')).getText();
  //   expect(driverLocationLable).toEqual('Location');
  //   browser.sleep(2000);

  //   const currentCycleLable = element(by.css('.col11.minWidth200')).getText();
  //   expect(currentCycleLable).toEqual('Current Cycle');
  //   browser.sleep(5000);


  //   // const cdl = element(by.css('.col15')).getText();
  //   // //expect(cdl).toEqual('CDL Number');

  //   const statusLable = element(by.css('.col17.minWidth120')).getText();
  //   expect(statusLable).toEqual('Status');
  //   browser.sleep(5000);


  //   // const action = element(by.css('.col17.minWidth120')).getText();
  //   // //expect(action).toEqual('Action');
  // }













}

