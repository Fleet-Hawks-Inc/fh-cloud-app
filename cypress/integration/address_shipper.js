

it('added shipper with required optional fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#shipper-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addShipperModal"]').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test shipper');
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('12345');
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('454566');
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('book');
    cy.get('.pt-1 > .form-control').clear();
    cy.get('.pt-1 > .form-control').type('234567');
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').type('shipper@mailinator.com');
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > .pt-3.ng-star-inserted > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > .pt-3.ng-star-inserted > .col-lg-3 > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > .pt-3.ng-star-inserted > .col-lg-3 > .form-control').type('hills');
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > .pt-3.ng-star-inserted > .col-lg-3 > .map-search__results > .p-0 > :nth-child(1) > a').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > .pt-3.ng-star-inserted > .col-lg-2 > .btn-success > .fa').click();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(3) > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(3) > .col-lg-3 > .form-control').clear();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(3) > .col-lg-3 > .form-control').type('rock');
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(3) > .col-lg-3 > .map-search__results > .p-0 > :nth-child(2) > a').click();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1)').click();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('smith');
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('12345679');
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('john@mailinator.com');
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('customer');
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get('.modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('3456789');
    //   cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#shipper-tab').click();
    cy.wait(8000);
});


it('added shipper with required  fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#shipper-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addShipperModal"]').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('Toxel industry');
    // cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#shipper-tab').click();
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
    cy.get('#shipper-tab').click();
    cy.get(':nth-child(1) > :nth-child(5) > .dropdown > .bg-transparent > .fas').click();
    cy.get(':nth-child(1) > :nth-child(5) > .dropdown > .dropdown-menu > :nth-child(1)').click();
    cy.wait(8000);
    cy.get('.pt-1 > .form-control').clear();
    cy.get('.pt-1 > .form-control').type('234567');
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('business name ');
    // cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#shipper-tab').click();
    cy.wait(8000);
});

it('validation error on required  fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#shipper-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addShipperModal"]').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('Toxel industry');
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-body > .card-body > .form-horizontal > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('.text-danger .ng-star-inserted').contains('Company name is required.');
    // cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addShipperModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#shipper-tab').click();
    cy.wait(8000);
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
    cy.get('#shipper-tab').click();
    cy.get('#shipper > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#shipper > .mr-1 > .pr-1 > .input-group > .form-control').type('test shipper');
    cy.get('.result-suggestions > ul').click();
    cy.get('#shipper > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
    cy.get('#shipper > .mr-1 > :nth-child(2) > [type="button"]').click();
    cy.wait(8000);
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
    cy.get('#shipper-tab').click();
    cy.wait(8000);
    cy.get('#shipper > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#shipper > .mr-1 > .pr-1 > .input-group > .form-control').type('del shipper');
    cy.get('#shipper > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);

});