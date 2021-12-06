//handle the recipe POST request
const handleRecipe = (e) => {
    e.preventDefault();

    $("#recipeMessage").animate({width:'hide'},350);

    sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function() {
        loadRecipesFromServer();
    });

    return false;
};

//react form for the recipe
const RecipeForm = (props) => {
    return(
        <form id="recipeForm"
        onSubmit={handleRecipe}
        name="recipeForm"
        action="/maker"
        method="POST"
        className = "recipeForm"
        >
            <label htmlFor="recTitle">Recipe Title: </label>
            <input id="recipeTitle" type="text" name="recTitle" placeholder ="title"/>
            <label htmlFor="ingInput">Ingredients: </label>
            <input id="ingredientInput" type="text" name="ingInput" placeholder ="Ingredients"/>
            <label htmlFor="instInput">Instructions:</label>
            <input id="instructionInput" type="text" name="instInput" placeholder="Instructions"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeRecipeSubmit" type="submit" value="Make Recipe"/>
        </form>
    );
};

//creates the react elements for the recipe list
const RecipeList = function(props) {
    if(props.recipes.length == 0) {
        return(
            <div className="recipeList">
                <h3 className="emptyRecipe">No Recipes yet</h3>
            </div>
        );
    }

    const recipeNodes = props.recipes.map(function(recipe) {
        return (
            <div key={recipe._id} className="recipe">
                <h3 className="recipeTitle">Title: {recipe.title} </h3>
                <h3 className="recipeIngredients">Ingredients: {recipe.ingredients} </h3>
                <h3 className="recipeInstructions">Instructions: {recipe.instructions}</h3>
            </div>
        );
    });

    return(
        <div className="recipeList">
            {recipeNodes}
        </div>
    );
};

//react element for placeholder advertisement elements
const Advertisement = (props) => {
    return (
        <div className="advertisement">
            <h3 className="advertText">This is an advertisement placeholder</h3>
        </div>
    );
};

//calls the GET request to load the recipes from the server
const loadRecipesFromServer = () => {
    sendAjax('GET', '/getRecipes', null, (data) => {
        ReactDOM.render(
            <RecipeList recipes={data.recipes} />, document.querySelector("#recipes")
        );
    });
};

//setup function renders the react elements and loads the recipes from the server
const setup = function(csrf) {
    ReactDOM.render(
        <RecipeForm csrf={csrf} />, document.querySelector("#makeRecipe")
    );

    ReactDOM.render(
        <RecipeList recipes={[]} />, document.querySelector("#recipes")
    );

    ReactDOM.render(
        <Advertisement/>, document.querySelector("#adSpace")
    );
    
    loadRecipesFromServer();
};

//gets the token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});