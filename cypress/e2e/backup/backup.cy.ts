describe("Test export and import JSON backup functions", () => {
    beforeEach(() => {
        cy.viewport(1980,1080);
        cy.loginWithGoogle();
    });

    const fileName = `export_${new Date().toISOString().split('T')[0]}.json`;

    it("Test export to JSON feature", () => {
        cy.visit("/backup");

        // backup page
        cy.get("button[data-cy='export-json']").should("exist").click();
        cy.wait(1000);

        // export to json modal
        cy.contains("Export your data to JSON as a backup measure and save the file in your device").should("be.visible");
        cy.get("input[data-cy='all-dates']").check();

        // export tables to JSON
        cy.get("button[data-cy='yes-button']").click();
        cy.wait(1500);

        // assert on the backup file
        cy.readFile(`cypress/downloads/${fileName}`).then((file) => {
            expect(file).to.not.be.empty;
            expect(file.transactions).to.be.an("array").and.to.not.be.empty;
            expect(file.accounts).to.be.an("array").and.to.not.be.empty;
            expect(file.categories).to.be.an("array").and.to.not.be.empty;
            expect(file.account_categories).to.be.an("array").and.to.not.be.empty;
        });
    });

    it("Delete data", () => {
        cy.visit("/settings");

        // delete data
        cy.get("button[data-cy='delete-data']").click();
        cy.contains("Are you really sure you want to delete your data? Data deletion includes all your transactions, accounts, and current configurations. This action is irreversible.").should("exist");
        cy.get("button[data-cy='yes-button']").click();
        cy.wait(1000);

        // check if there are no transactions
        cy.visit("/transactions");
        cy.contains("No transactions found").should("be.visible");
        cy.get("div[data-cy='transaction-row']").should("not.exist");
    })

    it("Test import from JSON feature", () => {
        cy.visit("/backup");

        cy.get("button[data-cy='import-json']").should("exist").click();
        cy.contains("Import your JSON file to restore your previous data to Money Tracker").should("exist");

        // open file explorer and get the downloaded backup file
        cy.get("input[data-cy='file-input']").selectFile(`cypress/downloads/${fileName}`);
        cy.wait(2000);

        cy.visit("/transactions");
        cy.get("div[data-cy='transaction-row']").should("have.length.greaterThan", 0);
    });
});

describe.only("Test export and import CSV backup functions", () => {
    beforeEach(() => {
        cy.viewport(1980,1080);
        cy.loginWithGoogle();
    });

    const fileName = `export_${new Date().toISOString().split('T')[0]}.zip`;

    it("Test export to CSV feature", () => {
        cy.visit("/backup");

        cy.get("button[data-cy='export-csv']").click();
        cy.contains("Export your data to CSV for you to view, share, and edit using spreadsheet apps.").should("exist");
        cy.get("input[data-cy='all-dates']").check();

        cy.get("button[data-cy='yes-button']").click();
        cy.wait(1500);

        cy.readFile(`cypress/downloads/${fileName}`, null).should("exist");

        // use the function declared in cypress.config.ts
        cy.task("readZip", `cypress/downloads/${fileName}`).then((file) => {
            const names = Object.keys(file as Record<string, string>); // this line allows us to assert anything
            
            expect(names).not.to.be.empty;
            expect(names).to.have.length(4);
            expect(names).to.have.members(["transactions.csv", "accounts.csv", "categories.csv", "account_categories.csv"]);
        });
    });

    it("Delete data", () => {
        cy.visit("/settings");

        // delete data
        cy.get("button[data-cy='delete-data']").click();
        cy.contains("Are you really sure you want to delete your data? Data deletion includes all your transactions, accounts, and current configurations. This action is irreversible.").should("exist");
        cy.get("button[data-cy='yes-button']").click();
        cy.wait(1000);

        // check if there are no transactions
        cy.visit("/transactions");
        cy.contains("No transactions found").should("be.visible");
        cy.get("div[data-cy='transaction-row']").should("not.exist");
    });

    it("Test import CSV feature", () => {
        cy.visit("/backup");

        cy.get("button[data-cy='import-csv']").click();
        cy.contains("Import your CSV file from a spreadsheet app to restore your previous data to Money Tracker").should("exist");
        cy.get("input[data-cy='file-input']").selectFile(`cypress/downloads/${fileName}`);
        cy.wait(2000);

        cy.visit("/transactions");
        cy.get("div[data-cy='transaction-row']").should("have.length.greaterThan", 0);
    });
});