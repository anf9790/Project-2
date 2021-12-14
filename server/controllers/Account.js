const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  username = `${req.body.username}`;
  password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required, bub' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password, bub.' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // Cast strings to cover up some security flaws.
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Hey bub, all the fields are required.' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Those passwords don\'t match, bub. Are you one of those "write-clickers"' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      name: '',
      email: '',
      address: '',
      credit: '',
      code: '',
      money: 0,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Some already has that username, bub, and clearly you ain\'t them.' });
      }

      return res.status(400).json({ error: 'Some sort of error occurred, bub.' });
    });
  });
};

// Changing the password
const changePassword = (request, response) => {
  const req = request;
  const res = response;
  // Cast to strings to cover up some security flaws
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Check if all fields aren't filled out.
  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required, bub.' });
  }

  // Check if passwords are the same.
  if (req.body.pass === req.body.pass2) {
    return res.status(400).json({ error: 'They have to be different passwords, bub.' });
  }

  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'That\'s not the right password, bub.' });
      }

      return Account.AccountModel.generateHash(req.body.pass2, (salt, hash) => {
        const accountData = {
          username: req.session.account.username,
          salt,
          password: hash,
          name: '',
          email: '',
          address: '',
          credit: '',
          code: '',
          money: 0,
        };

        return Account.AccountModel.replacePass(accountData, (errr, docs) => {
          if (errr) {
            console.log(err);
            return res.status(400).json({ error: 'Something went wrong, bub.' });
          }
          return res.json({ redirect: '/logout' });
        });
      });
    });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
