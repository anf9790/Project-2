const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let NFTModel = {};

// mongoose.Types.ObjectID is a function that
//  converts string ID's to real mongo ID's.
const convertId = mongoose.Types.ObjectId;
const setColor = (color) => _.escape(color).trim();

const NFTSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    trim: true,
    set: setColor,
  },

  idNum: {
    type: Number,
    min: 1,
    required: true,
  },

  value: {
    type: Number,
    min: 1,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    defualt: Date.now,
  },
});

NFTSchema.statics.toAPI = (doc) => ({
  color: doc.color,
  idNum: doc.idNum,
  value: doc.value,
});

NFTSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return NFTModel.find(search).select('color idNum value').lean().exec(callback);
};

NFTSchema.statics.removeNFT = (NFTId, callback) => {
  const search = {
    _id: convertId(NFTId),
  };

  return NFTModel.findByIdAndDelete(search).exec(callback);
};

NFTModel = mongoose.model('NFT', NFTSchema);

module.exports.NFTModel = NFTModel;
module.exports.NFTSchema = NFTSchema;
