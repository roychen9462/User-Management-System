const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application
app.use(bodyParser.json());

// Static files
app.use(express.static('public'));

// Templating engine
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Connection pool
const pool = mysql2.createPool({
  connectionLimit: 100,
  host           : process.env.DB_HOST,
  user           : process.env.DB_USER,
  password       : process.env.DB_PASS,
  database       : process.env.DB_NAME
})

// Connect to DB
pool.getConnection((err, connection) => {
  if (err) throw err; // Not connected
  console.log('Connected as ID ' + connection.threadId);
});

const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));