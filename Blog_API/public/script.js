const apiUrl = 'http://localhost:3000';

async function fetchPosts() {
  const sortBy = document.getElementById('sortBy').value;
  const author = document.getElementById('filterAuthor').value;

  const queryParams = new URLSearchParams();
  if (sortBy) {
    queryParams.append('sortBy', sortBy);
  }
  if (author) {
    queryParams.append('author', author);
  }

  const response = await fetch(`${apiUrl}/posts?${queryParams.toString()}`);
  const posts = await response.json();

  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';

  posts.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
  
    const idElement = document.createElement('p');
    idElement.textContent = `Post ID: ${post.id}`;
    postElement.appendChild(idElement);
  
    const titleElement = document.createElement('h3');
    titleElement.textContent = post.title;
    postElement.appendChild(titleElement);
  
    const contentElement = document.createElement('p');
    contentElement.textContent = post.content;
    postElement.appendChild(contentElement);
  
    const dateElement = document.createElement('p');
    dateElement.textContent = `Publication Date: ${post.publicationDate}`;
    postElement.appendChild(dateElement);
  
    const authorElement = document.createElement('p');
    authorElement.textContent = `Author: ${post.author}`;
    authorElement.classList.add('author');
    postElement.appendChild(authorElement);
  
    postsContainer.appendChild(postElement);
  });
}

async function createPost(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const postData = {
    title: formData.get('title'),
    content: formData.get('content'),
    publicationDate: formData.get('publicationDate'),
    author: formData.get('author'),
  };

  const response = await fetch(`${apiUrl}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (response.ok) {
    form.reset();
    await fetchPosts();
  } else {
    const errorData = await response.json();
    alert(errorData.error);
  }
}

async function updatePost(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const postId = formData.get('updatePostId');
  const postData = {
    title: formData.get('updateTitle'),
    content: formData.get('updateContent'),
    publicationDate: formData.get('updatePublicationDate'),
    author: formData.get('updateAuthor'),
  };

  const response = await fetch(`${apiUrl}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (response.ok) {
    await fetchPosts();
  } else {
    const errorData = await response.json();
    alert(errorData.error);
  }
}

async function deletePost(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const postId = formData.get('deletePostId');

  const response = await fetch(`${apiUrl}/posts/${postId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    await fetchPosts();
  } else {
    const errorData = await response.json();
    alert(errorData.error);
  }
}

document.getElementById('createPostForm').addEventListener('submit', createPost);
document.getElementById('updatePostForm').addEventListener('submit', updatePost);
document.getElementById('deletePostForm').addEventListener('submit', deletePost);
document.getElementById('sortBy').addEventListener('change', fetchPosts);
document.getElementById('filterAuthor').addEventListener('input', fetchPosts);

fetchPosts();