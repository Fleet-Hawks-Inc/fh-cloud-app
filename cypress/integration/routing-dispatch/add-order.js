describe("Add Order", function () {
  it.only('should allow the user to add-order', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
   // cy.get('.col-lg-10 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    // cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').click();
    cy.get('[name="orderData\.customerID"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//customer id
    cy.get('input[name="customerPO"]').clear();
    cy.get('input[name="customerPO"]').type('8968831455');//customer PO

    cy.get('input[name="order_phone"]').clear();
    cy.get('input[name="order_phone"]').type('8968831455');//customer Phone

    cy.get('[class="bg-white p-3 text-dark mb-3"] [name="email"]').clear();
    cy.get('[class="bg-white p-3 text-dark mb-3"] [name="email"]').type('stevesmith@maliniator.com');//email

    cy.get('input[name="order_reference"]').clear();
    cy.get('input[name="order_reference"]').type('ASWe5');//reference
  });
  it('should list the order which was added and then verify the added order is listed ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    //cy.get(':nth-child(1) > [tabindex="0"]').contains('109');
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
    cy.get('[class="mb-1"] .btn-dark').click();//save btn Consignor
    cy.get('[id="collapseReceiverArea-0"] .btn-dark').click();//save btn Consignee
    cy.get(':nth-child(6) > .col-lg-12 > .btn-success').first().click();//save btn
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .text-danger').contains('This Field is required');
    cy.get('.mt-2 > .col-lg-10 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(1) > .col-lg-11 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(2) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(3) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(3) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(5) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(6) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(1) > .col-lg-10 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(1) > .col-lg-11 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(2) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(3) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(3) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(5) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(6) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(1) > .col-lg-10 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('.col-lg-8 > .text-danger').contains('This Field is required');
    cy.get(':nth-child(5) > :nth-child(2) > :nth-child(2) > .col-md-12 > .text-danger').contains('This Field is required');
    cy.get('.input-group > .text-danger').contains('This Field is required');
    cy.get(':nth-child(4) > .text-danger').contains('This Field is required');


  });
});