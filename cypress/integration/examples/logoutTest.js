/* === Test Created with Cypress Studio === */
it('Log Out', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://cloudapp.fleethawks.com/#/Login/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('hardeepcloud');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@1302');
  cy.get('#btnsubmit').click();
  cy.get('[data-toggle="dropdown"] > .fa').click();
  cy.get('#lnkLogout').click();
  cy.wait('http://cloudapp.fleethawks.com/#/Map-Dashboard');
  cy.get('li:nth-of-type(4) > .nav-link > span').contains('Assets').click();
  /* ==== End Cypress Studio ==== */
});