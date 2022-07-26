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

  cy.wrap(accountNumber).as("accountNumber")
  cy.wrap(invoiceNumber).as("invoiceNumber")

  cy.visit(`/en/payment/${accountNumber}/${invoiceNumber}`);

  cy.intercept('POST', '/api/authenticate', (req) => {
    req.headers['x-sm-trace-token'] = 'hello-pavan'
  }).as('headers')

});

Then("invoice should be shown", () => {

  cy.get("@invoiceNumber").then((invoiceNumber) => {
    cy.get('.billing-document__number', { timeout: 30000 }).first().contains(invoiceNumber)
  })

  cy.wait('@gqlgetAccountQuery', { timeout: 30000 }).then((interception) => {
    assert.isNotNull(interception.response.body, 'getAccount response is not null')
    //send camunda message
  })

})

Then("account should be retrieved", () => {

  cy.intercept('POST', '/api/graphql', (req) => {
    cy.log('req: ', req)
  })

})
