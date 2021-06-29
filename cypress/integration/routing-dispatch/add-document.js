// describe('Add Documents', function () {

//         it('should allow the user to add-order first', function () {

//                 cy.visit('/#/Login');
//                 cy.get(':nth-child(1) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
//                 cy.get(':nth-child(2) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
//                 cy.get('#btnsubmit').click();
//                 cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
//                 cy.get('.ng-star-inserted > .nav > :nth-child(1) > .nav-link').click();
//                 cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
//                 cy.get('[name="orderData\.customerID"] input').first().click();
//                 cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//customer id

//                 cy.get('[placeholder="Select Shipper"] input').first().click();
//                 cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//shipper 

//                 cy.get('[id="collapseReceiverArea-0"] .row:nth-of-type(1) [role="combobox"]').first().click();
//                 cy.get('div[role="option"] > .ng-option-label').last().click();//reciever

//                 cy.get('[id="collapseShipperArea-0"] [class="row mt-3"]:nth-of-type(2) .ng-invalid').type('ww');
//                 cy.get('[class="col-lg-12 col-md-12 show-search__result"] [title="Calgary Climbing Centre Stronghold\, 140 15 Ave NW\, Calgary\, AB T2M 0G6\, Canada"]').click();//pickup location


//                 cy.get('input[name="dropOffLocation"]').type('as');
//                 cy.get('[class="col-lg-12 col-md-12 show-search__result"] [title]').click();//drop location

//                 cy.get('#collapseShipperArea-0 > :nth-child(3) > :nth-child(2) > .input-group > .form-control').first().click();
//                 cy.get('div:nth-of-type(2) > div:nth-of-type(3) > .btn-light').last().click();//pickp date
//                 cy.get('input[name="pickupTime"]').type('01:30')//pickuptime
//                 cy.get('input[name="dropOffDate"]').first().click();
//                 cy.get('div:nth-of-type(2) > div:nth-of-type(6) > .btn-light').last().click();//delivery date
//                 cy.get('input[name="dropOffTime"]').type('02:45');//dropoff time
//                 cy.get('[id="collapseShipperArea-0"] [pattern]').type('add comments for pickup delivery');//pickup delivery

//                 cy.get('div#collapseShipperArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click()//save1
//                 cy.wait(3000);
//                 cy.get('div#collapseReceiverArea-0 > div:nth-of-type(8) .btn.btn-dark.btn-md.btnw90px').click();//save 2

//                 cy.get('.col-lg-8.offset-lg-2 > ng-select[role="listbox"] input[role="combobox"]').first().click();
//                 cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//asset type

//                 cy.get('[name="freight_type"] input').first().click();
//                 cy.get('div[role="option"] > .ng-option-label').last().click();//freieght type

//                 cy.get('input[name="freight_amount"]').type('40');//amount

//                 cy.get('[name="freight_currency"] input').first().click();
//                 cy.get('div:nth-of-type(1) > .ng-option-label').last().click();//currency type

//                 cy.get('input[name="totalMiles"]').type('500');//miles
//                 cy.get('[class="row mb-3"]:nth-of-type(3) button').click();//save btn
//                 cy.wait(3000);

//                 Cypress.on('uncaught:exception', (err, runnable) => {
//                         // returning false here prevents Cypress from
//                         // failing the test
//                         return false
//                 })
//         });
//         it("should allow the user to add trip", function () {
//                 cy.visit("/#/Login");
//                 cy.get(":nth-child(1) > .input-group > .form-control").clear();
//                 cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
//                 cy.get(":nth-child(2) > .input-group > .form-control").clear();
//                 cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
//                 cy.get("#btnsubmit").click();
//                 cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
//                 cy.get(':nth-child(2) > .nav-link > span').click();
//                 cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();

//                 cy.get('input[name="ordr"]').click();
//                 cy.get('[role="row"]:nth-of-type(1) [name]').first().click();
//                 cy.get('[class="btn btn-success modal-confirm mr-3"]').last().click();
//                 cy.get('.col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();

//                 cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .form-control').clear();
//                 cy.get(':nth-child(2) > :nth-child(2) > .col-lg-10 > .form-control').type('12369544');
//                 cy.get('.col-lg-10 > .row > :nth-child(1) > .form-control').clear();
//                 cy.get('.col-lg-10 > .row > :nth-child(1) > .form-control').type('340.69');
//                 cy.get('[name="reeferTemperatureUnit"] input').first().click();
//                 cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').last().click();
//                 cy.get('#HazMat1').click();
//                 cy.get('#HazMat2').click();
//                 cy.get('#HazMat3').click();
//                 cy.get('#HazMat4').click();
//                 cy.get('#HazMat5').click();
//                 cy.get('.btn.btn-success.mt-1.ng-star-inserted').click();
//                 cy.wait(3000);

