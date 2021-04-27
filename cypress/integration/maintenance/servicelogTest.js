describe(" Maintenance tests", () => {
  /* === Test Created with Cypress Studio === */
  it('Add Service Log ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('.col-md-4 > .btn').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tes{enter}');
    cy.get('.pt-2.ng-star-inserted > .col-lg-10 > .form-control').clear();
    cy.get('.pt-2.ng-star-inserted > .col-lg-10 > .form-control').type('1000');
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').click();
    cy.get('[aria-label="Friday, April 30, 2021"] > .btn-light').click();
    cy.get(':nth-child(3) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get('tbody > .ng-star-inserted > :nth-child(1) > .ng-untouched').check();
    cy.get(':nth-child(3) > .col-lg-5.pl-0 > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(3) > .col-lg-5.pl-0 > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('t{enter}');
    cy.get('tbody > .ng-star-inserted > :nth-child(2) > .form-control').clear();
    cy.get('tbody > .ng-star-inserted > :nth-child(2) > .form-control').type('2');
    cy.get(':nth-child(4) > .pl-0 > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container').click();
    cy.get('.col-10 > #nextBtn').click();

    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('search and reset service log', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('.pl-0 > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(1000);
    cy.get('.pl-0 > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tes{enter}');
    cy.get('.form-horizontal > .row > :nth-child(3) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.form-horizontal > .row > :nth-child(3) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('tyre{enter}');
    cy.get(':nth-child(4) > .mr-2').click();
    cy.get(':nth-child(4) > [type="button"]').click();

    /* ==== End Cypress Studio ==== */
  });

  /* === Test Created with Cypress Studio === */
it('edit, update and delete service log', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(8) > .nav-link > .fas').click();
  cy.get('#dropdownMenuButton-0 > .fas').click();
  cy.get(':nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > [ng-reflect-router-link="/fleet/maintenance/service-log"]').click();
  cy.get('.col-lg-10 > .row > .col-lg-12 > .btn').click();
  cy.get(':nth-child(2) > .col-12 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get(':nth-child(2) > .col-12 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('{enter}');
  cy.get('.pt-4 > .col-lg-12 > .form-control').clear();
  cy.get('.pt-4 > .col-lg-12 > .form-control').type('3000');
  cy.get('#issueName').clear();
  cy.get('#issueName').type('brake issue');
  cy.get(':nth-child(4) > .col-12 > .form-control').click();
  cy.get('[aria-label="Friday, April 30, 2021"] > .btn-light').click();
  cy.get('.mt-4 > .col-lg-12 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get('.mt-4 > .col-lg-12 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('el{enter}');
  cy.get('.mt-3 > .row.pt-2 > .col-lg-12 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get('.mt-3 > .row.pt-2 > .col-lg-12 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('ele{enter}');
  cy.get('#issueForm > .form-group > .col-lg-12 > .btn-success').click();
  cy.get('.col-lg-5.pl-0 > .row > .col-lg-2 > .btn > .fas').click();
  cy.get('#form1_ > :nth-child(1) > .form-group > .form-control').clear();
  cy.get('#form1_ > :nth-child(1) > .form-group > .form-control').type('windows glasses');
  cy.get('#addServiceTaskModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
  cy.get('.col-10 > .btn-success').click();
  cy.get('#dropdownMenuButton-0 > .fas').click();
  cy.get('.row-border > tbody > :nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > [href="javascript:;"]').click();
  cy.wait(1000);
  /* ==== End Cypress Studio ==== */
});
/* === Test Created with Cypress Studio === */
it('validation error message test', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(8) > .nav-link > .fas').click();
  cy.get('.col-md-4 > .btn').click();
  cy.get('.col-10 > #nextBtn').click();
  /* ==== End Cypress Studio ==== */
});


});
