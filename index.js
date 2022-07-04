import Express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import encrypt from './encrypt.js';
import User from './entities/User.js';
import Post from './entities/Post.js';
import Guest from './entities/Guest.js';
import registerPostController from './controllers/postController.js';
import registerUserController from './controllers/userController.js';
import flash from './flash.js';
// import flash from 'flash';

export default () => {
  // app init state
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
  // app.use('/public', Express.static('./public'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
  }));
  app.use((req, res, next) => {
    if (req.session?.nickname) {
      const { nickname } = req.session;
      const user = state.users.find((u) => u.nickname === nickname);
      // console.log(nickname, state.users, user);
      res.locals.currentUser = user;
    } else {
      res.locals.currentUser = new Guest();
    }
    next();
  });
  app.use(flash());

  // controllers
  registerUserController(app, state);
  registerPostController(app, state);

  app.get('/', (req, res) => {
    res.render('index');
  });

  // error handle middlewares
  app.use((res, req) => {
    res.status(404);
    res.render('404');
  });

  app.use((error, req, res) => {
    // console.log(error);
    res.status(404);
    res.render('404');
  });

  return app;
};
