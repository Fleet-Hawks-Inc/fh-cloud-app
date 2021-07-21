

it('added vendor with required optional fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
    cy.wait(8000);
    cy.get('.mb-1').click();
    cy.get('[data-target="#addVendorModal"]').click();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('Test');
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('test45@yopmail.com');
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(2) > .form-control').type('bookstore');
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(3) > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > :nth-child(3) > .form-control').type('34567890');
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('546546546');
    cy.get('#vendorForm > :nth-child(1) > .row.ng-star-inserted > .col-lg-5 > .row > .col-lg-12 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    cy.get('#vendorForm > :nth-child(1) > .row.ng-star-inserted > .col-lg-3 > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > .row.ng-star-inserted > .col-lg-3 > .form-control').type('rock');
    cy.get('#vendorForm > :nth-child(1) > .row.ng-star-inserted > .col-lg-3 > .map-search__results > .p-0 > :nth-child(2) > a').click();
    //   cy.get('#addVendorModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addVendorModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
    
});



it('added vendor with required  fields ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
    cy.wait(8000);
    cy.get('.mb-1').click();
    cy.get('[data-target="#addVendorModal"]').click();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('very very new vendor');
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('Fh123@yopmail.com');
    //   cy.get('#addVendorModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addVendorModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
});


it('user should be able to edit the vendor  ', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
    cy.wait(8000);
    cy.get('#vendorTable > tbody > :nth-child(2) > :nth-child(5) > .dropdown > .bg-transparent > .fas').click();
    cy.get('#vendorTable > tbody > :nth-child(2) > :nth-child(5) > .dropdown > .dropdown-menu > :nth-child(1)').click();
    cy.wait(8000);
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(2) > .form-control').type('9855584907');
    //   cy.get('#addVendorModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
    cy.get('#addVendorModal > .modal-dialog > .modal-content > .modal-footer > .btn-default').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
});




it('validation error on required fields ', function () {
    
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
    cy.wait(8000);
    cy.get('.mb-1').click();
    cy.get('[data-target="#addVendorModal"]').click();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').type('FH ');
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > .col-lg-5.offset-lg-1 > .row > .col-lg-12 > .form-control').clear();
    cy.get('.text-danger .ng-star-inserted').contains('Company name is required.');
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').type('Fh123@yopmai');
    cy.get('#vendorForm > :nth-child(1) > :nth-child(1) > :nth-child(4) > .row > :nth-child(1) > .form-control').clear();
    cy.get('.col-lg-5 > .row > div:nth-of-type(1) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Email is required.');

});


it('user should be able to search the vendor  ', function () {
   
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
    cy.wait(8000);
    cy.get('#vendor > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#vendor > .mr-1 > .pr-1 > .input-group > .form-control').type('test');
    cy.get('.result-suggestions ul').click();
    cy.wait(6000);
    cy.get('#vendor > .mr-1 > :nth-child(2) > .mr-3').click();
    cy.wait(6000);
    cy.get('#vendor > .mr-1 > :nth-child(2) > [type="button"]').click();
    cy.wait(6000);
});


it('user should be able to delete the vendor  ', function () {
   
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('rashmi.cypress123');
    cy.get('#btnsubmit').click();
    cy.get('.address-book-icon > .far').click();
    cy.get('#vendor-tab').click();
    cy.wait(8000);
    cy.get('#vendor > .mr-1 > .pr-1 > .input-group > .form-control').click();
    cy.get('#vendor > .mr-1 > .pr-1 > .input-group > .form-control').type('del vendor');
    cy.wait(6000);
    cy.get('#vendor > .mr-1 > :nth-child(2) > .mr-3').click();
});
