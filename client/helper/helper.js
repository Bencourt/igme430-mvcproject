
//error handler helper function
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#recipeMessage").animate({width:'toggle'},350);
};

//redirect helper function
const redirect = (response) => {
    $("#recipeMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

//send AJAX helper function
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
