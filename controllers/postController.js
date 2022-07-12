import Post from '../entities/Post.js';

export default (app, state) => {
  const validatePostData = ({ title, body }) => {
    const errors = {};
    if (!title) {
      errors.titleError = "Can't be empty";
    }
    if (!body) {
      errors.bodyError = "Can't be empty";
    }
    return errors;
  };

  const getPostById = (id) => state.posts.find((post) => Number(id) === post.id);

  app.get('/posts', (req, res) => {
    res.render('posts/index', { posts: state.posts });
  });

  app.post('/posts', (req, res) => {
    const { title, body } = req.body;
    const errors = validatePostData({ title, body });

    if (Object.keys(errors).length > 0) {
      res.status(422);
      res.render('posts/new', { errors, post: { title, body } });
      return;
    }

    const { currentUser } = res.locals;
    if (currentUser.isGuest()) {
      res.status(403);
      res.flash('info', 'Please, sign in for creating post.');
      res.redirect('/');
      return;
    }

    const { nickname } = currentUser;
    const newPost = new Post(title, body, nickname);
    state.posts = [...state.posts, newPost];
    res.redirect(`/posts/${newPost.id}`);
  });

  app.get('/posts/new', (req, res) => {
    const { currentUser } = res.locals;
    if (!currentUser.isGuest()) {
      res.render('posts/new', { post: {}, errors: {} });
      return;
    }

    res.status(403);
    res.flash('info', 'Please, sign in for creating post.');
    res.redirect('/');
  });

  app.get('/posts/:id', (req, res, next) => {
    const { id } = req.params;
    const post = getPostById(id);
    if (!post) {
      next(new Error());
      return;
    }
    res.render('posts/show', { post });
  });

  app.get('/posts/:id/edit', (req, res) => {
    const { id } = req.params;
    const post = getPostById(id);
    const { currentUser } = res.locals;
    if (currentUser.isAuthorOf(post)) {
      res.render('posts/edit', { post, errors: {} });
      return;
    }

    res.flash('info', "You don't have permission for this action");
    res.redirect('/posts');
  });

  app.patch('/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = getPostById(id);
    const { currentUser } = res.locals;
    if (!currentUser.isAuthorOf(post)) {
      res.flash('info', "You don't have permission for this action");
      res.redirect('/posts');
      return;
    }

    const { title, body } = req.body;
    const newPost = { title, body, id };
    const errors = validatePostData(newPost);
    if (Object.keys(errors).length > 0) {
      res.status(422);
      res.render('posts/edit', { errors, post: newPost });
      return;
    }

    post.title = title;
    post.body = body;
    res.redirect(`/posts/${id}`);
  });

  app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = getPostById(id);
    const { currentUser } = res.locals;
    if (currentUser.isAuthorOf(post)) {
      const filtredPosts = state.posts.filter((p) => p.id !== Number(id));
      state.posts = filtredPosts;
      res.redirect('/posts');
      return;
    }

    res.flash('info', "You don't have permission for this action");
    res.redirect('/posts');
  });
};
