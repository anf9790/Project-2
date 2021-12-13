const models = require('../models');

const { NFT } = models;

const makerPage = (req, res) => {
  NFT.NFTModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), NFTs: docs });
  });
};

const makeNFT = (req, res) => {
  if (!req.body.color || !req.body.idNum || !req.body.value) {
    return res.status(400).json({ error: 'RAWR! Color, idNum and value are required' });
  }

  const NFTData = {
    color: req.body.color,
    idNum: req.body.idNum,
    value: req.body.value,
    owner: req.session.account._id,
  };

  const newNFT = new NFT.NFTModel(NFTData);

  const NFTPromise = newNFT.save();

  NFTPromise.then(() => res.json({ redirect: '/maker' }));

  NFTPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'NFT already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return NFTPromise;
};

const getNFTs = (request, response) => {
  const req = request;
  const res = response;

  return NFT.NFTModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ NFTs: docs });
  });
};

const deleteNFT = (request, response) => {
  const req = request;
  const res = response;

  console.log(req.body);

  return NFT.NFTModel.removeNFT(req.body.NFTId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ redirect: '/maker' });
  });
};

module.exports.makerPage = makerPage;
module.exports.getNFTs = getNFTs;
module.exports.deleteNFT = deleteNFT;
module.exports.make = makeNFT;
