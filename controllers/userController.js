import encrypt from '../encrypt.js';
// import morgan from 'morgan';
import Guest from '../entities/Guest.js';
import User from '../entities/User.js';

export default (app, users) => {
  // app.use(morgan('combined'));
  const validateUserData = ({ nickname, password }) => {
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

  // BEGIN (write your solution here)
  //session controller
  app.use((req, res, next) => {
    if (req.session?.nickname) {
      const { nickname } = req.session;
      res.locals.currentUser = users.find((user) => user.nickname === nickname);
    } else {
      res.locals.currentUser = new Guest();
    }
    // console.log(users, req.session.nickname);
    next();
  });

  app.get(('/session/new'), (req, res) => {
    const { nickname } = req.body;
    res.render('session/new', { errors: {}, form: { nickname } });
  });

  app.post('/session', (req, res) => {
    const password = req.body.password;
    const nickname = req.body.nickname.trim();
    const user = users.find((user) => user.nickname === nickname);
    // console.log(users);
    if (user && (encrypt(password)) === user.passwordDigest) {
      req.session.nickname = nickname;
      res.redirect('/');
      return;
    }
    res.status(422);
    const errors = { loginFailed: 'Invalid nickname or password' };
    res.render('session/new', { errors, form: { nickname } });
  });

  app.delete('/session', (req, res) => {
    req.session.destroy((error) => {
      console.log('Error during delete session', error);
    })
    res.redirect('/');
  });

  //user controller
  app.get('/users/new', (_req, res) => {
    res.render('users/new', { form: {}, errors: {} });
  });

    app.post('/users', (req, res) => {
    const password = req.body.password;
    const nickname = req.body.nickname.trim();
    const errors = validateUserData({ nickname, password });

    if (Object.keys(errors).length > 0) {
      res.status(422);
      res.render('users/new', { errors, form: { nickname, password } });
      return;
    }

    const user = new User(nickname, encrypt(password));
    users = [...users, user];
    res.redirect('/');

  });


  // END
};
