// npm install --global fast-speedtest-api
// npm install --save @azure/eventhubs

const FastSpeedtest = require("fast-speedtest-api");
const fs = require('fs');
const {
    EventHubProducerClient
} = require('@azure/event-hubs');
const EVENT_HUB_CONFIG = require('./event-hub-info');
const TOKEN = require('./token');

function getFastSpeedTest() {
    //console.log(`${(new Date()).toISOString()}: Getting Internet speed...`);
    let speedtest = new FastSpeedtest({
        token: TOKEN, // required
        verbose: false, // default: false
        timeout: 10000, // default: 5000
        https: true, // default: true
        urlCount: 5, // default: 5
        bufferSize: 8, // default: 8
        unit: FastSpeedtest.UNITS.Mbps // default: Bps
    });

    speedtest.getSpeed().then(async s => {

        let speedReport = {
            "Time": `${(new Date()).toISOString()}`,
            "Speed (Mbps)": `${s}`
        };

        const producer = new EventHubProducerClient(EVENT_HUB_CONFIG.eventHubConnectionString, EVENT_HUB_CONFIG.eventHubName);
        const batch = await producer.createBatch({
            partitionId: 0
        });
        batch.tryAdd({body: speedReport});
        await producer.sendBatch(batch);
        await producer.close();
        console.log(JSON.stringify(speedReport)); 
    }).catch(e => {
        console.error(e.message);
    });
}

// Entrypoint of the program
setInterval(function(){getFastSpeedTest()}, 60*1000);

// getFastSpeedTest();