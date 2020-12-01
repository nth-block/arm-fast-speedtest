// npm install --global fast-speedtest-api
// npm install --save @azure/eventhubs

const FastSpeedtest = require("fast-speedtest-api");
const {EventHubProducerClient} = require('@azure/event-hubs');
const EVENT_HUB_CONFIG = require('./event-hub-info');
const TOKEN = require('./token');
const request = require('request');

function getFastSpeedTest() {
    // Get details of the current ISP
    let returnObject = {};
    request(TOKEN.url,{json:true}, function (err,res,body){
        if(err){console.error('HTTPS call to get ISP details failed');}
        returnObject["ASN"] = body.client.asn;
        returnObject["ISP"] = body.client.isp;
        returnObject["IP"] = body.client.ip;
        returnObject["City"] = body.client.location.city;
        returnObject["Country"] = body.client.location.country;
    });

    //console.log(`${(new Date()).toISOString()}: Getting Internet speed...`);
    let speedtest = new FastSpeedtest({
        token: TOKEN.token, // required
        verbose: false, // default: false
        timeout: 10000, // default: 5000
        https: true, // default: true
        urlCount: 5, // default: 5
        bufferSize: 8, // default: 8
        unit: FastSpeedtest.UNITS.Mbps // default: Bps
    });

    speedtest.getSpeed().then(async s => {

        returnObject["Timestamp"] = `${(new Date()).toISOString()}`;
        returnObject["Speed (Mbps)"] = s;

        const producer = new EventHubProducerClient(EVENT_HUB_CONFIG.eventHubConnectionString, EVENT_HUB_CONFIG.eventHubName);
        const partitions = await producer.getPartitionIds();
        const batch = await producer.createBatch();
        batch.tryAdd({body: returnObject});
        await producer.sendBatch(batch);
        await producer.close();
        console.log(JSON.stringify(returnObject)); 
    }).catch(e => {
        console.error(e.message);
    });
}

// Entrypoint of the program
setInterval(function(){getFastSpeedTest()}, 60*1000);

// getFastSpeedTest();