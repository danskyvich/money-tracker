describe("Test supabase's passwordless sign in", () => {

    beforeEach(() => {
        cy.env(["MAILSLURP_INBOX_ID"]).then(({ MAILSLURP_INBOX_ID }) => {
           cy.mailslurp().then((m) => m.inboxController.deleteAllInboxEmails({ inboxId: MAILSLURP_INBOX_ID }));
       });
    }); 

    it("Test auth flow successfully (with resend)", () => {
        cy.env(["EMAIL_ADDRESS", "MAILSLURP_INBOX_ID"]).then(({ EMAIL_ADDRESS, MAILSLURP_INBOX_ID }) => {
            let firstId: string;

            cy.visit("/login");

            cy.wait(5000);
            cy.get("input[type='email']").type(EMAIL_ADDRESS);
            cy.wait(1500);
            cy.get("button[data-cy='login-button']").click();

            cy.mailslurp().then({ timeout: 35000}, async (m) => {
                const email = await m.waitForLatestEmail(MAILSLURP_INBOX_ID, 30000, true);
                firstId = email.id;
            });
            cy.get("button[data-cy='resend-link']", { timeout: 130000 }).should("not.be.disabled").click();

            cy.wait(1500);
            cy.mailslurp().then({timeout: 35000}, async (m) => {
                const email = await m.waitForLatestEmail(MAILSLURP_INBOX_ID, 30000, true);
                if (firstId === email.id) {
                    throw new Error("Got the first email again, resend email never arrived");
                }
                const result = await m.emailController.getEmailContentMatch({
                    emailId: email.id,
                    contentMatchOptions: {
                        pattern: "\\b(\\d{6})\\b"
                    },
                });
                return result.matches[1];
            }).then((otp) => {
                cy.get("input[data-cy='otp-input']").type(otp);
                cy.get("button[data-cy='verify-code']").click();
                cy.url().should("include", "/overview");
            });
        });
    });
});