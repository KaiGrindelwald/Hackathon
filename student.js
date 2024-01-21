const socket = io('http://localhost:4000');

document.addEventListener('DOMContentLoaded', function() {
    loadOrderForm(); // Existing load order form logic

    socket.on('itemUpdated', (canteenName, updatedItem) => {
        if (canteenName in canteenMenus) {
            const menuItems = canteenMenus[canteenName];
            const itemIndex = menuItems.findIndex(item => item.id === updatedItem.id);
            if (itemIndex !== -1) {
                menuItems[itemIndex] = updatedItem;
                if (document.getElementById('canteenSelect').value === canteenName) {
                    loadMenu(canteenName); // Reload only if the canteen is currently selected
                }
            }
        }
    });
});

const canteenMenus = {
    'Canteen 1': [
        { id: 1, name: 'Noodles', price: 2.5 },
        { id: 2, name: 'Sandwich', price: 3.0 },
        // ... more items for Canteen 1
    ],
    'Canteen 2': [
        { id: 3, name: 'Pizza', price: 4.0 },
        { id: 4, name: 'Burger', price: 3.5 },
        // ... more items for Canteen 2
    ],
    'Canteen 3': [
        { id: 5, name: 'Salad', price: 2.0 },
        { id: 6, name: 'Soup', price: 1.5 },
        // ... more items for Canteen 3
    ]
    // ... add more canteens if needed
};

function loadMenu(canteenName) {
    const menuItems = canteenMenus[canteenName];
    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = ''; // Clear previous menu items

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.innerHTML = `<h3>${item.name}<br>$${item.price}</h3>`;
        menuDiv.appendChild(menuItem);
    });

    // Update the menu items dropdown
    updateMenuItemDropdown(canteenName);
}

function updateMenuItemDropdown(canteenName) {
    const menuItemSelect = document.getElementsByName('menuItem')[0];

    // Check if menuItemSelect exists before updating
    if (menuItemSelect) {
        menuItemSelect.innerHTML = '';

        canteenMenus[canteenName].forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            menuItemSelect.appendChild(option);
        });
    }
}


function loadOrderForm() {
    const orderDiv = document.getElementById('orderForm');
    orderDiv.innerHTML = '';

    // Create a dropdown for canteen selection
    const canteenSelect = document.createElement('select');
    canteenSelect.id = 'canteenSelect';
    for (const canteen in canteenMenus) {
        const option = document.createElement('option');
        option.value = canteen;
        option.textContent = canteen;
        canteenSelect.appendChild(option);
    }
    orderDiv.appendChild(canteenSelect);

    // Load the menu for the initially selected canteen
    loadMenu(canteenSelect.value);

    // Event listener for canteen selection change
    canteenSelect.addEventListener('change', function() {
        loadMenu(this.value);
    });

    // Create the order form
    const form = document.createElement('form');

    // Add a dropdown for menu items
    const menuItemSelect = document.createElement('select');
    menuItemSelect.name = 'menuItem';
    menuItemSelect.id = 'menuItemSelect';
    menuItemSelect.style.width = '320px'; // Set the width inline
    menuItemSelect.style.padding = '8px'; // Set the id for reference
    canteenMenus[canteenSelect.value].forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        menuItemSelect.appendChild(option);
    });
    form.appendChild(menuItemSelect);

    // Input for quantity
    const quantityInput = document.createElement('input');
    quantityInput.id = 'quantityInput.id';
    quantityInput.style.width = '300px'; // Set the width inline
    quantityInput.style.padding = '8px';
    quantityInput.type = 'number';
    quantityInput.name = 'quantity';
    quantityInput.min = 1;
    quantityInput.value = 1;
    form.appendChild(quantityInput);

    // Input for pickup time
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.name = 'pickupTime';
    form.appendChild(timeInput);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Place Order';
    form.appendChild(submitButton);

    // Append the form to the orderDiv
    orderDiv.appendChild(form);

    // Handle form submission
    form.onsubmit = function(event) {
        event.preventDefault();

        const selectedMenuItem = canteenMenus[canteenSelect.value].find(item => item.id.toString() === menuItemSelect.value);
        if (selectedMenuItem) {
            const menuItemId = selectedMenuItem.id;
            const menuItemName = selectedMenuItem.name;
            const menuItemPrice = selectedMenuItem.price;
            const quantity = quantityInput.value;
            const pickupTime = timeInput.value;

            window.location.href = `payment.html?menuItemId=${menuItemId}&menuName=${encodeURIComponent(menuItemName)}&price=${menuItemPrice}&quantity=${quantity}&pickupTime=${pickupTime}`;
        }
    };
}
