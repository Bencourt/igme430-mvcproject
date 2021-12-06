const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let RecipeModel = {};

// convert string id to mogo id
const converId = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();
const setIngredients = (ingredients) => _.escape(ingredients).trim();
const setInstructions = (instructions) => _.escape(instructions).trim();

//create a new schema for the recipes that contains information about the recipe title, ingredients, instructions, and account info
const RecipeMakerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },

  ingredients: {
    type: String,
    required: true,
    trim: true,
    set: setIngredients,
  },

  instructions: {
    type: String,
    required: true,
    trim: true,
    set: setInstructions,
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
  title: doc.title,
  ingredients: doc.ingredients,
  instructions: doc.instructions,
  createdData: doc.createdData,
});

//search the collection for recipes created by the account owner
RecipeMakerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: converId(ownerId),
  };

  return RecipeModel.find(search).select('title ingredients instructions').lean().exec(callback);
};

RecipeModel = mongoose.model('Recipe', RecipeMakerSchema);
//expose the endpoints
module.exports.RecipeModel = RecipeModel;
module.exports.RecipeSchema = RecipeMakerSchema;
