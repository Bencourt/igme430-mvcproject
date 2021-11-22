"use strict";

var handleRecipe = function handleRecipe(e) {
  e.preventDefault();
  $("#recipeMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#ingredientInput").val() == '' || $("#instructionInput").val() == '') {
    handleError("Rawr: all fields are required");
    return false;
  }

  sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function () {
    loadRecipesFromServer();
  });
  return false;
};

var addIngredient = function addIngredient(e) {
  document.querySelector("#ingredients").innerHTML += "<li>".concat(document.querySelector("#ingredientInput").value, "</li>");
  document.querySelector("#ingredientInput").value = "";
};

var addInstruction = function addInstruction(e) {
  document.querySelector("#instructions").innerHTML += "<li>".concat(document.querySelector("#instructionInput").value, "</li>");
  document.querySelector("#instructionInput").value = "";
};

var RecipeForm = function RecipeForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "recipeForm",
    onSubmit: handleRecipe,
    name: "recipeForm",
    action: "/maker",
    method: "POST",
    className: "recipeForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "ingInput"
  }, "Ingredient: "), /*#__PURE__*/React.createElement("ul", {
    className: "ingredients"
  }), /*#__PURE__*/React.createElement("input", {
    id: "ingredientInput",
    type: "text",
    name: "ingInput",
    placeholder: "Ingredient"
  }), /*#__PURE__*/React.createElement("input", {
    className: "addIngredient",
    type: "button",
    onClick: addIngredient,
    value: "Add Ingredient"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "instInput"
  }, "Instruction:"), /*#__PURE__*/React.createElement("ul", {
    className: "instructions"
  }), /*#__PURE__*/React.createElement("input", {
    id: "instructionInput",
    type: "text",
    name: "instInput",
    placeholder: "Instruction"
  }), /*#__PURE__*/React.createElement("input", {
    className: "addInstruction",
    type: "button",
    onClick: addInstruction,
    value: "Add Instruction"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeRecipeSubmit",
    type: "submit",
    value: "Make Recipe"
  }));
};

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
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/recipeface.jpeg",
      alt: "recipe face",
      className: "recipeFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "recipeName"
    }, "Name: ", recipe.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "recipeAge"
    }, "Age: ", recipe.age, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "recipeList"
  }, recipeNodes);
};

var loadRecipesFromServer = function loadRecipesFromServer() {
  sendAjax('GET', '/getRecipes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: data.recipes
    }), document.querySelector("#recipes"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeForm, {
    csrf: csrf
  }), document.querySelector("#makeRecipe"));
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
    recipes: []
  }), document.querySelector("#recipes"));
  loadRecipesFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#recipeMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#recipeMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

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
