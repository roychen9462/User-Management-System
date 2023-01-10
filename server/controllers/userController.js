const mysql2 = require("mysql2");

// Connection pool
const pool = mysql2.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// View users
exports.view = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log("Connected as ID " + connection.threadId);

    // Use the connection
    connection.query(
      'SELECT * FROM user WHERE status = "active"',
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }

        console.log("The data is loaded");
      }
    );
  });
};

// Find user by search
exports.find = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log("Connected as ID " + connection.threadId);
    let searchTerm = req.body.search;

    // Use the connection
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? or last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }

        console.log("The data is finded");
      }
    );
  });
};

// View add user form
exports.form = (req, res) => {
  res.render("add-user");
};

// Add user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comment } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log("Connected as ID " + connection.threadId);

    // Use the connection
    connection.query(
      "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comment = ?",
      [first_name, last_name, email, phone, comment],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          res.render("add-user", { alert: "Add user successfully." });
        } else {
          console.log(err);
        }

        console.log("The data is added");
      }
    );
  });
};

// Edit user
exports.edit = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log("Connected as ID " + connection.threadId);

    // Use the connection
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

// Update user
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comment } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log("Connected as ID " + connection.threadId);

    // Use the connection
    connection.query(
      "UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comment = ? WHERE id = ?",
      [first_name, last_name, email, phone, comment, req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          // Connect to DB
          pool.getConnection((err, connection) => {
            if (err) throw err; // Not connected
            console.log("Connected as ID " + connection.threadId);

            // Use the connection
            connection.query(
              "SELECT * FROM user WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                // When done with the connection, release it
                connection.release();

                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `${first_name} ${last_name} is updated.`,
                  });
                } else {
                  console.log(err);
                }
              }
            );
          });
        } else {
          console.log(err);
        }

        console.log("The data is updated");
      }
    );
  });
};

// Delete user
exports.delete = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log("Connected as ID " + connection.threadId);

    // Use the connection
    connection.query(
      "DELETE FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          let removedUser = encodeURIComponent("User successeflly removed.");
          res.redirect("/?removed=" + removedUser);
        } else {
          console.log(err);
        }
      }
    );
  });
};

// View Users
exports.viewall = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not connected
    console.log("Connected as ID " + connection.threadId);

    // User the connection
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};
