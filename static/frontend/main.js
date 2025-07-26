// 🔁 Load all posts and their comments
function loadPosts() {
  const token = localStorage.getItem('token');
  const currentUsername = localStorage.getItem('username'); // 🧠 Save this during login

  fetch('/api/posts/', {
    headers: token ? { 'Authorization': 'Token ' + token } : {}
  })
    .then(res => res.json())
    .then(data => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';

      data.forEach(post => {
        const isAuthor = token && post.author.username === currentUsername;
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="post-title">${post.title}</h5>
              <p class="post-content">${post.content}</p>
              <small>By ${post.author.username}</small><br>
              <small>👍 ${post.likes_count}</small>

              ${isAuthor ? `
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${post.id}">Edit</button>
                  <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${post.id}">Delete</button>
                </div>
              ` : ''}

              <div class="mt-3">
                <input type="text" class="form-control comment-input" data-post-id="${post.id}" placeholder="Add a comment">
                <button class="btn btn-sm btn-primary mt-2 comment-btn" data-post-id="${post.id}">Comment</button>
                <ul class="comment-list mt-2" id="comments-${post.id}"></ul>
              </div>
            </div>
          </div>
        `;
        postList.appendChild(card);

        // Load comments for each post
        loadComments(post.id);
      });

      // 🔄 Setup Edit/Delete Listeners
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEditPost);
      });

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeletePost);
      });
    });
}

async function handleEditPost(e) {
  const postId = e.target.dataset.id;
  const card = e.target.closest('.card-body');
  const titleEl = card.querySelector('.post-title');
  const contentEl = card.querySelector('.post-content');

  const newTitle = prompt('Edit Title:', titleEl.textContent);
  const newContent = prompt('Edit Content:', contentEl.textContent);

  if (!newTitle || !newContent) return;

  const token = localStorage.getItem('token');

  const response = await fetch(`/api/posts/${postId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token
    },
    body: JSON.stringify({ title: newTitle, content: newContent })
  });

  if (response.ok) {
    loadPosts();
  } else {
    alert('❌ Failed to update post');
  }
}

async function handleDeletePost(e) {
  const postId = e.target.dataset.id;
  const confirmDelete = confirm('Are you sure you want to delete this post?');

  if (!confirmDelete) return;

  const token = localStorage.getItem('token');

  const response = await fetch(`/api/posts/${postId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Token ' + token
    }
  });

  if (response.ok) {
    loadPosts();
  } else {
    alert('❌ Failed to delete post');
  }
}


// 🔁 Load comments for a specific post
async function loadComments(postId) {
  try {
    const res = await fetch(`/api/posts/${postId}/comments/`);
    const data = await res.json();

    const commentList = document.getElementById(`comments-${postId}`);
    commentList.innerHTML = '';

    data.forEach(comment => {
      const li = document.createElement('li');
      li.textContent = `${comment.author.username}: ${comment.text}`;
      commentList.appendChild(li);
    });
  } catch (err) {
    console.error(`❌ Failed to load comments for post ${postId}`, err);
  }
}

// ✅ Run after DOM fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('post-form');
  const postMessage = document.getElementById('post-message');

  // Load all posts on page load
  loadPosts();

  // 📝 Handle post creation
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

  // 💬 Handle comment submission
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('comment-btn')) {
      const postId = e.target.dataset.postId;
      const input = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
      const text = input.value.trim();
      const token = localStorage.getItem('token');

      if (!text) return;

      if (!token) {
        alert('Login required to comment.');
        return;
      }

      try {
        const res = await fetch(`/api/posts/${postId}/comments/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
          },
          body: JSON.stringify({ text })
        });

        if (res.ok) {
          input.value = '';
          loadComments(postId);
        } else {
          alert('❌ Failed to post comment.');
        }
      } catch (err) {
        alert('❌ Network error.');
      }
    }
  });
});
