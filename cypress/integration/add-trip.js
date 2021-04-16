describe("Add trip ", function () {
    it("should allow the user to add trip", function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(
            Cypress.config("testerUserName")
        );
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get(':nth-child(2) > .nav-link > span').click();
        cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
        cy.get('.my-2 > :nth-child(2) > .col-lg-10 > .form-control').clear();
        cy.get('.my-2 > :nth-child(2) > .col-lg-10 > .form-control').type('Trip 2507');
        cy.get('input[name="ordr"]').click();
        cy.get('[role="row"]:nth-of-type(1) [name]').first().click();
        cy.get('[class="btn btn-success modal-confirm mr-3"]').last().click();
        cy.get('.col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
        cy.get('.ng-option-label').click();
        cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .form-control').clear();
        cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .form-control').type('12369544');
        cy.get('.col-lg-10 > .row > :nth-child(1) > .form-control').clear();
        cy.get('.col-lg-10 > .row > :nth-child(1) > .form-control').type('340.69');
        cy.get('[name="reeferTemperatureUnit"] input').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
        cy.get('#HazMat1').click();
        cy.get('#HazMat2').click();
        cy.get('#HazMat3').click();
        cy.get('#HazMat4').click();
        cy.get('#HazMat5').click();
        cy.get('.text-right > .col-lg-12 > .btn-success').click();

    });

    it('should list the trip which was added and then verify the added trip is listed by name/other properties', function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(
            Cypress.config("testerUserName")
        );
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get(':nth-child(2) > .nav-link > span').click();
        cy.get('[name="category"] input').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
        cy.get('input[name="searchValue"]').type('2507');
        cy.get('input[name="fromDate"]').first().click();
        cy.get('div:nth-of-type(4) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();


        cy.get('input[name="toDate"]').first().click();
        cy.get('div:nth-of-type(4) > div:nth-of-type(5) > .btn-light.ng-star-inserted').last().click();

        cy.get('.btn.btn-sm.btn-success.mr-3').click();
        cy.get('.inner-wrapper .page-header [class] [type="button"]:nth-of-type(2)').click();

    });
    it('should allow user to delete trip', function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(
            Cypress.config("testerUserName")
        );
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get(':nth-child(2) > .nav-link > span').click();

        cy.get('#dropdownMenuButton-0').first().click();
        cy.get(':nth-child(12) > .dropdown > .dropdown-menu > :nth-child(2)').last().click();
    });
    // it.only('should give validation error message when required fields are not provided', function () {
    //     cy.visit("/#/Login");
    //     cy.get(":nth-child(1) > .input-group > .form-control").clear();
    //     cy.get(":nth-child(1) > .input-group > .form-control").type(
    //         Cypress.config("testerUserName")
    //     );
    //     cy.get(":nth-child(2) > .input-group > .form-control").clear();
    //     cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
    //     cy.get("#btnsubmit").click();
    //     cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    //     cy.get(':nth-child(2) > .nav-link > span').click();

        
    // });
});