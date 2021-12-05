const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Name and age are required' });
  }

  // Domoness will default to 1 unless something else is input.
  let domonessVar;
  if (!req.body.domoness) { domonessVar = 1; } else { domonessVar = req.body.domoness; }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    domoness: domonessVar,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};


const releaseDomo = (request, response) => {
  const req = request;
  const res = response;

  console.log(req.body);

  return Domo.DomoModel.removeDomo(req.body.domoId, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured, your domo is FREAKING out!' });
    }
    return res.json({ redirect: '/maker' });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.releaseDomo = releaseDomo;
