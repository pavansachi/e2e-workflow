import {
  Given,
  When,
  And,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";
import { aliasQuery, getIframeBody } from '../../utils/graphql-test-utils'

// after payment, there is an uncaught expection that occurs during redirection to success page due to navigation guard
// suppressing it here
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

beforeEach(() => {
  cy.intercept('POST', '/api/graphql', (req) => {
    aliasQuery(req, 'getAccount')
    aliasQuery(req, 'getHostedPaymentPages')
    aliasQuery(req, 'getBillingDocuments')
    aliasQuery(req, 'getRSA')
  })
})

Given("the user visits billing", (dataTable) => {

  const rows = dataTable.rows()

  const accountNumber = rows[0][0]
  const invoiceNumber = rows[0][1]

  cy.wrap(accountNumber).as("accountNumber")
  cy.wrap(invoiceNumber).as("invoiceNumber")

  cy.visit(`/en/payment/${accountNumber}/${invoiceNumber}`);

  cy.request('POST',
   'http://localhost:8080/engine-rest/process-definition/key/Process_Midas_Payment/start',
   {
    businessKey : "123"
  }).then((response) => {
    cy.wrap(response.body.id).as("processId")
  })

  cy.intercept('POST', '/api/authenticate').as('authenticate')

  cy.get('@authenticate').then(() => {
    cy.get('@processId').then(processId => {
      cy.request('POST',
        'http://localhost:8080/engine-rest/message',
        {
          processInstanceId: processId,
          messageName: "Message_Authenticate",
          businessKey: "123"
        })
    })
  })

  cy.wait('@gqlgetAccountQuery', { timeout: 30000 }).then((interception) => {
    assert.isNotNull(interception.response.body, 'getAccount response is not null')
    
    cy.get('@processId').then(processId => {
      cy.request('POST',
        'http://localhost:8080/engine-rest/message',
        {
          processInstanceId: processId,
          messageName: "Message_GetAccount",
          businessKey: "123"
        })
    })
  })

  cy.wait('@gqlgetBillingDocumentsQuery', { timeout: 30000 }).then((interception) => {
    assert.isNotNull(interception.response.body, 'getBillingDocuments response is not null')
    
    cy.get('@processId').then(processId => {
      cy.request('POST',
        'http://localhost:8080/engine-rest/message',
        {
          processInstanceId: processId,
          messageName: "Message_GetBillingDocs",
          businessKey: "123"
        })
    })

  })
  
});

And("should display invoices {string}", (invoiceNumber) => {

  cy.get('.billing-document__number', { timeout: 30000 }).first().contains(invoiceNumber)

})

When("the user selects the invoice {string}", (invoiceNumber) => {

  // deselect all items
  cy.get('[type="checkbox"]').first().uncheck({ force: true })

  // select the invoice to pay
  cy.get('.billing-document').each((item) => {

    cy.wrap(item).find('.billing-document__number').then((itemNumber) => {

      if (itemNumber.text().includes(invoiceNumber)) {
        cy.wrap(item).click({ force: true })
      }

    })

  })

})

And("selects update auto payment and credit card", () => {

  // click update automatic payment
  cy.get('[type="checkbox"]').last().check({ force: true })

  // find the credit card payment method button and click it
  cy.get('[type="button"]').each((button) => {

    cy.wrap(button).find('.clearfix').then((paymentMethod) => {

      if (paymentMethod.text().includes('Credit card')) {
        cy.wrap(button).click({ force: true })
      }

    })

  })

})

Then("the hosted payment page is loaded", () => {

  // check if getRSA gql query is called
  cy.wait('@gqlgetRSAQuery', { timeout: 30000 }).then((interception) => {
    assert.isNotNull(interception.response.body, 'getRSA response is not null')
    
    cy.get('@processId').then(processId => {
      cy.request('POST',
        'http://localhost:8080/engine-rest/message',
        {
          processInstanceId: processId,
          messageName: "Message_GetRSA",
          businessKey: "123"
        })
    })

  })

  // check if iframe is visible
  cy.get('#zuora_payment').should('be.visible')

})

When("user enters card details and clicks submit", (dataTable) => {

  const rows = dataTable.rows()

  const cardNumber = rows[0][0]
  const expMonth = rows[0][1]
  const expYear = rows[0][2]
  const cvc = rows[0][3]

  // enter card details
  getIframeBody().find('#input-creditCardNumber').type(cardNumber)
  getIframeBody().find('#input-creditCardExpirationMonth').select(expMonth)
  getIframeBody().find('#input-creditCardExpirationYear').select(expYear)
  getIframeBody().find('#input-cardSecurityCode').type(cvc)

  // enter personal details
  getIframeBody().find('#input-creditCardHolderName').type('Test Test')
  getIframeBody().find('#input-creditCardCountry').select('Canada')
  getIframeBody().find('#input-creditCardAddress1').type('Test st, Test')
  getIframeBody().find('#input-creditCardCity').type('Canada city')
  getIframeBody().find('#input-creditCardPostalCode').type('22222')
  getIframeBody().find('#input-phone').type('01234567')
  getIframeBody().find('#input-email').type('email@test.com')
  getIframeBody().find('#creditcard-can-state').find('select').select('Alberta')

  // click submit
  cy.get('.submit-payment').click({ force: true })

})

Then("the success page is displayed", (dataTable) => {

  const rows = dataTable.rows()

  const accountNumber = rows[0][0]
  const invoiceNumber = rows[0][1]

  // should be redirected to /success-payment
  cy.url({ timeout: 10000 }).should('contain', `/payment/${accountNumber}/${invoiceNumber}/success-payment`)

  cy.get('.card__title').first().contains('Payment successful!')

})
