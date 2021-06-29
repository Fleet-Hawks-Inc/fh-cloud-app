// describe("Add Route", function () {
//     it('should allow the user to add-route with required fields', function () {
//         cy.visit('/#/Login');
//         cy.get(':nth-child(1) > .input-group > .form-control').clear();
//         cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
//         cy.get(':nth-child(2) > .input-group > .form-control').clear();
//         cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
//         cy.get('#btnsubmit').click();
//         cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
//         cy.get(':nth-child(3) > .nav-link > span').click();
//         cy.get('.content-body > .page-header > .row > .col-md-8 > .btn').click();
//         cy.get('input[name="routeNo"]').type('12L');//route no
//         cy.get('input[name="routeName"]').type('calgary to boston');//route name
//         cy.get('textarea[name="notes"]').type('have a safe journey');//notes
//         cy.get('[name="vehicleID"] input').first().click();
//         cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//select vehicle
//         cy.get('[name="assetID"] input').first().click();
//         cy.get('div:nth-of-type(3) > .ng-option-label').last().click();//select asset
//         cy.get('[name="driverID"] input').first().click();
//         cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//select driver
//         // cy.get('ng-select#codrvr > .ng-select-container input[role="combobox"]').first().click();
//         // cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').last().click();//select co-driver
//         cy.get('input[name="sourceInfo.address"]').type('ww');
//         cy.get('.col-lg-10.show-search__result > .bg-white.map-search__results.ml-0.mt-1.row > .m-0.p-0.text-left  a[title^="Calgary Climbing Centre Stronghold, 140 15 Ave NW, Calgary, "]').click();//source location
        
//         cy.get('input[name="destInfo.address"]').type('as');
//         cy.get('.col-lg-10.show-search__result > .bg-white.map-search__results.ml-0.mt-1.row > .m-0.p-0.text-left  a[title="Aspen Woods, Rocky View County, AB, Canada"]').click({force:true});//destination location
//         cy.get('.btn.btn-success.mt-1').click({force:true});//save btn







//         Cypress.on('uncaught:exception', (err, runnable) => {
//             // returning false here prevents Cypress from
//             // failing the test
//             return false
//         });

//     });
// });







