describe("Test backup functions", () => {
    beforeEach(() => {
        cy.viewport(1980,1080);
        cy.loginWithGoogle();
    });

    it("Test export to JSON feature", () => {
        cy.visit("/backup");
    });
    it("Test export to CSV feature", () => {
        cy.visit("/backup");
    });
    it("Test import from JSON feature", () => {
        cy.visit("/backup");
    });
    it("Test import from CSV feature", () => {
        cy.visit("/backup");
    });
})