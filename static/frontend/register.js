document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const registerMessage = document.getElementById('register-message');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        registerMessage.textContent = '✅ Registered! Redirecting to login...';
        registerMessage.style.color = 'green';
        setTimeout(() => {
          window.location.href = '/login/';
        }, 1500);
      } else {
        registerMessage.textContent = '❌ ' + (data.username?.[0] || 'Registration failed');
        registerMessage.style.color = 'red';
      }
    } catch (err) {
      registerMessage.textContent = '❌ Network error';
      registerMessage.style.color = 'red';
    }
  });
});
