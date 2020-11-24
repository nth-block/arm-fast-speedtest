// npm install --global fast-speedtest-api

const FastSpeedtest = require("fast-speedtest-api");
const fs = require('fs');



function getToken()
{
    let fastToken = fs.readFileSync('/opt/token.txt','utf-8').trim();
    return fastToken;
}

function getFastSpeedTest(fastToken)
{
    //console.log(`${(new Date()).toISOString()}: Getting Internet speed...`);
    let speedtest = new FastSpeedtest({
    token: fastToken, // required
    verbose: false, // default: false
    timeout: 10000, // default: 5000
    https: true, // default: true
    urlCount: 5, // default: 5
    bufferSize: 8, // default: 8
    unit: FastSpeedtest.UNITS.Mbps // default: Bps
    });
     
    speedtest.getSpeed().then(s => {
        console.log(`${(new Date()).toISOString()}: `+ JSON.stringify(
            {
                "Time": `${(new Date()).toISOString()}`,
                "Speed (Mbps)": `${s}`
            }
        ));
    }).catch(e => {
        console.error(e.message);
    });
}

// Entrypoint of the program
let fastToken = getToken();
//console.log(`${(new Date()).toISOString()}: Starting...`);
setInterval(function(){getFastSpeedTest(fastToken)}, 60*1000);
