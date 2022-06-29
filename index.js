import Express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import encrypt from './encrypt.js';
import User from './entities/User.js';
import Post from './entities/Post.js';
import registerPostController from './controllers/postController.js';
import registerUserController from './controllers/userController.js';
// import Guest from './entities/Guest.js';

export default () => {
  //app init state
  const state = {
    posts: [
      new Post('hello', 'how are you?'),
      new Post('nodejs', 'story about nodejs'),
    ],
    users: [new User('admin', encrypt('qwerty'))],
  };

  // app creating
  const app = new Express();
  app.set('view engine', 'pug');
  app.use('/assets', Express.static('./node_modules'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));

  registerPostController(app, state.posts);
  registerUserController(app, state.users);

  app.use((res, _req, next) => {
    // console.log(res);
    res.status(404);
    res.render('404');
    // next(error);
  });

  app.use((error, req, res, next) => {
    console.log(error);
    res.status(404);
    res.render('404');
  });

  return app;
};
