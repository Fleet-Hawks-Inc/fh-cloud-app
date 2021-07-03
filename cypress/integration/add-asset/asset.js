
describe("Assets Test", function () {
    let authToken;
    let assetID;
    afterEach(() => {
        if (authToken && assetID) {
            const serviceUrl = Cypress.env('SERVICE_URL') + '/assets/record/cypress/delete/' + assetID;
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
    it("should allow the user to add asset", function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();
        cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link").first().click();
        cy.get(".col-md-6 > .btn-success").first().click();
        cy.get('.adddriverpl.form-group.pt-3.row input[name="assetIdentification"]').type("Boxer Asset"); //asset name
        cy.get('.inner-wrapper [name="VIN"]').type("RN4DC2390LS002470"); //vin number
        cy.get(".inner-wrapper [class='row mb-3']:nth-of-type(2) [class='col-lg-5 mb-3'] .row:nth-child(1) [role='combobox']").first().click();
        cy.get("div:nth-of-type(2) > .ng-option-label.ng-star-inserted").last().click(); //asset type
        cy.get('.inner-wrapper [class="col-lg-5 mb-3"] [class="row mt-2"]:nth-of-type(2) [class="col-lg-5"]:nth-of-type(1) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(10) .ng-star-inserted').last().click(); //year
        cy.get('.inner-wrapper [class="col-lg-5 mb-3"] [class="row mt-2"]:nth-of-type(2) [class="col-lg-5"]:nth-of-type(2) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click(); //asset status
        cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').click(); //Licence country
        cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click(); //issue state
        cy.get('form#form_ > div:nth-of-type(2) input[name="assetDetails.licencePlateNumber"]').type("PB0Cl78"); //Licence Number
        cy.get('form#form_ > div:nth-of-type(2) input[name="assetDetails.annualSafetyDate"]').first().click();
        cy.get('[role] [role="row"]:nth-of-type(4) [role="gridcell"]:nth-of-type(2) .ng-star-inserted').last().click(); //Annual Safety Date
        cy.get('div:nth-of-type(5) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//inspection form
        cy.get('[class="col-11 pr-0"] #nextBtn').first().click(); //save
        cy.wait(5000);
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })

    });
    it("should not allow users to add assets with optional fields.", function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();
        cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link").first().click();
        cy.get(".col-md-6 > .btn-success").first().click();
        cy.get('.adddriverpl.form-group.pt-3.row input[name="assetDetails.height"]').type("10"); //height
        cy.get('div:nth-of-type(3) > div:nth-of-type(1) > .row > .col-lg-6.pl-0 > ng-select[role="listbox"] .ng-input').first().click();
        cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click(); //height type
        cy.get('input[name="assetDetails.length"]').clear();
        cy.get('input[name="assetDetails.length"]').type("20"); //length
        cy.get('div:nth-of-type(3) > div:nth-of-type(2) > .row > .col-lg-6.pl-0 > ng-select[role="listbox"] > .ng-select-container').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click(); //length type
        cy.get('div:nth-of-type(3) > div:nth-of-type(3) > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('.ng-dropdown-panel.ng-select-bottom.ng-star-inserted > div > div:nth-of-type(2) > div:nth-of-type(2)').last().click();//axle
        cy.get('input[name="assetDetails.GVWR"]').type("58");
        cy.get('div:nth-of-type(4) > div:nth-of-type(1) > .row > .col-lg-6.pl-0 > ng-select[role="listbox"] .ng-input').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//gvwr
        cy.get('input[name="assetDetails.GAWR"]').type('65');
        cy.get('[name="assetDetails\.GAWR_Unit"] input').first().click();//gawr
        cy.get('textarea[name="assetDetails.remarks"]').type('Asset is working');//notes
        cy.get('input[name="insuranceDetails.dateOfIssue"]').first().click();
        cy.get('div:nth-of-type(2) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();//date of issue
        cy.get('input[name="insuranceDetails.premiumAmount"]').type('50');
        cy.get('[name="insuranceDetails\.premiumCurrency"] .ng-input').first().click();
        cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').last().click();//premium amount
        cy.get('input[name="insuranceDetails.dateOfExpiry"]').first().click();
        cy.get('div:nth-of-type(5) > div:nth-of-type(2) > .btn-light.ng-star-inserted').last().click();//date of expiry
        cy.get(':nth-child(4) > .col-lg-12 > .bg-white > .form-group > :nth-child(2) > .row > .col-lg-10 > .form-control').type("1234567895");
        cy.get(':nth-child(4) > .col-lg-12 > .bg-white > .form-group > .offset-lg-1 > .row > .col-lg-10 > .form-control').type('1234567892');
        const imagefile1 = "download.jpg";
        cy.get('input[name="uploadedPhotos"]').attachFile(imagefile1);
        const file2 = "load1.pdf";
        cy.get('[name="uploadedDocs"]').attachFile(file2);
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
    });
    it("should list the vehicle which was added and then verify the added asset are listed by name/other properties.", function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();
        cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link").first().click();
        cy.get('[class] [class="col-md-2 col-lg-2"]:nth-of-type(1) .form-control').first().click();
        cy.get('[class] [class="col-md-2 col-lg-2"]:nth-of-type(1) .form-control').last().type("Cacadia 1566");
        cy.get('.form-horizontal > .row > .pl-0 > .form-control > .ng-select-container > .ng-value-container').first().click();
        cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').last().click();//select type
        cy.get(".btn.btn-sm.btn-success.mr-2").first().click(); //search asset type
        cy.get(".form-horizontal > .row > :nth-child(3) > .mr-2").first().click(); //search
        cy.wait(3000);
        cy.get('.row > :nth-child(3) > [type="button"]').first().click();//reset
        cy.get('.btn-group > .mr-2').first().click();
        cy.get(".dropdown-menu > :nth-child(6) > label").first().click(); //column visibility
        Cypress.on('uncaught:exception', (err, runnable) => {

            return false
        });
    });
    it("should allow users to edit assets.", function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();

        cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link").first().click();

        cy.get('#dropdownMenuButton-1 > .fas').click();
        cy.get('[href="\#\/fleet\/assets\/edit\/1ukNRrLIdEn5knoMOlLHQlXFOou"]').click();//edit
        //cy.get('.col-11 > .btn-success').click();//update
        cy.url().then(url => {
            console.log('url', url);
            let newUrl = url.split('/');
            assetID = newUrl[newUrl.length - 1];
            //console.log('storage ID====', cy.getLocalStorage('assetID'));
            cy.setLocalStorage('assetID', assetID);
        })
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
    });

    it("should allow users to delete assets.", function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();

        cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link").first().click();
        cy.get('#dropdownMenuButton-0').click();
        cy.get('.dropdown-menu.show > a:nth-of-type(1)').click();
        cy.getLocalStorage('congnitoAT').then((data) => {
            authToken = data;
        });
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
    });

    it("should give validation error message when required fields are not provided", function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();

        cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link").first().click();

        cy.get(".col-md-6 > .btn-success").first().click();
        cy.get('.adddriverpl.form-group.pt-3.row input[name="assetIdentification"]').type("Xyz 14568"); //asset name
        cy.get('.adddriverpl.form-group.pt-3.row input[name="assetIdentification"]').clear();
        cy.get(".text-danger > .ng-star-inserted").contains('Asset name/number is required.');
        cy.get('.inner-wrapper [name="VIN"]').type("JH4DC2390SS002570");
        cy.get('.inner-wrapper [name="VIN"]').clear(); //vin number
        cy.get('.offset-lg-1 > .row > :nth-child(1) > .text-danger > .ng-star-inserted').contains('VIN is required.');
        cy.get('form#form_ > div:nth-of-type(2) input[name="assetDetails.licencePlateNumber"]').type("PB0Cl78"); //Licence Number
        cy.get('form#form_ > div:nth-of-type(2) input[name="assetDetails.licencePlateNumber"]').clear();
        cy.get(':nth-child(3) > .col-lg-10 > .text-danger > .ng-star-inserted').contains('Licence plate number is required.');
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });


    });
    it("check  button is enabled or not.", function () {
        cy.visit("/#/Login");
        cy.get(":nth-child(1) > .input-group > .form-control").clear();
        cy.get(":nth-child(1) > .input-group > .form-control").type(Cypress.config("testerUserName"));
        cy.get(":nth-child(2) > .input-group > .form-control").clear();
        cy.get(":nth-child(2) > .input-group > .form-control").type(Cypress.config("testerPassword"));
        cy.get("#btnsubmit").click();
        cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link").first().click();
        cy.get(".col-md-6 > .btn-success").first().click();
        cy.get('.adddriverpl.form-group.pt-3.row input[name="assetIdentification"]').type("Asset 1568"); //asset name
        cy.get('.inner-wrapper [name="VIN"]').type("JH4DC2390SS002470"); //vin number
        cy.get(".inner-wrapper [class='row mb-3']:nth-of-type(2) [class='col-lg-5 mb-3'] .row:nth-child(1) [role='combobox']").first().click();
        cy.get("div:nth-of-type(2) > .ng-option-label.ng-star-inserted").last().click(); //asset type
        cy.get('.inner-wrapper [class="col-lg-5 mb-3"] [class="row mt-2"]:nth-of-type(2) [class="col-lg-5"]:nth-of-type(1) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(10) .ng-star-inserted').last().click(); //year
        cy.get('.inner-wrapper [class="col-lg-5 mb-3"] [class="row mt-2"]:nth-of-type(2) [class="col-lg-5"]:nth-of-type(2) [role="combobox"]').first().click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').last().click(); //asset status
        cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]').click();
        cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').click(); //Licence country
        cy.get('div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]').click();
        cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click(); //issue state
        cy.get('form#form_ > div:nth-of-type(2) input[name="assetDetails.licencePlateNumber"]').type("PB0Cl78"); //Licence Number
        cy.get('form#form_ > div:nth-of-type(2) input[name="assetDetails.annualSafetyDate"]').first().click();
        cy.get('[role] [role="row"]:nth-of-type(4) [role="gridcell"]:nth-of-type(2) .ng-star-inserted').last().click(); //Annual Safety Date
        cy.get('div:nth-of-type(5) > .col-lg-10 > ng-select[role="listbox"] input[role="combobox"]').first().click();
        cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').last().click();//inspection form
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
    });
});