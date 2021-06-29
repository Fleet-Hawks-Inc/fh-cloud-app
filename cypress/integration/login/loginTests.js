describe('Login Tests', function () {
    it('should allow user to login when valid credentails are provided', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
          })
    });
    it('should fail with error message when invalid credentials are provided', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type('kkkk');
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type('1234');
        cy.get('#btnsubmit').click();
        cy.get('.text').contains('Incorrect username or password.');//Updated validation message
    });

    it('should give validation error message when neither username or password is not provided', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get('.pl-4').contains('Username is required.');
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get('.pl-4').contains('Password is required.');   
    });
    it('should login first and then logout the existing carrier ', function () {
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


