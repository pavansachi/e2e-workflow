import {
  Given,
  When,
  And,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

Given("the user visits billing.siteminder.com", (account , invoice) => {

  cy.intercept('POST', '/api/authenticate', (req) => {
    req.headers['x-sm-trace-token'] = '123'
  }).as('headers')

  // cy.intercept('/data/animals.json', { fixture: 'animals.json' })

  // cy.request('POST',
  //  'http://localhost:8080/engine-rest/process-definition/key/Process_Midas_Payment/start',
  //  {
  //   businessKey : "123"
  // })

  cy.visit("/en/payment/A00085433/INV02816962");

});

Then("the header x-trace-token is added", () => {
  
  //expect(1).equal(1)
  cy.wait('@headers')
  .its('request.headers')
  .should('have.property', 'x-sm-trace-token', '123')
})
