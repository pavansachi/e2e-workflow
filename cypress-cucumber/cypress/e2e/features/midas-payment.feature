Feature: Make a payment using credit card

    Test for making a payment

    Background:
        Given the user visits billing
        |AccountNumber   | InvoiceNumber |
        |A00085433       | INV02816962   |
    Scenario: Success
        And should display invoices "INV02816962"
        When the user selects the invoice "INV02816962"
        And selects update auto payment and credit card
        Then the hosted payment page is loaded
        When user enters card details and clicks submit
        |cardNumber   | ExpMonth | ExpYear | CVC |
        Then the success page is displayed
