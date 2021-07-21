describe('Driver Tests', function () {
  let authToken;
  let driverID;
  afterEach(() => {

    if (authToken && driverID) {
      const serviceUrl = Cypress.env('SERVICE_URL') + '/drivers/record/cypress/delete/' + driverID;
      ;

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
  });
  it('should allow users to add driver with all required fields.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('fleet-sidebar > ul > li:nth-of-type(2) > .nav-link').click();
    cy.get('.col-md-6 > .btn-success').click();
    cy.get('.content-body > #driverForm > .m-2 > :nth-child(1) > .col-12 > .bg-white > .form-group > :nth-child(2) > :nth-child(1) > #employeeIDDiv > .row > .ng-star-inserted > .input-group > .form-control').clear();
    cy.get('.content-body > #driverForm > .m-2 > :nth-child(1) > .col-12 > .bg-white > .form-group > :nth-child(2) > :nth-child(1) > #employeeIDDiv > .row > .ng-star-inserted > .input-group > .form-control').type('01');//emp id
    cy.get('.justify-content-between [class="col-lg-6 mb-1"]:nth-of-type(2) [role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//status
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="userName"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="userName"]').type('james.253');//username
    cy.get('input#birth').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();//birthdate
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="firstName"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="firstName"]').type('James');//first name
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="lastName"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="lastName"]').type('smith');//last name
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#pd').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#pd').type('11nAm11@');//pswd
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#cnf').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#cnf').type('11nAm11@');//pswd cnf
    cy.get('.adddriverpl [name="phone"]').clear();
    cy.get('.adddriverpl [name="phone"]').type('4425896320');//phone
    cy.get('.adddriverpl [name="email"]').clear();
    cy.get('.adddriverpl [name="email"]').type('james.coder@gmail.in');//email
    cy.get('.adddriverpl [name="startDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();//start date
    cy.get('div:nth-of-type(9) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//citizenship
    const file2 = "download.jpg";
    cy.get('[class="col-lg-5 mar-top-37"] [type]').attachFile(file2);
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="CDL_Number"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="CDL_Number"]').type('221413330');//cdl
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="licenceDetails.licenceExpiry"]').first().click();
    cy.get('div:nth-of-type(6) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();//expiration date
    cy.get('[name] [class="row mb-3"]:nth-of-type(5) [class="col-lg-5"]:nth-of-type(3) [role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//country
    cy.get('div:nth-of-type(5) > .col-lg-12 > .bg-white.p-3 > .adddriverpl.form-group.row.text-dark > div:nth-of-type(3) > .row > div:nth-of-type(4) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//province/state
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="SIN"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="SIN"]').type('221413331');//sin
    cy.get('div:nth-of-type(7) > .col-lg-12 > .bg-white.p-3 > .adddriverpl.form-group.row.text-dark > .col-lg-6.mb-1 > .row > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//status exempt
    cy.get(':nth-child(7) > .col-lg-12 > .bg-white > .form-group > :nth-child(3) > .row > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('.ng-option-label div').last().click();//home terminal
    cy.get('div:nth-of-type(7) > .col-lg-12 > .bg-white.p-3 > .adddriverpl.form-group.row.text-dark > .col-lg-6 > .row > div:nth-of-type(4) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//home terminal timezone

    cy.get('.col-lg-11.pb-1.pr-2.pt-1.text-right > .btn.btn-success.cus-btn-padd.ng-star-inserted').click();
    cy.wait(4000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })

  });
  it('should not allow users to add driver with optional fields.', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('fleet-sidebar > ul > li:nth-of-type(2) > .nav-link').click();
    cy.get('.col-md-6 > .btn-success').click();
    cy.get('[name="groupID"] .ng-select-container').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//group
    cy.get('[name="assignedVehicle"] input').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-option-label').last().click();//assign vehicle
    cy.get('[class="form-group row border-bottom-0"] .ng-select-container').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//address type
    // cy.get('.form-control.mb-2.ng-dirty.ng-touched.ng-valid').type("cal");
    // cy.get('.m-0.p-0.text-left > li:nth-of-type(1) > a').last().click();//address
    cy.get('div#document-one > div:nth-of-type(1) > .row > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) > .ng-option-label').last().click();//document type
    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3 > div#document-one > div:nth-of-type(3) > .row > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//issue country
    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3 > div#document-one > div:nth-of-type(3) > .row > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('.ng-dropdown-panel.ng-select-bottom > div > div:nth-of-type(2) > div:nth-of-type(1)').last().click();//issue province/sate.
    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3 > div#document-one input[name="documentDetails[0].document"]').type("5464641ASD");//issue number
    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3 > div#document-one input[name="documentDetails[0].issuingAuthority"]').type("Ontario,canada");//issue authority

    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3 > div#document-one input[name="documentDetails[0].issueDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light').last().click();//issue date
    cy.get('div:nth-of-type(3) > .col-lg-12 > .bg-white.p-3 > div#document-one input[name="documentDetails[0].expiryDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light').last().click();//issue expiry date

    cy.get('input[name="crossBorderDetails.ACI_ID"]').type("546464145");//aci
    cy.get('input[name="crossBorderDetails.ACE_ID"]').type("454464666");//ace
    cy.get('input[name="crossBorderDetails.fast_ID"]').type("45446466600001");//fast expiry
    cy.get('input[name="name"]').type("Steve");//name
    cy.get('[name="emergencyDetails\.phone"]').type("7000045246");//name
    cy.get('[name="emergencyDetails\.relationship"]').type("Manager");//name

    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    })


  });
  it('should list the vehicle which was added and then verify the added vehicle is listed by name/other properties', function () {


    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('fleet-sidebar > ul > li:nth-of-type(2) > .nav-link').click();
    cy.get('input[name="driverName"]').type('James');
    // cy.get('section[role="main"]  form[method="get"] ul > li').click();
    cy.get('.page-header [role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last();
    cy.get('.btn.btn-sm.btn-success.mr-3').first().click();
    cy.get('[class="col-md-2 col-lg-2"] [type="button"]').click();
    cy.get('.btn.btn-default.btn-md.driverbtn.dropdown-toggle.mr-3.toggleright').first().click();
    cy.get('input[name="currVehicle"]').last().click();
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    })
  });
  it('should allow user to edit driver', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('fleet-sidebar > ul > li:nth-of-type(2) > .nav-link').click();
    cy.get('tr:nth-of-type(1) > .border-0  .bg-transparent.border-0 > .fa-ellipsis-v.fas').click();
    cy.get('.dropdown-menu.show > a:nth-of-type(1)').click();
    cy.url().then(url => {

      let newUrl = url.split('/');


      // cy.get('.editor-toolbar-actions-save').click();
      // cy.url().should('not.eq', url);
      driverID = newUrl[newUrl.length - 1];

      cy.setLocalStorage('driverID', driverID);

    })

    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    })


  });
  it('should allow user to delete driver', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('fleet-sidebar > ul > li:nth-of-type(2) > .nav-link').click();
    cy.get('tr:nth-of-type(1) > .border-0  .bg-transparent.border-0 > .fa-ellipsis-v.fas').click();
    cy.get('.dropdown-menu.show > a:nth-of-type(2)').click();

    cy.getLocalStorage('congnitoAT').then((data) => {
      authToken = data;

    });
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    })

  });

  it('should give validation error message when required fields are not provided ', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('fleet-sidebar > ul > li:nth-of-type(2) > .nav-link').click();
    cy.get('.col-md-6 > .btn-success').click();

    cy.get('.content-body > #driverForm > .m-2 > :nth-child(1) > .col-12 > .bg-white > .form-group > :nth-child(2) > :nth-child(1) > #employeeIDDiv > .row > .ng-star-inserted > .input-group > .form-control').type('23')
    cy.get('.content-body > #driverForm > .m-2 > :nth-child(1) > .col-12 > .bg-white > .form-group > :nth-child(2) > :nth-child(1) > #employeeIDDiv > .row > .ng-star-inserted > .input-group > .form-control').clear();
    cy.get('div#employeeIDDiv .text-danger > div').contains('Employee ID is required.');
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="userName"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="userName"]').type('nameet.23');
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="userName"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 .text-danger > div').contains('Username is required.');

    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="firstName"]').type('charlie');//first name
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="firstName"]').clear();
    cy.get('div:nth-of-type(5) > .row > div:nth-of-type(1) > .text-danger > div').contains('First name is required.');

    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="lastName"]').type('smith');//last name
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="lastName"]').clear();
    cy.get('div:nth-of-type(2) > .text-danger > div').contains('Last name is required.');


    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#pd').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#pd').type('11nAm11@');//pswd
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#pd').clear();
    cy.get('div:nth-of-type(6) > .row > div:nth-of-type(1) > .text-danger > div').contains('Password is required');

    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#cnf').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#cnf').type('11nAm11@');//pswd cnf
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#cnf').clear();
    cy.get('div:nth-of-type(6) > .row > div:nth-of-type(2) > .text-danger > div').contains('Confirm password is required.');

    cy.get('.adddriverpl [name="phone"]').clear();
    cy.get('.adddriverpl [name="phone"]').type('8968831455');//phone
    cy.get('.adddriverpl [name="phone"]').clear();
    cy.get('div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) > .text-danger > div').contains('Phone is required.');

    cy.get('.adddriverpl [name="email"]').clear();
    cy.get('.adddriverpl [name="email"]').type('charliesmith@gmail.com');//email
    cy.get('.adddriverpl [name="email"]').clear();
    cy.get('div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(3) > .text-danger > div').contains('Email is required.');



    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="CDL_Number"]').type('450496565');//cdl
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="CDL_Number"]').clear();
    cy.get('div:nth-of-type(3) > .row > div:nth-of-type(1) > .text-danger > div').contains('CDL# is required.');


    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="SIN"]').type('789650666');//sin
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="SIN"]').clear();
    cy.get('div:nth-of-type(2) > .row > div:nth-of-type(2) > .text-danger > div').contains('SIN is required.');

    Cypress.on('uncaught:exception', (err, runnable) => {

      return false
    })


  });
  it('check button is enabled or not.', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('fleet-sidebar > ul > li:nth-of-type(2) > .nav-link').click();
    cy.get('.col-md-6 > .btn-success').click();
    cy.get('.content-body > #driverForm > .m-2 > :nth-child(1) > .col-12 > .bg-white > .form-group > :nth-child(2) > :nth-child(1) > #employeeIDDiv > .row > .ng-star-inserted > .input-group > .form-control').clear();
    cy.get('.content-body > #driverForm > .m-2 > :nth-child(1) > .col-12 > .bg-white > .form-group > :nth-child(2) > :nth-child(1) > #employeeIDDiv > .row > .ng-star-inserted > .input-group > .form-control').type('23');//emp id
    cy.get('.justify-content-between [class="col-lg-6 mb-1"]:nth-of-type(2) [role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//status
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="userName"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="userName"]').type('nameet.23');//username
    cy.get('input#birth').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();//birthdate
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="firstName"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="firstName"]').type('charlie');//first name
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="lastName"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="lastName"]').type('smith');//last name
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#pd').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#pd').type('11nAm11@');//pswd
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#cnf').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 > div:nth-of-type(1) input#cnf').type('11nAm11@');//pswd cnf
    cy.get('.adddriverpl [name="phone"]').clear();
    cy.get('.adddriverpl [name="phone"]').type('8968831455');//phone
    cy.get('.adddriverpl [name="email"]').clear();
    cy.get('.adddriverpl [name="email"]').type('charliesmith@gmail.com');//email
    cy.get('.adddriverpl [name="startDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();//start date
    cy.get('div:nth-of-type(9) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//citizenship
    const file2 = "download.jpg";
    cy.get('[class="col-lg-5 mar-top-37"] [type]').attachFile(file2);
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="CDL_Number"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="CDL_Number"]').type('456496565');//cdl
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="licenceDetails.licenceExpiry"]').first().click();
    cy.get('div:nth-of-type(6) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();//expiration date
    cy.get('[name] [class="row mb-3"]:nth-of-type(5) [class="col-lg-5"]:nth-of-type(3) [role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//country
    cy.get('div:nth-of-type(5) > .col-lg-12 > .bg-white.p-3 > .adddriverpl.form-group.row.text-dark > div:nth-of-type(3) > .row > div:nth-of-type(4) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//province/state
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="SIN"]').clear();
    cy.get('section[role="main"] > form#driverForm > .m-2 input[name="SIN"]').type('789655666');//sin
    cy.get('div:nth-of-type(7) > .col-lg-12 > .bg-white.p-3 > .adddriverpl.form-group.row.text-dark > .col-lg-6.mb-1 > .row > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//status exempt
    cy.get(':nth-child(7) > .col-lg-12 > .bg-white > .form-group > :nth-child(3) > .row > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').first().click();
    cy.get('.ng-option-label div').last().click();//home terminal
    cy.get('div:nth-of-type(7) > .col-lg-12 > .bg-white.p-3 > .adddriverpl.form-group.row.text-dark > .col-lg-6 > .row > div:nth-of-type(4) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();//home terminal timezone
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
  });
});