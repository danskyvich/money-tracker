import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,tsx,jsx}',
    supportFile: 'cypress/support/e2e.ts',
    testIsolation: true,
    defaultCommandTimeout: 30000, // 30 secs, 
    requestTimeout: 120000, // 2 minutes
    downloadsFolder: "cypress/downloads",
    trashAssetsBeforeRuns: true,
  },
  env: {
    site_url: "http://localhost:3000"
  },
  viewportHeight: 1080,
  viewportWidth: 1980,
});
