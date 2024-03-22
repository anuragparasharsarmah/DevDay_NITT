const express = require('express');
const app = express();
const port = 3000;

// In-memory data store
let blogPosts = [];

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// GET /posts - Read all blog posts
app.get('/posts', (req, res) => {
  const { sortBy, author } = req.query;

  let sortedPosts = [...blogPosts];

  if (sortBy === 'publicationDate') {
    sortedPosts.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
  } else if (sortBy === 'author') {
    sortedPosts.sort((a, b) => a.author.localeCompare(b.author));
  }

  if (author) {
    sortedPosts = sortedPosts.filter((post) => post.author === author);
  }

  res.json(sortedPosts);
});

// GET /posts/:id - Read a specific blog post
app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = blogPosts.find((p) => p.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// POST /posts - Create a new blog post
app.post('/posts', (req, res) => {
  const { title, content, publicationDate, author } = req.body;

  if (!title || !content || !publicationDate || !author) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newPost = {
    id: blogPosts.length + 1,
    title,
    content,
    publicationDate,
    author,
  };

  blogPosts.push(newPost);
  res.status(201).json(newPost);
});

// PUT /posts/:id - Update a blog post
app.put('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content, publicationDate, author } = req.body;

  const postIndex = blogPosts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const updatedPost = {
    ...blogPosts[postIndex],
    title: title || blogPosts[postIndex].title,
    content: content || blogPosts[postIndex].content,
    publicationDate: publicationDate || blogPosts[postIndex].publicationDate,
    author: author || blogPosts[postIndex].author,
  };

  blogPosts[postIndex] = updatedPost;
  res.json(updatedPost);
});

// DELETE /posts/:id - Delete a blog post
app.delete('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = blogPosts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  blogPosts.splice(postIndex, 1);
  res.json({ message: 'Post deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});