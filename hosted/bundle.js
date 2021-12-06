"use strict";

//handle the recipe POST request
var handleRecipe = function handleRecipe(e) {
  e.preventDefault();
  $("#recipeMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function () {
    loadRecipesFromServer();
  });
  return false;
}; //react form for the recipe


var RecipeForm = function RecipeForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "recipeForm",
    onSubmit: handleRecipe,
    name: "recipeForm",
    action: "/maker",
    method: "POST",
    className: "recipeForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "recTitle"
  }, "Recipe Title: "), /*#__PURE__*/React.createElement("input", {
    id: "recipeTitle",
    type: "text",
    name: "recTitle",
    placeholder: "title"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "ingInput"
  }, "Ingredients: "), /*#__PURE__*/React.createElement("input", {
    id: "ingredientInput",
    type: "text",
    name: "ingInput",
    placeholder: "Ingredients"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "instInput"
  }, "Instructions:"), /*#__PURE__*/React.createElement("input", {
    id: "instructionInput",
    type: "text",
    name: "instInput",
    placeholder: "Instructions"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeRecipeSubmit",
    type: "submit",
    value: "Make Recipe"
  }));
}; //creates the react elements for the recipe list


var RecipeList = function RecipeList(props) {
  if (props.recipes.length == 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "recipeList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyRecipe"
    }, "No Recipes yet"));
  }

  var recipeNodes = props.recipes.map(function (recipe) {
    return /*#__PURE__*/React.createElement("div", {
      key: recipe._id,
      className: "recipe"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "recipeTitle"
    }, "Title: ", recipe.title, " "), /*#__PURE__*/React.createElement("h3", {
      className: "recipeIngredients"
    }, "Ingredients: ", recipe.ingredients, " "), /*#__PURE__*/React.createElement("h3", {
      className: "recipeInstructions"
    }, "Instructions: ", recipe.instructions));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "recipeList"
  }, recipeNodes);
}; //react element for placeholder advertisement elements


var Advertisement = function Advertisement(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "advertisement"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "advertText"
  }, "This is an advertisement placeholder"));
}; //calls the GET request to load the recipes from the server


var loadRecipesFromServer = function loadRecipesFromServer() {
  sendAjax('GET', '/getRecipes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: data.recipes
    }), document.querySelector("#recipes"));
  });
}; //setup function renders the react elements and loads the recipes from the server


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeForm, {
    csrf: csrf
  }), document.querySelector("#makeRecipe"));
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
    recipes: []
  }), document.querySelector("#recipes"));
  ReactDOM.render( /*#__PURE__*/React.createElement(Advertisement, null), document.querySelector("#adSpace"));
  loadRecipesFromServer();
}; //gets the token


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

//error handler helper function
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#recipeMessage").animate({
    width: 'toggle'
  }, 350);
}; //redirect helper function


var redirect = function redirect(response) {
  $("#recipeMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
}; //send AJAX helper function


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
