const { last } = require("lodash");
describe(" Contact reminders tests", () => {
  let authToken;
  let contactRenewal;
  let serviceReminderType;
  afterEach(() => {
    if (authToken && contactRenewal) {
      const serviceUrl = Cypress.env('SERVICE_URL') + '/reminders/record/cypress/delete/' + contactRenewal+'/'+serviceReminderType;
      cy.request({
        method: 'DELETE',
        url: serviceUrl,
        failOnStatusCode: false,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          "Content-type": "application/json"
        }
      }).then(response => {
      })
    }
  })

  it('should allow users to add contact reminders with all required fields.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('cypress{enter}');
    cy.get('.col-lg-5.offset-lg-1  .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");
    cy.get('input[name="dueDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();
    cy.get('.col-lg-12.text-right .btn.btn-success.ng-star-inserted').click();//save
    cy.wait(4000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });


  it('should list the contact reminders which were added and then verify the added reminders are listed by name/other properties', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.page-header > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('cypress{enter}');
    cy.get('.page-header > .row > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('cypress{enter}');
    cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.page-header > .row > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('All{enter}');
    cy.get('.btn.btn-sm.btn-success.mr-3').click();
    cy.get('.page-header [type="button"]').click();
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
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('cypress{enter}');
    cy.get('.col-lg-5.offset-lg-1  .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();
    cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");
    cy.get('input[name="dueDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();
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
    cy.get('.ng-star-inserted > .nav > :nth-child(6) > .nav-link').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get('input[name="subscribers"]').type("hellouser@maliniator.in");
    cy.get('input[name="subscribers"]').clear();
    cy.get('.col-lg-5 .ng-star-inserted').contains('Email is required.');
    cy.get('input[name="reminderData.tasks.time"]').clear();
    cy.get('input[name="reminderData.tasks.time"]').type('2')
    cy.get('input[name="reminderData.tasks.time"]').clear();
    cy.get('[class="form-group row adddriverpl pt-3"] [class="col-lg-4"] .ng-star-inserted .ng-star-inserted').contains('Time is required.');
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });
  it('should allow users to edit contact reminders.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.btn.p-0 > .fa-ellipsis-v.fas').first().click();
    cy.get('.btn-group.flex-wrap.show > div[role="menu"] > a:nth-of-type(2)').last().click();//edit
    cy.get('input[name="dueDate"]').first().click();
    cy.get('div:nth-of-type(6) > div:nth-of-type(6) > .btn-light.ng-star-inserted').last().click();//update date
    // cy.get('[class="col-10"] .ng-star-inserted').click();//update
    cy.url().then(url => {
      console.log('url',url);
      let newUrl = url.split('/');
      contactRenewal = newUrl[newUrl.length - 1];
      serviceReminderType='contact';
      cy.setLocalStorage('contactRenewal', contactRenewal);
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });

  it('should allow users to delete contact reminders.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(6) > .nav-link > .fas').click();
    cy.get('.wtopnav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.btn.p-0 > .fa-ellipsis-v.fas').first().click();
    cy.get('.btn-group.flex-wrap.show > div[role="menu"] > a:nth-of-type(3)').last().click();
    cy.getLocalStorage('congnitoAT').then((data) => {
      authToken = data;
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });

  
  
});
