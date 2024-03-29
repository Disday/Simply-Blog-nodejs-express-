import Express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
// import flash from 'connect-flash';
import encrypt from './encrypt.js';
import flash from './flash.js';

import User from './entities/User.js';
import Post from './entities/Post.js';
import Guest from './entities/Guest.js';
import registerPostController from './controllers/postController.js';
import registerUserController from './controllers/userController.js';

export default () => {
  // app init state
  const state = {
    posts: [
      new Post('hello', 'how are you?', 'admin'),
      new Post('nodejs', 'story about nodejs', 'admin'),
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
  app.use((res, req, next) => {
    res.status(404);
    res.render('404');
    next();
  });

  app.use((error, req, res, next) => {
    res.status(404);
    res.render('404');
  });

  return app;
};
