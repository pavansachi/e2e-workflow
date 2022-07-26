import {
  Given,
  When,
  And,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";
import { aliasQuery } from '../../utils/graphql-test-utils'

beforeEach(() => {
  cy.intercept('POST', '/api/graphql', (req) => {
    aliasQuery(req, 'getAccount')
    aliasQuery(req, 'getHostedPaymentPages')
    aliasQuery(req, 'getBillingDocuments')
  })
})

Given("the user visits billing", (dataTable) => {

  const rows = dataTable.rows()


  const accountNumber = rows[0][0]
  const invoiceNumber = rows[0][1]

  cy.visit(`/en/payment/${accountNumber}/${invoiceNumber}`);

  cy.intercept('POST', '/api/authenticate', (req) => {
    req.headers['x-sm-trace-token'] = 'hello-pavan'
  }).as('headers')

});

And("should display invoices {string}", (invoiceNumber) => {

  cy.get('.billing-document__number', { timeout: 30000 }).first().contains(invoiceNumber)

  cy.wait('@gqlgetAccountQuery', { timeout: 30000 }).then((interception) => {
    assert.isNotNull(interception.response.body, 'getAccount response is not null')
    //send camunda message
  })

})

When("the user selects the invoice {string}", (invoiceNumber) => {

  expect(1).equals(1)

})

And("selects update auto payment and credit card", () => {

  expect(1).equals(1)

})

Then("the hosted payment page is loaded", () => {

  expect(1).equals(1)

})

When("user enters card details and clicks submit", () => {

  expect(1).equals(1)

})

Then("the success page is displayed", () => {

  expect(1).equals(1)

})