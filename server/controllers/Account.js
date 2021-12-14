const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

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

const signup = (req, res) => {
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
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      credit: req.body.credit,
      code: req.body.code,
      money: req.body.money,
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
const changePassword = (req, res) => {
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
        };

        return Account.AccountModel.replacePass(accountData, (errr, docs) => {
          if (errr) {
            console.log(errr);
            return res.status(400).json({ error: 'Something went wrong, bub.' });
          }
          return res.json({ redirect: '/logout' });
        });
      });
    });
};

/// ///
const changeName = (req, res) => {
  req.body.name = `${req.body.name}`;

  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'An error has occured, bub.' });
      }

      const accountData = {
        username: req.session.account.username,
        name: req.body.name,
      };

      return Account.AccountModel.changeName(accountData, (errr, docs) => {
        if (errr) {
          console.log(errr);
          return res.status(400).json({ error: 'Something went wrong, bub.' });
        }
        return res.json({ redirect: '/logout' });
      });
    });
};

const changeEmail = (req, res) => {
  req.body.email = `${req.body.email}`;

  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'An error has occured, bub.' });
      }

      const accountData = {
        username: req.session.account.username,
        email: req.body.email,
      };

      return Account.AccountModel.changeName(accountData, (errr, docs) => {
        if (errr) {
          console.log(errr);
          return res.status(400).json({ error: 'Something went wrong, bub.' });
        }
        return res.json({ redirect: '/logout' });
      });
    });
};

const changeAddress = (req, res) => {
  req.body.address = `${req.body.address}`;

  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'An error has occured, bub.' });
      }

      const accountData = {
        username: req.session.account.username,
        address: req.body.address,
      };

      return Account.AccountModel.changeName(accountData, (errr, docs) => {
        if (errr) {
          console.log(errr);
          return res.status(400).json({ error: 'Something went wrong, bub.' });
        }
        return res.json({ redirect: '/logout' });
      });
    });
};

const changeCard = (req, res) => {
  req.body.card = `${req.body.card}`;

  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'An error has occured, bub.' });
      }

      const accountData = {
        username: req.session.account.username,
        card: req.body.card,
      };

      return Account.AccountModel.changeName(accountData, (errr, docs) => {
        if (errr) {
          console.log(errr);
          return res.status(400).json({ error: 'Something went wrong, bub.' });
        }
        return res.json({ redirect: '/logout' });
      });
    });
};

const changeCode = (req, res) => {
  req.body.code = `${req.body.code}`;

  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'An error has occured, bub.' });
      }

      const accountData = {
        username: req.session.account.username,
        code: req.body.code,
      };

      return Account.AccountModel.changeName(accountData, (errr, docs) => {
        if (errr) {
          console.log(errr);
          return res.status(400).json({ error: 'Something went wrong, bub.' });
        }
        return res.json({ redirect: '/logout' });
      });
    });
};

const changeMoney = (req, res) => {
  req.body.money = `${req.body.money}`;

  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'An error has occured, bub.' });
      }

      const accountData = {
        username: req.session.account.username,
        money: req.body.money,
      };

      return Account.AccountModel.changeName(accountData, (errr, docs) => {
        if (errr) {
          console.log(errr);
          return res.status(400).json({ error: 'Something went wrong, bub.' });
        }
        return res.json({ redirect: '/logout' });
      });
    });
};

const getToken = (req, res) => {
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
module.exports.changeName = changeName;
module.exports.changeEmail = changeEmail;
module.exports.changeAddress = changeAddress;
module.exports.changeCard = changeCard;
module.exports.changeCode = changeCode;
module.exports.changeMoney = changeMoney;
