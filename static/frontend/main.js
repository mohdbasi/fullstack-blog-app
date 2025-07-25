fetch('/api/posts/')
  .then(res => res.json())
  .then(data => {
    const postList = document.getElementById('post-list');
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
