describe('Add-Issue Page', function () {
    beforeEach(function () {
        cy.visit('http://cloudapp.fleethawks.com/#/Login/');
    })
    it('add issue test', function () {

        /* ==== Generated with Cypress Studio ==== */

        cy.get(':nth-child(1) > .input-group > .form-control').clear();
        cy.get(':nth-child(1) > .input-group > .form-control').type('hardeepcloud');
        cy.get(':nth-child(2) > .input-group > .form-control').clear();
        cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@1302');
        cy.get('#btnsubmit').click();
        cy.wait(5000);
        cy.visit('http://cloudapp.fleethawks.com/#/Map-Dashboard');
        cy.wait(5000);
        cy.get('fleet-sidebar > ul > li:nth-of-type(7) > .nav-link').click();
        cy.get('[href="#/fleet/maintenance/issues/add"]').first().click();
    
        cy.get('.inner-wrapper [class="col-lg-5 offset-lg-1"]:nth-of-type(2) [role="combobox"]').first().click();
        cy.get('[role="option"]:nth-of-type(11) .ng-option-label').last().click();//vehicle
        cy.get('.inner-wrapper [name="issueName"]').type('Mirror Broken');//issue name
        cy.get('.inner-wrapper [name="reportedDate"]').click();
        cy.get('[role] [role="row"]:nth-of-type(4) [role="gridcell"]:nth-of-type(2) .btn-light').click();//date
        cy.get('form#issueForm > .row input[name="odometer"]').first().type('21000');//odometer
        cy.get('.inner-wrapper [class="col-lg-5 offset-lg-1"]:nth-of-type(3) [class="row pt-2"]:nth-of-type(2) [role="combobox"]').click();
        cy.get('[role="option"]:nth-of-type(2) .ng-option-label').click();//reported by
        cy.get('.inner-wrapper [class="row pt-2"]:nth-of-type(3) [role="combobox"]').click();
        cy.get('[role="option"]:nth-of-type(2) .ng-option-label').click();//assigned to
        cy.wait(4000);
        const imagefile = 'download.jpg';
        cy.get('[name="uploadedPhotos"]').attachFile(imagefile);
        const file2 = 'load1.pdf';
        cy.get('[name="uploadedDocs"]').attachFile(file2);
        cy.get('[class="col-lg-11 text-right pr-0"] button').first().click();

    })
})