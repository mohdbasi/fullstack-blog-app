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
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <h5>${post.title}</h5>
              <p>${post.content}</p>
              <small>By ${post.author.username}</small><br>

              <button class="btn btn-sm btn-outline-primary like-btn mt-2" data-post-id="${post.id}">
                👍 ${post.likes_count}
              </button>

              ${post.is_owner ? `
                <button class="btn btn-sm btn-warning mt-2 edit-post-btn" 
                        data-id="${post.id}" 
                        data-title="${encodeURIComponent(post.title)}" 
                        data-content="${encodeURIComponent(post.content)}">
                  ✏️ Edit
                </button>
                <button class="btn btn-sm btn-danger mt-2 delete-post-btn" data-id="${post.id}">
                  🗑️ Delete
                </button>
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
        loadComments(post.id);

        // ✏️ Edit handler - inline form
        card.querySelector('.edit-post-btn')?.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const title = decodeURIComponent(e.target.dataset.title);
          const content = decodeURIComponent(e.target.dataset.content);

          const existingForm = document.querySelector('.inline-edit-form');
          if (existingForm) existingForm.remove();

          const editForm = document.createElement('form');
          editForm.className = 'inline-edit-form mt-3';
          editForm.innerHTML = `
            <input type="text" class="form-control mb-2" name="title" value="${title}" required>
            <textarea class="form-control mb-2" name="content" rows="3" required>${content}</textarea>
            <button type="submit" class="btn btn-success btn-sm">Update</button>
            <button type="button" class="btn btn-secondary btn-sm cancel-edit">Cancel</button>
            <p class="edit-message mt-2 text-danger small"></p>
          `;

          const postBody = e.target.closest('.card-body');
          postBody.appendChild(editForm);

          // ❌ Cancel button
          editForm.querySelector('.cancel-edit').addEventListener('click', () => {
            editForm.remove();
          });

          // ✅ Submit updated post
          editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newTitle = editForm.querySelector('input[name="title"]').value.trim();
            const newContent = editForm.querySelector('textarea[name="content"]').value.trim();
            const token = localStorage.getItem('token');

            try {
              const res = await fetch(`/api/posts/${id}/`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Token ' + token
                },
                body: JSON.stringify({ title: newTitle, content: newContent })
              });

              if (res.ok) {
                loadPosts(); // Refresh UI
              } else {
                const data = await res.json();
                editForm.querySelector('.edit-message').textContent = '❌ ' + (data.detail || 'Update failed');
              }
            } catch (err) {
              editForm.querySelector('.edit-message').textContent = '❌ Network error';
            }
          });
        });

        // 🗑️ Delete handler
        card.querySelector('.delete-post-btn')?.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const confirmed = confirm('Are you sure you want to delete this post?');
          if (!confirmed) return;

          try {
            const res = await fetch(`/api/posts/${id}/`, {
              method: 'DELETE',
              headers: { 'Authorization': 'Token ' + token }
            });
            if (res.ok) loadPosts();
            else alert('❌ Could not delete post.');
          } catch (err) {
            alert('❌ Network error while deleting post.');
          }
        });
      });

      // 👍 Like button handling
      document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', async () => {
          const postId = button.getAttribute('data-post-id');
          if (!token) return alert('❌ You must be logged in to like posts.');

          try {
            const response = await fetch(`/api/posts/${postId}/like/`, {
              method: 'POST',
              headers: { 'Authorization': 'Token ' + token }
            });

            if (response.ok) loadPosts();
            else alert('❌ Failed to like/unlike the post.');
          } catch (err) {
            alert('❌ Network error');
          }
        });
      });
    });
}

// 🔁 Load comments for a post
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

// ✅ DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('post-form');
  const postMessage = document.getElementById('post-message');
  loadPosts();

  // 📝 Create post
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const token = localStorage.getItem('token');
    if (!token) return (postMessage.textContent = '❌ Login required');

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
        postForm.reset();
        loadPosts();
      } else {
        postMessage.textContent = '❌ ' + (data.detail || 'Error creating post');
      }
    } catch (err) {
      postMessage.textContent = '❌ Network error';
    }
  });

  // 💬 Comment submission
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('comment-btn')) {
      const postId = e.target.dataset.postId;
      const input = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
      const text = input.value.trim();
      const token = localStorage.getItem('token');
      if (!text) return;
      if (!token) return alert('Login required to comment.');

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
