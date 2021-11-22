const handleRecipe = (e) => {
    e.preventDefault();

    $("#recipeMessage").animate({width:'hide'},350);

    if($("#ingredientInput").val() == '' || $("#instructionInput").val() == '') {
        handleError("Rawr: all fields are required");
        return false;
    }

    sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function() {
        loadRecipesFromServer();
    });

    return false;
};



const addIngredient = (e) => {
    document.querySelector("#ingredients").innerHTML += `<li>${document.querySelector("#ingredientInput").value}</li>`
    document.querySelector("#ingredientInput").value = "";

}

const addInstruction = (e) => {
    document.querySelector("#instructions").innerHTML += `<li>${document.querySelector("#instructionInput").value}</li>`
    document.querySelector("#instructionInput").value = "";
}

const RecipeForm = (props) => {
    return(
        <form id="recipeForm"
        onSubmit={handleRecipe}
        name="recipeForm"
        action="/maker"
        method="POST"
        className = "recipeForm"
        >
            <label htmlFor="ingInput">Ingredient: </label>
            <ul className="ingredients">
            </ul>
            <input id="ingredientInput" type="text" name="ingInput" placeholder ="Ingredient"/>
            <input className="addIngredient" type="button" onClick={addIngredient} value="Add Ingredient"/>
            <label htmlFor="instInput">Instruction:</label>
            <ul className="instructions">   
            </ul>
            <input id="instructionInput" type="text" name="instInput" placeholder="Instruction"/>
            <input className="addInstruction" type="button" onClick={addInstruction} value="Add Instruction" />
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeRecipeSubmit" type="submit" value="Make Recipe"/>
        </form>
    );
};

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
                <img src="/assets/img/recipeface.jpeg" alt="recipe face" className="recipeFace" />
                <h3 className="recipeName">Name: {recipe.name} </h3>
                <h3 className="recipeAge">Age: {recipe.age} </h3>
            </div>
        );
    });

    return(
        <div className="recipeList">
            {recipeNodes}
        </div>
    );
};

const loadRecipesFromServer = () => {
    sendAjax('GET', '/getRecipes', null, (data) => {
        ReactDOM.render(
            <RecipeList recipes={data.recipes} />, document.querySelector("#recipes")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <RecipeForm csrf={csrf} />, document.querySelector("#makeRecipe")
    );

    ReactDOM.render(
        <RecipeList recipes={[]} />, document.querySelector("#recipes")
    );

    loadRecipesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});