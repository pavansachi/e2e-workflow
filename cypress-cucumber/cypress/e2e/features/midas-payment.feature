Feature: Make a payment using credit card

    Test for making a payment

    Background:
        Given the user visits billing.siteminder.com
        | A00085433 | INV02816962 |
        When the page loads
        Then the invoice "A1" is shown on the page
        And approval request is sent to @finance
        When the user selects credit card
        Then the hosted payment page is loaded
        And approval request is sent to @finance
        When the user fills the card details and clicks submit
        | xxxxx | xxxxx |
        Then the success page is displayed
        And approval request is sent to @finance to verify the payment