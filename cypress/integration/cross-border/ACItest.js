describe(" ACI eManifest e2e Test cases", () => {
  it('Add ACI test ', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(5) > .nav-link > .fas').click();
    cy.get('#aci-emanifest-tab').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    cy.get('.form-horizontal > :nth-child(1) > .offset-lg-1 > :nth-child(1) > .col-lg-10 > .row > .col-lg-4 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('.form-horizontal > :nth-child(1) > .offset-lg-1 > :nth-child(1) > .col-lg-10 > .row > .col-lg-8 > .form-control').clear();
    cy.get('.form-horizontal > :nth-child(1) > .offset-lg-1 > :nth-child(1) > .col-lg-10 > .row > .col-lg-8 > .form-control').type('TEST1113');
    cy.get('.offset-lg-1 > :nth-child(2) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label="Code\: 0817\, Name\: ABBOTSFORD-H"]').click();
    cy.get('.offset-lg-1 > :nth-child(3) > .col-lg-10 > .ng-select > .ng-select-container').click();
    cy.get('[ng-reflect-ng-item-label="Code\: 4256\, Name\: 10050 NEWFOU"]').click();
    cy.get(':nth-child(4) > .col-lg-10 > .form-control').click();
    cy.get('[aria-label="Sunday, May 30, 2021"] > .btn-light').click();
    cy.get(':nth-child(5) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(33)').click();
    cy.get(':nth-child(5) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label="Pacific Standard Time"]').click();
    cy.get(':nth-child(3) > :nth-child(1) > .col-lg-10 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(4) > .ng-option-label.ng-star-inserted').click();
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .row > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .row > :nth-child(1) > .form-control').type('1');
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .row > :nth-child(2) > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .row > :nth-child(2) > .form-control').type('4');
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .row > :nth-child(3) > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .row > :nth-child(3) > .form-control').type('6');
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .row > :nth-child(4) > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .row > :nth-child(4) > .form-control').type('3');
    cy.get(':nth-child(3) > :nth-child(3) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').click();
    cy.get(':nth-child(3) > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').click();
    cy.get('.form-horizontal > :nth-child(4) > .text-right > .btn').click();
    cy.get('.offset-lg-1 > .form-group > :nth-child(1) > .form-control').clear();
    cy.get('.offset-lg-1 > .form-group > :nth-child(1) > .form-control').type('Box type');
    cy.get(':nth-child(5) > .offset-lg-1 > .form-group > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('.col-lg-10.ng-star-inserted > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div[role="option"]').click();
    cy.get(':nth-child(3) > .form-group > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label=" Flying Truck"]').click();
    cy.get(':nth-child(2) > .row > .col-lg-3 > .form-control').clear();
    cy.get(':nth-child(2) > .row > .col-lg-3 > .form-control').type('1239');
    //shipment 1
    cy.get('.mat-expansion-panel-header-title').click();
    cy.get('.offset-lg-1 > .form-group > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get(':nth-child(1) > .offset-lg-1 > .form-group > .col-lg-10.ng-star-inserted > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div[role="option"] > .ng-option-label.ng-star-inserted').click();
    cy.get(':nth-child(1) > .offset-lg-1 > .form-group > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get(':nth-child(4) > .row > .col-lg-4 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get(':nth-child(4) > .row > .col-lg-8 > .form-control').clear();
    cy.get(':nth-child(4) > .row > .col-lg-8 > .form-control').type('TEST1010');
    cy.get('.form-group > :nth-child(5) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label="Code\: 0318\, Name\: ABERCORN"]').click();
    cy.get('.offset-lg-1 > .form-group > :nth-child(6) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label="Code\: 0214\, Name\: ANDOVER"]').click();
    cy.get(':nth-child(1) > :nth-child(2) > .form-group > :nth-child(1) > .form-control').click();
    cy.get('[aria-label="Monday, May 31, 2021"] > .btn-light').click();
    cy.get(':nth-child(1) > :nth-child(2) > .form-group > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label=" 10\:00 AM"]').click();
    cy.get(':nth-child(1) > :nth-child(2) > .form-group > :nth-child(3) > .ng-select > .ng-select-container').click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').click();
    cy.get('.form-group > :nth-child(4) > .ng-select > .ng-select-container').click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').click();
    cy.get(':nth-child(2) > .form-group > :nth-child(6) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get(':nth-child(8) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label="VA - Virginia"]').click();
    cy.get(':nth-child(9) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label=" Lebanon"]').click();
    cy.get(':nth-child(3) > .col-lg-5.offset-lg-1 > .row > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(3) > .col-lg-5.offset-lg-1 > .row > .col-lg-10 > .form-control').type('John Smith');

    cy.get(':nth-child(3) > :nth-child(3) > .row > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(3) > :nth-child(3) > .row > .col-lg-10 > .form-control').type('9822194688');

    cy.get(':nth-child(6) > .col-lg-5.offset-lg-1 > .row > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(6) > .col-lg-5.offset-lg-1 > .row > .col-lg-10 > .form-control').type('Rachel Green');

    cy.get(':nth-child(6) > :nth-child(3) > .row > .col-lg-10 > .form-control').clear();
    cy.get(':nth-child(6) > :nth-child(3) > .row > .col-lg-10 > .form-control').type('7776846600');

    cy.get(':nth-child(9) > .offset-lg-1 > :nth-child(1) > :nth-child(1) > .form-control').clear();
    cy.get(':nth-child(9) > .offset-lg-1 > :nth-child(1) > :nth-child(1) > .form-control').type('truck');
    cy.get(':nth-child(2) > .row > .col-lg-5 > .form-control').clear();
    cy.get(':nth-child(2) > .row > .col-lg-5 > .form-control').type('9');
    cy.get(':nth-child(2) > .row > .col-lg-7 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label="Basket or hamper "]').click();
    cy.get(':nth-child(3) > .row > .col-lg-5 > .form-control').clear();
    cy.get(':nth-child(3) > .row > .col-lg-5 > .form-control').type('1000');
    cy.get(':nth-child(3) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();

    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').click();

    cy.get(':nth-child(9) > .col-lg-12 > .btn').click();
    //shipment 2
    cy.get('#mat-expansion-panel-header-1 > .mat-content > .mat-expansion-panel-header-title').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .offset-lg-1 > .form-group > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .offset-lg-1 > .form-group > .col-lg-10.ng-star-inserted > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div[role="option"]').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .offset-lg-1 > .form-group > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(3)').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .offset-lg-1 > .form-group > :nth-child(4) > .row > .col-lg-4 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .offset-lg-1 > .form-group > :nth-child(4) > .row > .col-lg-8 > .form-control').clear();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .offset-lg-1 > .form-group > :nth-child(4) > .row > .col-lg-8 > .form-control').type('TEST9914');
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .offset-lg-1 > .form-group > :nth-child(5) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(5) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > .offset-lg-1 > .form-group > :nth-child(6) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(94) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > :nth-child(2) > .form-group > :nth-child(1) > .form-control').click();
    cy.get('[aria-label="Monday, May 31, 2021"] > .btn-light').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > :nth-child(2) > .form-group > :nth-child(2) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(37) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > :nth-child(2) > .form-group > :nth-child(3) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(1) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > :nth-child(2) > .form-group > :nth-child(4) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > :nth-child(2) > .form-group > :nth-child(6) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > :nth-child(2) > .form-group > :nth-child(8) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > :nth-child(1) > :nth-child(2) > .form-group > :nth-child(9) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(5) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > .form-group.ng-star-inserted > .offset-lg-1 > :nth-child(1) > :nth-child(1) > .form-control').clear();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > .form-group.ng-star-inserted > .offset-lg-1 > :nth-child(1) > :nth-child(1) > .form-control').type('Box truck');
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > .form-group.ng-star-inserted > .offset-lg-1 > :nth-child(1) > :nth-child(2) > .row > .col-lg-5 > .form-control').clear();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > .form-group.ng-star-inserted > .offset-lg-1 > :nth-child(1) > :nth-child(2) > .row > .col-lg-5 > .form-control').type('50');
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > .form-group.ng-star-inserted > .offset-lg-1 > :nth-child(1) > :nth-child(2) > .row > .col-lg-7 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(8) > .ng-option-label.ng-star-inserted').click();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > .form-group.ng-star-inserted > .offset-lg-1 > :nth-child(1) > :nth-child(3) > .row > .col-lg-5 > .form-control').clear();
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > .form-group.ng-star-inserted > .offset-lg-1 > :nth-child(1) > :nth-child(3) > .row > .col-lg-5 > .form-control').type('500');
    cy.get('#cdk-accordion-child-1 > .mat-expansion-panel-body > .form-group.ng-star-inserted > .offset-lg-1 > :nth-child(1) > :nth-child(3) > .row > .col-lg-7 > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) > .ng-option-label.ng-star-inserted').click();
    cy.get('tr.ng-star-inserted > :nth-child(1) > .row > .col-lg-12 > .ng-select > .ng-select-container').click();
    cy.get('[ng-reflect-ng-item-label=" validation testing"]').click();
    cy.get('tr.ng-star-inserted > :nth-child(2) > .row > .col-lg-12 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('[ng-reflect-ng-item-label=" Gondola \(Closed\)"]').click();
    cy.get(':nth-child(11) > .col-lg-12 > .btn-success').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('Search and Reset ACI eManifest', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(5) > .nav-link > .fas').click();
    cy.get('#aci-emanifest-tab').click();
    cy.get('.page-header > .form-horizontal > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(1)').click();
    cy.get('.form-horizontal > .row > .pr-0 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(1) > .ng-option-label').click();
    cy.get('[name="aciFromDate"]').click();
    cy.get('[aria-label="Saturday, May 1, 2021"] > .btn-light').click();
    cy.get('.input-daterange > .ng-untouched').click();
    cy.get('[aria-label="Monday, May 31, 2021"] > .btn-light').click();
    cy.get(':nth-child(4) > .mr-2').click();
    cy.get(':nth-child(4) > [type="button"]').click();
    cy.get('.page-header > .form-horizontal > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(2)  ').click();
    cy.get('.form-horizontal > .row > .pr-0 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('.form-horizontal > .row > .pr-0 > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').type('c');
    cy.get('div:nth-of-type(4) > .ng-option-label').click();
    cy.get('[name="aciFromDate"]').click();
    cy.get('[aria-label="Saturday, May 1, 2021"] > .btn-light').click();
    cy.get('.input-daterange > .ng-invalid').click();
    cy.get('[aria-label="Monday, May 31, 2021"] > .btn-light').click();
    cy.get(':nth-child(4) > .mr-2').click();
    cy.get(':nth-child(4) > [type="button"]').click();
    cy.get('.page-header > .form-horizontal > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(3) > .ng-option-label').click();
    cy.get('.pr-0 > .input-group > .form-control').clear();
    cy.get('.pr-0 > .input-group > .form-control').type('9914');
    cy.get('[name="aciFromDate"]').click();
    cy.get('[aria-label="Saturday, May 1, 2021"] > .btn-light').click();
    cy.get('.input-daterange > .ng-invalid').click();
    cy.get('[aria-label="Monday, May 31, 2021"] > .btn-light').click();
    cy.get(':nth-child(4) > .mr-2').click();
    cy.get(':nth-child(4) > [type="button"]').click();
    cy.get('.page-header > .form-horizontal > .row > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('.ng-dropdown-panel.ng-select-bottom > div > div:nth-of-type(2) > div:nth-of-type(4)').click();
    cy.get('.pr-0 > .input-group > .form-control').clear();
    cy.get('.pr-0 > .input-group > .form-control').type('184STEST1111');
    cy.get('[name="aciFromDate"]').click();
    cy.get('[aria-label="Saturday, May 1, 2021"] > .btn-light').click();
    cy.get('.input-daterange > .ng-invalid').click();
    cy.get('[aria-label="Monday, May 31, 2021"] > .btn-light').click();
    cy.get(':nth-child(4) > .mr-2').click();
    cy.get(':nth-child(4) > [type="button"]').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it.only('detailing', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(5) > .nav-link > span').click();
    cy.get('#aci-emanifest-tab').click();
    cy.get('#aci > tbody > :nth-child(3) > :nth-child(1)').click();
    cy.get('.right-wrapper > .btn-group > .btn').first().click();
    cy.get('[class="btn-group btn-group1 flex-wrap mr-1 show"] [role] [class="dropdown-item text-1"]:nth-of-type(3)').last().click();
    cy.get(':nth-child(5) > :nth-child(1) > .ng-select > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('div:nth-of-type(2) [role="option"]:nth-of-type(35)').click();
    cy.get(':nth-child(13) > .col-lg-12 > .btn-success').click();
    cy.get('.right-wrapper > .btn-group > .btn').click();
    cy.get('[class="btn-group btn-group1 flex-wrap mr-1 show"] [role] [class="dropdown-item text-1"]:nth-of-type(8)').click();
    cy.get('.body  section[role="main"] .btn.btn-default.btn-sm').click();
    cy.get('#aci-emanifest-tab').click();
    cy.get('#aci > tbody > :nth-child(1) > :nth-child(12) > .btn-group > .mb-1').click();
    cy.get('#aci > tbody > :nth-child(1) > :nth-child(12) > .btn-group > .dropdown-menu > button.dropdown-item').click();
    /* ==== End Cypress Studio ==== */
  });
  /* === Test Created with Cypress Studio === */
  it('validation error message Test', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4200/');
    cy.get(':nth-child(1) > .input-group > .form-control').clear();
    cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
    cy.get(':nth-child(2) > .input-group > .form-control').clear();
    cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
    cy.get('#btnsubmit').click();
    cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
    cy.get(':nth-child(5) > .nav-link > span').click();
    cy.get('#aci-emanifest-tab').click();
    cy.get('.page-header > .form-horizontal > .row > .text-right > .btn').click();
    cy.get('.form-horizontal > :nth-child(10) > .col-lg-12 > .btn-success').click();
    /* ==== End Cypress Studio ==== */
  });




});
