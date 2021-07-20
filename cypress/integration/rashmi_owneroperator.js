
it('added owner operator with required optional fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addOwnerOperatorModal"]').click();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('book');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('4567898764');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('owner!@yopmail.com');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(2) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(2) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('42701234567601');
    cy.get(':nth-child(2) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').click();
    cy.get('.ngb-dp-today > .btn-light').click();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(2) > :nth-child(3) > .row > :nth-child(1) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('.col-lg-10 > .row > .col-lg-3 > .form-control').clear();
    cy.get('.col-lg-10 > .row > .col-lg-3 > .form-control').type('5');
    cy.get('.col-lg-8 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get(':nth-child(2) > .col-lg-5.offset-lg-1 > .row > :nth-child(3) > .form-control').clear();
    cy.get(':nth-child(2) > .col-lg-5.offset-lg-1 > .row > :nth-child(3) > .form-control').type('45677');
    cy.get('#operatorForm > :nth-child(1) > .address-item > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#operatorForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').type('ro');
    cy.get('#operatorForm > :nth-child(1) > .address-item > .col-lg-3 > .map-search__results > .p-0 > :nth-child(2) > a').click();
    cy.get(':nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get(':nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(4) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('mahajan');
    cy.get(':nth-child(4) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(4) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('56785444');
    cy.get(':nth-child(4) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(4) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('test@yopmail.com');
    cy.get(':nth-child(4) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get(':nth-child(4) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('manager');
    cy.get(':nth-child(4) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get(':nth-child(4) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('45633322');
    cy.get(':nth-child(4) > .col-11 > #add-document').click();
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('test');
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('test');
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > :nth-child(1) > .form-control').type('6546465');
    cy.get(':nth-child(5) > :nth-child(3) > .row > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(5) > :nth-child(3) > .row > :nth-child(2) > .form-control').type('te@yopmail.com');
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get(':nth-child(5) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('customer');
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > .col-lg-12').click();
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > .col-lg-12 > .form-control').clear();
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(3) > .row > .col-lg-12 > .form-control').type('e3w53w');
    //   cy.get('#addOwnerOperatorModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addOwnerOperatorModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
  });
  
  
  it('added owner operator with required  fields ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addOwnerOperatorModal"]').click();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('new operator');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('owner45@yopmail.com');
    cy.get('#operatorForm > :nth-child(1) > .address-item > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#operatorForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > .address-item > .col-lg-3 > .form-control').type('ro');
    cy.get('#operatorForm > :nth-child(1) > .address-item > .col-lg-3 > .map-search__results > .p-0 > :nth-child(2) > a').click();
    // cy.get('#addOwnerOperatorModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addOwnerOperatorModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
  });


  it('user should be able to edit  ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
    cy.get(':nth-child(1) > :nth-child(5) > .dropdown > .bg-transparent > .fas').click();
    cy.get(':nth-child(1) > :nth-child(5) > .dropdown > .dropdown-menu > :nth-child(1)').click();
    cy.wait(8000);
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('opera@yopmail.com');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('4567898764');
    // cy.get('#addOwnerOperatorModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addOwnerOperatorModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
});

it('user should be able to search  ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
    cy.wait(6000);
    cy.get('#ownerOperator > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#ownerOperator > .mr-1 > .pr-1 > .input-group > .form-control').type('test');
    cy.get('.result-suggestions > ul').click();
    cy.get('#ownerOperator > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(6000);
    cy.get('#ownerOperator > .mr-1 > :nth-child(2) > [type="button"]').click();
    cy.wait(6000);

});

it('validation error', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
    cy.get('.mb-1').click();
    cy.get('[data-target="#addOwnerOperatorModal"]').click();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').type('new operator');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(1) > .form-control').clear();
    cy.get('form#operatorForm > div > div:nth-of-type(1) .ng-star-inserted').contains('Company name is required.');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('owner45@yopmail.com');
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('div:nth-of-type(2) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Email is required.')
    cy.get('#operatorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('div:nth-of-type(2) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Email is required.');
    cy.get('#addOwnerOperatorModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
});

it('user should be able to delete  ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#ownerOperator-tab').click();
    cy.wait(6000);
    cy.get('#ownerOperator > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#ownerOperator > .mr-1 > .pr-1 > .input-group > .form-control').type('del owner');
    cy.get('#ownerOperator > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(6000);

});

