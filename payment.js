function confirmPayment() {
    // Simulate payment processing logic
    console.log('Processing payment...');
    // Find the confirm payment button
    const confirmButton = document.querySelector('button[onclick="confirmPayment()"]');
    // Mock delay to simulate payment processing
    setTimeout(() => {
        // Logic after 'payment' is 'processed'
        console.log('Payment confirmed');

        // Display a success message
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Thank you! Your payment has been confirmed.';
        successMessage.style.color = 'black';
        document.body.appendChild(successMessage);
        if (confirmButton) {
            confirmButton.style.display = 'none';
        }
    }, 200); // Mock processing delay of 0.2 seconds
}

document.addEventListener('DOMContentLoaded', function() {
    // Option 1: Retrieve Query Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const menuItemId = urlParams.get('menuItemId');
    const menuName = urlParams.get('menuName');
    const price = parseFloat(urlParams.get('price'));
    const quantity = parseInt(urlParams.get('quantity'), 10);
    const pickupTime = urlParams.get('pickupTime');

    displayOrderSummary(menuItemId, menuName, price, quantity, pickupTime);

    // Add payment processing logic here
    document.getElementById('confirmPayment').addEventListener('click', function() {
        // Payment confirmation logic
        console.log('Payment confirmed');
        // Redirect to a confirmation page or display a confirmation message
    });
});

function displayOrderSummary(menuItemId, menuName, price, quantity, pickupTime) {
    const orderSummaryDiv = document.getElementById('orderSummary');
    const totalPrice = price * quantity;

    orderSummaryDiv.innerHTML = `
        Order Summary:<br>
        Item Name: ${decodeURIComponent(menuName)}<br>
        Quantity: ${quantity}<br>
        Price per item: $${price.toFixed(2)}<br>
        Total Cost: $${totalPrice.toFixed(2)}<br>
        Pickup Time: ${pickupTime}
    `;
}


//new comment to check git push
