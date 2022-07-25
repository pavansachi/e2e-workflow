Feature: Login page

    Feature Login page will work depending on the user credentials.

    Background:
        Given A user opens a saucelabs website
    Scenario: Success Login
        When A user enters the username "standard_user"
        And A user enters the password "secret_sauce"
        And A user clicks on the login button
        Then the url will contains the inventory subdirectory
