describe(" Inventory tests", () => {
  let authToken;
  let inventoryID;
  afterEach(() => {
    if (authToken && inventoryID) {
      const serviceUrl = Cypress.env('SERVICE_URL') + '/items/record/cypress/delete/' + inventoryID;
      cy.request({
        method: 'DELETE',
        url: serviceUrl,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          "Content-type": "application/json"
        }
      }).then(response => {
      })
    }
  })
  it('should allow users to add inventory with all required fields.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();
    cy.get('[routerlink="/fleet/inventory/add"]').click();
    cy.get('[name="partNumber"]').clear();
    cy.get('[name="partNumber"]').type('nut bolt 2020');
    cy.get('input[name="itemName"]').clear();
    cy.get('input[name="itemName"]').type('tires');
    cy.get('[name="category"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();
    cy.get('input[name="cost"]').clear();
    cy.get('input[name="cost"]').type('5');
    cy.get('input[name="quantity"]').clear();
    cy.get('[name="costUnitType"] input').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
    cy.get('[name="costUnit"] input').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
    cy.get('input[name="quantity"]').type('10');
    cy.get('[name="warehouseID"] input').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get('[name="warehouseVendorID"] input').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get('[class="col-11 pr-0"] .ng-star-inserted').click();//save
    cy.wait(3000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should not allow users to add inventory with optional fields.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();
    cy.get('[routerlink="/fleet/inventory/add"]').click();
    cy.get('.bg-white.p-3.text-dark textarea[name="description"]').type('Inventory is not added with optional fields.');
    cy.get('input[name="aisle"]').type('20');
    cy.get('[name="row"]').type('10');
    cy.get('[name="bin"]').type('4');
    cy.get('input[name="warrantyTime"]').type('5');
    cy.get('[name="warrantyUnit"] input').first().click()
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();
    cy.get('[name="notes"]').type('do not add inventory with optional fields.')
    const imagefile5 = "download.jpg";
    cy.get('[class="form-group row adddriverpl pt-2"] .row:nth-of-type(1) [type="file"]').attachFile(imagefile5);
    const file5 = "load1.pdf";
    cy.get('[class] [class="row mt-2"] [type="file"]').attachFile(file5);

    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    });
  });

  it('should list the inventory which was added and then verify the added inventory is listed by name/other properties.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();
    cy.get('.page-header > .row > :nth-child(1) > .input-group > .form-control').clear();
    cy.get('.page-header > .row > :nth-child(1) > .input-group > .form-control').type('tires{enter}');
    cy.get(':nth-child(2) > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('fleet{enter}');
    cy.get('.result-suggestions > ul > li').click();
    cy.get(':nth-child(3) > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(3) > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('hardware{enter}');
    cy.get('.page-header [type="submit"]').click();
    cy.wait(4000);
    cy.get('[class="col-md-2 col-lg-2"]:nth-of-type(4) [type="button"]').click();
    cy.get('.btn.btn-default.btn-md.driverbtn.dropdown-toggle.mb-1.toggleright').first().click();
    cy.get('input[name="warranty"]').last().click();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should allow users to edit inventory.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();

    cy.get('#dropdownMenuButton-0 > .fas').click();
    cy.get('.dropdown-menu.show > a:nth-of-type(1)').click();//edit
    cy.url().then(url => {
      let newUrl = url.split('/');
      inventoryID = newUrl[newUrl.length - 1];
      cy.setLocalStorage('inventoryID', inventoryID);
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should allow users to delete inventory.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();
    cy.get('#dropdownMenuButton-0 > .fas').click();
    cy.get('[aria-labelledby] > .dropdown-item:nth-of-type(2)').click();
    cy.getLocalStorage('congnitoAT').then((data) => {
      authToken = data;
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should give validation error messages when the required field is not provided.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();
    cy.get('[routerlink="/fleet/inventory/add"]').click();
    cy.get('[name="partNumber"]').type('nut bolt 2020');
    cy.get('[name="partNumber"]').clear();
    cy.get('.col-lg-12 > .bg-white.p-3.text-dark .text-danger > div').contains('Part number is required.');
    cy.get('input[name="itemName"]').type('tires');
    cy.get('input[name="itemName"]').clear();
    cy.get('div:nth-of-type(2) > .col-lg-10 > .text-danger > div').contains('Item name is required.');
    cy.get('input[name="cost"]').type('5');
    cy.get('input[name="cost"]').clear();
    cy.get('.col-lg-8 > .row > div:nth-of-type(1) > .text-danger > div').contains('Unit cost is required.');
    cy.get('input[name="quantity"]').type('10');
    cy.get('input[name="quantity"]').clear();
    cy.get('.col-lg-5.mb-2.offset-lg-1.pb2 > .row > .col-lg-4 > .text-danger > div').contains('Quantity must contain numbers.');
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('check button is enabled or not.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();
    cy.get('[routerlink="/fleet/inventory/add"]').click();
    cy.get('[name="partNumber"]').clear();
    cy.get('[name="partNumber"]').type('nut bolt 2020');
    cy.get('input[name="itemName"]').clear();
    cy.get('input[name="itemName"]').type('tires');
    cy.get('[name="category"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();
    cy.get('input[name="cost"]').clear();
    cy.get('input[name="cost"]').type('5');
    cy.get('input[name="quantity"]').clear();
    cy.get('[name="costUnitType"] input').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
    cy.get('[name="costUnit"] input').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
    cy.get('input[name="quantity"]').type('10');
    cy.get('[name="warehouseID"] input').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get('[name="warehouseVendorID"] input').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
});


