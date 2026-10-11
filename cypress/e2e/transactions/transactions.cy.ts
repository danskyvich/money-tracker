describe("Add a transaction", () => {
    beforeEach(() => {
        cy.viewport(1980,1080);
        cy.loginWithGoogle();
    });

    const transactions = [
        {
            type: "income",
            dateTime: "2026-10-11T07:46",
            amount: "10000.00",
            category: "Salary",
            fromAccount: "Chinabank",
            toAccount: null,
            description: "Allowance for today",
        },
        {
            type: "expense",
            dateTime: "2026-10-11T08:55",
            amount: "135.00",
            category: "Food",
            fromAccount: "Chinabank",
            toAccount: null,
            description: "Zus Coffee - Iced Spanish Latte",
        },
        {
            type: "transfer",
            dateTime: "2026-10-11T20:35",
            amount: "500.00",
            category: null,
            fromAccount: "Chinabank",
            toAccount: "BPI",
            description: "Savings",
        },
    ];

    transactions.forEach((transaction) => {
        it(`Add an ${transaction.type} transaction`, () => {
            cy.visit("/overview");
            cy.url().should("include", "/overview");

            cy.get("button[data-cy='add-transaction']").click();

            cy.contains("p", /^Add a transaction$/);

            cy.get(`button[data-cy='${transaction.type}-button']`).click();

            cy.get("input[type='datetime-local']").type(transaction.dateTime);
            cy.get("input[data-cy='amount']").clear().type(transaction.amount);

            cy.get("select[data-cy='from-account']").select(transaction.fromAccount);

            cy.wait(1500);
            // if transfer, replace category with toAccount
            if (transaction.type === "transfer") {
                    cy.get("select[data-cy='category_id']").should("not.be.visible");
                    cy.get("select[data-cy='to-account']").select(transaction.toAccount!);
                } else {
                    cy.get("select[data-cy='category_id']").select(transaction.category!);
                    cy.get("select[data-cy='to-account']").should("not.exist");
                }
            cy.get("textarea[data-cy='description']").clear().type(transaction.description);
            
            // submit
            cy.get("button[data-cy='yes-button']").click();

            cy.contains("p", /^Add a transaction$/).should("not.exist");

            // view changes
            cy.get("[data-cy='transaction-item']").click();
            cy.url().should("include", "/transactions");
            cy.contains(`${transaction.description}`);
        });
    });
});