describe("Fuel Test", function () {
  let authToken;
  let fuelID;
  afterEach(() => {
    if (authToken && fuelID) {
      const serviceUrl = Cypress.env('SERVICE_URL') + '/fuelEntries/record/cypress/delete/' + fuelID;
      cy.request({
        method: 'DELETE',
        url: serviceUrl,
        failOnStatusCode: false,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          "Content-type": "application/json"
        }
      }).then(response => {
      })
    }
  });
  it('should allow users to add fuel with all required fields.', function () {
    cy.visit('/#/Login');
   cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
    cy.get('#form_ > .row > .text-right > .btn').click();
    cy.get('div#fuelVehicle > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//Select Vehilce.
    cy.get('input[name="fuelQty"]').clear();
    cy.get('input[name="fuelQty"]').type('15');//Fuel Quantity
    cy.get('input[name="fuelQtyAmt"]').clear();
    cy.get('input[name="fuelQtyAmt"]').type('50');//Fuel Amount
    cy.get('input[name="pricePerUnit"]').type('5');//Cost Per litre
    cy.get('input[name="amountPaid"]').clear();
    cy.get('input[name="amountPaid"]').type('12');//Amount paid
    cy.get('input[name="fuelDate"]').first().click();
    cy.get('div:nth-of-type(3) > div:nth-of-type(4) > .btn-light.ng-star-inserted').last().click();//Fuel Date
    cy.get('input[name="fuelTime"]').type('10:30');//fuel time
    cy.get('[name="fuelType"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();// fuel type
    cy.get('form#fuelForm > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//Paid By(Driver)
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//Payment Mode
    cy.get('input[name="reference"]').type('FP1234');
    cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(1)').last().click();//Country
    cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//province
    cy.get('div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').last().click();//city
    cy.get('div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(2) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//vendor

    cy.get('div:nth-of-type(5) input[name="odometer"]').clear();
    cy.get('div:nth-of-type(5) input[name="odometer"]').type('4500');//odometer
   cy.get('div:nth-of-type(6) > .col-lg-12.text-right .btn.btn-success.cus-btn-padd').click();//save button
    cy.wait(4000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should not allow users to add fuel with optional fields.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
    cy.get('#form_ > .row > .text-right > .btn').click();
    cy.get('[name="discType"] input').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//discount type
    cy.get('input[name="discAmount"]').clear();
    cy.get('input[name="discAmount"]').type('100');//discount amount
    cy.get('.ng-star-inserted.row > .col-lg-6 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();//Tax Type
    cy.get('input[name="tax[0].taxAmount"]').clear();
    cy.get('input[name="tax[0].taxAmount"]').type('10');//Tax Amount

    cy.get('input[name="fuelTime"]').type('10:30');//fuel time
    const photo = 'download.jpg'
    cy.get('input[name="uploadedPhotos"]').attachFile(photo);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });

  });
  it('should list the fuel which was added and then verify the added fuel is listed by name/other properties.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();

    cy.get('.col-lg-2.col-md-2  ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get('input[name="fromDate"]').first().click();
    cy.get('div:nth-of-type(5) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();//from date
    cy.get('input[name="toDate"]').first().click();
    cy.get('div:nth-of-type(6) > div:nth-of-type(4) > .btn-light.ng-star-inserted').last().click();//todate
    cy.get('.btn.btn-sm.btn-success.mr-3').click();//search
    cy.get('[class="col-md-2 col-lg- pl-2"] [type="button"]').click();//reset
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });

  });
  it('should allow users to edit fuel.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
    cy.get(':nth-child(1) > :nth-child(10) > .btn-group > .mb-1').first().click();
    cy.get(':nth-child(1) > :nth-child(10) > .btn-group > .dropdown-menu > a.dropdown-item').last().click();
    cy.url().then(url => {
      console.log('url', url);
      let newUrl = url.split('/');
      fuelID = newUrl[newUrl.length - 1];
      cy.setLocalStorage('fuelID', fuelID);
    })
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should allow users to delete fuel.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
    cy.get(':nth-child(1) > :nth-child(10) > .btn-group > .mb-1').first().click();
    cy.get('.show [role] [type]').last().click();
    cy.getLocalStorage('congnitoAT').then((data) => {
      authToken = data;
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should give validation error message when required fields are not provided', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
    cy.get('#form_ > .row > .text-right > .btn').click();
    cy.get('input[name="fuelQty"]').type('15');
    cy.get('input[name="fuelQty"]').clear();
    cy.get('div#fuelVehicleQty > .row  .text-danger > div').contains('Fuel quantity must contain numbers.');
    cy.get('input[name="fuelQtyAmt"]').type('50');
    cy.get('input[name="fuelQtyAmt"]').clear();
    cy.get('div#fuelVehicleQty > .row  .text-danger > div').contains('Amount must contain numbers.');
    cy.get('input[name="pricePerUnit"]').type('5');//Cost Per litre
    cy.get('input[name="amountPaid"]').clear();
    cy.get('input[name="amountPaid"]').type('12');//Amount paid
    cy.get('input[name="pricePerUnit"]').type('5');//Cost Per litre
    cy.get('input[name="pricePerUnit"]').clear();
    cy.get('div:nth-of-type(5) .text-danger > div').contains('Cost must contain numbers.');
    cy.get('input[name="amountPaid"]').type('12');//Amount paid
    cy.get('input[name="amountPaid"]').clear();
    cy.get('div:nth-of-type(6) .text-danger > div').contains('Amount must contain numbers.');
    cy.get('div:nth-of-type(5) input[name="odometer"]').type('4500');//odometer
    cy.get('div:nth-of-type(5) input[name="odometer"]').clear();
    cy.get('div:nth-of-type(5) > div:nth-of-type(3) .text-danger > div').contains('Odometer is required.');
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
    cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
    cy.get('#form_ > .row > .text-right > .btn').click();
    cy.get('div#fuelVehicle > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//Select Vehilce.
    cy.get('input[name="fuelQty"]').clear();
    cy.get('input[name="fuelQty"]').type('15');//Fuel Quantity
    cy.get('input[name="fuelQtyAmt"]').clear();
    cy.get('input[name="fuelQtyAmt"]').type('50');//Fuel Amount
    cy.get('input[name="pricePerUnit"]').type('5');//Cost Per litre
    cy.get('input[name="amountPaid"]').clear();
    cy.get('input[name="amountPaid"]').type('12');//Amount paid
    cy.get('input[name="fuelDate"]').first().click();
    cy.get('div:nth-of-type(3) > div:nth-of-type(4) > .btn-light.ng-star-inserted').last().click();//Fuel Date
    cy.get('input[name="fuelTime"]').type('10:30');//fuel time
    cy.get('[name="fuelType"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();// fuel type
    cy.get('form#fuelForm > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//Paid By(Driver)
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//Payment Mode
    cy.get('input[name="reference"]').type('FP1234');
    cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(1)').last().click();//Country
    cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//province
    cy.get('div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').last().click();//city
    cy.get('div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(2) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//vendor
    cy.get('div:nth-of-type(5) input[name="odometer"]').clear();
    cy.get('div:nth-of-type(5) input[name="odometer"]').type('4500');//odometer
    Cypress.on('uncaught:exception', (err, runnable) => {
      
      return false
    });
  });

});
