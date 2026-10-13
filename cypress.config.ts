import { defineConfig } from "cypress";
import JSZip, { loadAsync } from "jszip";
import fs from "fs";
import { generate } from "otplib";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async readZip(path: string) {
          const zip = await JSZip.loadAsync(fs.readFileSync(path));
          const tobeFilledUp: Record<string, string> = {};
          for ( const [name, file] of Object.entries(zip.files)) {
            if (!file.dir) tobeFilledUp[name] = await file.async("string");
          }
          return tobeFilledUp;
        }
      });

      on("task", {
        async totp(secret: string) {
          return await generate({ secret });
        },
      });
      
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
