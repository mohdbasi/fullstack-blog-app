// Load posts
function loadPosts() {
  const token = localStorage.getItem('token');

  fetch('/api/posts/', {
    headers: token ? { 'Authorization': 'Token ' + token } : {}
  })
    .then(res => res.json())
    .then(data => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';

      data.forEach(post => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
          <div class="card shadow-sm">
            <div class="card-body">
              <h5>${post.title}</h5>
              <p>${post.content}</p>
              <small>By ${post.author.username}</small><br>
              <small>👍 ${post.likes_count}</small>
            </div>
          </div>
        `;
        postList.appendChild(card);
      });
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('post-form');
  const postMessage = document.getElementById('post-message');

  loadPosts();

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const token = localStorage.getItem('token');

    if (!token) {
      postMessage.textContent = '❌ Login required';
      postMessage.style.color = 'red';
      return;
    }

    try {
      const response = await fetch('/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        },
        body: JSON.stringify({ title, content })
      });

      const data = await response.json();
      if (response.ok) {
        postMessage.textContent = '✅ Post created!';
        postMessage.style.color = 'green';
        postForm.reset();
        loadPosts();
      } else {
        postMessage.textContent = '❌ ' + (data.detail || 'Error creating post');
        postMessage.style.color = 'red';
      }
    } catch (err) {
      postMessage.textContent = '❌ Network error';
      postMessage.style.color = 'red';
    }
  });
});
