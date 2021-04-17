describe("Add Order", function () {
  it('should allow the user to add-order', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    cy.get('.col-lg-10 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get(':nth-child(2) > .mt-2 > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(2) > .mt-2 > .col-lg-10 > .form-control').type('132589');
    cy.get(':nth-child(3) > :nth-child(2) > .col-lg-5 > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(2) > .col-lg-5 > .form-control').type('Raghav Oberoi');
    cy.get('.form-group.mt-3 > :nth-child(3) > :nth-child(3) > :nth-child(1) > .form-control').clear();
    cy.get('.form-group.mt-3 > :nth-child(3) > :nth-child(3) > :nth-child(1) > .form-control').type('1248566');
    cy.get(':nth-child(3) > :nth-child(3) > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(3) > :nth-child(2) > .form-control').type('yahoo@gmail.com');
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').type('589622');
    cy.get('div#collapseShipperArea-0 > .row  ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get('#collapseShipperArea-0 > :nth-child(2) > .col-lg-12 > .form-control').clear();
    cy.get('#collapseShipperArea-0 > :nth-child(2) > .col-lg-12 > .form-control').type('cal');
    cy.get('#collapseShipperArea-0 > :nth-child(2) > .col-lg-12 > .p-0 > :nth-child(1) > a').click();
    cy.get('input[name="pickupDate"]').first().click();
    cy.get('div:nth-of-type(5) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();//datepicker
    cy.get('input[name="pickupTime"]').last().type('01:30');//datetime
    cy.get('#collapseShipperArea-0 > :nth-child(5) > .col-lg-12 > #inputDefault').type('Geroge smith');
    cy.get('#collapseShipperArea-0 > :nth-child(6) > .col-lg-12 > #inputDefault').clear();
    cy.get('#collapseShipperArea-0 > :nth-child(6) > .col-lg-12 > #inputDefault').type('1741398');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(1) > .col-lg-10 > .form-control').clear();
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(1) > .col-lg-10 > .form-control').type('Nut bolts');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(2) > .col-lg-12 > #inputDefault').clear();
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(2) > .col-lg-12 > #inputDefault').type('123692');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(2) > .form-control').clear();
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(2) > .form-control').type('30');
    cy.get('div#collapseShipperArea-0 > .ng-star-inserted > div:nth-of-type(3)  ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').last().click();
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(2) > .form-control').type('2500');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(3) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();
    cy.get('#collapseShipperArea-0 > :nth-child(8) > .col-lg-5 > .btn-group-toggle > :nth-child(1)').click();
    cy.get('.mb-1 > .btn').click();
    // <------------------------------------Add cosignee---------------------------------------------------------->
    cy.get('#collapseReceiverArea-0 > :nth-child(1) > .col-lg-11 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').click();
    cy.get('#collapseReceiverArea-0 > :nth-child(2) > .col-lg-12 > .form-control').clear();
    cy.get('#collapseReceiverArea-0 > :nth-child(2) > .col-lg-12 > .form-control').type('us');
    cy.get('#collapseReceiverArea-0 > :nth-child(2) > .col-lg-12 > .p-0 > :nth-child(3) > a').click();
    cy.get('#collapseReceiverArea-0 > :nth-child(3) > :nth-child(2) > .input-group > .form-control').click();
    cy.get('input[name="dropOffDate"]').click();
    cy.get('input[name="dropOffDate').type('2021/4/20');//datepicker
    cy.get('input[name="dropOffTime"]').last().type('04:39');//datetime
    cy.get('#collapseReceiverArea-0 > :nth-child(5) > .col-lg-12 > #inputDefault').type('David Milan');
    cy.get('#collapseReceiverArea-0 > :nth-child(6) > .col-lg-12 > #inputDefault').clear();
    cy.get('#collapseReceiverArea-0 > :nth-child(6) > .col-lg-12 > #inputDefault').type('774441100236');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(1) > .col-lg-10 > .form-control').clear();
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(1) > .col-lg-10 > .form-control').type('cakes');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(2) > .col-lg-12 > #inputDefault').clear();
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(2) > .col-lg-12 > #inputDefault').type('14589369');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(2) > .form-control').clear();
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(2) > .form-control').type('23');
    cy.get('div#collapseReceiverArea-0 > .ng-star-inserted > div:nth-of-type(3)  ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(2)').last().click();
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(2) > .form-control').clear();
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(2) > .form-control').type('1258');
    cy.get('div#collapseReceiverArea-0 > .ng-star-inserted > div:nth-of-type(4)  ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(1)').last().click();
    cy.get('div#collapseReceiverArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px.ng-star-inserted').click();
    cy.get('[name="trailerType"] input').first().click();
    cy.get('[role="option"]:nth-of-type(3) .ng-star-inserted').last().click();
    cy.get('.col-lg-8.mt-3.offset-lg-2 > textarea#textareaDefault').type('Thank You For The Service Team Fleet Hawks Inc');
    cy.get(':nth-child(7) > .col-lg-8 > .form-control').type('10');
    cy.get('[name="freight_type"] input').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();

    cy.get('input[name="freight_amount"]').clear();
    cy.get('input[name="freight_amount"]').type('20');
    cy.get('div:nth-of-type(2) > div:nth-of-type(4) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click();

    cy.get('div:nth-of-type(3) > .col-lg-3.offset-lg-2 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();
    cy.get('input[name="fuel_amount"]').clear();
    cy.get('input[name="fuel_amount"]').type('15');

    cy.get('div:nth-of-type(4) > .col-lg-3.offset-lg-2 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();
    cy.get(':nth-child(4) > :nth-child(3) > .input-group > .form-control').clear();
    cy.get(':nth-child(4) > :nth-child(3) > .input-group > .form-control').type('3');

    cy.get('div:nth-of-type(5) > .col-lg-3.offset-lg-2 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(3) .ng-star-inserted').last().click();
    cy.get(':nth-child(5) > :nth-child(3) > .input-group > .form-control').clear();
    cy.get(':nth-child(5) > :nth-child(3) > .input-group > .form-control').type('5');
    cy.get('input[name="advance"]').clear();
    cy.get('input[name="advance"]').type('2');
    // cy.get('label#pcmiles').click();
    cy.get('.ng-touched [type="submit"]').first().click();//save btn
    cy.wait(5000);


  });
  it('should list the order which was added and then verify the added order is listed ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    //cy.get(':nth-child(1) > [tabindex="0"]').contains('109');
  });
  it('should allow user to delete order', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('#dropdownMenuButton-0 > .fas').first().click();
    cy.get(':nth-child(1) > :nth-child(10) > .dropdown > .dropdown-menu > [href="javascript:;"]').first().click();
    cy.wait(3000);
  });
  it('should give validation error message when required fields are not provided', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    cy.get('[class="mb-1"] .btn-dark').click();//save btn Consignor
    cy.get('[id="collapseReceiverArea-0"] .btn-dark').click();//save btn Consignee
    cy.get(':nth-child(6) > .col-lg-12 > .btn-success').first().click();//save btn
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .text-danger').contains('This Field is required');
    cy.get('.mt-2 > .col-lg-10 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(1) > .col-lg-11 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(2) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(3) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(3) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(5) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(6) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(1) > .col-lg-10 > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseShipperArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(1) > .col-lg-11 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(2) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(3) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(3) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(5) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(6) > .col-lg-12 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(1) > .col-lg-10 > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(3) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(2) > .text-danger').contains('This Field is required');
    cy.get('#collapseReceiverArea-0 > :nth-child(7) > :nth-child(4) > :nth-child(3) > .text-danger').contains('This Field is required');
    cy.get('.col-lg-8 > .text-danger').contains('This Field is required');
    cy.get(':nth-child(5) > :nth-child(2) > :nth-child(2) > .col-md-12 > .text-danger').contains('This Field is required');
    cy.get('.input-group > .text-danger').contains('This Field is required');
    cy.get(':nth-child(4) > .text-danger').contains('This Field is required');


  });
});