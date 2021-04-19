describe('Add Documents', function () {
        it('should allow the user to add the documents', function () {

                cy.visit('http://localhost:4200/');
                cy.get(':nth-child(1) > .input-group > .form-control').clear();
                cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
                cy.get(':nth-child(2) > .input-group > .form-control').clear();
                cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
                cy.get('#btnsubmit').click();
                cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
                cy.get(':nth-child(6) > .nav-link > span').click();
                cy.get('.mr-5 > a > .position-relative > .folder-shape').click();
                cy.get('.col-lg-5 > .modal-with-form').click();
                cy.get('#form_ > .form-row > :nth-child(1) > .form-control').clear();
                cy.get('#form_ > .form-row > :nth-child(1) > .form-control').type('1325');
                cy.get('.form-row > :nth-child(2) > .form-control > .ng-select-container > .ng-value-container > .ng-input > input').click();
                cy.get('.ng-option-label').click();
                cy.get('[name="docType"] input').first().click();
                cy.get('div:nth-of-type(3) > .ng-option-label.ng-star-inserted').last().click();
                cy.get('.form-row > :nth-child(4) > .form-control').clear();
                cy.get('.form-row > :nth-child(4) > .form-control').type('Fuel Recipt');
                const fileUpload = 'download.jpg'
                cy.get('input[name="uploadedDocs"]').attachFile(fileUpload);
                cy.get('#addDocumentModal [name="description"]').type('Thank You Fleet Hawks Inc For Your Services');
                cy.get('#addDocumentModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();

                cy.wait(5000);
        });
        it('should display the added documents to the document list and then verify the added document by name/other properties', function () {
                cy.visit('http://localhost:4200/');
                cy.get(':nth-child(1) > .input-group > .form-control').clear();
                cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
                cy.get(':nth-child(2) > .input-group > .form-control').clear();
                cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
                cy.get('#btnsubmit').click();
                cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
                cy.get(':nth-child(6) > .nav-link > span').click();
                cy.get('.mr-5 > a > .position-relative > .folder-shape').click();
                cy.get('input[name="searchValue"]').type('1325');
                cy.get('input[name="fromDate"]').first().click();
                cy.get('div:nth-of-type(4) > div:nth-of-type(6) > .btn-light.ng-star-inserted').last().click();//start date

                cy.get('input[name="toDate"]').first().click();
                cy.get('div:nth-of-type(5) > div:nth-of-type(6) > .btn-light.ng-star-inserted').last().click();//end date
                cy.get('.btn.btn-sm.btn-success.mr-2').click();
                cy.get('.inner-wrapper .page-header [class] [type="button"]:nth-of-type(2)').click();


        });
        it('should delete the added document from the list', function () {
                cy.visit('http://localhost:4200/');
                cy.get(':nth-child(1) > .input-group > .form-control').clear();
                cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
                cy.get(':nth-child(2) > .input-group > .form-control').clear();
                cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
                cy.get('#btnsubmit').click();
                cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
                cy.get(':nth-child(6) > .nav-link > span').click();
                cy.get('.mr-5 > a > .position-relative > .folder-shape').click();
                cy.get('#dropdownMenuButton-0').first().click();
                cy.get(':nth-child(8) > .dropdown > .dropdown-menu > :nth-child(2)').last().click();
                cy.wait(5000);
        });
        it('should give validation error message when user directly submit the form without entering the credentials', function () {
                cy.visit('http://localhost:4200/');
                cy.get(':nth-child(1) > .input-group > .form-control').clear();
                cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
                cy.get(':nth-child(2) > .input-group > .form-control').clear();
                cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
                cy.get('#btnsubmit').click();
                cy.get('nav > .nav > :nth-child(3) > .nav-link').click();
                cy.get(':nth-child(6) > .nav-link > span').click();
                cy.get('.mr-5 > a > .position-relative > .folder-shape').click();
                cy.get('.col-lg-5 > .modal-with-form').click();
                cy.get('#addDocumentModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click();
                cy.get('#documentNumber-error').contains('This Field is not allowed to be empty');
                cy.get('#tripID-error').contains('This Field is not allowed to be empty');
                cy.get('#docType-error').contains('This Field is not allowed to be empty');
                cy.get('#documentName-error').contains('This Field is not allowed to be empty');

        });

});
