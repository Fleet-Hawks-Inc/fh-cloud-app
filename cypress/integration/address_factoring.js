

it('added company with required optional fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').click();
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#fc-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addFCModal"]').click();
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('book');
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('446546');
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('company@mailinator.com');
    cy.get('#FCBasicDetails > .address-item > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('#FCBasicDetails > .address-item > .col-lg-3').click();
    cy.get('#FCBasicDetails > .address-item > .col-lg-3 > .checkbox-custom > .ng-untouched').check();
    cy.get('.pl-3 > .offset-lg-1 > .row > :nth-child(1) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('.offset-lg-1 > .row > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('.offset-lg-1 > .row > :nth-child(3) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('.pl-3 > .offset-lg-1 > .row > :nth-child(4) > .form-control').clear();
    cy.get('.pl-3 > .offset-lg-1 > .row > :nth-child(4) > .form-control').type('12345');
    cy.get('.pr-0 > .row > :nth-child(1) > .form-control').clear();
    cy.get('.pr-0 > .row > :nth-child(1) > .form-control').type('edmonton');
    cy.get('.pr-0 > .row > :nth-child(2) > .form-control').clear();
    cy.get('.pr-0 > .row > :nth-child(2) > .form-control').type('regina');
    cy.get('#FCBasicDetails > :nth-child(3) > .offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(3) > .offset-lg-1 > .row > .col-lg-12 > .form-control').type('453454654');
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .col-lg-12 > .row > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .col-lg-12 > .row > :nth-child(1) > .form-control').type('5000');
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .col-lg-12 > .row > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    //   cy.get('#addFCModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('div#addFCModal > div[role="document"] .btn.btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#fc-tab').click();
    cy.wait(6000);
});

it('added company with required fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').click();
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#fc-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addFCModal"]').click();
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('new fact company');
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('factoring123@mailinator.com');
    cy.get('#addFCModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    // cy.get('div#addFCModal > div[role="document"] .btn.btn-default').click();
    // cy.get('.address-book-icon > .far').click();
    // cy.get('#fc-tab').click();
    // cy.wait(6000);
});


it('validation error ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').click();
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#fc-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addFCModal"]').click();
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('new company');
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('div#FCBasicDetails > .pt-3.row > .col-lg-5.offset-lg-1 .ng-star-inserted').contains('Company name is required.');
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('factoring123@mailinator.com');
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(2) > .text-danger > .ng-star-inserted').contains('Email is required.');
    // cy.get('#addFCModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('div#addFCModal > div[role="document"] .btn.btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#fc-tab').click();
    cy.wait(6000);
});

it('user should be able to edit ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').click();
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#fc-tab').click();
    cy.get('#companyTable > tbody > :nth-child(1) > :nth-child(5) > .dropdown > .bg-transparent > .fas').click();
    cy.get('#companyTable > tbody > :nth-child(1) > :nth-child(5) > .dropdown > .dropdown-menu > :nth-child(1)').click();
    cy.wait(8000);
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('book');
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#FCBasicDetails > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('8712345678');
    cy.get('#addFCModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    // cy.get('div#addFCModal > div[role="document"] .btn.btn-default').click();

    // cy.get('.address-book-icon > .far').click();
    // cy.get('#fc-tab').click();
    // cy.wait(6000);

});

it('user should be able to search ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').click();
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#fc-tab').click();
    cy.wait(8000);
    cy.get('#fc > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#fc > .mr-1 > .pr-1 > .input-group > .form-control').type('test');
    cy.get('.result-suggestions > ul').click();
    cy.get('#fc > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
    cy.get('#fc > .mr-1 > :nth-child(2) > [type="button"]').click();
    cy.wait(8000);
});


it('user should be able to delete ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').click();
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#fc-tab').click();
    cy.wait(8000);
    cy.get('#fc > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#fc > .mr-1 > .pr-1 > .input-group > .form-control').type('required factory');
    cy.get('#fc > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
});

