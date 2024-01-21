const socket = io('http://localhost:5500'); // Connect to your server

function loadMenuItems(canteenName) {
    fetch(`http://localhost:4000/menu/${canteenName}`)  // Request for the specified canteen
        .then(response => response.json())
        .then(menuItems => {
            const menuDiv = document.getElementById('menuItems');
            menuDiv.innerHTML = ''; // Clear existing items

            menuItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.innerHTML = `
                    <p>Name: ${item.name}</p>
                    <p>Price: $<span id="price-${item.id}">${item.price}</span></p>
                    <p>Quantity: <span id="quantity-${item.id}">${item.quantity}</span></p>
                    <button onclick="updateItem(${item.id})">Update</button>
                    <button onclick="restockItem(${item.id})">Restock</button>
                `;
                menuDiv.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Error loading menu items for ' + canteenName + ':', error));
}

// Function to change the canteen
function changeCanteen(canteenName) {
    loadMenuItems(canteenName);
}

function updateItem(itemId) {
    const item = canteenMenus['Canteen 1'].find(item => item.id === itemId); // Adjust based on your data structure

    // Create and display a form for updating the item
    const updateForm = document.createElement('form');
    updateForm.innerHTML = `
        <h3>Update Item: ${item.name}</h3>
        <label for="newPrice">New Price:</label>
        <input type="number" id="newPrice" value="${item.price}" step="0.01" min="0"><br>
        <label for="newQuantity">New Quantity:</label>
        <input type="number" id="newQuantity" value="${item.quantity}" min="0"><br>
        <button type="button" onclick="submitUpdate(${itemId})">Update Item</button>
    `;

    const menuDiv = document.getElementById('menuItems');
    menuDiv.appendChild(updateForm);
}

function submitUpdate(itemId) {
    const newPrice = parseFloat(document.getElementById('newPrice').value);
    const newQuantity = parseInt(document.getElementById('newQuantity').value);

    fetch(`http://localhost:4000/update-item/Canteen 1/${itemId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            price: newPrice,
            quantity: newQuantity,
        }),
    })
    .then(response => {
        if (response.ok) {
            alert('Item updated successfully');
            loadMenuItems(); // Reload the menu items

            // Emit the update event to the server after successful update
            socket.emit('updateItem', 'Canteen 1', itemId, newPrice, newQuantity);
        } else {
            throw new Error('Failed to update item');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

function restockItem(itemId) {
    const restockQuantity = prompt("Enter restock quantity for the item:", "10");
    if (restockQuantity != null) {
        fetch(`http://localhost:4000/restock-item/Canteen 1/${itemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quantity: parseInt(restockQuantity, 10)
            }),
        })
        .then(response => {
            if (response.ok) {
                alert('Item restocked successfully');
                loadMenuItems(); // Reload the menu items

                // Emit the restock event to the server only after successful response
                socket.emit('restockItem', 'Canteen 1', itemId, parseInt(restockQuantity, 10));
            } else {
                throw new Error('Failed to restock item');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    }
}

function addNewItem() {
    const itemName = prompt("Enter new item name:", "New Item");
    const itemPrice = prompt("Enter price for the new item:", "1");
    const itemQuantity = prompt("Enter quantity for the new item:", "10");

    if (itemName && itemPrice && itemQuantity) {
        fetch(`http://localhost:4000/add-item/Canteen 1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: itemName,
                price: parseFloat(itemPrice),
                quantity: parseInt(itemQuantity, 10)
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Assuming the server sends back the ID of the new item
            } else {
                throw new Error('Failed to add new item');
            }
        })
        .then(data => {
            alert('New item added successfully');
            loadMenuItems(); // Reload the menu items

            // Emit the add item event to the server after successful addition
            socket.emit('addItem', 'Canteen 1', data.id, itemName, parseFloat(itemPrice), parseInt(itemQuantity, 10));
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    }
}



document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems('Canteen 1');
    // Listen for item updates
    socket.on('itemUpdated', (canteenName, updatedItem) => {
        if (canteenName === 'Canteen 1') {
            const priceElement = document.getElementById(`price-${updatedItem.id}`);
            const quantityElement = document.getElementById(`quantity-${updatedItem.id}`);
            if (priceElement) priceElement.textContent = `$${updatedItem.price}`;
            if (quantityElement) quantityElement.textContent = updatedItem.quantity;
        }
    });

    // Listen for new items added
    socket.on('itemAdded', (canteenName, newItem) => {
        if (canteenName === 'Canteen 1') {
            const menuDiv = document.getElementById('menuItems');
            const newItemDiv = document.createElement('div');
            newItemDiv.innerHTML = `
                <p>Name: ${newItem.name}</p>
                <p>Price: $<span id="price-${newItem.id}">${newItem.price}</span></p>
                <p>Quantity: <span id="quantity-${newItem.id}">${newItem.quantity}</span></p>
                <button onclick="updateItem(${newItem.id})">Update</button>
                <button onclick="restockItem(${newItem.id})">Restock</button>
            `;
            menuDiv.appendChild(newItemDiv);
        }
    });
});
