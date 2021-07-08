describe(" Maintenance tests", () => {
  let authToken;
  let programID;
  afterEach(() => {
  
    if (authToken && programID) {
      const serviceUrl = Cypress.env('SERVICE_URL') + '/servicePrograms/record/cypress/delete/' + programID;     
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

  it('should allow users to add service program with all required fields.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();
    cy.get('.col-md-6 > .btn').click();
    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').type('Heavy Vehicle');
    cy.get(':nth-child(1) > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('div[role="option"] > .ng-option-label').type('task{enter}');
    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3.text-dark > div:nth-of-type(1) ng-select[role="listbox"] input[role="combobox"]').clear();
    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3.text-dark > div:nth-of-type(1) ng-select[role="listbox"] input[role="combobox"]').type('tesla{enter}');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').type('2');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('d{enter}');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').type('1000');
    cy.get('div:nth-of-type(2) button#nextBtn').click();
    cy.wait(4000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });

  it('should dont allow users to add service program with all optional fields.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();
    cy.get('.col-md-6 > .btn').click();

    cy.get('.bg-white.p-3.text-dark textarea[name="description"]').type('Service program is working');
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
  });

  it('should list the service program which was added and then verify the added service program are listed by name/other properties.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();
    cy.get('.form-horizontal > .row > .col-md-3 > .input-group > .form-control').clear();
    cy.get('.form-horizontal > .row > .col-md-3 > .input-group > .form-control').type('Heavy{enter}');
    cy.get('section[role="main"]  form[method="get"] ul > li').click();
    cy.get('.btn.btn-sm.btn-success.mr-3').click();
    cy.wait(3000);
    cy.get('[class="col-md-2 col-lg-2"] [type="button"]').click();
    Cypress.on('uncaught:exception', (err, runnable) => {
  
      return false
    });
  });
  it('should allow users to edit service program.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();

    cy.get('#dropdownMenuButton-0 > .fas').click();
    cy.get('.dropdown-menu.show > a:nth-of-type(1)').click();//edit
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').type('7500');
    cy.get('.col-11 > .btn-success').click();
    cy.url().then(url => {
     
      let newUrl = url.split('/');
      
      
      programID = newUrl[newUrl.length - 1];
      
      cy.setLocalStorage('programID', programID);
    })
    Cypress.on('uncaught:exception', (err, runnable) => {
      
      return false
    });
  });

  it('should allow users to delete service program.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();

    cy.get('#dropdownMenuButton-0 > .fas').click();
    cy.get('.dropdown-menu.show > a:nth-of-type(2)').click();
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
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();
    cy.get('.col-md-6 > .btn').click();


    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').type('Heavy Vehicle');
    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').clear();
    cy.get('div:nth-of-type(1) > .col-lg-12 > .bg-white.p-3.text-dark .text-danger > div').contains('Service program name is required.');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').type('2');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').clear();
    cy.get('.col-lg-5.pr-0 > .text-danger > div').contains('Repeat by time is required.');

    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').type('1000');

    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('div:nth-of-type(2) > .text-danger > div').contains('Repeat by odometer is required.');
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
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#service-prog-tab').click();
    cy.get('.col-md-6 > .btn').click();
    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(2) > .row > .col-lg-10 > .form-control').type('Heavy Vehicle');
    cy.get(':nth-child(1) > .row > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();

    cy.get('div[role="option"] > .ng-option-label').type('task{enter}');

    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3.text-dark > div:nth-of-type(1) ng-select[role="listbox"] input[role="combobox"]').clear();
    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3.text-dark > div:nth-of-type(1) ng-select[role="listbox"] input[role="combobox"]').type('tesla{enter}');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-5 > .form-control').type('2');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').clear();

    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').type('d{enter}');
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').clear();
    cy.get('.col-lg-10 > :nth-child(1) > :nth-child(2) > .form-control').type('1000');

  });
  Cypress.on('uncaught:exception', (err, runnable) => {
    
    return false
  });
});


