// import the models
const models = require('../models');

const { Recipe } = models;

// on request, render the maker page
const makerPage = (req, res) => {
  Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), recipes: docs });
  });
};

// on request, check if all the inputs are valid and create a new recipe from the recipe data
const makeRecipe = (req, res) => {
  if (!req.body.ingInput || !req.body.instInput || !req.body.recTitle) {
    return res.status(400).json({ error: 'All three fields are required' });
  }

  const recipeData = {
    title: req.body.recTitle,
    ingredients: req.body.ingInput,
    instructions: req.body.instInput,
    owner: req.session.account._id,
  };

  const newRecipe = new Recipe.RecipeModel(recipeData);

  const recipePromise = newRecipe.save();

  recipePromise.then(() => res.json({ redirect: '/maker' }));

  recipePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Recipe already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return recipePromise;
};

// on request, get the recipes for the account fron the database
const getRecipes = (request, response) => {
  const req = request;
  const res = response;

  return Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ recipes: docs });
  });
};

// expose the endpoints
module.exports.makerPage = makerPage;
module.exports.getRecipes = getRecipes;
module.exports.make = makeRecipe;
