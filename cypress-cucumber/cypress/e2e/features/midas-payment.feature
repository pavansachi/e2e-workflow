Feature: Make a payment using credit card

    Test for making a payment

    Background:
        Given the user visits billing
        |AccountNumber   | InvoiceNumber |
        |A00085930       | DM00005839   |
    Scenario: Success
        And should display invoices "DM00005839"
        When the user selects the invoice "DM00005839"
        And selects update auto payment and credit card
        Then the hosted payment page is loaded
        When user enters card details and clicks submit
        |cardNumber          | ExpMonth | ExpYear | CVC |
        |2222 4000 7000 0005 | 03        | 2030   | 737 |
        Then the success page is displayed
        |AccountNumber   | InvoiceNumber |
        |A00085930       | DM00005839    |