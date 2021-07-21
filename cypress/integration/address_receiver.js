

it('added receiver with required optional fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addConsigneeModal"]').click();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test receiver');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('12345');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('567889');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('book');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').type('8903456789');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').type('reciever@mailinator.com');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(2) > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(2) > .col-lg-3 > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(2) > .col-lg-3 > .form-control').type('roc');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(2) > .col-lg-3 > .map-search__results > .p-0 > :nth-child(2) > a').click();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('smith');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('2345678986');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('john@mailinator.com');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3)').click();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('customer');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('123456789098766');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(3) > .col-11 > #add-document').click();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('elina');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2)').click();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('smith');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('8766554');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('rec@mailinator.com');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('customer');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(4) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('456789876');
    //   cy.get('#addConsigneeModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addConsigneeModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.wait(6000);
});


it('user should able to search ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.wait(8000);
    cy.get('#consignee > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#consignee > .mr-1 > .pr-1 > .input-group > .form-control').type('test receiver');
    cy.get('.result-suggestions > ul')
    cy.get('#consignee > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
    cy.get('#consignee > .mr-1 > :nth-child(2) > [type="button"]').click();
    cy.wait(8000);
});


it('added receiver with required  fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addConsigneeModal"]').click();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('new reciever for required');
    // cy.get('#addConsigneeModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addConsigneeModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.wait(6000);
});


it('user should able to edit ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.wait(8000);
    cy.get('#consigneeTable > tbody > :nth-child(1) > :nth-child(5) > .dropdown > .bg-transparent > .fas').click();
    cy.get('#consigneeTable > tbody > :nth-child(1) > :nth-child(5) > .dropdown > .dropdown-menu > :nth-child(1)').click();
    cy.wait(8000);
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(3) > .form-control').type('8903456789');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(4) > .form-control').clear();
    // cy.get('#addConsigneeModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addConsigneeModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.wait(6000);
});


it('user should able to delete ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.wait(8000);
    cy.get('#consignee > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#consignee > .mr-1 > .pr-1 > .input-group > .form-control').type('del reciever');
    cy.get('#consignee > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(8000);
});


it('validation error on  required  fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addConsigneeModal"]').click();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('new d');
    cy.get('#consigneeForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('form#consigneeForm > div > .pt-3.row .ng-star-inserted').contains('Company name is required');
    // cy.get('#addConsigneeModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addConsigneeModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#consignee-tab').click();
    cy.wait(6000);
});