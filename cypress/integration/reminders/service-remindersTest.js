describe(" reminders tests", () => {

  /* === Test Created with Cypress Studio === */
  it.only('Add service-reminder test', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();

    cy.get(':nth-child(6) > .nav-link > .fas').first().click();

    cy.get('.col-md-4 > .btn').first().click({ force: true });

    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(1000);
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla truck1{enter}');
    //cy.get('#aa665db5fb90-0').click({ force: true });
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('Delivery{enter}');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .pl-0 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .pl-0 > .ng-select > .ng-select-container').first().click();
    cy.get('#serviceForm > :nth-child(1) > :nth-child(3)').last().click({ force: true });

    cy.get(':nth-child(3) > :nth-child(2) > .col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(2) > .col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').type('101');
    cy.get('.col-10 > .btn-success').click();
    
  });

  /* === Test Created with Cypress Studio === */
it('search-reset the reminder', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();

  cy.get(':nth-child(6) > .nav-link > .fas').click();

  cy.get('.input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.wait(1000);
  cy.get('.input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla truck1{enter}');
  cy.get('.page-header > .row > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
  cy.get('.ng-option-label').first().click({force: true});
  cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('ALL{enter}');
  //cy.get('#a83fb1241580-0 > .ng-option-label').click({force: true});
  cy.get(':nth-child(4) > .mr-2').click();
  cy.get('.row > :nth-child(4) > [type="button"]').click();
  /* ==== End Cypress Studio ==== */
});


/* === Test Created with Cypress Studio === */
it('Delete the reminder test', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(6) > .nav-link > .fas').click();
  cy.get(':nth-child(1) > :nth-child(6) > .btn-group > .btn > .fas').first().click({force: true});
  cy.get(':nth-child(1) > :nth-child(6) > .btn-group > .dropdown-menu > :nth-child(4)').click();
  /* ==== End Cypress Studio ==== */
});
const { contains } = require("jquery");

/* === Test Created with Cypress Studio === */
it('validation error message', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(6) > .nav-link > .fas').click();
  cy.get('.col-md-4 > .btn').click();
  cy.get('.col-10 > .btn-success').click();
  cy.wait(2000);
 // cy.get('.text').contains('This Field is not allowed to be empty');
  /* ==== End Cypress Studio ==== */
});





});
















