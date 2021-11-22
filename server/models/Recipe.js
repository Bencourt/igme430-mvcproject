const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let RecipeModel = {};

// convert string id to mogo id
const converId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const RecipeMakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

RecipeMakerSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

RecipeMakerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: converId(ownerId),
  };

  return RecipeModel.find(search).select('name age').lean().exec(callback);
};

RecipeModel = mongoose.model('Recipe', RecipeMakerSchema);

module.exports.RecipeModel = RecipeModel;
module.exports.RecipeSchema = RecipeMakerSchema;
