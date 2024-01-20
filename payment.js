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
        successMessage.style.color = '#7dcdb5';
        document.body.appendChild(successMessage);
        if (confirmButton) {
            confirmButton.style.display = 'none';
        }
    }, 1000); // Mock processing delay of 2 seconds
}

document.addEventListener('DOMContentLoaded', function() {
    // Option 1: Retrieve Query Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const menuItemId = urlParams.get('menuItemId');
    const quantity = urlParams.get('quantity');
    const pickupTime = urlParams.get('pickupTime');

    // Option 2: Retrieve from Session Storage
    // const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));

    displayOrderSummary(menuItemId, quantity, pickupTime);

    // Add payment processing logic here
    document.getElementById('confirmPayment').addEventListener('click', function() {
        // Payment confirmation logic
        console.log('Payment confirmed');
        // Redirect to a confirmation page or display a confirmation message
    });
});

function displayOrderSummary(menuItemId, quantity, pickupTime) {
    const orderSummaryDiv = document.getElementById('orderSummary');
    orderSummaryDiv.innerHTML = `Order Summary:<br>Item ID: ${menuItemId}<br>Quantity: ${quantity}<br>Pickup Time: ${pickupTime}`;
    // Add more detailed summary based on your application's requirements
}


//new comment to check git push
