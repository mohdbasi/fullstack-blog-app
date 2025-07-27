document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);  //  Save username for post ownership check

        loginMessage.textContent = '✅ Login successful!';
        loginMessage.style.color = 'green';

        setTimeout(() => {
          window.location.href = '/';  // redirect to main page
        }, 1000);
      } else {
        loginMessage.textContent = '❌ ' + (data.error || 'Login failed');
        loginMessage.style.color = 'red';
      }
    } catch (err) {
      loginMessage.textContent = '❌ Network error';
      loginMessage.style.color = 'red';
    }
  });
});
