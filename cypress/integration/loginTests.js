describe('Login Tests', function () {
    it('should allow user to login when valid credentails are provided', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
    });
    it('should fail with errormessage when invalid credentials are provided', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type('kkkk');
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type('1234');
        cy.get('#btnsubmit').click();
        cy.get('.text').contains('Incorrect username or password.');//updated validation message
    });

    it('should give validation error message when neither username or password is not provided', function () {
        cy.visit('/#/Login');
        cy.get('#btnsubmit').click();
        cy.get('.text').contains("Username and Password is required");
    });
    it('should Login first and then Logout the existing carrier ', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.wait(2000);
        cy.get('#userbox > [data-toggle="dropdown"]').click();
        cy.get('#lnkLogout').click();
        
    });
});


