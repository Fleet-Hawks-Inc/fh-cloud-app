describe(" Maintenance tests", () => {
  let authToken;
  let logID;
  afterEach(() => {

    if (authToken && logID) {

      const serviceUrl = Cypress.env('SERVICE_URL') + '/serviceLogs/record/cypress/delete/' + logID;


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
  it('should allow users to add service log with all required fields', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('.col-md-4 > .btn').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tes{enter}');
    cy.get('.pt-2.ng-star-inserted > .col-lg-10 > .form-control').clear();
    cy.get('.pt-2.ng-star-inserted > .col-lg-10 > .form-control').type('1000');
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light').last().click();//completion date
    cy.get(':nth-child(3) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();

    cy.get('[class="col-11 pr-0"] #nextBtn').click();
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    });


  });
  it('should not allow users to add service log with all optional fields', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('.col-md-4 > .btn').click();
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tes{enter}');
    cy.get('.m-2 > form[method="get"] textarea[name="description"]').type('Service log is working');
    cy.get('input[name="selected0"]').click();
    cy.get('[bindlabel="taskName"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();
    const imagefile4 = "download.jpg";
    cy.get('input[name="uploadedPhotos"]').attachFile(imagefile4);
    const file4 = "load1.pdf";
    cy.get('input[name="uploadedDocuments"]').attachFile(file4);
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    });

  });
  it('should list the maintenance which was added and then verify the added maintenance are listed by name/other properties.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('[name="vehicleID"] input').clear();

    cy.get('[name="vehicleID"] input').type('tes{enter}');
    cy.get('[name="taskID"] input').clear();
    cy.get('[name="taskID"] input').type('testing{enter}');
    cy.get('.page-header [type="submit"]').click();
    cy.wait(3000);
    cy.get('.page-header [type="button"]').click();
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    });

  });
  it('should allow users to edit service log.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#dropdownMenuButton-0 > .fas').click();
    cy.get('.dropdown-menu.show > a:nth-of-type(1)').click();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').first().click();
    cy.get('div:nth-of-type(6) > div:nth-of-type(6) > .btn-light.ng-star-inserted').last().click();//update completion date
    cy.get('.m-2 > form[method="get"] textarea[name="description"]').type('Service Log updated succesfully')
    // cy.get('.col-11 > .btn-success').click();//update button
    cy.wait(1000);
    cy.url().then(url => {
      console.log('url', url);
      let newUrl = url.split('/');


      logID = newUrl[newUrl.length - 1];

      cy.setLocalStorage('logID', logID);
    })
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    });
  });

  it('should allow users to delete service log.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get(':nth-child(8) > .nav-link > .fas').click();
    cy.get('#dropdownMenuButton-0 > .fas').click();
    cy.get('.row-border > tbody > :nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > [href="javascript:;"]').click();
    cy.wait(1000);
    cy.getLocalStorage('congnitoAT').then((data) => {
      authToken = data;


    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
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
    cy.get('.col-md-4 > .btn').click();

    cy.get('.pt-2.ng-star-inserted > .col-lg-10 > .form-control').type('1000');
    cy.get('.pt-2.ng-star-inserted > .col-lg-10 > .form-control').clear();
    cy.get('.m-2 > form[method="get"] .text-danger > div').contains('Odometer is required.');
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
    cy.get('.col-md-4 > .btn').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('tes{enter}');
    cy.get('.pt-2.ng-star-inserted > .col-lg-10 > .form-control').clear();
    cy.get('.pt-2.ng-star-inserted > .col-lg-10 > .form-control').type('1000');
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light').last().click();
    cy.get(':nth-child(3) > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-option-label').click();
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    });


  });

});
