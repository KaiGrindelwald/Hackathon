function submitLoginForm() {
  var username = document.getElementById('loginUsername').value;
  var password = document.getElementById('loginPassword').value;
  authenticateUser('login', username, password);
}

function submitRegisterForm() {
  var username = document.getElementById('registerUsername').value;
  var password = document.getElementById('registerPassword').value;
  authenticateUser('register', username, password);
}

function authenticateUser(action, username, password) {
  // Send a request to the server to check the credentials or register
  fetch(`http://localhost:4000/${action}?username=${username}&password=${password}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful`);
      } else {
        alert(`Failed to ${action}: ${data.message}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function toggleForms() {
  var loginFormDiv = document.getElementById('loginFormDiv');
  var registerFormDiv = document.getElementById('registerFormDiv');

  if (loginFormDiv.style.display === 'none') {
    loginFormDiv.style.display = 'block';
    registerFormDiv.style.display = 'none';
  } else {
    loginFormDiv.style.display = 'none';
    registerFormDiv.style.display = 'block';
  }
}