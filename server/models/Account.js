const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
  },
  credit: {
    type: String,
  },
  code: {
    type: String,
  },
  money: {
    type: Number,
    min: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique.
  username: doc.username,
  _id: doc._id,
  name: doc.name,
  email: doc.email,
  address: doc.address,
  credit: doc.credit,
  code: doc.code,
  money: doc.code,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

AccountSchema.statics.authenticate = (username, password, callback) => {
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

AccountSchema.statics.replacePass = (account, callback) => {
  const query = { username: account.username };
  const update = {
    $set: {
      salt: account.salt,
      password: account.password,
    },
  };
  const options = { upsert: false };
  AccountModel.updateOne(query, update, options).exec(callback);
};

AccountSchema.statics.setName = (account, callback) => {
  const query = { username: account.username };
  const update = {
    $set: {
      name: account.name,
    },
  };
  const options = { upsert: false };
  AccountModel.updateOne(query, update, options).exec(callback);
};

AccountSchema.statics.setEmail = (account, callback) => {
  const query = { username: account.username };
  const update = {
    $set: {
      email: account.email,
    },
  };
  const options = { upsert: false };
  AccountModel.updateOne(query, update, options).exec(callback);
};

AccountSchema.statics.setAddress = (account, callback) => {
  const query = { username: account.username };
  const update = {
    $set: {
      address: account.address,
    },
  };
  const options = { upsert: false };
  AccountModel.updateOne(query, update, options).exec(callback);
};

AccountSchema.statics.setCard = (account, callback) => {
  const query = { username: account.username };
  const update = {
    $set: {
      card: account.card,
    },
  };
  const options = { upsert: false };
  AccountModel.updateOne(query, update, options).exec(callback);
};

AccountSchema.statics.setCode = (account, callback) => {
  const query = { username: account.username };
  const update = {
    $set: {
      code: account.code,
    },
  };
  const options = { upsert: false };
  AccountModel.updateOne(query, update, options).exec(callback);
};

AccountSchema.statics.setMoney = (account, callback) => {
  const query = { username: account.username };
  const update = {
    $set: {
      money: account.money,
    },
  };
  const options = { upsert: false };
  AccountModel.updateOne(query, update, options).exec(callback);
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
