

it('added broker with required optional fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addBrokerModal"]').click();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(2) > .form-control').type('test new broker');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(3) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(3) > .form-control').type('book');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('3423325');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(3) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(3) > .form-control').type('brokr@mailinator.com');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(4) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(4) > .form-control').type('545453');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(5) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(5) > .form-control').type('213243');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(4) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(4) > .form-control').type('35435464');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(5) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(5) > .form-control').type('3434324');
    cy.get('#brokerForm > :nth-child(1) > .address-item > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#brokerForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').type('can');
    cy.get('#brokerForm > :nth-child(1) > .address-item > .col-lg-3 > .map-search__results > .p-0 > :nth-child(1) > a').click();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('smith');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('5657757');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('john@mailinator.com');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('customer');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('4332543533');
    //   cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon').click();
    
});

it('added broker with required  fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addBrokerModal"]').click();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(2) > .form-control').type('broker required');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(3) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(3) > .form-control').type('newbroker@mailinator.com');
    // cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon').click();
});

it('user be able to serach', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.wait(8000);
    cy.get('#broker > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#broker > .mr-1 > .pr-1 > .input-group > .form-control').type('test new broker');
    cy.get('.result-suggestions > ul').click();
    cy.get('#broker > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
    cy.get('#broker > .mr-1 > :nth-child(2) > [type="button"]').click();
    cy.wait(8000);
});

it('user be able to edit', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.wait(8000);
    cy.get('#brokerTable > tbody > :nth-child(1) > :nth-child(5) > .dropdown > .bg-transparent > .fas').click();
    cy.get('#brokerTable > tbody > :nth-child(1) > :nth-child(5) > .dropdown > .dropdown-menu > :nth-child(1)').click();
    cy.wait(8000);
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(3) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(3) > .form-control').type('bookstore');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('3423325');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(5) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(5) > .form-control').type('9876543234');
    // cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon').click();
});

it('validation error on required  fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addBrokerModal"]').click();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(2) > .form-control').type('broker required');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(3) > .form-control').clear();
    cy.get('form#brokerForm > div > .pt-3.row .ng-star-inserted').contains('Company name is required');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(3) > .form-control').click();
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(3) > .form-control').type('newbroker@mailinator.com');
    cy.get('#brokerForm > :nth-child(1) > :nth-child(1) > :nth-child(3) > .row > :nth-child(3) > .form-control').clear();
    cy.get('div:nth-of-type(3) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Email is required');
    // cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addBrokerModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon').click();
});

it('user be able to delete', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.wait(8000);
    cy.get('#broker > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#broker > .mr-1 > .pr-1 > .input-group > .form-control').type('del broker');
    cy.get('#broker > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
});

