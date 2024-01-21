const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 4000;

// Serve static files and use body-parser
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/OPS.html');
  });

// In-memory data storage for canteen menus
let canteenMenus = {
    'Canteen 1': [
        { id: 1, name: 'Noodles', price: 2.5, quantity: 10 },
        { id: 2, name: 'Sandwich', price: 3.0, quantity: 5 },
        // ... more items for Canteen 1
    ],
    'Canteen 2': [
        { id: 3, name: 'Pizza', price: 4.0, quantity: 10 },
        { id: 4, name: 'Burger', price: 3.5, quantity: 5 },
        // ... more items for Canteen 2
    ],
    'Canteen 3': [
        { id: 5, name: 'Salad', price: 2.0, quantity: 10 },
        { id: 6, name: 'Soup', price: 1.5, quantity: 5 },
        // ... more items for Canteen 3
    ]
    // ... add more canteens if needed
};

// User authentication routes
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

        res.json({ success: isValidUser, redirect: isValidUser ? '/student.html' : null });
    });
});

app.post('/register', (req, res) => {
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
                    res.json({ success: true });
                }
            });
        }
    });
});

// Vendor functionality routes
app.get('/menu/:canteenName', (req, res) => {
    const canteenName = req.params.canteenName;
    const menu = canteenMenus[canteenName];
    if (menu) {
        res.json(menu);
    } else {
        res.status(404).send('Canteen not found');
    }
});

app.post('/update-item/:canteenName/:itemId', (req, res) => {
    const canteenName = req.params.canteenName;
    const itemId = parseInt(req.params.itemId);
    const { price, quantity } = req.body;

    if (canteenMenus[canteenName]) {
        const item = canteenMenus[canteenName].find(item => item.id === itemId);
        if (item) {
            item.price = price;
            item.quantity = quantity;
            res.send('Item updated successfully');

            // Notify all clients about the update
            io.emit('itemUpdated', canteenName, item);
        } else {
            res.status(404).send('Item not found');
        }
    } else {
        res.status(404).send('Canteen not found');
    }
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('updateItem', (canteenName, itemId, price, quantity) => {
        // WebSocket event handling for updateItem
    });

    socket.on('restockItem', (canteenName, itemId, quantity) => {
        // WebSocket event handling for restockItem
    });

    socket.on('addItem', (canteenName, itemId, itemName, price, quantity) => {
        // WebSocket event handling for addItem
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server with HTTP and WebSocket support
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
