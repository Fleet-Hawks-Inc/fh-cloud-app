describe(" Inventory tests", () => {
  /* === Test Created with Cypress Studio === */
  it('Add existing inventory', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();
    cy.get('[routerlink="/fleet/inventory/add"]').click();
    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .col-lg-10 > .form-control').type('123AZ');
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .form-control').type('tires');
    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(3) > .col-lg-10 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(3) > .col-lg-10 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('m{enter}');
    cy.get(':nth-child(1) > .col-lg-10 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(1) > .col-lg-10 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('f{enter}');
    cy.get(':nth-child(2) > :nth-child(2) > :nth-child(3) > .col-lg-10 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(2) > :nth-child(3) > .col-lg-10 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('f{enter}');
    cy.get('#form > :nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(1) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#form > :nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(1) > .row > :nth-child(1) > .form-control').type('1');
    cy.get(':nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(1) > .row > .pl-0 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(1) > .row > .pl-0 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('g{enter}');
    cy.get('#form > :nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('#form > :nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(2) > .form-control').type('1000');
    cy.get('.col-10 > .btn-success').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('Search and reset Existing Inventory', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(9) > .nav-link > .fas').click();
    cy.get('.page-header > .row > :nth-child(1) > .input-group > .form-control').clear();
    cy.get('.page-header > .row > :nth-child(1) > .input-group > .form-control').type('tires{enter}');
    cy.get(':nth-child(2) > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('f{enter}');
    cy.get(':nth-child(3) > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(3) > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('m{enter}');
    cy.get(':nth-child(4) > .mr-2').click();
    cy.get(':nth-child(4) > [type="button"]').click();
    /* ==== End Cypress Studio ==== */
  });
 /* === Test Created with Cypress Studio === */
it('edit, update and delete existing inventory', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(9) > .nav-link > .fas').click();
  cy.get('#dropdownMenuButton-1 > .fas').click();
  cy.get('[ng-reflect-router-link="/fleet/inventory/edit/f9e1ca80"]').click({ force: true });
  // cy.get(':nth-child(1) > :nth-child(2) > :nth-child(3) > .col-lg-2 > .btn > .fas').click();
  // cy.get('#groupForm > form.ng-untouched > :nth-child(1) > .form-group > .form-control').clear();
  // cy.get('#groupForm > form.ng-untouched > :nth-child(1) > .form-group > .form-control').type('mechtronics');
  // cy.get('#categoryModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
  cy.get(':nth-child(1) > .col-lg-2 > .modal-with-form > .fas').click();
  cy.get('#warehoseForm > :nth-child(1) > .form-group > .form-control').clear();
  cy.get('#warehoseForm > :nth-child(1) > .form-group > .form-control').type('mg hector');
  cy.get('.form-group > :nth-child(2) > :nth-child(1) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get('.form-group > :nth-child(2) > :nth-child(1) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('cana{enter}');
  cy.get('.form-group > :nth-child(2) > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get('.form-group > :nth-child(2) > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('albe{enter}');
  cy.get('.form-group > :nth-child(3) > :nth-child(1) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.get('.form-group > :nth-child(3) > :nth-child(1) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('w{enter}');
  cy.get('.form-group > :nth-child(3) > :nth-child(2) > .form-control').clear();
  cy.get('.form-group > :nth-child(3) > :nth-child(2) > .form-control').type('416004');
  cy.get(':nth-child(4) > .col-lg-12 > .form-control').clear();
  cy.get(':nth-child(4) > .col-lg-12 > .form-control').type('fashion street, alberta ');
  cy.get('#warehouseModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
  cy.get('.col-10 > .btn-success').click();
  cy.get('#dropdownMenuButton-0 > .fas').click();
  cy.get(':nth-child(1) > :nth-child(9) > .dropdown > .dropdown-menu > [href="javascript:;"]').click();
  /* ==== End Cypress Studio ==== */
});

it('validation error message Test', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(9) > .nav-link > .fas').click();
  cy.get('[routerlink="/fleet/inventory/add"]').click();
  cy.get('.col-10 > .btn-success').click();
  /* ==== End Cypress Studio ==== */
});
/* === Test Created with Cypress Studio === */
it('Adding transfer inventory', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(9) > .nav-link > .fas').click();
  cy.get('.col-md-4 > .modal-with-form').click();
  cy.get('#transferModal > .modal-dialog > .modal-content > .modal-body > form.ng-untouched > .form-row > .form-group > :nth-child(1) > :nth-child(1) > .form-control').clear();
  cy.get('#transferModal > .modal-dialog > .modal-content > .modal-body > form.ng-untouched > .form-row > .form-group > :nth-child(1) > :nth-child(1) > .form-control').type('123as');
  cy.get('.form-group > :nth-child(2) > :nth-child(1) > .form-control').clear();
  cy.get('.form-group > :nth-child(2) > :nth-child(1) > .form-control').type('5');
  cy.get('.form-group > :nth-child(3) > :nth-child(1) > .form-control').select('18faf020-a436-11eb-b72c-9fd36c59e7d8');
  cy.get('.form-row > .form-group > :nth-child(1) > :nth-child(2)').click();
  cy.get('.form-group > :nth-child(1) > :nth-child(2) > .form-control').clear();
  cy.get('.form-group > :nth-child(1) > :nth-child(2) > .form-control').type('engine');
  cy.get('.form-group > :nth-child(2) > :nth-child(2) > .form-control').click();
  cy.get('.form-group > :nth-child(2) > :nth-child(2) > .form-control').click();
  cy.get(':nth-child(3) > :nth-child(2) > .form-control').select('25243f10-a430-11eb-b72c-9fd36c59e7d8');
  cy.get('#transferModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
  /* ==== End Cypress Studio ==== */
});


});


