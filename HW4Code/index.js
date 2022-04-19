const express = require('express');
const bodyParser = require('body-parser');
const hive = require('hive-driver');
const { TCLIService, TCLIService_types } = hive.thrift;
const {spawn} = require('child_process');

const app = express();
app.use(bodyParser.json());
app.set('json spaces', 2);

var http = require('http').Server(app);
const PORT = 80;
http.listen(PORT, function() {
        console.log('Listening');
});

const client = new hive.HiveClient(
        TCLIService,
        TCLIService_types
);

const utils = new hive.HiveUtils(TCLIService_types);

app.get('/', (req, res) => {
        res.send("Welcome");
});

app.post('/results', (req, res) => {
        client.connect(
            {
                host: '10.128.0.3',
                port: 10000,
            },
            new hive.connections.TcpConnection(),
            new hive.auth.PlainTcpAuthentication()
        ).then(async client => {
                const session = await client.openSession({
                         client_protocol: hive.thrift.TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
                });

                var input = req.body.term;
                var inputESC = '\"' + input + '\"'
                var base = 'SELECT urlclicks FROM searchdata WHERE term["searchTerm"] = '
                var myquery = base.concat(inputESC);
                //console.log(inputESC);
                console.log(myquery);
                const operation = await session.executeStatement(
                        //'SELECT * FROM searchdata', {runSync: true}
                        myquery, {runSync: true}
                );

                await utils.waitUntilReady(operation, false, () => {});

                const response = await operation.status();
                await utils.fetchAll(operation);
                //await operation.close();

                const result = utils.getResult(operation).getValue();

                var result2 = JSON.stringify(result);
                result2 = result2.substring(1, result2.length - 1);
                result2 = result2.replace('urlclicks','results');
                console.log(result2);

                res.json(JSON.parse(result2));

                //await session.close();
                //await client.close();

        }).catch(error => {
            console.log(error);
        });
});


app.post('/trends', (req, res) => {
        client.connect(
            {
                host: '10.128.0.3',
                port: 10000,
            },
            new hive.connections.TcpConnection(),
            new hive.auth.PlainTcpAuthentication()
        ).then(async client => {
                const session = await client.openSession({
                         client_protocol: hive.thrift.TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
                });

                var input = req.body.term;
                var inputESC = '\"' + input + '\"';
                var base = 'SELECT SUM(val) AS clicks FROM (SELECT explode(urlClicks) AS (key, val) FROM searchdata WHERE term["searchTerm"] = ';
                var myquery = base + inputESC + ') temp';
                //console.log(inputESC);
                console.log(myquery);
                const operation = await session.executeStatement(
                        myquery, {runSync: true}
                );

                await utils.waitUntilReady(operation, false, () => {});

                const response = await operation.status();
                await utils.fetchAll(operation);
                //await operation.close();

                const result = utils.getResult(operation).getValue();

                var result2 = JSON.stringify(result);
                result2 = result2.substring(1, result2.length - 1);
                console.log(result2);

                res.json(JSON.parse(result2));

                //await session.close();
                //await client.close();

        }).catch(error => {
            console.log(error);
        });
});

app.post('/popularity', (req, res) => {
        client.connect(
            {
                host: '10.128.0.3',
                port: 10000,
            },
            new hive.connections.TcpConnection(),
            new hive.auth.PlainTcpAuthentication()
        ).then(async client => {
                const session = await client.openSession({
                         client_protocol: hive.thrift.TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
                });

                var input = req.body.url;
                var inputESC = '\"' + input + '\"';
                var base = 'SELECT clicks FROM popularity WHERE url = ';
                var myquery = base.concat(inputESC);
                //console.log(inputESC);
                console.log(myquery);
                const operation = await session.executeStatement(
                        myquery, {runSync: true}
                );

                await utils.waitUntilReady(operation, false, () => {});

                const response = await operation.status();
                await utils.fetchAll(operation);
                //await operation.close();

                const result = utils.getResult(operation).getValue();

                var result2 = JSON.stringify(result);
                result2 = result2.substring(1, result2.length - 1);
                console.log(result2);
                res.json(JSON.parse(result2));

                //await session.close();
                //await client.close();

        }).catch(error => {
            console.log(error);
        });
});


app.post('/getbestterms', (req, res) => {
        client.connect(
            {
                host: '10.128.0.3',
                port: 10000,
            },
            new hive.connections.TcpConnection(),
            new hive.auth.PlainTcpAuthentication()
        ).then(async client => {
                const session = await client.openSession({
                         client_protocol: hive.thrift.TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
                });

                var input = req.body.website;
                var inputESC = '\"' + input + '\"';
                var base = 'SELECT best_terms FROM bestterms WHERE url = ';
                var myquery = base.concat(inputESC);

                console.log(myquery);
                const operation = await session.executeStatement(
                        myquery, {runSync: true}
                );

                await utils.waitUntilReady(operation, false, () => {});

                const response = await operation.status();
                await utils.fetchAll(operation);
                //await operation.close();

                const result = utils.getResult(operation).getValue();
                var result2 = JSON.stringify(result);
                console.log(result2);
                result2 = result2.substring(1, result2.length - 1);
                console.log(result2);
                res.json(JSON.parse(result2));

        }).catch(error => {
            console.log(error);
        });
});
