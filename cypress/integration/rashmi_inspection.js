

it('added inspection form with required fields with no default form', function() {
  cy.visit('/#/Login');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('sixteen.may');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
  cy.get('#btnsubmit').click();
  cy.get('nav > .nav > :nth-child(2) > .nav-link').click();
  cy.get(':nth-child(7) > .nav-link > span').click();
  cy.get('.col-md-8 > .btn-group > .btn').click();
  cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').clear();
  cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').type('new form today for vehicle ');
  cy.get('.col-lg-9 > .row > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
  cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
  cy.get('.row > :nth-child(1) > .col-lg-12 > .form-control').clear();
  cy.get('.row > :nth-child(1) > .col-lg-12 > .form-control').type('lights');
//   cy.get('.col-lg-11 > .btn-success').click();
cy.get('.col-lg-11 > .mb-1').click();
cy.wait(8000);
 
});

it('validation errors', function() {
  cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('sixteen.may');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(2) > .nav-link').click();
    cy.get(':nth-child(7) > .nav-link > span').click();
    cy.get('.col-md-8 > .btn-group > .btn').click();
    cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').clear();
    cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').type('new form today for vehicle ');
    cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').clear(); 
    cy.get('div:nth-of-type(1) > .ng-star-inserted.text-danger > .ng-star-inserted').contains('Form Name is required.');
    cy.get('.col-lg-9 > .row > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('.form-group.mt-3.row ng-select[role="listbox"]  span[title="Clear all"]').click();
    cy.get('[class] [class="col-lg-6"]:nth-of-type(2) .text-danger .ng-star-inserted').contains('Select valid inspection type from the list is required.');
    // cy.get(':nth-child(6) > .btn > .fas').click();
    // cy.get('.row > :nth-child(1) > :nth-child(7) > .form-control').clear();
    // cy.get('.row > :nth-child(1) > :nth-child(7) > .form-control').type('lights');
    // cy.get(':nth-child(7) > .btn > .fas').click();
  //   cy.get('.col-lg-11 > .btn-success').click();
  cy.get('.col-lg-11 > .mb-1').click();
    
  });



  it('user should be able to edit the inspection form', function() {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('sixteen.may');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(2) > .nav-link').click();
    cy.get(':nth-child(7) > .nav-link > span').click();
    cy.get('#dropdownMenuButton-3 > .fas').click();
    cy.get('[href="#/compliance/dvir/inspection-add/1vQeP0aIKLN1Muu3ZBpnJub3Zpp"]').click();
    cy.wait(8000);
    cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').clear(); 
    cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').type('new  today for vehicle ');
    // cy.get('.col-lg-11 > .btn-success').click();
    cy.get('.col-lg-11 > .mb-1').click();
    cy.wait(8000);
});


it.only('added inspection form (asset) with required fields with  default form', function() {
  cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('sixteen.may');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('Hello#123');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(2) > .nav-link').click();
    cy.get(':nth-child(7) > .nav-link > span').click();
    cy.get('.col-md-8 > .btn-group > .btn').click();
    cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').clear();
    cy.get('.col-lg-9 > .row > :nth-child(1) > .form-control').type('new form today for asset ');
    cy.get('.col-lg-9 > .row > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();
    // cy.get('.row > :nth-child(1) > .col-lg-12 > .form-control').click();
    // cy.get('.row > :nth-child(1) > .col-lg-12 > .form-control').type('Tires');
    // cy.get('.row > :nth-child(1) > .col-lg-12 > .btn').click();
    cy.get('#defaultCheckbox').click();
    // cy.get('.col-lg-11 > .btn-success').click();
    cy.get('.col-lg-11 > .mb-1').click();
});
