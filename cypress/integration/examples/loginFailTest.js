/* === Test Created with Cypress Studio === */
  it('Login Fail', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://devapp.fleethawks.com/#/Login/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('nameet');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('1234');
    cy.get('#btnsubmit').click();
    cy.get('.text').contains('Incorrect username or password.')
    /* ==== End Cypress Studio ==== */
  });