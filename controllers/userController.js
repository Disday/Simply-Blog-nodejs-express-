import session from 'express-session';
import encrypt from '../encrypt.js';
// import morgan from 'morgan';
import Guest from '../entities/Guest.js';
import User from '../entities/User.js';

const validateUserData = ({ nickname, password }, users) => {
  const errors = {};
  if (!nickname) {
    errors.nickname = "Can't be empty";
  }

  const isNicknameTaken = users.find((user) => user.nickname === nickname);
  if (isNicknameTaken) {
    errors.nickname = "Nickname is already taken";
  }

  if (!password) {
    errors.password = "Can't be empty";
  }

  return errors;
};

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
  app.get('/users/new', (_req, res) => {
    res.render('users/new', { form: {}, errors: {} });
  });

  app.post('/users', (req, res) => {
    const { nickname, password } = req.body;
    const errors = validateUserData({ nickname, password }, users);

    if (Object.keys(errors).length > 0) {
      res.status(422);
      res.render('users/new', { errors, form: { nickname, password } });
      return;
    }

    const user = new User(nickname, encrypt(password));
    users = [...users, user];
    console.log(users);
    res.redirect('/');

  });
  // END
};
