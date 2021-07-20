
it('added carrier with required optional fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addCarrierModal"]').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('very new test carrier');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('book');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('3432453253');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('carri@mailinator.com');
    cy.get('.col-lg-5.offset-lg-1 > .row > .d-flex > :nth-child(1) > .ng-untouched').check();
    cy.get('.col-lg-5.offset-lg-1 > .row > .d-flex > :nth-child(2) > label').click();
    cy.get('.col-lg-5.offset-lg-1 > .row > .d-flex > :nth-child(2) > .ng-untouched').check();
    cy.get('.col-lg-5.offset-lg-1 > .row > .d-flex > :nth-child(3) > .ng-untouched').check();
    cy.get(':nth-child(4) > .checkbox-custom > .ng-untouched').check();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(5) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(5) > .form-control').type('34543543');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').type('232323');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').type('4');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4)').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').type('3');
    cy.get(':nth-child(7) > .form-control').clear();
    cy.get(':nth-child(7) > .form-control').type('42706756765901');
    cy.get(':nth-child(8) > .form-control').click();
    cy.get('[aria-label="Thursday, July 22, 2021"] > .btn-light').click();
    cy.get(':nth-child(4) > .row > :nth-child(5) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#payPercentageForm > .col-lg-12 > .row > .col-lg-4 > .form-control').clear();
    cy.get('#payPercentageForm > .col-lg-12 > .row > .col-lg-4 > .form-control').type('4');
    cy.get('#payPercentageForm > .col-lg-12 > .row > .col-lg-6 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get(':nth-child(9) > .form-control').clear();
    cy.get(':nth-child(9) > .form-control').type('34234');
    cy.get(':nth-child(10) > .form-control').clear();
    cy.get(':nth-child(10) > .form-control').type('23424');
    cy.get(':nth-child(11) > .form-control').clear();
    cy.get(':nth-child(11) > .form-control').type('32323');
    cy.get('.col-lg-12.pt-2 > .checkbox-custom > .ng-untouched').check();
    cy.get('#wsib-fields').check();
    cy.get('.wsib-wrapper > :nth-child(1) > .form-control').clear();
    cy.get('.wsib-wrapper > :nth-child(1) > .form-control').type('24324242');
    cy.get('.wsib-wrapper > :nth-child(2) > .form-control').click();
    cy.get('[aria-label="Friday, July 23, 2021"] > .btn-light').click();
    cy.get('#carrierForm > :nth-child(1) > .address-item > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#carrierForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').type('cana');
    cy.get('#carrierForm > :nth-child(1) > .address-item > .col-lg-3 > .map-search__results > .p-0 > :nth-child(2) > a').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('smith');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('345354');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('john@mailinattor.com');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('manager');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('343535');
    //   cy.get('#addCarrierModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addCarrierModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
    /* ==== End Cypress Studio ==== */
});


it('added carrier with required  fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addCarrierModal"]').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('required fields carrier');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('9877765456');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('newcarrier@yopmail.com');
    cy.get('#carrierForm > :nth-child(1) > .address-item > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#carrierForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').type('cana');
    cy.get('#carrierForm > :nth-child(1) > .address-item > .col-lg-3 > .map-search__results > .p-0 > :nth-child(2) > a').click();
    //   cy.get('#addCarrierModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addCarrierModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
    /* ==== End Cypress Studio ==== */
});


it('user should be able to search ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
    cy.wait(8000);
    cy.get('#carrier > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#carrier > .mr-1 > .pr-1 > .input-group > .form-control').type('very new test carrier');
    cy.get('.result-suggestions > ul').click();
    cy.get('#carrier > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
    cy.get('#carrier > .mr-1 > :nth-child(2) > [type="button"]').click();
    cy.wait(8000);
});


it('user should be able to edit ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
    cy.wait(8000);
    cy.get(':nth-child(2) > :nth-child(5) > .dropdown > .bg-transparent > .fas').click();
    cy.get(':nth-child(2) > :nth-child(5) > .dropdown > .dropdown-menu > :nth-child(1)').click();
    cy.wait(8000);
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('bookstoreee ');
    cy.get('.col-lg-5.offset-lg-1 > .row > .d-flex > :nth-child(1) > .ng-untouched').check();
    cy.get('.col-lg-5.offset-lg-1 > .row > .d-flex > :nth-child(2) > label').click();
    cy.get('.col-lg-5.offset-lg-1 > .row > .d-flex > :nth-child(2) > .ng-untouched').check();
    cy.get('.col-lg-5.offset-lg-1 > .row > .d-flex > :nth-child(3) > .ng-untouched').check();
    cy.get(':nth-child(4) > .checkbox-custom > .ng-untouched').check();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(5) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(5) > .form-control').type('34543543');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').type('232323');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').type('4');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4)').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').clear();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').type('3');
    cy.get(':nth-child(7) > .form-control').clear();
    cy.get(':nth-child(7) > .form-control').type('42706756765901');
    //   cy.get('#addCarrierModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addCarrierModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
});

it('user should be able to delete ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
    cy.wait(8000);
    cy.get('#carrier > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#carrier > .mr-1 > .pr-1 > .input-group > .form-control').type('test new carrier');
    cy.get('#carrier > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
});

it.only('validation error on required  fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addCarrierModal"]').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('required fields carrier');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('.text-danger .ng-star-inserted').contains('Company name is required.');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('9877765456');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('.row > div:nth-of-type(1) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Phone number is required');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').click();
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('newcarrier@yopmail.com');
    cy.get('#carrierForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('div:nth-of-type(2) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Email is required');
    cy.get('#addCarrierModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#carrier-tab').click();
});
