// import models
const models = require('../models');

const { Account } = models;

// on request, render the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// on logout, send to login page and end the session
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// on login request, check if the username and password are valid and login
const login = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// Change password is having difficulties.
// on request, check if the username and password is a valid user,
// check if the new password is new, and update the password for the user
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // check if the username and passwords exist
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  // check if the new password is new
  if (req.body.pass === req.body.pass2) {
    return res.status(400).json({ error: 'new password cannot be old password' });
  }

  // generate a new hash for the new password
  return Account.AccountModel.generateHash(req.body.pass2, (salt) => {
    // create a new account variable
    let newAccount;

    // get the account by username
    return Account.AccountModel.findByUsername(req.body.username, (err, doc) => {
      if (err) {
        return res.status(400).json({ error: 'error finding user' });
      }

      if (!doc) {
        return res.status(400).json({ error: 'user does not exist' });
      }

      // set the new account to the retreived account and update the password and salt
      newAccount = doc;
      newAccount.salt = salt;
      newAccount.password = req.body.pass2;
      // call the update function to change the doc document to the new account information
      // this is where I think the error in updating the password comes from
      const updatePromise = Account.AccountModel.update(doc, newAccount);

      updatePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(newAccount);
        return res.json({ redirect: '/maker' });
      });

      updatePromise.catch((erro) => {
        console.log(erro);
        return res.status(400).json({ error: 'An error occurred.' });
      });
      return false;
    });
  });
};

// on request, check the given username and passwords, and create a new account
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
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
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred.' });
    });
  });
};

// get token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// expose the enpoints
module.exports.loginPage = loginPage;
module.exports.signup = signup;
module.exports.logout = logout;
module.exports.login = login;
module.exports.changePassword = changePassword;
module.exports.getToken = getToken;
