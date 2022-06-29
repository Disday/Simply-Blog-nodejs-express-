import Express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import parse from './parse.js';


import Post from './entities/Post.js';

export default () => {
  const app = new Express();
  app.set('view engine', 'pug');
  app.use('/assets', Express.static('./node_modules'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  // app.use(parse);

  let posts = [
    new Post('hello', 'how are you?'),
    new Post('nodejs', 'story about nodejs'),
  ];

  const validatePostData = ({ title, body }) => {
    const errors = {};
    if (!title) {
      errors['titleError'] = "Can't be empty";
    }
    if (!body) {
      errors['bodyError'] = "Can't be empty";
    }
    return errors;
  };

  const getPostById = (id) => {
    return posts.find((post) => Number(id) === post.id)
  };

  app.get('/', (req, res) => {
    res.render('index');
  });

  // BEGIN (write your solution here)
  app.get('/posts', (req, res) => {
    res.render('posts/index', { posts });
  });

  app.post('/posts', (req, res) => {
    const { title, body } = req.body;
    const errors = validatePostData({ title, body });

    if (Object.keys(errors).length > 0) {
      res.status(422);
      res.render('posts/new', { errors, post: { title, body } });
      return;
    }

    const newPost = new Post(title, body);
    posts.push(newPost);
    res.redirect(`/posts/${newPost.id}`);
  });

  app.get('/posts/new', (req, res) => {
    res.render('posts/new', { post: {}, errors: {} });
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
    console.log(post);

    res.render('posts/edit', { post, errors: {} });
  });

  app.patch('/posts/:id', (req, res) => {
    const { title, body } = req.body;
    const { id } = req.params;
    const newPost = { title, body, id };
    const errors = validatePostData(newPost);

    if (Object.keys(errors).length > 0) {
      res.status(422);
      res.render('posts/edit', { errors, post: newPost });
      return;
    }

    const post = getPostById(id);
    post.title = title;
    post.body = body;
    res.redirect(`/posts/${id}`);
  });

  app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    const filtredPosts = posts.filter((post) => post.id !== Number(id));
    // console.log(filtredPosts);
    posts = filtredPosts;

    res.redirect('/posts');
  });

  
  app.use((res, _req, next) => {
    // console.log('normal');
    // next(new Error());
    res.status(404);
    res.render('404');
  });

  app.use((error, req, res, next) => {
    // console.log('error!!!');
    res.status(404);
    res.render('404');
  });
  
  // END

  return app;
};
