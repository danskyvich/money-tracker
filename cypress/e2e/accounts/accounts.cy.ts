describe("Test accounts actions (add, edit, delete)", () => {
    
    const accounts = [
        {
            name: "Credit account",
            type: "Accounts",
            description: "An account for my credit purchases"
        }
    ]
    beforeEach(() => {
        cy.viewport(1980,1080);
        cy.loginWithGoogle();
    });

    accounts.forEach((account) => {
        it("Add account", (() => {
            cy.visit("/overview");
            cy.wait(2000);

            cy.get("button[data-cy='add-account']").click();
            cy.contains("p", /^Add an account$/);

            cy.get("input[data-cy='name-input']").clear().type(account.name);
            cy.get("select[data-cy='account-type']").select(account.type);
            cy.get("textarea[data-cy='description']").type(account.description);

            cy.get("button[data-cy='submit-button']").click();

            cy.url().should("include", "/overview");
            cy.contains("p", /^Add an account$/).should("not.exist");

            cy.get("[data-cy='accounts-item']").click();
            cy.contains(account.description);
        }));

        it("Modify account", () => {
            cy.visit("/overview");
            cy.wait(2000);

            cy.get("[data-cy='accounts-item']").click();
            cy.contains(account.description);

            // click an account
            cy.contains("div[data-cy='account-row']", account.name).click();

            // click edit account details button
            cy.get("div[data-cy='open-info']").click();

            // edit account details
            cy.get("input[data-cy='name-input']").clear().type(`${account.name} (sample edit)`);
            cy.get("select[data-cy='account-type']").select("Loans");
            cy.get("textarea[data-cy='description']").type(`${account.description} (sample edit)`);

            // confirm changes
            cy.get("button[data-cy='edit-account']").click();

            cy.wait(1500);

            cy.get("button[data-cy='x-button']").click();

            cy.contains(/^Edit account details$/).should("not.exist");
        });

        it("Delete account", (() => {
            cy.visit("/overview");
            cy.wait(2000);

            cy.get("[data-cy='accounts-item']").click();
            cy.contains(account.description + " (sample edit)").should("be.visible");

            cy.contains("div[data-cy='account-row']", account.name + " (sample edit)").click();

            cy.get("button[data-cy='delete-account']").click();

            cy.contains(`${account.description}`).should("not.exist");
        }));
    });
    
})