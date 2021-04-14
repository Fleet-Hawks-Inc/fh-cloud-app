describe(" reminders tests", () => {


  /* === Test Created with Cypress Studio === */
  it('Add issue', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('.content-body > .page-header > .row > .text-right > .btn').click();
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get('.col-lg-10 > #issueName').clear();
    cy.get('.col-lg-10 > #issueName').type('brake issue');
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').click();
    cy.get('[aria-label="Thursday, April 1, 2021"] > .btn-light').click();
    cy.get('.pt-4 > .col-lg-10 > .form-control').clear();
    cy.get('.pt-4 > .col-lg-10 > .form-control').type('10000');
    cy.get(':nth-child(3) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get(':nth-child(3) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get('.col-10 > .btn-success').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('search-reset issue', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('.pl-0 > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.pl-0 > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla truck1{enter}');
    cy.get(':nth-child(3) > .input-group > .form-control').clear();
    cy.get(':nth-child(3) > .input-group > .form-control').type('brake issue');
    cy.get('.page-header > .row > :nth-child(4) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(4) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('OPEN{enter}');
    cy.get(':nth-child(5) > .mr-2').click();
    cy.wait(1000);
    cy.get(':nth-child(5) > [type="button"]').click();

  });
  /* === Test Created with Cypress Studio === */
  it('Delete Issue', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get(':nth-child(1) > :nth-child(8) > .btn-group > .mb-1 > .fas').click();
    cy.get(':nth-child(1) > :nth-child(8) > .btn-group > .dropdown-menu > button.dropdown-item').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('validation error message', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('.content-body > .page-header > .row > .text-right > .btn').click();
    cy.get('.col-10 > .btn-success').click();
    /* ==== End Cypress Studio ==== */
  });



});
