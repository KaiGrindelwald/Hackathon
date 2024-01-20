const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

app.use(express.static(__dirname)); // Serve static files from the current directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/OPS.html');
});

app.get('/login', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  // Read user.txt file
  fs.readFile('user.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading user.txt:', err);
      res.json({ success: false, message: 'Internal server error' });
      return;
    }

    const users = data.split('\n').map(line => line.split(','));

    // Check if the provided credentials match any user in the file
    const isValidUser = users.some(user => user[0] === username && user[1] === password);

    res.json({ success: isValidUser });
  });
});

app.get('/register', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  // Read user.txt file
  fs.readFile('user.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading user.txt:', err);
      res.json({ success: false, message: 'Internal server error' });
      return;
    }

    const users = data.split('\n').map(line => line.split(','));

    // Check if the username already exists
    const isUsernameTaken = users.some(user => user[0] === username);

    if (isUsernameTaken) {
      res.json({ success: false, message: 'Username is already taken' });
    } else {
      // Append the new user to the file
      fs.appendFile('user.txt', `${username},${password}\n`, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to user.txt:', err);
          res.json({ success: false, message: 'Internal server error' });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
