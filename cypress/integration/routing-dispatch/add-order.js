describe("Add Order", function () {
  it('should allow the user to add-order with required fields', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    cy.get('[name="orderData\.customerID"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//customer id

    cy.get('[placeholder="Select Shipper"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//shipper 

    cy.get('[id="collapseReceiverArea-0"] .row:nth-of-type(1) [role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//reciever

    cy.get('[id="collapseShipperArea-0"] [class="row mt-3"]:nth-of-type(2) .ng-invalid').type('ww');
    cy.get('[class="col-lg-12 col-md-12 show-search__result"] [title="Calgary Climbing Centre Stronghold\, 140 15 Ave NW\, Calgary\, AB T2M 0G6\, Canada"]').click();//pickup location


    cy.get('input[name="dropOffLocation"]').type('as');
    cy.get('[class="col-lg-12 col-md-12 show-search__result"] [title]').click();//drop location

    cy.get('#collapseShipperArea-0 > :nth-child(3) > :nth-child(2) > .input-group > .form-control').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light').last().click();//pickp date
    cy.get('input[name="pickupTime"]').type('01:30')//pickuptime
    cy.get('input[name="dropOffDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(6) > .btn-light').last().click();//delivery date
    cy.get('input[name="dropOffTime"]').type('02:45');//dropoff time
    cy.get('[id="collapseShipperArea-0"] [pattern]').type('add comments for pickup delivery');//pickup delivery

    cy.get('div#collapseShipperArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click()//save1
    cy.wait(3000);
    cy.get('div#collapseReceiverArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click();//save 2

    cy.get('.col-lg-8.offset-lg-2 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//asset type

    cy.get('[name="freight_type"] input').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//freieght type

    cy.get('input[name="freight_amount"]').type('40');//amount

    cy.get('[name="freight_currency"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//currency type

    cy.get('input[name="totalMiles"]').type('500');//miles
    cy.get('[class="row mb-3"]:nth-of-type(3) button').click();//save btn

    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
  });


  it('should not allow the user to add-order with optional fields ', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    cy.get('input[name="customerPO"]').clear();
    cy.get('input[name="customerPO"]').type('8968831455');//customer PO

    cy.get('input[name="order_phone"]').clear();
    cy.get('input[name="order_phone"]').type('8968831455');//customer Phone

    cy.get('[class="bg-white p-3 text-dark mb-3"] [name="email"]').clear();
    cy.get('[class="bg-white p-3 text-dark mb-3"] [name="email"]').type('stevesmith@maliniator.com');//email

    cy.get('input[name="order_reference"]').clear();
    cy.get('input[name="order_reference"]').type('ASWe5');//reference




    cy.get('[id="collapseShipperArea-0"] [pattern]').type('add comments for pickup delivery');//pickup delivery
    cy.get('textarea[name="dropOffInstruction"]').type('add comments for delivery');//delivery instructions

    cy.get('[id="collapseShipperArea-0"] [placeholder="eg\. John Smith"]').type('john');//name1
    cy.get('div#collapseReceiverArea-0 > div:nth-of-type(5) > .col-lg-12.col-md-12 > input#inputDefault').type('shawn');//name2 

    cy.get('div#collapseShipperArea-0 > div:nth-of-type(6) > .col-lg-12.col-md-12 > input#inputDefault').type('7065656566');//phone1
    cy.get('div#collapseReceiverArea-0 > div:nth-of-type(6) > .col-lg-12.col-md-12 > input#inputDefault').type('898980565');//phone2 

    cy.get('[id="collapseShipperArea-0"] [placeholder="eg\. cakes"]').type('cakes');//commodity1,2


    cy.get('[placeholder="eg\. 1348\,0096"]').type('4546');//pu#
    cy.get('[placeholder="eg\. 1458\,16325"]').type('74746AZ');//del#


    cy.get('[placeholder="eg\. 20\,400"]').type('5');//quantity 1,2
    cy.get('[id="collapseShipperArea-0"] [class="row mt-3"]:nth-of-type(3) [role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//quantity type

    cy.get('[id="collapseShipperArea-0"] [placeholder="eg\. 500 Kg"]').type('50');//weight 1,2
    cy.get('[id="collapseShipperArea-0"] [class="row mt-3"]:nth-of-type(4) [role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//weight type

    cy.get('div#collapseShipperArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click()//save1
    cy.wait(3000);
    cy.get('div#collapseReceiverArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click();//save 2

    cy.get('.col-lg-8.offset-lg-2 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//asset type

    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    });
  });
  it('should list the order which were added and then verify the added order are listed by name/other properties. ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('[name="category"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//category type
    cy.get('input[name="searchValue"]').type('1000');//Order number
    cy.get('input[name="fromDate"]').first().click();
    cy.get('div:nth-of-type(6) > div:nth-of-type(1) > .btn-light').last().click();//search date
    cy.get('input[name="toDate"]').first().click();
    cy.get('div:nth-of-type(6) > div:nth-of-type(3) > .btn-light').last().click();//end date
    cy.get('.btn.btn-sm.btn-success.mr-3').click();//serach
    cy.wait(3000);
    cy.get('.inner-wrapper [class] [type="submit"]:nth-of-type(2)').click();//reset



    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    });
  });
  it('should allow user to delete order', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('#dropdownMenuButton-0 > .fas').first().click();
    cy.get(':nth-child(1) > :nth-child(10) > .dropdown > .dropdown-menu > [href="javascript:;"]').first().click();
    cy.wait(3000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
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
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    // cy.get('#collapseShipperArea-0 > :nth-child(2) > .col-lg-12 > .form-control').type('ww');
    // cy.get('#collapseShipperArea-0 > :nth-child(2) > .col-lg-12 > .form-control').clear();
    // cy.get('.col-lg-12.col-md-12.show-search__result > .text-danger').contains('Pickup location is required.');

    // cy.get('input[name="dropOffLocation"]').type('as');
    // cy.get('input[name="dropOffLocation"]').clear();
    // cy.get('.col-lg-12.col-md-12.show-search__result > .text-danger').contains('Drop off location is required.');
    cy.get('input[name="totalMiles"]').type('500');//miles
    cy.get('input[name="totalMiles"]').clear();
    cy.get('.col-lg-8.mt-3.offset-lg-2 > .text-danger > div').contains('Total Miles are required.');



    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })

  });
  it.only('check button is enabled or not.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    cy.get('[name="orderData\.customerID"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//customer id

    cy.get('[placeholder="Select Shipper"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//shipper 

    cy.get('[id="collapseReceiverArea-0"] .row:nth-of-type(1) [role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//reciever

    cy.get('[id="collapseShipperArea-0"] [class="row mt-3"]:nth-of-type(2) .ng-invalid').type('ww');
    cy.get('[class="col-lg-12 col-md-12 show-search__result"] [title="Calgary Climbing Centre Stronghold\, 140 15 Ave NW\, Calgary\, AB T2M 0G6\, Canada"]').click();//pickup location


    cy.get('input[name="dropOffLocation"]').type('as');
    cy.get('[class="col-lg-12 col-md-12 show-search__result"] [title]').click();//drop location

    cy.get('#collapseShipperArea-0 > :nth-child(3) > :nth-child(2) > .input-group > .form-control').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light').last().click();//pickp date
    cy.get('input[name="pickupTime"]').type('01:30')//pickuptime
    cy.get('input[name="dropOffDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(6) > .btn-light').last().click();//delivery date
    cy.get('input[name="dropOffTime"]').type('02:45');//dropoff time
    cy.get('[id="collapseShipperArea-0"] [pattern]').type('add comments for pickup delivery');//pickup delivery

    cy.get('div#collapseShipperArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click()//save1
    cy.wait(3000);
    cy.get('div#collapseReceiverArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click();//save 2

    cy.get('.col-lg-8.offset-lg-2 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//asset type

    cy.get('[name="freight_type"] input').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//freieght type

    cy.get('input[name="freight_amount"]').type('40');//amount

    cy.get('[name="freight_currency"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//currency type

    cy.get('input[name="totalMiles"]').type('500');//miles
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    });

  });
})
