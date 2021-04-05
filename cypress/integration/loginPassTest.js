/* === Test Created with Cypress Studio === */
it('login test pass', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://cloudapp.fleethawks.com/#/Login/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('hardeepcloud');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@1302');
  cy.get('#btnsubmit').click();
  /* ==== End Cypress Studio ==== */
});