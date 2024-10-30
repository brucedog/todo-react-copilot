const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());
app.use(cors());

db.serialize(() => {
  db.run("CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, date TEXT, time TEXT)");
});

app.get('/todos', (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/todos', (req, res) => {
  const { text, date, time } = req.body;
  db.run("INSERT INTO todos (text, date, time) VALUES (?, ?, ?)", [text, date, time], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, text, date, time });
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id = ?", id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});