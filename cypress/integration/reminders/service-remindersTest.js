describe(" Reminders tests", () => {
  it('should allow users to add reminders with all required fields.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();

    cy.get(':nth-child(6) > .nav-link > .fas').first().click();

    cy.get('.col-md-4 > .btn').first().click();

    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.wait(1000);
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('Task Sevrice');
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').click();
    cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");

    cy.get('input[name="reminderData.lastServiceDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();
    cy.get('.col-11 > .btn-success').first().click();
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })

  });

  
it('should list the reminders which were added and then verify the added reminders are listed by name/other properties.', function() {

  cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();

  cy.get(':nth-child(6) > .nav-link > .fas').click();

  cy.get('.input-group.input-group-md.mb-3 > ng-select[role="listbox"] input[role="combobox"]').first().click();
  cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();

  cy.get('.input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla {enter}');
  cy.get('.page-header > .row > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
  cy.get('[name="searchServiceTask"] input').first().click();
  cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
  cy.get('[name="filterStatus"] input').first().click();
  cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').last().click();
  cy.get('.btn.btn-sm.btn-success.mr-3').click();
  cy.get('.page-header [type="button"]').click();

});



it('should allow users to delete reminders.', function() {

  cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
  cy.get(':nth-child(6) > .nav-link > .fas').click();
  cy.get(':nth-child(1) > :nth-child(6) > .btn-group > .btn > .fas').first().click();
  cy.get(':nth-child(1) > :nth-child(6) > .btn-group > .dropdown-menu > :nth-child(4)').click();
 
});



it('.should give validation error messages when the required field is not provided.', function() {

  cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();

    cy.get(':nth-child(6) > .nav-link > .fas').first().click();

    cy.get('.col-md-4 > .btn').first().click();
  cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");
  cy.get('input[name="subscribers"]').clear();
  cy.get('.col-lg-10 > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Email is required.');
  cy.get('input[name="tasks.time"]').clear();
  cy.get('input[name="tasks.time"]').type('2');
  cy.get('input[name="tasks.time"]').clear();
  cy.get('.col-lg-5.offset-lg-1 .ng-star-inserted').contains('Time is required.');
 
});


it.only('check button is enabled or not.', function () {

  cy.visit('/#/Login');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
  cy.get('#btnsubmit').click();

  cy.get(':nth-child(6) > .nav-link > .fas').first().click();

  cy.get('.col-md-4 > .btn').first().click();

  cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  cy.wait(1000);
  cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
  cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('Task Sevrice');
  cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').click();
  cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");

  cy.get('input[name="reminderData.lastServiceDate"]').first().click();
  cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();


});




});
















