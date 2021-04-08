const { last } = require("lodash");

describe("Assets Test", function () {
  it("should allow the user to add asset", function () {
    cy.visit("/#/Login");
    cy.get(":nth-child(1) > .input-group > .form-control").clear();
    cy.get(":nth-child(1) > .input-group > .form-control").type(
      Cypress.config("testerUserName")
    );
    cy.get(":nth-child(2) > .input-group > .form-control").clear();
    cy.get(":nth-child(2) > .input-group > .form-control").type(
      Cypress.config("testerPassword")
    );
    cy.get("#btnsubmit").click();

    cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link")
      .first()
      .click();

    cy.get(".col-md-6 > .btn-success").first({ force: true }).click();

    cy.get('form#form_ > .row input[name="assetIdentification"]').type(
      "Xyz1456"
    ); //asset name
    cy.get('.inner-wrapper [name="VIN"]').type("9988273734"); //vin number
    cy.get('form#form_ > .row input[name="startDate"]').click();
    cy.get(
      '[role] [role="row"]:nth-of-type(3) [role="gridcell"]:nth-of-type(3) .ng-star-inserted'
    ).click(); //date
    cy.get(
      'form#form_ > div:nth-of-type(2) > div:nth-of-type(2) ng-select#assetType input[role="combobox"]'
    )
      .first()
      .click();
    cy.get("div:nth-of-type(3) > .ng-option-label.ng-star-inserted")
      .last()
      .click(); //asset type
    cy.get(
      'div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]'
    ).click();
    cy.get('[role="option"]:nth-of-type(3) .ng-star-inserted').click(); //year
    cy.get(
      'div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]'
    ).click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)').click(); //asset status
    cy.get(
      'div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > ng-select[role="listbox"] input[role="combobox"]'
    ).click();
    cy.get('[role="option"]:nth-of-type(1) .ng-star-inserted').click(); //Licence country
    cy.get(
      'div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > ng-select[role="listbox"] input[role="combobox"]'
    ).click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click(); //issue state
    cy.get(
      'form#form_ > div:nth-of-type(2) input[name="assetDetails.licencePlateNumber"]'
    ).type("PB08LC5963"); //Licence Number
    cy.get(
      'form#form_ > div:nth-of-type(2) input[name="assetDetails.annualSafetyDate"]'
    ).click();
    cy.get(
      '[role] [role="row"]:nth-of-type(4) [role="gridcell"]:nth-of-type(2) .ng-star-inserted'
    ).click(); //Annual Safety Date

    cy.get('input[name="assetDetails.height"]').first().type("10"); //height
    cy.get(
      'div:nth-of-type(3) > div:nth-of-type(1) > .row > .col-lg-6.pl-0 > ng-select[role="listbox"] input[role="combobox"]'
    )
      .first()
      .click();
    cy.get('[role="option"]:nth-of-type(2) .ng-star-inserted').last().click(); //height type
    const imagefile1 = "download.jpg";
    cy.get('input[name="uploadedPhotos"]').attachFile(imagefile1);
    const file2 = "load1.pdf";
    cy.get('[name="uploadedDocs"]').attachFile(file2);
    cy.get("#nextBtn").first().click(); //save
  });
  it("should list the asset which was added and then verify the added asset is listed by name/other properties", function () {
    cy.visit("/#/Login");
    cy.get(":nth-child(1) > .input-group > .form-control").clear();
    cy.get(":nth-child(1) > .input-group > .form-control").type(
      Cypress.config("testerUserName")
    );
    cy.get(":nth-child(2) > .input-group > .form-control").clear();
    cy.get(":nth-child(2) > .input-group > .form-control").type(
      Cypress.config("testerPassword")
    );
    cy.get("#btnsubmit").click();

    cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link")
      .first()
      .click();

    cy.get('[class] [class="col-md-2 col-lg-2"]:nth-of-type(1) .form-control')
      .first()
      .click();
    cy.get('[class] [class="col-md-2 col-lg-2"]:nth-of-type(1) .form-control')
      .last()
      .type("xyz1456");
    cy.get(".result-suggestions > ul > :nth-child(2)").click({ force: true }); //search driver
    cy.get('[class="row px-2"] [role="combobox"]').first().click();
    cy.get("div:nth-of-type(3) > .ng-option-label.ng-star-inserted")
      .last()
      .click(); //search asset type
    cy.get(".form-horizontal > .row > :nth-child(3) > .mr-2").first().click(); //search

    cy.get('.form-horizontal > .row > :nth-child(3) > [type="button"]')
      .first()
      .click(); //reset
    cy.get('[class="col-md-6 col-lg-6 text-right page-buttons"] [data-toggle]')
      .first()
      .click();
    cy.get(".dropdown-menu > :nth-child(6) > label").first().click(); //column visibility
  });

  it("should allow user to delete asset", function () {
    cy.visit("/#/Login");
    cy.get(":nth-child(1) > .input-group > .form-control").clear();
    cy.get(":nth-child(1) > .input-group > .form-control").type(
      Cypress.config("testerUserName")
    );
    cy.get(":nth-child(2) > .input-group > .form-control").clear();
    cy.get(":nth-child(2) > .input-group > .form-control").type(
      Cypress.config("testerPassword")
    );
    cy.get("#btnsubmit").click();

    cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link")
      .first()
      .click();

    cy.get("#dropdownMenuButton-0").first().click();
    cy.get(':nth-child(8) > .dropdown > .dropdown-menu > [href="javascript:;"]')
      .last()
      .click();
  });
  it("should give validation error message when required fields are not provided", function () {
    cy.visit("/#/Login");
    cy.get(":nth-child(1) > .input-group > .form-control").clear();
    cy.get(":nth-child(1) > .input-group > .form-control").type(
      Cypress.config("testerUserName")
    );
    cy.get(":nth-child(2) > .input-group > .form-control").clear();
    cy.get(":nth-child(2) > .input-group > .form-control").type(
      Cypress.config("testerPassword")
    );
    cy.get("#btnsubmit").click();

    cy.get(".ng-star-inserted > .nav > :nth-child(4) > .nav-link")
      .first()
      .click();

    cy.get(".col-md-6 > .btn-success").first().click({ force: true });

    cy.get('[class="col-lg-11 text-right"] #nextBtn').first().click(); //save
    cy.get(
      "#form_ > :nth-child(1) > :nth-child(2) > .row > :nth-child(1) > #assetIdentification-error"
    ).contains("This Field is not allowed to be empty");
    cy.get(".col-lg-10 > #VIN-error").contains(
      "This Field is not allowed to be empty"
    );
    cy.get(".col-lg-10 > #startDate-error").contains(
      "This Field is not allowed to be empty"
    );
    cy.get('[class=" row pt-3"] [for="assetDetails.assetType"]').contains(
      "This Field is not allowed to be empty"
    );
    cy.get('[class=" row pt-3"] [for="assetDetails.year"]').contains(
      "This Field is not allowed to be empty"
    );
    cy.get('[class="row pt-3"] [for="assetDetails.currentStatus"]').contains(
      "This Field is not allowed to be empty"
    );
    cy.get('[for="assetDetails.heightUnit"]').contains(
      "This Field is not allowed to be empty"
    );
    cy.get('[class="row pt-3"] [for="assetDetails.licenceCountryID"]').contains(
      "This Field is not allowed to be empty"
    );
    cy.get('[class=" row pt-3"] [for="assetDetails.licenceStateID"]').contains(
      "This Field is not allowed to be empty"
    );
    cy.get(
      '[class=" row pt-3"] [for="assetDetails.licencePlateNumber"]'
    ).contains("This Field is not allowed to be empty");
    cy.get(
      '[class=" row pt-3"] [for="assetDetails.annualSafetyDate"]'
    ).contains("This Field is not allowed to be empty");
  });
});
