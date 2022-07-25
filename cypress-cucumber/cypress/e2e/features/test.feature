Feature: Test page

    Test for adding header

    Background:
        Given A user opens a test website
    Scenario: Success
        Then the header x-trace-token is added
