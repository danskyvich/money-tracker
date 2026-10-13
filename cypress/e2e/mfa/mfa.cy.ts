describe("Test setting up the MFA flow", () => {
    beforeEach(() => {
        cy.viewport(1980, 1080);
        cy.loginWithGoogle();
    });

    it("Test MFA flow", () => {
        cy.visit("/profile");

        cy.contains("Inactive").should("exist"); // mfa must be toggled off
        cy.get("[data-cy='toggle-mfa']").click();

        cy.url().should("include", "/mfa");

        cy.contains("Scan this QR code or enter the code below into your preferred authenticator application.").should("exist");

        cy.get("p[data-cy='otp-secret']").should("not.be.empty").invoke("text").then((secret) => secret.replace(/\s/g, "")).as("secret");

        cy.get("button[data-cy='proceed-to-verify']").click();
        cy.get("input[data-cy='code-input']").should("exist");

        cy.get<string>("@secret").then((secret) => {
            cy.task("totp", secret);
        }).then((code) => {
            cy.get("input[data-cy='code-input']").type(code as string);
        });

        cy.get("button[data-cy='submit-code']").click();
        cy.wait(1500);

        cy.url().should("include", "/profile");
        cy.get("[data-cy='toggle-mfa']").should("have.attr", "aria-checked", "true");

        // disable mfa
        cy.get("[data-cy='toggle-mfa']").click();
        cy.get("[data-cy='toggle-mfa']").should("have.attr", "aria-checked", "false");
    });
})