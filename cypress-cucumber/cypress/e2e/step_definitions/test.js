import {
  Given,
  When,
  And,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";
const loginPage = require("../../pages/LoginPage");

Given("A user opens a test website", () => {

  cy.intercept('GET', 'http://localhost:8000/data/animals.json', (req) => {
    req.headers['x-trace-token'] = '123'
  }).as('headers')

  cy.visit("/public");

});

Then("the header x-trace-token is added", () => {
  cy.wait('@headers')
  .its('request.headers')
  .should('have.property', 'x-trace-token', '123')
})
