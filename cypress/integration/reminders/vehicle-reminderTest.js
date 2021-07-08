describe("Vehicle Reminders tests", () => {
  let authToken;
  let vehicleRenewal;
  afterEach(() => {

    if (authToken && vehicleRenewal) {
      const serviceUrl = Cypress.env('SERVICE_URL') + '/vehicleRenewal/record/cypress/delete/' + vehicleRenewal;
      cy.request({
        method: 'DELETE',
        url: serviceUrl,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          "Content-type": "application/json"
        }
      }).then(response => {
      })
    }
  })
  it('should allow users to add Vehicle reminders with all required fields', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').first().click();
    cy.get('.wtopnav > .nav > :nth-child(2) > .nav-link').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla {enter}');
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('Testing Renewal');
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').click();
    cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");
    cy.get('input[name="dueDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();
    cy.get('.col-lg-8 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('#vehicleRenewalForm > :nth-child(1) > :nth-child(3)').last().click();
    cy.get('.col-11 > .btn-success').first().click();
    cy.wait(4000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });

  it('should list the vehicle reminders which were added and then verify the added reminders are listed by name/other properties.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').first().click();
    cy.get('.wtopnav > .nav > :nth-child(2) > .nav-link').click();
    cy.get('.page-header > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla {enter}');
    cy.get('.page-header > .row > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('ALL{enter}');
    cy.get('.btn.btn-sm.btn-success.mr-3').click();
    cy.get('.page-header [type="button"]').click();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should allow users to edit vehicle reminders.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(2) > .nav-link').click();
    cy.get(':nth-child(1) > :nth-child(6) > .btn-group > .btn > .fas').click();
    cy.get('.mb-0.row-border.table.table-bordered.table-striped div[role="menu"] > a:nth-of-type(2)').click();
    cy.get('input[name="subscribers"]').clear();
    cy.get('input[name="dueDate"]').first().click();
    cy.get('div:nth-of-type(5) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();
    cy.get('.col-11 > .btn-success').click();//update button
    cy.url().then(url => {
      console.log('url', url);
      let newUrl = url.split('/');
      vehicleRenewal = newUrl[newUrl.length - 1];
      cy.setLocalStorage('vehicleRenewal', vehicleRenewal);
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });

  it('should allow users to delete vehicle reminders.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(2) > .nav-link').click();
    cy.get(':nth-child(1) > :nth-child(6) > .btn-group > .btn > .fas').click();
    cy.get(':nth-child(1) > :nth-child(6) > .btn-group > .dropdown-menu > :nth-child(3)').click();
    cy.getLocalStorage('congnitoAT').then((data) => {
      authToken = data;
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should give validation error messages when the required field is not provided.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').first().click();
    cy.get('.wtopnav > .nav > :nth-child(2) > .nav-link').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");
    cy.get('input[name="subscribers"]').clear();
    cy.get('.text-danger .ng-star-inserted').contains('Email is required');
    cy.get('input[name="time"]').clear();
    cy.get('input[name="time"]').type('2')
    cy.get('input[name="time"]').clear();
    cy.get('[class] [class="col-lg-4"] .ng-star-inserted .ng-star-inserted').contains('Time is required.');
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('check button is enabled or not.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').first().click();
    cy.get('.wtopnav > .nav > :nth-child(2) > .nav-link').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tesla {enter}');
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('Testing Renewal');
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').click();
    cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");
    cy.get('input[name="dueDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();
    cy.get('.col-lg-8 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('#vehicleRenewalForm > :nth-child(1) > :nth-child(3)').last().click();
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    });
  });

});
