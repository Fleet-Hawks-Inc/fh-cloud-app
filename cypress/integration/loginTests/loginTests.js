it('login test', function () {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('/#/Login');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
  cy.get('#btnsubmit').click();
});

