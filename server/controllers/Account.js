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

  // Force cast to strings to cover some security flaws.
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Hey bub, all the fields are required.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'That\'s the wrong username and/or password, bub. I can\'t let you in.' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const collectionPage = (req, res) => {
  res.render('collection', { csrfToken: req.csrfToken() });
};

const infoPage = (req, res) => {
  res.render('collection', { csrfToken: req.csrfToken() });
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
    return res.status(400).json({ error: 'Those passwords don\'t match, bub. Are you one of those \"write-clickers\"' });
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

const update = (request, response) => {
  e.preventDefault();

  $("#NFTmessage").animate({ width: 'hide' }, 350);

  
  // If name is filled out...
  if (!$("#name").val() == '') {
    sendAjax($("#nameChangeForm").attr("action"), $("#nameChangeForm").serialize());
  }

  // If email is filled out...
  if (!$("#email").val() == '') {
    sendAjax($("#emailChangeForm").attr("action"), $("#emailChangeForm").serialize());
  }

  // If address is filled out...
  if (!$("#address").val() == '') {
    sendAjax($("#nameChangeForm").attr("action"), $("#addressChangeForm").serialize());
  }

  // If credit card is filled out...
  if (!$("#card").val() == '' || !$("#code").val() == '') {
    sendAjax($("#cardChangeForm").attr("action"), $("#cardChangeForm").serialize());
    sendAjax($("#codeChangeForm").attr("action"), $("#codeChangeForm").serialize());
  }

  // If password is filled out...
  if (!$("#pass").val() == '' && !$("#pass2").val() == '') {
    if ($("#pass").val() == $("#pass2").val()) {
      sendAjax($("#passwordChangeForm").attr("action"), $("#passwordChangeForm").serialize());
    }
    else {
      handleError("Those aren't the same password, bub.");
      return false;
    }
  }
  else {
    handleError("You need both, bub.");
      return false;
  }

  return false;
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
module.exports.collectionPage = collectionPage;
module.exports.infoPage = infoPage;
module.exports.update = update;
