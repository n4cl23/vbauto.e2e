const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({

  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true
  },

  viewportWidth: 1920,
  viewportHeight: 1080,

  e2e: {
    baseUrl: "https://hmg.vbconnection.info",
  },

  env: {
    username: process.env.CYPRESS_USERNAME,
    password: process.env.CYPRESS_PASSWORD
  }

});