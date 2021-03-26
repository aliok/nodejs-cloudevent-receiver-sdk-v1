const v1 = require("cloudevents-sdk/v1");

const express = require('express')
const app = express()
const port = 8080

var bodyParser = require('body-parser')



const receiver = new v1.StructuredHTTPReceiver();

// some parts were removed //

app.use(bodyParser.json({ type: 'application/*+json' }))

app.post("/", (req, res) => {
    try {
        let myevent = receiver.parse(req.body, req.headers);

        console.log(myevent.format());

        // TODO use the event

        res.status(201).send("Event Accepted");

    } catch(err) {
        // TODO deal with errors
        console.error(err);
        res.status(415)
            .header("Content-Type", "application/json")
            .send(JSON.stringify(err));
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

registerGracefulExit();

function registerGracefulExit() {
    let logExit = function () {
        console.log("Exiting");
        process.exit();
    };

    // handle graceful exit
    //do something when app is closing
    process.on('exit', logExit);
    //catches ctrl+c event
    process.on('SIGINT', logExit);
    process.on('SIGTERM', logExit);
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', logExit);
    process.on('SIGUSR2', logExit);
}

/*
 curl -X POST     \
   -H "content-type: application/cloudevents+json"      \
   -H "specversion: 1.0"      \
   -H "ce-source: curl-command"      \
   -H "ce-type: curl.demo"      \
   -H "ce-id: 123-abc"      \
   -d '{"specversion":"1.0","type":"com.github.pull.create","source":"https://github.com/cloudevents/spec/pull/123","id":"b25e2717-a470-45a0-8231-985a99aa9416","time":"2019-11-06T11:08:00Z","datacontenttype":"application/json","data":{"much":"wow"}}' \
   localhost:8080

{
  "specversion":"1.0",
  "type":"com.github.pull.create",
  "source":"https://github.com/cloudevents/spec/pull/123",
  "id":"b25e2717-a470-45a0-8231-985a99aa9416",
  "time":"2019-11-06T11:08:00Z",
  "datacontenttype":"application/json",
  "data":{
    "much":"wow"
  }
}
*/
