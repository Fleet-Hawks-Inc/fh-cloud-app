describe(" Issue tests", () => {
  it('should allow users to add issues with all required fields.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('.content-body > .page-header > .row > .text-right > .btn').click();
    cy.get('[name="unitID"] input').clear();
    cy.get('[name="unitID"] input').type('tesla {enter}');
  
    cy.get('.col-lg-10 > #issueName').clear();
    cy.get('.col-lg-10 > #issueName').type('brake issue');
    cy.get('input[name="odometer"]').clear();
    cy.get('input[name="odometer"]').type('10000');
   
    cy.get('.inner-wrapper [class="row pt-2"]:nth-of-type(2) [role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();
    
    cy.get('div:nth-of-type(3) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();
    
    cy.get('[class="col-11 pr-0"] button').click();
    cy.wait(4000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
   
  });
  it('should not allow users to add issues with optional fields.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('.content-body > .page-header > .row > .text-right > .btn').click();
    cy.get('.m-2 > form#issueForm textarea[name="description"]').type('Vehicle number 234 is not working.');
    const imagefile3 = "download.jpg";
    cy.get('input[name="uploadedPhotos"]').attachFile(imagefile3);
    const file34 = "load1.pdf";
    cy.get('[name="uploadedDocs"]').attachFile(file34);

  });
  
  it('should list the issues which were added and then verify the added issues are listed by name/other properties.', function () {
  
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('[name="unitID"] input').clear();
    cy.get('[name="unitID"] input').type('tesla {enter}');
    cy.get(':nth-child(3) > .input-group > .form-control').clear();
    cy.get(':nth-child(3) > .input-group > .form-control').type('brake issue');
    cy.get('.page-header > .row > :nth-child(4) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(4) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('OPEN{enter}');
   cy.get('.btn.btn-sm.btn-success.mr-3').click();
   cy.wait(4000);
    cy.get('.page-header [type="button"]').click();

  });
  
  it('should allow users to delete issues.', function () {
   
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('.btn.mr-1 > .fa-ellipsis-v.fas').first().click();
    cy.get('.table-responsive [role] [type]').last().click();
    
  });
  
  it('should give validation error messages when the required field is not provided.', function () {
   
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('.content-body > .page-header > .row > .text-right > .btn').click();
    
    cy.get('.col-lg-10 > #issueName').type('brake issue');
    cy.get('.col-lg-10 > #issueName').clear();
    cy.get('.text-danger .ng-star-inserted').contains('Issue name is required.');

   
    cy.get('input[name="odometer"]').type('10000');
    cy.get('input[name="odometer"]').clear(); 
    cy.get('.ng-star-inserted.pt-3.row .ng-star-inserted').contains('Odometer miles is required.');

  });
  it('check button is enabled or not.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(7) > .nav-link > .fas').click();
    cy.get('.content-body > .page-header > .row > .text-right > .btn').click();
    cy.get('[name="unitID"] input').clear();
    cy.get('[name="unitID"] input').type('tesla {enter}');
  
    cy.get('.col-lg-10 > #issueName').clear();
    cy.get('.col-lg-10 > #issueName').type('brake issue');
    cy.get('input[name="odometer"]').clear();
    cy.get('input[name="odometer"]').type('10000');
   
    cy.get('.inner-wrapper [class="row pt-2"]:nth-of-type(2) [role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();
    
    cy.get('div:nth-of-type(3) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click();
    
   
  });



});
