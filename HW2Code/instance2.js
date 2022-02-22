onst mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
//connect to LOCAL (replica) database
var connection = mysql.createConnection({
        host: 'localhost', //34.136.51.54
        user: 'replica',
        password: 'abdi',
        database: 'mydb'
});
//connect to FOREIGN (master) database
var connectionMaster = mysql.createConnection({
        host: '34.66.33.76',
        user: 'replica',
        password: 'abdi',
        database: 'mydb'
});
//Initialize web app
const app = express();
app.use(bodyParser.json());
//Handle requests to base IP/URL
app.get('/', (req, res) => {
        res.json({'Hello': 'world'});
});
//greeting page
app.get('/greeting', (req, res) => {
        res.send('Hello World!');
});
//register page
app.post('/register', (req,res) => {
        let n = req.body.username;
        n = n.replace(/^[0-9\s]*|[+*\r\n]/g, '');
        query = `INSERT INTO Users (username) VALUES ('`+n+`');`;
        connection.connect();
        connection.query(query, (e,r,f) => {
                //console.log(r);
        });
  });
//list page
app.get('/list', (req, res) => {
        query = `SELECT * FROM Users;`;
        connection.query(query, (e,r,f) => {
                res.json({'users': r});
        });
});
//clear page
app.post('/clear', (req, res) => {
        query = `DELETE FROM Users;`;
        connection.connect();
        connection.query(query, (e,r,f) => {
                //res.send('Users removed.');
        });
        connectionMaster.connect();
        connectionMaster.query(query, (e,r,f) => {
                res.send('Users removed');
        });
})
var http = require('http').Server(app);
const PORT = 80;
http.listen(PORT, function() {
        console.log('Listening');
});
