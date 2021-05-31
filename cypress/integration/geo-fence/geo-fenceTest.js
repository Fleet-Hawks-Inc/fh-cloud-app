describe(" Geofencing tests",()=>{

})


/* === Test Created with Cypress Studio === */
it('geo test', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4200/');
  cy.get(':nth-child(1) > .input-group > .form-control').clear();
  cy.get(':nth-child(1) > .input-group > .form-control').type('e2etestcarrier');
  cy.get(':nth-child(2) > .input-group > .form-control').clear();
  cy.get(':nth-child(2) > .input-group > .form-control').type('FleetHawks@2502');
  cy.get('#btnsubmit').click();
  cy.get(':nth-child(10) > .nav-link > .fas').click();
  //cy.get('.col-md-6 > .btn').click();
  //cy.get('#btnAdd')
  cy.get('#btnAdd').click();
  cy.get('#destinationLocation').clear();
  cy.get('#destinationLocation').clear();
  cy.get('#destinationLocation').type('Alberta, AB, Canada');
  cy.get('.Alberta\\,').click();
  cy.get('.leaflet-pm-draw > .button-container > .leaflet-buttons-control-button > .control-icon').click();
  cy.get('.marker-icon').click();
  cy.get('.cursor-marker').click();
  cy.get('.cursor-marker').click();
  cy.get('.cursor-marker').click();
  cy.get('[style="margin-left: -6px; margin-top: -6px; width: 12px; height: 12px; transform: translate3d(871px, 226px, 0px); z-index: 226;"]').click();
  cy.get('.card-body > .pt-3 > .offset-lg-1 > .row > :nth-child(1) > .form-control').click();
  /* ==== End Cypress Studio ==== */
});


