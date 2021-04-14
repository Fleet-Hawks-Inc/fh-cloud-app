describe(" reminders tests", () => {

  /* === Test Created with Cypress Studio === */
  it('Add contact Renewal', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(2000);
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('elena jacob{enter}');
    //cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    //cy.get('.col-lg-1 > .modal-with-form > .fas').click();
    //cy.get('#serviceTaskForm > :nth-child(1) > .col-lg-12 > .form-control').clear();
    //cy.get('#serviceTaskForm > :nth-child(1) > .col-lg-12 > .form-control').type('tyres renewal');
    //cy.get('#addServiceTasks > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('Brake renewal{enter}');
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .form-control').click();
    cy.get('.ngb-dp-today > .btn-light').click();
    cy.get('.col-10 > .btn-success').click();
    /* ==== End Cypress Studio ==== */
  });

  /* === Test Created with Cypress Studio === */
  it('Search and reset the reminder', function () {

    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.page-header > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla truck1{enter}');

    cy.get('.page-header > .row > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tyres renewal{enter}');
    //cy.get('#a3df10f1d2e2-0 > .ng-option-label').click();
    cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('All{enter}');
    //cy.get('#ad2b430e76c1-0').click();
    cy.get(':nth-child(4) > .mr-2').click();
    cy.get('.row > :nth-child(4) > [type="button"]').click();

    
  });
  /* === Test Created with Cypress Studio === */
  it('Delete reminder', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(3) > :nth-child(6) > .btn-group > .btn > .fas').click();
    cy.get(':nth-child(3) > :nth-child(6) > .btn-group > .dropdown-menu > :nth-child(3)').click();
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
    cy.get('.ng-star-inserted > .nav > :nth-child(6) > .nav-link').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get('.col-10 > .btn-success').click();
    /* ==== End Cypress Studio ==== */
  });

});
