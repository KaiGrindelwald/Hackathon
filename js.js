document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    loadOrderForm();
});

const menuItems = [
    { id: 1, name: 'Noodles', price: 2.5 },
    { id: 2, name: 'Sandwich', price: 3.0 },
    { id: 3, name: 'Noodles', price: 2.5 },
    { id: 4, name: 'Sandwich', price: 3.0 },
    { id: 5, name: 'Noodles', price: 2.5 },
    { id: 6, name: 'Sandwich', price: 3.0 },
    { id: 7, name: 'Noodles', price: 2.5 },
    { id: 8, name: 'Sandwich', price: 3.0 },
    // ... more items
];

function loadMenu() {
    const menuDiv = document.getElementById('menu');
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.innerHTML = `<h3>${item.name}<br>$${item.price}</h3>`;  // Corrected line
        menuDiv.appendChild(menuItem);
    });
}

function loadOrderForm() {
    const orderDiv = document.getElementById('orderForm');

    // Clear previous content
    orderDiv.innerHTML = '';

    // Create form element
    const form = document.createElement('form');

    // Add a dropdown or list for menu items
    const menuItemSelect = document.createElement('select');
    menuItemSelect.name = 'menuItem';
    menuItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        menuItemSelect.appendChild(option);
    });
    form.appendChild(menuItemSelect);

    // Input for quantity
    const quantityInput = document.createElement('input');
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
        form.onsubmit = function(event) {
            event.preventDefault();
        
            // Capture form data and redirect to the payment page
            const menuItemId = menuItemSelect.value;
            const quantity = quantityInput.value;
            const pickupTime = timeInput.value;
        
            window.location.href = `payment.html?menuItemId=${menuItemId}&quantity=${quantity}&pickupTime=${pickupTime}`;
        };
        
    };
}
