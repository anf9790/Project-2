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
  const color = "#" + Math.floor(Math.random()*16777215).toString(16);
  const idNum = Math.floor(Math.random()*1000000);
  const value = Math.round(((Math.random()*10) + Number.EPSILON) * 100) / 100;

  const NFTData = {
    color: color,
    idNum: idNum,
    value: value,
    owner: req.session.account._id,
  };

  const newNFT = new NFT.NFTModel(NFTData);

  const NFTPromise = newNFT.save();

  NFTPromise.then(() => res.json({ redirect: '/maker' }));

  NFTPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An NFT like that already exists...' });
    }

    return res.status(400).json({ error: 'Woah, slow down there bub, gimme a sec.' });
  });

  return NFTPromise;
};

const getNFTs = (request, response) => {
  const req = request;
  const res = response;

  return NFT.NFTModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Some sort of error occurred, bub.' });
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
      return res.status(400).json({ error: 'Some sort of error occurred, bub.' });
    }
    return res.json({ redirect: '/maker' });
  });
};


module.exports.makerPage = makerPage;
module.exports.getNFTs = getNFTs;
module.exports.deleteNFT = deleteNFT;
module.exports.make = makeNFT;
module.exports.collection = getNFTs;
