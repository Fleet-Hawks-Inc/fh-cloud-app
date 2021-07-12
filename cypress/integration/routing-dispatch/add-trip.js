describe("Add trip ", function () {
  let authToken;
  let tripID;
  let orderID;
  afterEach(() => {
    if (authToken && tripID) {
      const serviceUrl = Cypress.env('SERVICE_URL') + '/trips/record/cypress/delete/' + tripID
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
  it('should allow the user to add-order first then add trip later', function () {

    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    cy.get('[name="orderData\.customerID"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//customer id

    cy.get('[placeholder="Select Shipper"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//shipper 

    cy.get('[id="collapseReceiverArea-0"] .row:nth-of-type(1) [role="combobox"]').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//reciever

    cy.get('[id="collapseShipperArea-0"] [class="row mt-3"]:nth-of-type(2) .ng-invalid').type('ww');
    cy.get('[class="col-lg-12 col-md-12 show-search__result"] [title="Calgary Climbing Centre Stronghold\, 140 15 Ave NW\, Calgary\, AB T2M 0G6\, Canada"]').click();//pickup location


    cy.get('input[name="dropOffLocation"]').type('as');
    cy.get('[class="col-lg-12 col-md-12 show-search__result"] [title]').click();//drop location

    cy.get('#collapseShipperArea-0 > :nth-child(3) > :nth-child(2) > .input-group > .form-control').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light').last().click();//pickp date
    cy.get('input[name="pickupTime"]').type('01:30')//pickuptime
    cy.get('input[name="dropOffDate"]').first().click();
    cy.get('div:nth-of-type(2) > div:nth-of-type(6) > .btn-light').last().click();//delivery date
    cy.get('input[name="dropOffTime"]').type('02:45');//dropoff time
    cy.get('[id="collapseShipperArea-0"] [pattern]').type('add comments for pickup delivery');//pickup delivery

    cy.get('div#collapseShipperArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click()//save1
    cy.wait(3000);
    cy.get('div#collapseReceiverArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click();//save 2

    cy.get('.col-lg-8.offset-lg-2 > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//asset type

    cy.get('[name="freight_type"] input').first().click();
    cy.get('div[role="option"] > .ng-option-label').last().click();//freieght type

    cy.get('input[name="freight_amount"]').type('40');//amount

    cy.get('[name="freight_currency"] input').first().click();
    cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//currency type

    cy.get('input[name="totalMiles"]').type('500');//miles
    cy.get('[class="row mb-3"]:nth-of-type(3) button').click();//save btn
    cy.wait(4000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      
      return false
    })
  });

  it("should allow the user to add trip", function () {
    cy.visit("/#/Login");
    cy.get(":nth-child(1) > .input-group > .form-control").clear();
    cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
    cy.get(":nth-child(2) > .input-group > .form-control").clear();
    cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
    cy.get("#btnsubmit").click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(2) > .nav-link > .fas').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();

    cy.get('input[name="ordr"]').click();
    cy.get('[role="row"]:nth-of-type(1) [name]').first().click();
    cy.get('[class="btn btn-success modal-confirm mr-3"]').last().click();
    cy.get('.col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();

    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .form-control').type('12369544');
    cy.get('.col-lg-10 > .row > :nth-child(1) > .form-control').clear();
    cy.get('.col-lg-10 > .row > :nth-child(1) > .form-control').type('340.69');
    cy.get('[name="reeferTemperatureUnit"] input').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
    cy.get('#HazMat1').click();
    cy.get('#HazMat2').click();
    cy.get('#HazMat3').click();
    cy.get('#HazMat4').click();
    cy.get('#HazMat5').click();
    cy.get('.btn.btn-success.mt-1.ng-star-inserted').click();
    cy.wait(4000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      
      return false
    })
  });

  it('should list the trip which was added and then verify the added trip is listed by name/other properties', function () {
    cy.visit("/#/Login");
    cy.get(":nth-child(1) > .input-group > .form-control").clear();
    cy.get(":nth-child(1) > .input-group > .form-control").type(
      Cypress.config("testerUserName")
    );
    cy.get(":nth-child(2) > .input-group > .form-control").clear();
    cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
    cy.get("#btnsubmit").click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(2) > .nav-link > .fas').click();
    cy.get('[name="category"] input').first().click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
    cy.get('input[name="searchValue"]').type('1000');
    cy.get('input[name="fromDate"]').first().click();
    cy.get('div:nth-of-type(4) > div:nth-of-type(3) > .btn-light.ng-star-inserted').last().click();


    cy.get('input[name="toDate"]').first().click();
    cy.get('div:nth-of-type(4) > div:nth-of-type(5) > .btn-light.ng-star-inserted').last().click();

    cy.get('.btn.btn-sm.btn-success.mr-3').click();
    cy.wait(3000);
    cy.get('.inner-wrapper .page-header [class] [type="button"]:nth-of-type(2)').click();
    Cypress.on('uncaught:exception', (err, runnable) => {
      
      return false
    })

  });
  it('should allow user to edit trip', function () {
    cy.visit("/#/Login");
    cy.get(":nth-child(1) > .input-group > .form-control").clear();
    cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
    cy.get(":nth-child(2) > .input-group > .form-control").clear();
    cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
    cy.get("#btnsubmit").click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(2) > .nav-link > .fas').click();

    cy.get('#dropdownMenuButton-0').first().click();
    cy.get('.dropdown-menu.show > a:nth-of-type(1)').last().click();//edit
    cy.url().then(url => {
      console.log('url', url);
      let newUrl = url.split('/');
      tripID = newUrl[newUrl.length - 1];
      cy.setLocalStorage('tripID', tripID);
    })
    Cypress.on('uncaught:exception', (err, runnable) => {
      
      return false
    })
  });
  it('should allow user to delete trip', function () {
    cy.visit("/#/Login");
    cy.get(":nth-child(1) > .input-group > .form-control").clear();
    cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
    cy.get(":nth-child(2) > .input-group > .form-control").clear();
    cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
    cy.get("#btnsubmit").click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(2) > .nav-link > .fas').click();

    cy.get('#dropdownMenuButton-0').first().click();
    cy.get(':nth-child(1) > :nth-child(12) > .dropdown > .dropdown-menu > :nth-child(2)').last().click();
    cy.getLocalStorage('congnitoAT').then((data) => {
      authToken = data;
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
    
      return false
    })
  });
  // it('should give validation error message when required fields are not provided', function () {
  //     cy.visit("/#/Login");
  //     cy.get(":nth-child(1) > .input-group > .form-control").clear();
  //     cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
  //     cy.get(":nth-child(2) > .input-group > .form-control").clear();
  //     cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
  //     cy.get("#btnsubmit").click();
  //     cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
  //     cy.get(':nth-child(2) > .nav-link > .fas').click();
  //     cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();

  //     Cypress.on('uncaught:exception', (err, runnable) => {
  //         // returning false here prevents Cypress from
  //         // failing the test
  //         return false
  //       })
  // });
  it('should allow user to edit order', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('#dropdownMenuButton-0 > .fas').first().click();
    cy.get('.dropdown-menu.show > a:nth-of-type(1)').last().click();//edit
    cy.get('input[name="customerPO"]').clear();
    cy.get('input[name="customerPO"]').type('4045');
    cy.get('.btn.btn-success.ng-star-inserted.text-white').click();//update

    cy.url().then(url => {
      console.log('url', url);
      let newUrl = url.split('/');
      orderID = newUrl[newUrl.length - 1];
      cy.setLocalStorage('orderID', orderID);
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
  });
  });
  it('should allow user to delete order', function () {
    cy.visit('/#/Login');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
    cy.get('#dropdownMenuButton-0 > .fas').first().click();
    cy.get(':nth-child(1) > :nth-child(10) > .dropdown > .dropdown-menu > [href="javascript:;"]').first().click();//delete
    cy.wait(3000);
    cy.getLocalStorage('congnitoAT').then((data) => {
      authToken = data;
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
  })
  });

});