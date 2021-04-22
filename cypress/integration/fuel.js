describe("Fuel Test", function () {
    it('should allow user to add Fuel Entry', function () {
        cy.visit('http://localhost:4200/');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
        cy.get('#btnsubmit').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
        cy.get('#form_ > .row > .text-right > .btn').click();
        cy.get('div#fuelVehicle > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();//Basic Details
        cy.get('input[name="fuelQty"]').clear();
        cy.get('input[name="fuelQty"]').type('15');//Fuel Quantity
        cy.get('input[name="fuelQtyAmt"]').clear();
        cy.get('input[name="fuelQtyAmt"]').type('50');//Fuel Amount
        cy.get('input[name="DEFFuelQty"]').clear();
        cy.get('input[name="DEFFuelQty"]').type('15');//DEF Fuel Quantity(Diesel Exaust Fuel)
        cy.get('input[name="DEFFuelQtyAmt"]').clear();
        cy.get('input[name="DEFFuelQtyAmt"]').type('50');
        cy.get('input[name="fuelData.totalAmount"]').clear();
        cy.get('input[name="fuelData.totalAmount"]').type('30');//Subtotal
        cy.get('div:nth-of-type(6) > .col-lg-6 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();//discount type
        cy.get('input[name="discAmount"]').clear();
        cy.get('input[name="discAmount"]').type('10');//discount amount
        cy.get('.ng-star-inserted.row > .col-lg-6 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();//Tax Type
        cy.get('input[name="tax[0].taxAmount"]').clear();
        cy.get('input[name="tax[0].taxAmount"]').type('10');//Tax Amount
        cy.get('input[name="fuelData.pricePerUnit"]').clear();
        cy.get('input[name="fuelData.pricePerUnit"]').type('5');//Cost Per litre
        cy.get('input[name="fuelData.amountPaid"]').clear();
        cy.get('input[name="fuelData.amountPaid"]').type('12');//Amount paid
        cy.get('input[name="fuelDate"]').first().click();
        cy.get('div:nth-of-type(3) > div:nth-of-type(4) > .btn-light.ng-star-inserted').last().click();//Fuel Date
        cy.get('input[name="fuelTime"]').type('10:30');//fuel time
        cy.get('[name="fuelType"] input').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();// fuel type
        cy.get('form#fuelForm > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//Paid By(Driver)
        cy.get('div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//Payment Mode
        cy.get('input[name="reference"]').type('FP1234');
        cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(36) > .ng-option-label.ng-star-inserted').last().click();//Country
        cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//province
        cy.get('div:nth-of-type(3) > div:nth-of-type(1) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();//city
        cy.get('div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(2) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//vendor
        const photo = 'download.jpg'
        cy.get('input[name="uploadedPhotos"]').attachFile(photo);
        cy.get('div:nth-of-type(5) input[name="odometer"]').clear();
        cy.get('div:nth-of-type(5) input[name="odometer"]').type('4500');//odometer
        cy.get('.col-10 > .btn-success').click();//save button
        cy.wait(5000);
    });
    it('should allow user to search the added fuel entry in list', function () {
        cy.visit('http://localhost:4200/');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
        cy.get('#btnsubmit').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
        cy.get('[class="col-md-2 col-lg-2"] [role="combobox"]').first().click();
        cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();
        cy.get('input[name="fromDate"]').first().click();
        cy.get('div:nth-of-type(5) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();//from date
        cy.get('input[name="toDate"]').first().click();
        cy.get('div:nth-of-type(6) > div:nth-of-type(4) > .btn-light.ng-star-inserted').last().click();//todate
        cy.get('.btn.btn-sm.btn-success.mr-2').click();//search
        cy.get('[class="col-md-2 col-lg- pl-2"] [type="button"]').click();//reset

    });

    it('should allow user to delete the listed entry of fuel', function () {
        cy.visit('http://localhost:4200/');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
        cy.get('#btnsubmit').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
        cy.get(':nth-child(2) > :nth-child(13) > .btn-group > .mb-1').first().click();
        cy.get(':nth-child(2) > :nth-child(13) > .btn-group > .dropdown-menu > button.dropdown-item').last().click();
    });
    it('should give validation error message when required fields are not provided', function () {
        cy.visit('http://localhost:4200/');
        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
        cy.get('#btnsubmit').click();
        cy.get('.ng-star-inserted > .nav > :nth-child(5) > .nav-link').click();
        cy.get('#form_ > .row > .text-right > .btn').click();
        cy.get('.col-10 > .btn-success').click();//save button
        cy.get('.col-lg-10 > #unitID-error').contains('This Field is not allowed to be empty');
        cy.get('#fuelDate-error').contains('This Field is not allowed to be empty');
        cy.get('#fuelType-error').contains('This Field is not allowed to be empty');
        cy.get('#paidBy-error').contains('This Field is not allowed to be empty');
        cy.get('#paymentMode-error').contains('This Field is not allowed to be empty');
        cy.get('#reference-error').contains('This Field is not allowed to be empty');
        cy.get('.col-lg-10 > #countryID-error').contains('This Field is not allowed to be empty');
        cy.get('#cityID-error').contains('This Field is not allowed to be empty');
        cy.get('.col-lg-10 > #stateID-error').contains('This Field is not allowed to be empty');
        cy.get('#vendorID-error').contains('This Field is not allowed to be empty');
        cy.get('.col-lg-10 > #odometer-error').contains('This Field must be larger than or equal to 1');

    });

});
