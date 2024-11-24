// const express = require("express");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// const port = 3000; // Port for the backend server

// // Middleware
// app.use(cors());
// app.use(bodyParser.json()); // Parse JSON request bodies

// // Serve static files from the frontend folder
// app.use(express.static(path.join(__dirname, "frontend")));

// // Fallback to serve index.html for the root route
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "index.html"));
// });

// // Set up MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root", // Your MySQL username
//   password: "bodbcfGmysql@30", // Your MySQL password
//   database: "budgeting_app", // Your database name
// });

// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     process.exit(1);
//   }
//   console.log("Connected to MySQL database");
// });

// // GET endpoint to retrieve transactions
// app.get("/transactions", (req, res) => {
//   const query =
//     "SELECT id, description, amount, type, category FROM transactions ORDER BY created_at DESC";
//   db.query(query, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: "Database error" });
//     } else {
//       const formattedResults = results.map((transaction) => ({
//         id: transaction.id,
//         description: transaction.description,
//         amount: parseFloat(transaction.amount),
//         type: transaction.type,
//         category: transaction.category,
//       }));
//       res.json(formattedResults);
//     }
//   });
// });

// // POST endpoint to add a new transaction
// app.post("/transactions", (req, res) => {
//   const { description, amount, type, category } = req.body;
//   const query =
//     "INSERT INTO transactions (description, amount, type, category) VALUES (?, ?, ?, ?)";
//   db.query(query, [description, amount, type, category], (err, result) => {
//     if (err) {
//       res.status(500).json({ error: "Database error" });
//     } else {
//       res.status(201).json({
//         id: result.insertId,
//         description,
//         amount: parseFloat(amount),
//         type,
//         category,
//       });
//     }
//   });
// });
// // .................................
// // PUT endpoint to update an existing transaction
// app.put("/transactions/:id", (req, res) => {
//   const { id } = req.params;
//   const { description, amount, type, category } = req.body;
//   const query =
//     "UPDATE transactions SET description = ?, amount = ?, type = ?, category = ? WHERE id = ?";
//   db.query(query, [description, amount, type, category, id], (err, result) => {
//     if (err) {
//       res.status(500).json({ error: "Database error" });
//     } else if (result.affectedRows === 0) {
//       res.status(404).json({ error: "Transaction not found" });
//     } else {
//       res.json({ message: "Transaction updated successfully" });
//     }
//   });
// });

// // DELETE endpoint to delete a transaction
// app.delete("/transactions/:id", (req, res) => {
//   const { id } = req.params;

//   const query = "DELETE FROM transactions WHERE id = ?";
//   db.query(query, [id], (err, result) => {
//     if (err) {
//       res.status(500).json({ error: "Database error" });
//     } else if (result.affectedRows === 0) {
//       res.status(404).json({ error: "Transaction not found" });
//     } else {
//       res.status(200).json({ message: "Transaction deleted" });
//     }
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Backend running on http://localhost:${port}`);
// });

// ..........................................
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000; // Port for the backend server

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "frontend")));

// Fallback to serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Set up MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root", // Your MySQL username
//   password: "bodbcfGmysql@30", // Your MySQL password
//   database: "budgeting_app", // Your database name
// });
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// GET endpoint to retrieve transactions
app.get("/transactions", (req, res) => {
  const query = `
    SELECT id, description, amount, type, category 
    FROM transactions 
    ORDER BY created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      // Format results for the frontend
      const formattedResults = results.map((transaction) => ({
        id: transaction.id,
        description: transaction.description,
        amount: parseFloat(transaction.amount), // Ensure amount is a number
        type: transaction.type,
        category: transaction.category,
      }));
      res.json(formattedResults);
    }
  });
});

// POST endpoint to add a new transaction
app.post("/transactions", (req, res) => {
  const { description, amount, type, category } = req.body;

  if (!description || isNaN(amount) || amount <= 0 || !type || !category) {
    res.status(400).json({ error: "Invalid transaction data" });
    return;
  }

  const query = `
    INSERT INTO transactions (description, amount, type, category) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [description, amount, type, category], (err, result) => {
    if (err) {
      console.error("Error adding transaction:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(201).json({
        id: result.insertId,
        description,
        amount: parseFloat(amount),
        type,
        category,
      });
    }
  });
});

// PUT endpoint to update an existing transaction
app.put("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category } = req.body;

  if (!description || isNaN(amount) || amount <= 0 || !type || !category) {
    res.status(400).json({ error: "Invalid transaction data" });
    return;
  }

  const query = `
    UPDATE transactions 
    SET description = ?, amount = ?, type = ?, category = ? 
    WHERE id = ?
  `;
  db.query(query, [description, amount, type, category, id], (err, result) => {
    if (err) {
      console.error("Error updating transaction:", err);
      res.status(500).json({ error: "Database error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Transaction not found" });
    } else {
      res.json({ message: "Transaction updated successfully" });
    }
  });
});

// DELETE endpoint to delete a transaction
app.delete("/transactions/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM transactions WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      res.status(500).json({ error: "Database error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Transaction not found" });
    } else {
      res.status(200).json({ message: "Transaction deleted successfully" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
