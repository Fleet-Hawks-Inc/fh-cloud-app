describe('add-asset Test',function(){
    beforeEach(function(){
        cy.visit('http://cloudapp.fleethawks.com/#/Login/');
    })
it('add-asset credential', function() {
   
    /* ==== Generated with Cypress Studio ==== */
    
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('hardeepcloud');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@1302');
    cy.get('#btnsubmit').click();
    cy.wait(5000);
    cy.visit('http://cloudapp.fleethawks.com/#/Map-Dashboard');
    cy.get('[routerlinkactive="nav-active"]:nth-of-type(2) .nav-link').first().click();
    cy.wait(5000);
    cy.get('[class="col-md-5 col-lg-5 pr-1 text-right page-buttons"] [routerlink]').click();
    cy.wait(4000);
    cy.get('[class="col pr-0 pb-3 bg-white"] [name="employeeContractorId"]').type('1500070006000');//empid
    cy.get('div#addDriverBasic  .form-group.row > div:nth-of-type(2) > .row > div:nth-of-type(3) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click();//status
    cy.get('div#addDriverBasic  .form-group.row > div:nth-of-type(2) input[name="userName"]').first().type('Cypress Singh');//username
    cy.get('div#addDriverBasic  .form-group.row > div:nth-of-type(2) > .row input[name="firstName"]').first().type('Singh');//first name
    cy.get('div#addDriverBasic  .form-group.row > div:nth-of-type(2) > .row input[name="middleName"]').first().type('Testing');//optional middle name
    cy.get('div#addDriverBasic  .form-group.row > div:nth-of-type(2) > .row input[name="lastName"]').first().type('cypress');//Last name

    cy.get('div#addDriverBasic  .form-group.row > div:nth-of-type(2) > .row input[name="startDate"]').first().click();
    cy.get('[role] [role="row"]:nth-of-type(3) [role="gridcell"]:nth-of-type(5) .ng-star-inserted').last().click();//start date
    
    cy.get('[class="col pr-0 pb-3 bg-white"] [name="password"]').type('FH@2021');//password
    cy.get('[class="col pr-0 pb-3 bg-white"] [name="confirmPassword"]').type('FH@2021')//cnfrm passboard
    cy.get('[class] [class="col-lg-10"]:nth-of-type(8) [role="combobox"]').click();
    cy.get('[role="option"]:nth-of-type(4) .ng-star-inserted').click();//citizen
    const abstractDoc='download.jpg';
    cy.get('[class="col pr-0 pb-3 bg-white"] [name="abstractDocs"]').attachFile(abstractDoc);
    const driverPhoto='download.jpg';
    cy.get('[name="driverImage"]').attachFile(driverPhoto);
    cy.wait(2000);

    cy.get('div#addDriverBasic  .form-group.row > div:nth-of-type(3) input[name="DOB"]').first().click();
    cy.get('[role] [role="row"]:nth-of-type(2) [role="gridcell"]:nth-of-type(4) .btn-light').last().click();//birthdate

    cy.get('[class="col pr-0 pb-3 bg-white"] [name="workPhone"]').first().type('1800145612');//workphone
    cy.get('[class="col pr-0 pb-3 bg-white"] [name="workEmail"]').first().type('cypresstesting1180@gmail.com');//work mail
    cy.get('.btnNext.ng-star-inserted').first().click();
    cy.wait(3000);
    cy.get('[placeholder="Select address type"] input').first().click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').last().click();
    cy.get('[class="form-group row border-bottom-0"] [placeholder="Type Address"]').first().type('#39Hbc,modelTown');
    cy.get('.btnNext.ng-star-inserted').first().click();
    cy.wait(2000);
    cy.get('[class] #documents [class="col-lg-5 offset-lg-1"]:nth-of-type(1) [role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(4) .ng-option-label').last().click();//document type
    cy.get('div#document-one > div:nth-of-type(3) > .row > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').first().click();
    cy.get('[role="option"]:nth-of-type(36) .ng-option-label').last().click();//issuing country
    cy.get('div#document-one > div:nth-of-type(3) > .row > div:nth-of-type(2) > ng-select[role="listbox"] > .ng-has-value.ng-select-container').first().click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').last().click();//issue state
     const attachDoc1='download.jpg';
    cy.get('[class="col pr-0 pb-3 bg-white"] #documents [type="file"]').attachFile(attachDoc1);
    cy.get('[class="col pr-0 pb-3 bg-white"] [placeholder="Enter the document number"]').first().type('15936745582');
    cy.get('div#document-one > div:nth-of-type(4) input[name="documentDetails[0].issueDate"]').first().click();
    cy.get('[role] [role="row"]:nth-of-type(2) [role="gridcell"]:nth-of-type(4) .btn-light').last().click();//issue date.
    cy.get('[class="col pr-0 pb-3 bg-white"] [placeholder="Select licence issuing authority"]').first().type('Cypress Academy');//issue authority
    cy.get('[class="col pr-0 pb-3 bg-white"] [placeholder="Select expiry date of the document"]').first().click();
    cy.get('[role] [role="row"]:nth-of-type(4) [role="gridcell"]:nth-of-type(3) .btn-light').last().click();
    



});
})