/// <reference types="cypress" />

import {createBrowserClient} from "@supabase/ssr";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("loginUsingGoogleApi", () => {
    cy.log("Logging in using Google");

    cy.env(["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"]).then(({GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN}) => {
        cy.request({
            method: "POST",
            url: "https://oauth2.googleapis.com/token",
            form: true,
            body: {
                grant_type: "refresh_token",
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                refresh_token: GOOGLE_REFRESH_TOKEN,
            },
        }).then(({ body }) => body.id_token as string);
    });
});

Cypress.Commands.add("loginWithGoogle", () => {
    cy.log("Connect with supabase");
    
    cy.session("google-auth", () => {
        cy.loginUsingGoogleApi().then((id_token) => {
            cy.env(["SUPABASE_URL", "SUPABASE_ANON_KEY"]).then(({ SUPABASE_URL, SUPABASE_ANON_KEY }) => {
                const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                cy.wrap(
                    supabase.auth.signInWithIdToken({
                        provider: "google",
                        token: id_token,
                    }).then(({ data, error }) => {
                        if (error) throw new Error(error.message);
                        if (data.session === null) throw new Error("Data session is missing.");
                    }),
                );
            });
        });
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            loginUsingGoogleApi(): Chainable<string>;
            loginWithGoogle(): Chainable<string>;
        }   
    }
}

export {};