function submitLoginForm() {
  var username = document.getElementById('loginUsername').value;
  var password = document.getElementById('loginPassword').value;
  authenticateUser('login', username, password);
}

function submitRegisterForm() {
  var username = document.getElementById('registerUsername').value;
  var password = document.getElementById('registerPassword').value;
  var email = document.getElementById('registerEmail').value;

  fetch(`http://localhost:4000/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
    }),
  })
    .then(response => {
      if (response.ok) {
        return response.json(); // Only parse JSON if response is successful
      } else {
        throw new Error('Username already taken'); // Or customize the error message based on response
      }
    })
    .then(data => {
      alert(`Registration successful`);
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(`Failed to register: ${error.message}`);
    });
}




function authenticateUser(action, username, password) {
  // Send a request to the server to check the credentials or register
  fetch(`http://localhost:4000/${action}?username=${username}&password=${password}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful`);
        if (data.redirect) {
          window.location.href = data.redirect;
        }
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
