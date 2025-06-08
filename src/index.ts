#!/usr/bin/env node

const { serveHTTP, publishToCentral } = require("stremio-addon-sdk")
const { sources } = require("./content");
import addon from "./addon";
import localtunnel from "localtunnel";

(async function() {
    await sources.initContent();
    console.log("content is ready");

    // open up a tunnel to the port
    const port = process.env.PORT as unknown as number || 53655;
    const tunnel = await localtunnel({port: port, subdomain: "stremio-addon-wigglytv"});
    
    console.log("Tunnel now opened to ", tunnel.url);
    tunnel.on('close', ()=>{ console.log("local tunnel has closed"); })

    serveHTTP(addon(), { port: port })
})();

// when you've deployed your addon, un-comment this line
// publishToCentral("https://my-addon.awesome/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying/README.md
