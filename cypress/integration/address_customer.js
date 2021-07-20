

it('added customer with required optional fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addCustomerModal"]').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1)').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('new test');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('book');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('123456789');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('545464657');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(3) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(3) > .form-control').type('2332423535');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(4) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(4) > .form-control').type('21212324');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').type('42705687865401');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').click();
    cy.get('[aria-label="Wednesday, July 21, 2021"] > .btn-light').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(5) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(5) > .form-control').type('3456765');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').type('custnew@mailinator.com');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > .col-lg-12 > :nth-child(1) > .ng-untouched').check();
    cy.get(':nth-child(4) > .row > .col-lg-12 > :nth-child(2) > .ng-untouched').check();
    cy.get(':nth-child(4) > .row > .col-lg-12 > :nth-child(3) > .ng-untouched').check();
    cy.get('#customerForm > :nth-child(1) > .address-item > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#customerForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').type('mills');
    cy.get('#customerForm > :nth-child(1) > .address-item > .col-lg-3 > .map-search__results > .p-0 > .ng-star-inserted > a').click();
    cy.get('#customerForm > :nth-child(1) > .address-item > .col-lg-2 > .btn-success > .fa').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(3) > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(3) > .col-lg-3 > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(3) > .col-lg-3 > .form-control').type('regina');
    cy.get('#customerForm > :nth-child(1) > :nth-child(3) > .col-lg-3 > .map-search__results > .p-0 > :nth-child(1) > a').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('smith');
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('2324234235');
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('john@mailinator.com');
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('customer');
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('34567');
    cy.get('#customerForm > :nth-child(1) > :nth-child(4) > .col-11 > #add-document').click();
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('elina');
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('cooper');
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('123456');
    cy.get(':nth-child(5) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(5) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('tst@mailinator.com');
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('manager');
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('098764657');
    //   cy.get('#addCustomerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addCustomerModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.wait(6000);
});


it('added customer with required  fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addCustomerModal"]').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1)').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('greenery');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').type('greenery@mailinator.com');
    // cy.get('#addCustomerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addCustomerModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.wait(6000);
});


it('user should be able to edit ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.get(':nth-child(1) > :nth-child(5) > .dropdown > .bg-transparent > .fas').click();
    cy.get(':nth-child(1) > :nth-child(5) > .dropdown > .dropdown-menu > :nth-child(1)').click();
    cy.wait(8000);
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('book');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(5) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(5) > .form-control').type('8725886506');
    // cy.get('#addCustomerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addCustomerModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.wait(6000);
});


it('validation error on required  fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addCustomerModal"]').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1)').click();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('gree');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('.text-danger .ng-star-inserted').contains('Company name is required.');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').clear();
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').type('greenery@m');
    cy.get('#customerForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(6) > .form-control').clear();
    cy.get('div:nth-of-type(6) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Email is required.');
    // cy.get('#addCustomerModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addCustomerModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.wait(6000);
});


it('user should be able to search ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.wait(6000);
    cy.get('#customer > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#customer > .mr-1 > .pr-1 > .input-group > .form-control').type('new test');
    cy.get('.result-suggestions > ul').click();
    cy.get('#customer > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
    cy.get('#customer > .mr-1 > :nth-child(2) > [type="button"]').click();
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
    cy.get('.address-book-icon').click();
    cy.get('#customer-tab').click();
    cy.wait(6000);
    cy.get('#customer > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#customer > .mr-1 > .pr-1 > .input-group > .form-control').type('del cust');
    cy.get('#customer > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
});
