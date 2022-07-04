import encrypt from '../encrypt.js';
import User from '../entities/User.js';

export default (app, state) => {
  // app.use(morgan('combined'));
  const validateUserData = ({ nickname, password }) => {
    const errors = {};
    if (!nickname) {
      errors.nickname = "Can't be empty";
    }

    const isNicknameTaken = state.users.find((user) => user.nickname === nickname);
    if (isNicknameTaken) {
      errors.nickname = 'Nickname is already taken';
    }

    if (!password) {
      errors.password = "Can't be empty";
    }

    return errors;
  };

  // BEGIN (write your solution here)
  // session controller
  app.get(('/session/new'), (req, res) => {
    const { nickname } = req.body;
    res.render('session/new', { errors: {}, form: { nickname } });
  });

  app.post('/session', (req, res) => {
    const { nickname: name = '', password: pass = '' } = req.body;
    const nickname = name.trim();
    const password = pass.trim();
    const user = state.users.find((user) => user.nickname === nickname);
    if (user && (encrypt(password)) === user.passwordDigest) {
      req.session.nickname = nickname;
      res.flash('info', `Welcome, ${user.nickname}!`);
      res.redirect('/');
      return;
    }
    res.status(422);
    const errors = { loginFailed: 'Invalid nickname or password' };
    res.render('session/new', { errors, form: { nickname } });
  });

  app.delete('/session', (req, res) => {
    delete req.session.nickname;
    res.flash('info', `Good bye, ${res.locals.currentUser.nickname}!`);
    res.redirect('/');
  });

  // user controller
  app.get('/users/new', (_req, res) => {
    res.render('users/new', { form: {}, errors: {} });
  });

  app.post('/users', (req, res) => {
    const nickname = req.body.nickname.trim();
    const password = req.body.password.trim();
    const errors = validateUserData({ nickname, password });

    if (Object.keys(errors).length > 0) { 
      res.status(422);
      res.render('users/new', { errors, form: { nickname, password } });
      return;
    }

    const user = new User(nickname, encrypt(password));
    state.users = [...state.users, user];
    res.flash('info', `Welcome, ${user.nickname}! Your account has been created.`);
    res.redirect('/');
  });

  // END
};
