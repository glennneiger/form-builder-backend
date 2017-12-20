const mysql = require('mysql');
const connect = require('connect');
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = '3000';
let app = connect();
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: hostname,
  user: 'root',
  password: '',
  database: 'form-builder'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('connected');
  let query = 'CREATE TABLE IF NOT EXISTS forms (id INT(11) AUTO_INCREMENT NOT NULL, name VARCHAR(50) UNIQUE, data TEXT, PRIMARY KEY(id))';
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.log('Table created!');
  });
});

app.use('/form/store', (req, res) => {
  let body = req.body;
  let data = body.JSONString;
  let name = body.name;
  let responseObj = {code: 0, message: 'Form created successfully'};
  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  let query = 'INSERT INTO forms (name, data) VALUES ("' + name + '", \'' + data + '\')';
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(400, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      responseObj = {code: err.errno, message: 'Some Error occurred'};
    }
    res.end(JSON.stringify(responseObj));
  });
});

app.use('/form/getall', (req, res) => {
  let query = 'SELECT * FROM forms';
  let responseObj = {};
  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  connection.query(query, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.writeHead(400, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      responseObj = {code: 1, message: 'Some Error occurred'};
    }
    res.end(JSON.stringify(result));
  });
});

app.use('/form/get', (req, res) => {
  let qp = req.url.split('?');
  let formParam = qp[1].split('=');
  let query = 'SELECT * FROM forms WHERE id="' + formParam[1] + '"';
  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  connection.query(query, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.writeHead(400, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      responseObj = {code: 1, message: 'Some Error occurred'};
    }
    res.end(JSON.stringify(result));
  });
});

app.listen(port);
console.log(`Server running at http://${hostname}:${port}`);

