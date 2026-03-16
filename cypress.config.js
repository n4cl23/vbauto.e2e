const { defineConfig } = require("cypress");

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

  }

});