//                 Cypress.on('uncaught:exception', (err, runnable) => {
//                         // returning false here prevents Cypress from
//                         // failing the test
//                         return false
//                 })
//         });

//         it.only('should allow the user to add the documents', function () {

//                 cy.visit('/#/Login');
//                 cy.get(':nth-child(1) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.config('testerUserName'));
//                 cy.get(':nth-child(2) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(2) > .input-group > .form-control').type(Cypress.config('testerPassword'));
//                 cy.get('#btnsubmit').click();
//                 cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
//                 cy.get(':nth-child(5) > .nav-link > span').click();
//                 cy.get('.btn.btn-sm.btn-success.mb-1.modal-with-form.mr-1.pull-right').click();
//                 cy.get('[name="tripID"] input').first().click();
//                 cy.get('div[role="option"] > .ng-option-label').last().click();
//                 cy.get('[name="docType"] input').first().click();
//                 cy.get('div:nth-of-type(1) > .ng-option-label').last().click();


              
//                 const file24 = "test.png";
//                 cy.get('#uploadedDocs').attachFile(file24);
//                 cy.get('#addDocumentModal [name="description"]').type('Thank You Fleet Hawks Inc For Your Services');
//                 cy.get('.btn.btn-success.modal-confirm').click();

//                 Cypress.on('uncaught:exception', (err, runnable) => {
//                         // returning false here prevents Cypress from
//                         // failing the test
//                         return false
//                 })
//         });
//         it('should display the added documents to the document list and then verify the added document by name/other properties', function () {
//                 cy.visit('http://localhost:4200/');
//                 cy.get(':nth-child(1) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
//                 cy.get(':nth-child(2) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
//                 cy.get('#btnsubmit').click();
//                 cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
//                 cy.get(':nth-child(6) > .nav-link > span').click();
//                 cy.get('.mr-5 > a > .position-relative > .folder-shape').click();
//                 cy.get('input[name="searchValue"]').type('1325');
//                 cy.get('input[name="fromDate"]').first().click();
//                 cy.get('div:nth-of-type(4) > div:nth-of-type(6) > .btn-light.ng-star-inserted').last().click();//start date

//                 cy.get('input[name="toDate"]').first().click();
//                 cy.get('div:nth-of-type(5) > div:nth-of-type(6) > .btn-light.ng-star-inserted').last().click();//end date
//                 cy.get('.btn.btn-sm.btn-success.mr-2').click();
//                 cy.get('.inner-wrapper .page-header [class] [type="button"]:nth-of-type(2)').click();


//         });
//         it('should delete the added document from the list', function () {
//                 cy.visit('http://localhost:4200/');
//                 cy.get(':nth-child(1) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
//                 cy.get(':nth-child(2) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
//                 cy.get('#btnsubmit').click();
//                 cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
//                 cy.get(':nth-child(6) > .nav-link > span').click();
//                 cy.get('.mr-5 > a > .position-relative > .folder-shape').click();
//                 cy.get('#dropdownMenuButton-0').first().click();
//                 cy.get(':nth-child(8) > .dropdown > .dropdown-menu > :nth-child(2)').last().click();
//                 cy.wait(5000);
//         });
//         it('should give validation error message when user directly submit the form without entering the credentials', function () {
//                 cy.visit('http://localhost:4200/');
//                 cy.get(':nth-child(1) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
//                 cy.get(':nth-child(2) > .input-group > .form-control').clear();
//                 cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
//                 cy.get('#btnsubmit').click();
//                 cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
//                 cy.get(':nth-child(6) > .nav-link > span').click();
//                 cy.get('.mr-5 > a > .position-relative > .folder-shape').click();
//                 cy.get('.col-lg-5 > .modal-with-form').click();
//                 cy.get('#addDocumentModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
//                 cy.get('#documentNumber-error').contains('This Field is not allowed to be empty');
//                 cy.get('#tripID-error').contains('This Field is not allowed to be empty');
//                 cy.get('#docType-error').contains('This Field is not allowed to be empty');
//                 cy.get('#documentName-error').contains('This Field is not allowed to be empty');

//         });

// });
