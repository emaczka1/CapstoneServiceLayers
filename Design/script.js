document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value;
   
    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Make the request to register the user
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      const data = await response.json();

      // Log the response data
      console.log('Response Data:');


      // Check if the registration was successful based on the server response
      if (response.ok) {
        // Redirect the user to the home page
        window.location.href = '/Login.html';
    } else {
        // Handle registration failure
        console.log('Registration failed:', data.error);
    }


    } catch (error) {
      console.error('Error registering user', error);
    }
  });