#!/usr/bin/env node

const { serveHTTP, publishToCentral } = require("stremio-addon-sdk")
const { sources } = require("./content");
import addon from "./addon";

(async function() {
    await sources.initContent();
    console.log("content is ready");
    serveHTTP(addon, { port: process.env.PORT || 53655 })
})();

// when you've deployed your addon, un-comment this line
// publishToCentral("https://my-addon.awesome/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying/README.md
