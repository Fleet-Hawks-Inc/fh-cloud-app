
it('added event with Required fields and button should be enable', function () {

    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(2) > .nav-link > span').click();
    cy.wait(12000);
    cy.get('.col-md-6 > .mr-2').click();
    cy.get('.text-capitalize > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(5)').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(1) > .form-control').click();
    cy.get('[aria-label="Friday, August 20, 2021"] > .btn-light').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .form-control').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .form-control').type('17:58');
    cy.get('[data-select2-id="351"] > :nth-child(1) > .ng-select > .ng-select-container').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').type('cana');
    cy.get('.p-0 > :nth-child(2) > a').click();
    cy.get('.col-lg-11 > .btn-default').click();
    //   cy.get('.col-lg-11 > .btn-success').click();
});


it('added event with optional Required fields ', function () {

    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(2) > .nav-link > span').click();
    cy.wait(12000);
    cy.get('.col-md-6 > .mr-2').click();
    cy.get('.text-capitalize > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(1) > .form-control').click();
    cy.get('[aria-label="Saturday, August 21, 2021"] > .btn-light').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .form-control').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .form-control').type('13:45');
    cy.get('[data-select2-id="351"] > :nth-child(1) > .ng-select > .ng-select-container').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').type('rock');
    cy.get('.p-0 > :nth-child(1) > a').click();
    cy.wait(5000);
    cy.get(':nth-child(2) > .col-lg-10 > .form-control').click();
    cy.get(':nth-child(2) > .col-lg-10 > .form-control').type('Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book');
    const imagefile3 = "download.jpg";
    cy.get('input[name="uploadedPhotos"]').attachFile(imagefile3);
    // cy.get('.col-lg-11 > .btn-success').click();
    cy.get('.col-lg-11 > .btn-default').click();
});


it('validation errors on Required fields ', function () {

    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(2) > .nav-link > span').click();
    cy.wait(12000);
    cy.get('.col-md-6 > .mr-2').click();
    cy.get('.text-capitalize > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(5)').click();
    cy.get('.text-capitalize > .ng-select-container > .ng-clear-wrapper').click()
    cy.get('[class="col-5"] .text-danger div').contains('Vehicle is required.');
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(1) > .form-control').click();
    cy.get('.row:nth-of-type(2) .text-danger div').contains('Event date is required');
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .form-control').click();
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .form-control').type('17:58');
    cy.get('.form-group > :nth-child(1) > :nth-child(2) > :nth-child(2) > .form-control').clear();
    cy.get('[class="col-lg-5"]:nth-of-type(2) .text-danger div').contains('Event time is required');
    cy.get('[data-select2-id="351"] > :nth-child(1) > .ng-select > .ng-select-container').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get('[data-select2-id="351"] > :nth-child(1) > .ng-select > .ng-select-container > .ng-clear-wrapper').click();
    cy.get('[data-select2-id] .text-danger div').contains('Event type is required');
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').type('cana');
    cy.get('.p-0 > :nth-child(2) > a').click();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').clear();
    
});

it('event should not add with optional fields and button remains disable ', function () {

    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(2) > .nav-link > span').click();
    cy.wait(12000);
    cy.get('.col-md-6 > .mr-2').click();
    cy.get(':nth-child(2) > .col-lg-10 > .form-control').click();
    cy.get(':nth-child(2) > .col-lg-10 > .form-control').type('Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book');
    const imagefile3 = "download.jpg";
    cy.get('input[name="uploadedPhotos"]').attachFile(imagefile3);
    
});

it('user should be able to search the event', function () {

    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(2) > .nav-link > span').click();
    cy.wait(12000);
    cy.get(':nth-child(1) > .text-capitalize > .ng-select-container > .ng-value-container > .ng-input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('.row > :nth-child(3) > .mr-1').click();
    cy.wait(5000);
    cy.get('.page-header > .row > :nth-child(3) > :nth-child(2)').click();
    cy.wait(12000);
    cy.get('.page-header > .row > :nth-child(2) > .input-group > .form-control').click();
    cy.get('[aria-label="Saturday, August 21, 2021"] > .btn-light').click();
    cy.get('.row > :nth-child(3) > .mr-1').click();
    cy.wait(5000);
    cy.get('.page-header > .row > :nth-child(3) > :nth-child(2)').click();
    cy.wait(12000);
});

it('user should be able to change the status of the event', function () {

    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(2) > .nav-link > span').click();
    cy.wait(12000);
    cy.get(':nth-child(1) > [style="width: 180px"] > .form-control > .ng-select-container > .ng-value-container > .ng-input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    
});

it('user should be able to view the detail page and add safety internal notes', function () {

    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(4) > .nav-link').click();
    cy.get('.inner-wrapper > app-sidebar > #sidebar-left > .nano > .nano-content > #menu > .ng-star-inserted > .nav > :nth-child(2) > .nav-link > span').click();
    cy.wait(12000);
    cy.get(':nth-child(1) > [tabindex="0"]').click();
    cy.wait(5000);
    cy.get('.mt-3 > .form-control').click();
    cy.get('.mt-3 > .form-control').type('Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer');
    cy.get('.form-group > .mt-2 > .btn').click();
    cy.wait(5000);
    cy.get('.content-body > .page-header > .row > .col-md-8 > .btn-default').click();
    cy.wait(12000);
});