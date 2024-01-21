// const express = require('express');
// const fs = require('fs');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 4000;

// app.use(express.static(__dirname)); // Serve static files from the current directory
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/OPS.html');
// });

// app.get('/login', (req, res) => {
//   const username = req.query.username;
//   const password = req.query.password;

//   // Read user.txt file
//   fs.readFile('user.txt', 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading user.txt:', err);
//       res.json({ success: false, message: 'Internal server error' });
//       return;
//     }

//     const users = data.split('\n').map(line => line.split(','));

//     // Check if the provided credentials match any user in the file
//     const isValidUser = users.some(user => user[0] === username && user[1] === password);

//     res.json({ success: isValidUser, redirect: isValidUser ? '/html.html' : null });
//   });
// });

// app.all('/register', (req, res) => {
//   if (req.method === 'GET') {
//     // Handle GET request (if needed)
//     res.sendFile(__dirname + '/OPS.html'); // Adjust the file path accordingly
//   } else if (req.method === 'POST') {
//     // Handle POST request (registration logic)
//     const username = req.body.username;
//     const password = req.body.password;
//     const email = req.body.email;

//     // Read user.txt file
//     fs.readFile('user.txt', 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading user.txt:', err);
//         res.json({ success: false, message: 'Internal server error' });
//         return;
//       }

//       const users = data.split('\n').map(line => line.split(','));

//       // Check if the username already exists
//       const isUsernameTaken = users.some(user => user[0] === username);

//       if (isUsernameTaken) {
//         res.json({ success: false, message: 'Username is already taken' });
//       } else {
//         // Append the new user to the file
//         fs.appendFile('user.txt', `${username},${password},${email}\n`, 'utf8', (err) => {
//           if (err) {
//             console.error('Error writing to user.txt:', err);
//             res.json({ success: false, message: 'Internal server error' });
//           } else {
//             // Read user.txt file (inside the callback of appendFile)
//             fs.readFile('user.txt', 'utf8', (err, data) => {
//               if (err) {
//                 console.error('Error reading user.txt:', err);
//                 res.json({ success: false, message: 'Internal server error' });
//                 return;
//               }

//               const users = data.split('\n').map(line => line.split(','));

//               // Check if the username already exists (again)
//               const isUsernameTaken = users.some(user => user[0] === username);

//               if (isUsernameTaken) {
//                 res.json({ success: false, message: 'Username is already taken' });
//               } else {
//                 res.json({ success: true });
//               }
//             });
//           }
//         });
//       }
//     });
//   } else {
//     // Handle other HTTP methods if necessary
//     res.status(405).send('Method Not Allowed');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

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

    res.json({ success: isValidUser, redirect: isValidUser ? '/html.html' : null });
  });
});

app.all('/register', (req, res) => {
  if (req.method === 'GET') {
    // Handle GET request (if needed)
    res.sendFile(__dirname + '/OPS.html'); // Adjust the file path accordingly
  } else if (req.method === 'POST') {
    // Handle POST request (registration logic)
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

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
        fs.appendFile('user.txt', `${username},${password},${email}\n`, 'utf8', (err) => {
          if (err) {
            console.error('Error writing to user.txt:', err);
            res.json({ success: false, message: 'Internal server error' });
          } else {
            // Read user.txt file (inside the callback of appendFile)
            fs.readFile('user.txt', 'utf8', (err, data) => {
              if (err) {
                console.error('Error reading user.txt:', err);
                res.json({ success: false, message: 'Internal server error' });
                return;
              }

              const users = data.split('\n').map(line => line.split(','));

              // Check if the username already exists (again)
              const isUsernameTaken = users.some(user => user[0] === username);

              if (isUsernameTaken) {
                res.json({ success: false, message: 'Username is already taken' });
              } else {
                res.json({ success: true });
              }
            });
          }
        });
      }
    });
  } else {
    // Handle other HTTP methods if necessary
    res.status(405).send('Method Not Allowed');
  }
});

app.post('/generateOTP', (req, res) => {
  const { email } = req.body;

  // Generate a new OTP code and send it via email
  const otpCode = Math.floor(100000 + Math.random() * 900000);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'OPS.bangera@gmail.com', // Replace with your Gmail email
      pass: 'Alcoholics',       // Replace with your Gmail password
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'LogIn OTP',
    text: `Your OTP code is ${otpCode}.`,
  };

  transporter.sendMail(mailOptions, (error, _info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    } else {
      console.log('OTP sent:', otpCode);
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
