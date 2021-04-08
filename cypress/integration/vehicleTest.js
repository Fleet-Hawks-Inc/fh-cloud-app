describe('vehicle Test', function () {
    it('should allow the user to add vehicle',function () {

        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        
        cy.get('fleet-sidebar > ul > li:nth-of-type(3) > .nav-link').first().click({force:true});
       
        cy.get('.col-md-6 > .btn-success').first().click({force:true});
        
        cy.get('#details [name="vehicleIdentification"]').first().type('Tesla Benz');//vehicle number
        cy.get('div#details > div > div:nth-of-type(1) > div:nth-of-type(2) > div > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(16)').last().click();//vehicle type
        cy.get('#details [name="VIN"]').first().type('5yjklmnop12378945');//vin number
        cy.get('#details [class="col-lg-5"]:nth-of-type(4) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(20)').last().click()//year
        cy.get('#details [name="plateNumber"]').first().type('PB-11-DJ-1236');//plate number
        cy.get('#details [class="col-lg-10"]:nth-of-type(6) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(10)').last().click();//make
        cy.get('#details [class="col-lg-10"]:nth-of-type(8) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();//model
        cy.get('#details [class="col-lg-10"]:nth-of-type(10) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();//country
        cy.get('#details [class="col-lg-10"]:nth-of-type(11) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(5)').last().click();//state
        const file3 = 'method.txt'
        cy.get('input[name="uploadedDocs"]').attachFile(file3);
        cy.get('div#details > div > div:nth-of-type(2) input[name="annualSafetyDate"]').first().click();
        cy.get('[role] [role="row"]:nth-of-type(2) [role="gridcell"]:nth-of-type(4) .ng-star-inserted').last().click();//Annual safety date
        cy.get('#details [class="row pt-3"]:nth-of-type(3) [class="col-lg-5 offset-lg-1"]:nth-of-type(2) [class="col-lg-10"]:nth-of-type(1) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').last().click();//status
        cy.get('div:nth-of-type(3) > div:nth-of-type(3) ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').last().click();//ownership
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenext
        cy.get('div#lifecycle > div > div:nth-of-type(1) > div:nth-of-type(2) input[name="lifeCycle.startDate"]').first().click();
        cy.get('div:nth-of-type(3) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();//start date
        cy.get('div:nth-of-type(1) > div:nth-of-type(3) input[name="lifeCycle.inServiceOdometer"]').first().type('4566');//in-service-odometer
        cy.get('input[name="lifeCycle.estimatedServiceYears"]').first().type('20');//in-service-years
        cy.get('#lifecycle [class="col-lg-5"]:nth-of-type(2) [min]').first().type('20');//in-service-month
        cy.get('input[name="lifeCycle.estimatedResaleValue"]').first().type('4500');//depreciation value
        cy.get('input[name="lifeCycle.estimatedServiceMiles"]').first().type('20000');//service life in miles
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt
        cy.get('#specifications [class="row pt-3"]:nth-of-type(1) [class="col-lg-5 offset-lg-1"]:nth-of-type(2) [min]').first().type('20');
        cy.get('#specifications [class="col-lg-5 offset-lg-1"]:nth-of-type(2) .ng-select-container').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//height 
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt
        cy.get('input[name="insurance.dateOfIssue"]').first().click();
        cy.get('[role] [role="row"]:nth-of-type(3) [role="gridcell"]:nth-of-type(3) .ng-star-inserted').last().click();//date of issue
        cy.get('input[name="insurance.premiumAmount"]').first().type('200');//premium account
        cy.get('input[name="insurance.amount"]').first().clear();
        cy.get('input[name="insurance.amount"]').first().type('45620');//insurance value
        cy.get('div#insurance > div > div:nth-of-type(2) > div:nth-of-type(2) > .row > div:nth-of-type(2) ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//insurance amount
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt
        cy.get('div#fluids > div > div:nth-of-type(1) > div:nth-of-type(2) > .row  ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//fueltype
        cy.get('div:nth-of-type(1) > div:nth-of-type(3) > .row input[name="fluid.fuelTankOneCapacity"]').first().type('250');
        cy.get('div#fluids > div > div:nth-of-type(1) > div:nth-of-type(3) > .row > div:nth-of-type(1) ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//fuel tank1
        cy.get('input[name="fluid.fuelTankTwoCapacity"]').first().type('350');
        cy.get('div#fluids > div > div:nth-of-type(1) > div:nth-of-type(3) > .row > div:nth-of-type(2) ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();//fuel tank2
        cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .row input[name="fluid.oilCapacity"]').first().type('250');
        cy.get('div#fluids > div > div:nth-of-type(2) > div:nth-of-type(2) > .row > .col-lg-10 ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//oil capacity2
        cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .row input[name="fluid.def"]').first().type('450');
        cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .row > .col-lg-10 ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();//diesel Exhaust Capacity
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();
        cy.get('input[name="wheelsAndTyres.numberOfTyres"]').first().type('18');//number of tires
        cy.get('input[name="wheelsAndTyres.driveType"]').first().type('4x4');//drive type
        cy.get('input[name="wheelsAndTyres.brakeSystem"]').first().type('air');//brake system
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt
        cy.get('input[name="engine.engineSummary"]').first().type('5.0l');//engine summary
        cy.get('input[name="engine.engineBrand"]').first().type('Cummins');//Engine Brand
        cy.get('input[name="engine.cylinders"]').first().type('8');//Cylinders
        cy.get('input[name="engine.stroke"]').first().type('3.47');//stroke
        cy.get('input[name="engine.valves"]').first().type('16');//valve
        cy.get('input[name="engine.transmissionSummary"]').first().type('6-speed shiftable Automatic');
        cy.get('input[name="engine.transmissionType"]').first().type('Continuously Variable');
        cy.get('input[name="engine.transmissionGears"]').first().type('6');
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt
        cy.get('.d-flex  ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//Purchase vendor
        cy.get('input[name="purchase.purchasePrice"]').first().type('7000');
        cy.get('div#purchase  .pt-3.row > div:nth-of-type(2) > div:nth-of-type(2) ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();//purchase price
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();//savenxt
        cy.get('div#loan  .pt-3.row > div:nth-of-type(2) > div:nth-of-type(1)  ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//loan vendor
        cy.get('[class="btn btn-success mt-4 ng-star-inserted"]').first().click();


    });
    it('should list the vehicle which was added and then verify the added vehicle is listed by name/other properties',function(){
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
        cy.get(':nth-child(3) > .nav-link > .fas').first().click({force:true});
      
       cy.get('form[method="get"] input[name="vehicleIdentification"]').first().click();
       cy.get('form[method="get"] input[name="vehicleIdentification"').last().type('tesla benz');
       cy.get('section[role="main"]  form[method="get"] ul > li:nth-of-type(1)').click({force: true});
       cy.get('[class="col-md-2 col-lg-2 pl-2"] [type="submit"]').first().click();
       cy.get('[class="col-md-2 col-lg-2 pl-2"] [type="button"]').first().click();
       cy.get('.btn.btn-default.btn-md.driverbtn.dropdown-toggle.mr-1.toggleright').first().click();
       cy.get('form[method="get"] div[role="menu"] > a:nth-of-type(5)').last().click();

    });
    it('should allow user to delete vehicle', function () {
        cy.visit('/#/Login');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
        cy.get('#btnsubmit').click();
       
        cy.get(':nth-child(3) > .nav-link > .fas').first().click({force:true});
       
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
        
        cy.get(':nth-child(3) > .nav-link > .fas').first().click({force:true });
       
        cy.get('.col-md-6 > .btn-success').first().click({force:true});
        cy.get('.btn.btn-success.mt-4.ng-star-inserted').first().click();
        
        cy.get('div#details > div > div:nth-of-type(1) label#vehicleIdentification-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(2) > #vehicleType-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(3) > #VIN-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(4) > #year-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(5) > #plateNumber-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(6) > #manufacturerID-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(8) > #modelID-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(10) > #countryID-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(11) > #stateID-error').contains('This Field is not allowed to be empty');

        cy.get(':nth-child(3) > .row > :nth-child(1) > #annualSafetyDate-error').contains('This Field is not allowed to be empty');
        cy.get(':nth-child(1) > :nth-child(3) > :nth-child(2) > .row > :nth-child(1) > #currentStatus-error').contains('This Field is not allowed to be empty');


    });
});
