
it('added incident event with the required fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(3) > .nav-link > span').click();
    cy.wait(12000);
    cy.get('.page-header > .row > .col-6 > .btn').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').click();
    cy.get('[aria-label="Thursday, August 19, 2021"] > .btn-light').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(1) > :nth-child(2) > .form-control').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(1) > :nth-child(2) > .form-control').type('12:45');
    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(4)').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[role="option"]').click();
    cy.get(':nth-child(3) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(5)').click();
    cy.get(':nth-child(3) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get(':nth-child(4) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get(':nth-child(4) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get(':nth-child(5) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-10 > .form-control').type('cana');
    cy.get('.p-0 > :nth-child(1) > a').click();
    //   cy.get('.col-lg-11 > .btn-success').click();
    cy.get('.col-lg-11 > .btn-default').click();

});

it('added incident event with the OPTIONAL /required fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(3) > .nav-link > span').click();
    cy.wait(12000);
    cy.get('.page-header > .row > .col-6 > .btn').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').click();
    cy.get('[aria-label="Thursday, August 19, 2021"] > .btn-light').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(1) > :nth-child(2) > .form-control').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(1) > :nth-child(2) > .form-control').type('12:45');
    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(5)').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[role="option"]').click();
    cy.get(':nth-child(3) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(4)').click();
    cy.get(':nth-child(3) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get(':nth-child(4) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get(':nth-child(4) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get(':nth-child(5) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-10 > .form-control').type('cana');
    cy.get('.p-0 > :nth-child(1) > a').click();
    cy.get(':nth-child(3) > .col-lg-10 > .form-control').click();
    cy.get(':nth-child(3) > .col-lg-10 > .form-control').type('Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book');
    // const imagefile3 = "download.jpg";
    // cy.get('input[name="uploadedPhotos"]').attachFile(imagefile3);
    // const file34 = "load1.pdf";
    // cy.get('[name="uploadedDocs"]').attachFile(file34);

    // cy.get('.col-lg-11 > .btn-success').click();
    cy.get('.col-lg-11 > .btn-default').click();

});

it('not added incident event with the optional fields then button should not enable ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(3) > .nav-link > span').click();
    cy.wait(12000);
    cy.get('.page-header > .row > .col-6 > .btn').click();
    cy.get(':nth-child(3) > .col-lg-10 > .form-control').click();
    cy.get(':nth-child(3) > .col-lg-10 > .form-control').type('Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book');
    // const photofile3 = "download.jpg";
    // cy.get('input[name="uploadedPhotos"]').attachFile(photofile3);
    // const file34 = "load1.pdf";
    // cy.get('[name="uploadedDocs"]').attachFile(file34);

    // cy.get('.col-lg-11 > .btn-success').click();
    cy.get('.col-lg-11 > .btn-default').click();

});

it('user should be able to view the incident data and add the safety internal notes ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(3) > .nav-link > span').click();
    cy.wait(12000);
    cy.get(':nth-child(1) > [tabindex="0"]').click();
    cy.get('.mt-3 > .form-control').click();
    cy.get('.mt-3 > .form-control').type('Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book');
    cy.get('.content-body > .page-header > .row > .col-md-8 > .btn-default').click();

});

it('user should be able to change the status  ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(3) > .nav-link > span').click();
    cy.wait(12000);
    cy.get(':nth-child(1) > [style="width: 180px;"] > .form-control > .ng-select-container > .ng-value-container > .ng-input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#under-review-tab').click();
});

it('user should be able to search  ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(3) > .nav-link > span').click();
    cy.wait(12000);
    cy.get(':nth-child(1) > .text-capitalize > .ng-select-container').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(5)').click();
    cy.get('.row > :nth-child(3) > .mr-1').click();
    cy.wait(6000);
    cy.get('.page-header > .row > :nth-child(3) > :nth-child(2)').click();
    cy.wait(6000);
    cy.get('.page-header > .row > :nth-child(2) > .input-group > .form-control').click();
    cy.get('[aria-label="Thursday, August 19, 2021"] > .btn-light').click();
    cy.get('.row > :nth-child(3) > .mr-1').click();
    cy.wait(6000);
    cy.get('.page-header > .row > :nth-child(3) > :nth-child(2)').click();
    cy.wait(6000);

});

it.only('validation error with the required fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(3) > .nav-link > span').click();
    cy.wait(12000);
    cy.get('.page-header > .row > .col-6 > .btn').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').click();
    cy.get('.text-danger .ng-star-inserted').contains('Event date is required.');
    cy.get('.form-group > :nth-child(1) > :nth-child(1) > :nth-child(2) > .form-control').click();
    cy.get('div:nth-of-type(2) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Event time is required.');
    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(4)').click();
    cy.get('div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"]  span[title="Clear all"]').click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(1) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Driver is required.');
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[role="option"]').click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"]  span[title="Clear all"]').click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Trip is required.');
    cy.get(':nth-child(3) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(5)').click();
    cy.get('div:nth-of-type(3) > div:nth-of-type(1) > ng-select[role="listbox"]  span[title="Clear all"]').click();
    cy.get('div:nth-of-type(3) > div:nth-of-type(1) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Vehicle is required.');
    cy.get(':nth-child(3) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get('div:nth-of-type(3) > div:nth-of-type(2) > ng-select[role="listbox"]  span[title="Clear all"]').click();
    cy.get('div:nth-of-type(3) > div:nth-of-type(2) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Assigned is required.');
    cy.get(':nth-child(4) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get(':nth-child(4) > :nth-child(1) > .ng-select > .ng-select-container > .ng-clear-wrapper').click();
    cy.get('div:nth-of-type(4) > div:nth-of-type(1) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Incident type is required.');
    cy.get(':nth-child(4) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get('div:nth-of-type(4) > div:nth-of-type(2) > ng-select[role="listbox"]  span[title="Clear all"]').click();
    cy.get('div:nth-of-type(4) > div:nth-of-type(2) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Severity is required.');
    cy.get(':nth-child(5) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-10 > .form-control').type('cana');
    cy.get('.p-0 > :nth-child(1) > a').click();
    cy.get(':nth-child(5) > .col-lg-10 > .form-control').clear();
    cy.get('.col-lg-10 > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Location is required');
    cy.get('.col-lg-11 > .btn-default').click();

}); 