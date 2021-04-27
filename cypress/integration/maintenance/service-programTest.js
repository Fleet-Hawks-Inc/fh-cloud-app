

describe(" Maintenance tests", () => {

  /* === Test Created with Cypress Studio === */
  it('Add Service Program', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();
    cy.get('.col-md-6 > .btn').click();
    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').type('Heavy Vehicle');
    cy.get(':nth-child(1) > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(1000);
    cy.get(':nth-child(1) > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('wi{enter}');
    cy.get(':nth-child(2) > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(1000);
    cy.get(':nth-child(2) > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('te{enter}');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').type('2');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(1000);
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('d{enter}');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').type('1000');
    cy.get('.col-10 > #nextBtn').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('Search and reset Service program', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();
    cy.get('.form-horizontal > .row > .col-md-3 > .input-group > .form-control').clear();
    cy.get('.form-horizontal > .row > .col-md-3 > .input-group > .form-control').type('Heavy Vehicle');
    cy.get('.col-md-2 > .mr-2').click();
    cy.get('.col-md-2 > [type="button"]').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
it('edit, update and delete service program', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(8) > .nav-link > .fas').click();
  cy.get('#service-prog-tab').click();
  cy.get('#dropdownMenuButton-3 > .fas').click();
  cy.get(':nth-child(4) > :nth-child(3) > .dropdown > .dropdown-menu > [ng-reflect-router-link="/fleet/maintenance/service-pro"]').click();
  cy.get(':nth-child(1) > .row > .col-lg-2 > .btn > .fas').click();
  cy.get('#form1_ > :nth-child(1) > .form-group > .form-control').clear();
  cy.get('#form1_ > :nth-child(1) > .form-group > .form-control').type('battery ');
  cy.get('#addServiceTaskModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
  cy.get('.row.ng-star-inserted > :nth-child(2) > .row.pt-2 > .col-lg-2 > .btn').click();
  cy.get(':nth-child(2) > :nth-child(2) > .row.pt-2 > .col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').clear();
  cy.get(':nth-child(2) > :nth-child(2) > .row.pt-2 > .col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').type('1');
  cy.get(':nth-child(2) > :nth-child(2) > .row.pt-2 > .col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get(':nth-child(2) > :nth-child(2) > .row.pt-2 > .col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('w{enter}');
  cy.get(':nth-child(2) > :nth-child(2) > .row.pt-2 > .col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').clear();
  cy.get(':nth-child(2) > :nth-child(2) > .row.pt-2 > .col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').type('1000');
  cy.get(':nth-child(2) > :nth-child(1) > .row > .col-lg-10 > .ng-select > .ng-select-container').click();
  cy.get(':nth-child(2) > :nth-child(1) > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get(':nth-child(2) > :nth-child(1) > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('ba{enter}');
  cy.get(':nth-child(2) > :nth-child(2) > .row.pt-2 > .col-lg-2 > .btn > .fas').click();
  cy.get('.col-10 > .btn-success').click();
  cy.get('#dropdownMenuButton-0 > .fas').click();
  /* ==== End Cypress Studio ==== */
});
  it('validation error message Test', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();
    cy.get('.col-md-6 > .btn').click();
    cy.get('.col-10 > #nextBtn').click();
    /* ==== End Cypress Studio ==== */
  });

});


