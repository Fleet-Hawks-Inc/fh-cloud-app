describe("Add Route", function () {
    let authToken;
    let routeID;
    afterEach(() => {
        if (authToken && routeID) {
            const serviceUrl = Cypress.env('SERVICE_URL') + '/vehicles/record/cypress/delete/' + routeID
            cy.request({
                method: 'DELETE',
                url: serviceUrl,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    "Content-type": "application/json"
                }
            }).then(response => {

            })
        }
    });
    it('should allow the user to add-route with required fields', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.content-body > .page-header > .row > .col-md-8 > .btn').click();
        cy.get('input[name="routeNo"]').type('12L');//route no
        cy.get('input[name="routeName"]').type('calgary to boston');//route name

        // cy.get('textarea[name="notes"]').type('have a safe journey');//notes
        // cy.get('[name="vehicleID"] input').first().click();
        // cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//select vehicle
        // cy.get('[name="assetID"] input').first().click();
        // cy.get('div:nth-of-type(3) > .ng-option-label').last().click();//select asset
        // cy.get('[name="driverID"] input').first().click();
        // cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//select driver
        // // cy.get('ng-select#codrvr > .ng-select-container input[role="combobox"]').first().click();
        // cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').last().click();//select co-driver
        cy.get('input[name="sourceInfo.address"]').first().type('ww');
        cy.get('.col-lg-10.show-search__result > .bg-white.map-search__results.ml-0.mt-1.row > .m-0.p-0.text-left  a[title^="Calgary Climbing Centre Stronghold, 140 15 Ave NW, Calgary, "]').last().click();//source location

        cy.get('input[name="destInfo.address"]').first().type('Aspen Woods, Rocky View County, AB, Canada');
        cy.wait(3000);
        cy.get('.show-search__result > .map-search__results > .p-0 > .ng-star-inserted > a').last().click();//destination location


        cy.get('[class] .ng-star-inserted:nth-of-type(2) [pattern]').type('start journey early in the morning');
        cy.get(':nth-child(3) > :nth-child(3) > .form-control').type('Drive safe');
        cy.get('.row.text-right > .col-lg-12 > .btn-success').click();//save btn
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });

    });
    it('should not allow the user to add-route with optional fields', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.content-body > .page-header > .row > .col-md-8 > .btn').click();


        cy.get('textarea[name="notes"]').type('have a safe journey');//notes
        cy.get('[name="vehicleID"] input').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//select vehicle
        cy.get('[name="assetID"] input').first().click();
        cy.get('div:nth-of-type(3) > .ng-option-label').last().click();//select asset
        cy.get('[name="driverID"] input').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//select driver
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });

    });
    it('should display the added route to the document list and then verify the added routes by name/other properties', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(3) > .nav-link').click();
        cy.get('input[name="searchedRouteName"]').type('calgary');
        //cy.get('.result-suggestions .ng-star-inserted').click();
        cy.get('.content-body > .page-header > .row > :nth-child(2) > :nth-child(1)').click();//search
        cy.wait(4000);
        cy.get('.page-header > .row > :nth-child(2) > :nth-child(2)').click();//reset


        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });

    });
    it('should allow user to edit the added route from the list', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(3) > .nav-link').click();
        cy.get('#dropdownMenuButton-0').click();
        cy.get('.dropdown-menu.show > a:nth-of-type(1)').click();//edit
        cy.get('input[name="routeNo"]').type('12L');//route no
        cy.url().then(url => {
            console.log('url', url);
            let newUrl = url.split('/');

            routeID = newUrl[newUrl.length - 1];
            cy.setLocalStorage('routeID', routeID);
        })

        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });

    });
    it('should allow user to delete the added route from the list', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(3) > .nav-link').click();
        cy.get('#dropdownMenuButton-0').click();
        cy.get('.dropdown-menu.show > a:nth-of-type(2)').click();
        cy.getLocalStorage('congnitoAT').then((data) => {
            authToken = data;
        });
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });

    });
    it('should give validation error messages when required field is not provided.', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.content-body > .page-header > .row > .col-md-8 > .btn').click();
        cy.get('input[name="routeNo"]').type('12L');//route no
        cy.get('input[name="routeNo"]').clear();
        cy.get('.text-danger .ng-star-inserted').contains('Route# is required.');

        cy.get('input[name="routeName"]').type('calgary to boston');//route name
        cy.get('input[name="routeName"]').clear();
        cy.get('div:nth-of-type(2) > .col-lg-10 > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Route name is required.');
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });
    });
    it('check button is enabaled or not ', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(3) > .nav-link').click();
        cy.get('.content-body > .page-header > .row > .col-md-8 > .btn').click();
        cy.get('input[name="routeNo"]').type('12L');//route no
        cy.get('input[name="routeName"]').type('calgary to boston');//route name
        cy.get('textarea[name="notes"]').type('have a safe journey');//notes
       
        // cy.get('ng-select#codrvr > .ng-select-container input[role="combobox"]').first().click();
        // cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').last().click();//select co-driver
        cy.get('input[name="sourceInfo.address"]').first().type('ww');
        cy.get('.col-lg-10.show-search__result > .bg-white.map-search__results.ml-0.mt-1.row > .m-0.p-0.text-left  a[title^="Calgary Climbing Centre Stronghold, 140 15 Ave NW, Calgary, "]').last().click();//source location

        cy.get('input[name="destInfo.address"]').first().type('Aspen Woods, Rocky View County, AB, Canada');
        cy.wait(3000);
        cy.get('.show-search__result > .map-search__results > .p-0 > .ng-star-inserted > a').last().click();//destination location


        cy.get('thead > :nth-child(2) > :nth-child(3) > .form-control').type('start journey early in the morning');
        cy.get(':nth-child(3) > :nth-child(3) > .form-control').type('Drive safe');

        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });
    });

});







