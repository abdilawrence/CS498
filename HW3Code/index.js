const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const {spawn} = require('child_process');

const app = express();
app.use(bodyParser.json());

//Handle requests to base IP/URL
app.get('/', (req, res) => {
        res.send("Welcome");
});

app.set('json spaces', 2);

//Web service: Return JSON
app.get('/lengthCounts', (req, res) => {
        var dataToSend;

        // spawn new child process to call the python script
        const python = spawn('python3', ['/home/lawrence_abdi/temp/sparktest.py', 'War_and_Peace.txt', 'output']);

        // collect data from script
        python.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                dataToSend = data.toString();
        });

        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}, ${dataToSend}`);
                // send data to browser
                res.json(JSON.parse(dataToSend));
        });
});

app.post('/analyze', (req, res) => {
        let words = req.body.wordlist;
        let weights = req.body.weights;
        var dataToSend;

        const python = spawn('python3', ['/home/lawrence_abdi/temp/analyze.py','War_and_Peace.txt', JSON.stringify(req.body)]);

        // collect data from script
        python.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                dataToSend = data.toString();
        });

        python.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}, ${dataToSend}`);
                // send data to browser

        });

        res.send("Coming right up!");
});

app.get('/result', (req, res) => {
        if (fs.existsSync("./result.json")) {
                var result = require("./result.json");
                res.json(result);
        } else {
                res.send("Not done yet!");
        }
});

var http = require('http').Server(app);
const PORT = 80;
http.listen(PORT, function() {
        console.log('Listening');
});
