import session from 'express-session';
// import morgan from 'morgan';
import Guest from '../entities/Guest.js';

export default (app, users) => {
  // app.use(morgan('combined'));
  app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
  }));

  app.use((req, res, next) => {
    if (req.session?.nickname) {
      const { nickname } = req.session;
      res.locals.currentUser = users.find((user) => user.nickname === nickname);
    } else {
      res.locals.currentUser = new Guest();
    }
    next();
  });

  app.get('/', (_req, res) => {
    res.render('index');
  });

  // BEGIN (write your solution here)

  // END
};
