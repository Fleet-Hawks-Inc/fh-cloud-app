// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
   
    //"./src/**/*.ts",
    //'./src/app/entry/add-driver/*.ts',
    //'./src/app/entry/driver-list/*.ts',
    //'./src/app/pages/fleet/assets/add-assets/*.ts',
    //'./src/app/pages/fleet/asset-list/*.ts',
    //'./src/app/pages/fleet/vehicles/*.ts',
    //'./src/app/pages/fleet/vehicle-list/*.ts',
    

  ],
  capabilities: {
    browserName: "chrome",
    'chromeOptions': {
      args: ['--lang=en',
        '--window-size=1024,720'],
      excludeSwitches: ['enable-logging']
    }

  },
  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    print: function () {},
  },
  onPrepare() {
    require("ts-node").register({
      project: require("path").join(__dirname, "./tsconfig.json"),
    });
    jasmine
      .getEnv()
      .addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
};