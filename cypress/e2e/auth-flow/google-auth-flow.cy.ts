describe("Log in using google", () => {
    beforeEach(() => {
        cy.loginWithGoogle();
    });
    it("Test google auth flow", () => {
        cy.visit("/overview");
        cy.url().should("include", "/overview");
    });
});