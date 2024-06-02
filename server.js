const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

app.use(bodyParser.json());
app.use(cors());

// Tworzenie tabeli użytkowników
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        nickname TEXT,
        email TEXT UNIQUE,
        password TEXT,
        birthdate TEXT
    )`);
});

// Endpoint do rejestracji użytkowników
app.post('/register', (req, res) => {
    const { firstName, lastName, nickname, email, password, birthdate } = req.body;
    
    db.run(`INSERT INTO users (firstName, lastName, nickname, email, password, birthdate) VALUES (?, ?, ?, ?, ?, ?)`, 
    [firstName, lastName, nickname, email, password, birthdate], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'User registered successfully!', userId: this.lastID });
    });
});

// Endpoint do logowania użytkowników
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }
        if (!row) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful!', userId: row.id });
      });
});

// Endpoint do pobierania danych użytkownika
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
