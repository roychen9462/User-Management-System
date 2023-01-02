const mysql2 = require('mysql2');

// Connection pool
const pool = mysql2.createPool({
  connectionLimit: 100,
  host           : process.env.DB_HOST,
  user           : process.env.DB_USER,
  password       : process.env.DB_PASS,
  database       : process.env.DB_NAME
})

// View users
exports.view = (req, res) => {

  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log('Connected as ID ' + connection.threadId);

    // Use the connection
    connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
      // When done with the connection, release it
      connection.release();

      if (!err) {
        res.render('home', { rows });
      } else {
        console.log(err);
      }

       console.log('The data is loaded');

    })
  });
}

// Find user by search
exports.find = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log('Connected as ID ' + connection.threadId);
    let searchTerm = req.body.search;

    // Use the connection
    connection.query('SELECT * FROM user WHERE first_name LIKE ? or last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
      // When done with the connection, release it
      connection.release();

      if (!err) {
        res.render('home', { rows });
      } else {
        console.log(err);
      }

       console.log('The data is loaded');
    })
  });
}

// Add user
exports.form = (req, res) => {
  res.render('add-user');
}
