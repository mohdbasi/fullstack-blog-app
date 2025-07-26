// 🔁 Load all posts and their comments
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

              <button class="btn btn-sm btn-outline-primary like-btn mt-2" data-post-id="${post.id}">
                👍 ${post.likes_count}
              </button>

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

      // 👍 Like button click handling
      document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', async () => {
          const postId = button.getAttribute('data-post-id');
          if (!token) {
            alert('❌ You must be logged in to like posts.');
            return;
          }

          try {
            const response = await fetch(`/api/posts/${postId}/like/`, {
              method: 'POST',
              headers: {
                'Authorization': 'Token ' + token
              }
            });

            if (response.ok) {
              loadPosts(); // 🔁 Refresh posts to update like count
            } else {
              alert('❌ Failed to like/unlike the post.');
            }
          } catch (err) {
            alert('❌ Network error');
          }
        });
      });
    });
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
