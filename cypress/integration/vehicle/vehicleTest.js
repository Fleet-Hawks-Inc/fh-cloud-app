describe('vehicle Test', function () {
    it('should allow users to add vehicles with all required fields.', function () {

        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('fleet-sidebar > ul > li:nth-of-type(3) > .nav-link').click();
        cy.get('.col-md-6 > .btn-success').click();
        cy.get('.col-12 input[name="vehicleIdentification"]').first().type('Cascadia benz');//vehicle number
        cy.get('.col-lg-5.mb-2.pb-1 > .row > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(16)').last().click();//vehicle type
        cy.get('#form_ > .m-2 > :nth-child(1) > .col-12 > .bg-white > :nth-child(1) > :nth-child(2) > .row > :nth-child(3) > .form-control').type('1C4BJWDG8DL559834');//vin number
        cy.get('#form_ > .m-2 > :nth-child(1) > .col-12 > .bg-white > :nth-child(1) > :nth-child(2) > .row > :nth-child(4) > .form-control').type('PBAL7801');//plate number
        cy.get('[class] [class="col-lg-5"]:nth-of-type(5) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(19) .ng-star-inserted').last().click()//year
        cy.get('[class] [class="col-lg-5"]:nth-of-type(6) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();//make
        cy.get('.bg-white.p-3.text-dark ng-select#vehicleSelect input[role="combobox"]').first().click();
        cy.get('div[role="option"]').last().click();//model
        cy.get('[class="col-lg-5 mb-2 pb-1 offset-lg-1"] [class="col-lg-5"]:nth-of-type(1) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//country
        cy.get('.bg-white.p-3.text-dark ng-select#stateSelect input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//state
        cy.get('.col-12 input[name="annualSafetyDate"]').first().click();
        cy.get('[role] [role="row"]:nth-of-type(2) [role="gridcell"]:nth-of-type(2) .ng-star-inserted').last().click();//Annual safety date
        cy.get('[class="col-lg-5 mb-1"] [class="col-lg-5"]:nth-of-type(1) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();//status
        cy.get('.adddriverpl.form-group.pt-2.row ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div[role="option"]').last().click();//inspection form

        cy.get('.col-lg-10 > input[name="lifeCycle.startDate"]').first().click();
        cy.get('[role] [role="row"]:nth-of-type(2) [role="gridcell"]:nth-of-type(4) .ng-star-inserted').last().click();//start date
        cy.get('.col-lg-10 > input[name="lifeCycle.inServiceOdometer"]').first().type('4566');//in-service-odometer

        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();
        cy.wait(4000);
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
          })


    });
    it('should not allow users to add vehicles with optional fields.', function () {

        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();

        cy.get('fleet-sidebar > ul > li:nth-of-type(3) > .nav-link').click();

        cy.get('.col-md-6 > .btn-success').click();

        cy.get('[name="driverID"] input').first().click();
        cy.get('.ng-option-label.ng-star-inserted').last().click();//assign driver

        // cy.get('[name='teamDriverID'] input').first().click();
        // cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').last().click();//assign driver

        cy.get('[name="servicePrograms"] input').first().click();
        cy.get('.ng-option-label').last().click();//service maintenace
        cy.get('[name="groupID"] input').first().click();
        cy.get('.ng-option-label').last().click();//group
        cy.get('[name="ownership"] input').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();//ownership
        cy.get('[name="vehicleColor"]').type('red');//vehicle color



        cy.get('input[name="lifeCycle.estimatedServiceYears"]').first().type('20');//in-service-years
        cy.get('input[name="lifeCycle.estimatedServiceMonths"]').first().type('20');//in-service-month
        cy.get('input[name="lifeCycle.estimatedResaleValue"]').first().type('4500');//depreciation value
        cy.get('input[name="lifeCycle.estimatedServiceMiles"]').first().type('20000');//service life in miles




        cy.get('input[name="lifeCycle.outOfServiceDate"]').first().click();
        cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();//date of issue
        cy.get('input[name="lifeCycle.outOfServiceOdometer"]').type('4141');
        cy.get('.bg-white.p-3.text-dark input[name="specifications.height"]').type('14');//height
        cy.get('[class="row adddriverpl pt-1 mt-1"] [class="col-lg-5 mb-2 pb-1"] [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();//height type
        cy.get('input[name="specifications.groundClearnce"]').type('14');//length

        cy.get('[name="specifications\.groundClearnceUnit"] input').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();//length
        cy.get('input[name="specifications.tareWeight"]').type('522');
        cy.get('input[name="specifications.grossVehicleWeightRating"]').type('522');
        cy.get('input[name="insurance.dateOfIssue"]').first().click();
        cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();//date of issue

        cy.get('input[name="insurance.premiumAmount"]').first().type('200');//premium account
        cy.get('[name="insurance\.premiumCurrency"] input').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//currency type
        cy.get('input[name="insurance.dateOfExpiry"]').first().click();
        cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();//date of issue
        cy.get('input[name="insurance.reminder"]').type('4');//reminder
        cy.get('.adddriverpl.pt-3.row .col-lg-6.pl-0 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//reminder time
        cy.get('[name="insurance\.vendorID"] input').first().click();
        cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//vendror
        cy.get('input[name="insurance.policyNumber"]').type('LOJO456'); //insurance number
        cy.get('input[name="insurance.amount"]').first().clear();
        cy.get('input[name="insurance.amount"]').first().type('45620');//insurance value
        cy.get('[name="insurance\.amountCurrency"] input').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//insurance currency type


        cy.get('.col-lg-12 > .bg-white.p-3.text-dark  .col-lg-5.mb-2.pb-1 > .row > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//fueltype
        cy.get('.bg-white.p-3.text-dark input[name="fluid.fuelTankOneCapacity"]').first().type('250');
        cy.get('[class="adddriverpl row pt-2"] [class="col-lg-5 offset-lg-1 mb-2 pb-1"] [class="col-lg-10"]:nth-of-type(1) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//fuel tank1
        cy.get('input[name="fluid.fuelTankTwoCapacity"]').first().type('350');
        cy.get('[name="fluid\.fuelTankTwoType"] input').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();//fuel tank2
        cy.get('.bg-white.p-3.text-dark input[name="fluid.oilCapacity"]').first().type('250');
        // cy.get('div#fluids > div > div:nth-of-type(2) > div:nth-of-type(2) > .row > .col-lg-10 ng-select[role="listbox"] input[role="combobox"]').first().click();
        // cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//oil capacity2
        // cy.get('.bg-white.p-3.text-dark input[name="fluid.def"]').first().type('450');
        // cy.get('.col-lg-5.mb-3.offset-lg-1.pb-1 > .row > .col-lg-10 > .row > .col-lg-6.pl-0 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        // cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();//diesel Exhaust Capacity
        // cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();
        // cy.get('input[name="wheelsAndTyres.numberOfTyres"]').first().type('18');//number of tires
        // cy.get('input[name="wheelsAndTyres.driveType"]').first().type('4x4');//drive type
        // cy.get('input[name="wheelsAndTyres.brakeSystem"]').first().type('air');//brake system
        // cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt
        // cy.get('input[name="engine.engineSummary"]').first().type('5.0l');//engine summary
        // cy.get('input[name="engine.engineBrand"]').first().type('Cummins');//Engine Brand
        // cy.get('input[name="engine.cylinders"]').first().type('8');//Cylinders
        // cy.get('input[name="engine.stroke"]').first().type('3.47');//stroke
        // cy.get('input[name="engine.valves"]').first().type('16');//valve
        // cy.get('input[name="engine.transmissionSummary"]').first().type('6-speed shiftable Automatic');
        // cy.get('input[name="engine.transmissionType"]').first().type('Continuously Variable');
        // cy.get('input[name="engine.transmissionGears"]').first().type('6');
        // cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt

        // // cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//Purchase vendo

        // cy.get('input[name="purchase.purchasePrice"]').first().type('7000');
        // cy.get('div#purchase  .pt-3.row > div:nth-of-type(2) > div:nth-of-type(2) ng-select[role="listbox"] input[role="combobox"]').first().click();
        // cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();//purchase price
        // cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt
        // cy.get('div#loan  .pt-3.row > div:nth-of-type(2) > div:nth-of-type(1)  ng-select[role="listbox"] input[role="combobox"]').first().click();
        // // cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//loan vendor
        // cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();


    });
    it('should list the vehicle which was added and then verify the added vehicle is listed by name/other properties', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get(':nth-child(3) > .nav-link > .fas').first().click({ force: true });

        cy.get('form[method="get"] input[name="vehicleIdentification"]').first().click();
        cy.get('form[method="get"] input[name="vehicleIdentification"').last().type('Cascadia benz');
        cy.get('section[role="main"]  form[method="get"] ul > li:nth-of-type(1)').click({ force: true });
        cy.get('[class="col-md-2 col-lg-2 pl-2"] [type="submit"]').first().click();
        cy.get('[class="col-md-2 col-lg-2 pl-2"] [type="button"]').first().click();



    });
    it('should allow user to delete vehicle', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();

        cy.get(':nth-child(3) > .nav-link > .fas').first().click();

        cy.get('#dropdownMenuButton-0').first().click();
        cy.get(':nth-child(1) > :nth-child(9) > .dropdown > .dropdown-menu > [href="javascript:;"]').last().click();

    });
    it('should give validation error message when required fields are not provided', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('fleet-sidebar > ul > li:nth-of-type(3) > .nav-link').click();
        cy.get('.col-md-6 > .btn-success').click();
        cy.get('.col-12 input[name="vehicleIdentification"]').first().type('Tesla Benzz');//vehicle number
        cy.get('.col-12 input[name="vehicleIdentification"]').clear();
        cy.get('[class="row pt-2 adddriverpl"] .ng-star-inserted .ng-star-inserted').contains('Vehicle name/number is required.');

        cy.get('#form_ > .m-2 > :nth-child(1) > .col-12 > .bg-white > :nth-child(1) > :nth-child(2) > .row > :nth-child(3) > .form-control').type('5sjklmnop12378945');//vin number
        cy.get('#form_ > .m-2 > :nth-child(1) > .col-12 > .bg-white > :nth-child(1) > :nth-child(2) > .row > :nth-child(3) > .form-control').clear();
        cy.get('.col-lg-5.mb-2.pb-1 > .row > div:nth-of-type(3) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('VIN is required.');
        cy.get('#form_ > .m-2 > :nth-child(1) > .col-12 > .bg-white > :nth-child(1) > :nth-child(2) > .row > :nth-child(4) > .form-control').type('PBAL7801');//plate number
        cy.get('#form_ > .m-2 > :nth-child(1) > .col-12 > .bg-white > :nth-child(1) > :nth-child(2) > .row > :nth-child(4) > .form-control').clear();
        cy.get('div:nth-of-type(4) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Plate number is required.');
        cy.get('.col-lg-10 > input[name="lifeCycle.inServiceOdometer"]').type('4566');
        cy.get('.col-lg-10 > input[name="lifeCycle.inServiceOdometer"]').clear();
        cy.get('.col-lg-12 > .bg-white.p-3.text-dark .ng-star-inserted').contains('In-Service odometer is required.');
    });
    it('check button is enabled or not.', function () {

        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get('fleet-sidebar > ul > li:nth-of-type(3) > .nav-link').click();
        cy.get('.col-md-6 > .btn-success').click();
        cy.get('.col-12 input[name="vehicleIdentification"]').first().type('Tesla Benzz');//vehicle number
        cy.get('.col-lg-5.mb-2.pb-1 > .row > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(16)').last().click();//vehicle type
        cy.get('#form_ > .m-2 > :nth-child(1) > .col-12 > .bg-white > :nth-child(1) > :nth-child(2) > .row > :nth-child(3) > .form-control').type('5sjklmnop12378945');//vin number
        cy.get('#form_ > .m-2 > :nth-child(1) > .col-12 > .bg-white > :nth-child(1) > :nth-child(2) > .row > :nth-child(4) > .form-control').type('PBAL7801');//plate number
        cy.get('[class] [class="col-lg-5"]:nth-of-type(5) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(19) .ng-star-inserted').last().click()//year
        cy.get('[class] [class="col-lg-5"]:nth-of-type(6) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();//make
        cy.get('.bg-white.p-3.text-dark ng-select#vehicleSelect input[role="combobox"]').first().click();
        cy.get('div[role="option"]').last().click();//model
        cy.get('[class="col-lg-5 mb-2 pb-1 offset-lg-1"] [class="col-lg-5"]:nth-of-type(1) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//country
        cy.get('.bg-white.p-3.text-dark ng-select#stateSelect input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//state
        cy.get('.col-12 input[name="annualSafetyDate"]').first().click();
        cy.get('[role] [role="row"]:nth-of-type(2) [role="gridcell"]:nth-of-type(2) .ng-star-inserted').last().click();//Annual safety date
        cy.get('[class="col-lg-5 mb-1"] [class="col-lg-5"]:nth-of-type(1) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();//status
        cy.get('.adddriverpl.form-group.pt-2.row ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div[role="option"]').last().click();//inspection form

        cy.get('.col-lg-10 > input[name="lifeCycle.startDate"]').first().click();
        cy.get('[role] [role="row"]:nth-of-type(2) [role="gridcell"]:nth-of-type(4) .ng-star-inserted').last().click();//start date
        cy.get('.col-lg-10 > input[name="lifeCycle.inServiceOdometer"]').first().type('4566');//in-service-odometer





    });
});
