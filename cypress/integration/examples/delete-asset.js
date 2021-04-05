/* === Test Created with Cypress Studio === */
it('delete asset', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://cloudapp.fleethawks.com/#/Login/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('hardeepcloud');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@1302');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(4) > .nav-link > span').click();
  cy.get('#dropdownMenuButton-0').click();
  cy.get(':nth-child(1) > :nth-child(10) > .dropdown > .dropdown-menu > [href="javascript:;"]').click();
  /* ==== End Cypress Studio ==== */
});