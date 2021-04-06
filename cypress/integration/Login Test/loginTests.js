/* === Test Created with Cypress Studio === */
it('login test', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://devapp.fleethawks.com/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
});
it('logout test', function () {
    cy.wait(2000);
    cy.get('#userbox > [data-toggle="dropdown"]').click();
    cy.get('#lnkLogout').click();
});
it('login failed', function () {
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('kkkk');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('1234');
    cy.get('#btnsubmit').click();
    cy.get('.text').contains('Incorrect username or password.');
    /* ==== End Cypress Studio ==== */
});
it('login and then go to Map Dashdashboard and then add asset and then delete asset', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://devapp.fleethawks.com/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.wait(4000);
    cy.get('.ng-star-inserted > .nav > :nth-child(4) > .nav-link').first().click();
    cy.wait(5000);
    cy.get('.col-md-6 > .btn-success').first().click();
    
    cy.get('form#form_ > .row input[name="assetIdentification"]').type('Xyz1456');//asset name
    cy.get('.inner-wrapper [name="VIN"]').type('9988273734');//vin number
    cy.get('form#form_ > .row input[name="startDate"]').click();
    cy.get('[role] [role="row"]:nth-of-type(3) [role="gridcell"]:nth-of-type(3) .ng-star-inserted').click();//date
    cy.get('form#form_ > div:nth-of-type(2) > div:nth-of-type(2) ng-select#assetType input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();//asset type
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').click();
    cy.get('[role="option"]:nth-of-type(3) .ng-star-inserted').click();//year
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();//asset status
    cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').click();//Licence country
    cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();//issue state
    cy.get('form#form_ > div:nth-of-type(2) input[name="assetDetails.licencePlateNumber"]').type('PB08LC5963');//Licence Number
    cy.get('form#form_ > div:nth-of-type(2) input[name="assetDetails.annualSafetyDate"]').click();
    cy.get('[role] [role="row"]:nth-of-type(4) [role="gridcell"]:nth-of-type(2) .ng-star-inserted').click();//Annual Safety Date
    cy.wait(4000);
    cy.get('input[name="assetDetails.height"]').first().type('10');//height
    cy.get('div:nth-of-type(3) > div:nth-of-type(1) > .row > .col-lg-6.pl-0 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();//height type
    const imagefile1 = 'download.jpg';
    cy.get('input[name="uploadedPhotos"]').attachFile(imagefile1);
    const file2 = 'load1.pdf';
    cy.get('[name="uploadedDocs"]').attachFile(file2);
    cy.get('[class="col-lg-11 text-right"] #nextBtn').first().click();
    //cy.get('cy.get(".toast-message")').contains('asset added successfully');
//delete asset code//
    cy.get(':nth-child(4) > .nav-link > span').click();
    cy.get('#dropdownMenuButton-0').click();
    cy.get('.dropdown > .dropdown-menu > [href="javascript:;"]').first().click();

});
