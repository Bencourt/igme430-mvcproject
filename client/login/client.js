//sends the POST request for the login
const handleLogin = (e) => {
    e.preventDefault();

    $("#recipeMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

//Sends the POST request for a password change
const handlePasswordChange = (e) => {
    e.preventDefault();

    $("#recipeMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == ''){
        handleError("All fields are required");
        return false;
    }

    if($("#pass").val() == $("#pass2").val()){
        handleError("New password cannot be the same as old password");
        return false;
    }

    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

    return false;
};

//handles the POST request for signup
const handleSignup = (e) => {
    e.preventDefault();

    $("#recipeMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()){
        handleError("passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

//react element for the login window
const LoginWindow = (props) => {
    return (
        <div>
        <h3 className="loginBlurb">Log in and get started logging recipes!</h3>
        <form id="loginForm" 
            name="loginForm"
            onSubmit = {handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
            >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
        </div>
    );
};

//react element for the change password window
const ChangePasswordWindow = (props) => {
    return (
        <div>
        <h3 className="loginBlurb">Change your password:</h3>
        <form id="changeForm" 
            name="changeForm"
            onSubmit = {handlePasswordChange}
            action="/changePassword"
            method="POST"
            className="mainForm"
            >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Original Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Change password and login" />
        </form>
        </div>
    );
};

//react element for the signup window
const SignupWindow = (props) => {
    return (
        <div>
        <h3 className="loginBlurb">Sign up to get started logging recipes!</h3>
        <form id="signupForm" 
            name="signupForm"
            onSubmit = {handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
            >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
        </div>
    );
};

//renders the login window
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//renders the changePassword window
const createChangePasswordWindow = (csrf) => {
    ReactDOM.render(
        <ChangePasswordWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//renders the signup window
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//sets up the page
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const changePasswordButton = document.querySelector("#changePasswordButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    changePasswordButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
}

//gets the token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});