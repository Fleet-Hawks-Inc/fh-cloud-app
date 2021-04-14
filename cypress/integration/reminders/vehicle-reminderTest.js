describe(" reminders tests", () => {


  /* === Test Created with Cypress Studio === */
  it('Add vehicle renewal reminder', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();

    cy.get(':nth-child(6) > .nav-link > .fas').first().click({ force: true });

    cy.get('.wtopnav > .nav > :nth-child(2) > .nav-link').click({ force: true });
    cy.get('.col-md-4 > .btn').click();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(1000);
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla benz{enter}');

    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(1000);
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('pick up{enter}');
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .form-control').click();
    cy.get('[aria-label="Select month"]').select('5');
    cy.get('[tabindex="0"] > .btn-light').click();
    //cy.get('.col-lg-8 > .ng-select > .ng-select-container > .ng-clear-wrapper').click();
    cy.get('.col-lg-8 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('#vehicleRenewalForm > :nth-child(1) > :nth-child(3)').last().click({ force: true });
    cy.get('.col-10 > .btn-success').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('search and reset the reminder', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.wait(3000);
    cy.get('.ng-star-inserted > .nav > :nth-child(6) > .nav-link').first().click({ force: true });
    cy.wait(3000);
    cy.get('.bg-white.card  ul > li:nth-of-type(2) > .nav-link').click({ force: true }).should('not.exist');
    cy.get('.page-header > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla benz{enter}');
    cy.get('.page-header > .row > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('ALL{enter}');
    cy.get(':nth-child(4) > .mr-2').click();
    cy.get('.row > :nth-child(4) > [type="button"]').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('delete the reminder', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(2) > .nav-link').click();
    cy.get(':nth-child(2) > :nth-child(6) > .btn-group > .btn').click();
    cy.get(':nth-child(2) > :nth-child(6) > .btn-group > .dropdown-menu > :nth-child(3)').click();
    /* ==== End Cypress Studio ==== */
  });
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
  cy.wait(2000);
  /* ==== End Cypress Studio ==== */
});


});
