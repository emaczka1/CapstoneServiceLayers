document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Make the request to log in the user
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        console.log('login API response', response)

        if (response.ok) {           
            window.location.href = '/Characters.html';
        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData.message);

        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});
