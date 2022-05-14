const fields = document.querySelectorAll("input");
const submit = document.querySelector("#submit");
const error = document.getElementById("error");
const agree = document.getElementById("agree");
const gender = document.getElementById("gender");
const switchModeButton = document.getElementById("login_instead");

const LOGIN = 1;
const SIGNUP = 0;

var mode = SIGNUP; // 0 = Sign up and 1 = Log in

submit.addEventListener("click", onSubmit);
switchModeButton.addEventListener("click", switchMode);

function onSubmit(e) {
  e.preventDefault();
  e.target.blur();
  var token = sha512(fields[2].value + "+" + fields[3].value);
  console.log(token);
  if (mode == SIGNUP && validate()) {
    var date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    token.then(x => document.cookie = "token=" + x + "; expires=" + date.toUTCString());
    showError("Signed up successfully.");
  } else if (mode == LOGIN && validateLogin()) {
    var savedCookie = document.cookie;
    token.then(x => login(x, savedCookie));
  }
}

function login(token, savedCookie){
    if("token=" + token === savedCookie){
        showError("Logged in...");
    }else{
        showError("Wrong email or password.");
    }
}

function switchMode() {
  if (mode === SIGNUP) {
    const form = document.querySelector("form");
    form.removeChild(document.getElementById("name_div"));
    form.removeChild(document.getElementById("gender-div"));
    form.removeChild(document.getElementById("agree-div"));
    submit.value = "Login";
    document.getElementById("header").innerText = "Login";
    document.getElementById("switch").innerHTML =
      '<p id="switch" style="cursor: context-menu;">Don\'t have an account?<br /><span id="signup_instead" style="color: rgb(72, 72, 206); text-decoration: underline; cursor: pointer;">Create one now.</span></p>';
    document
      .getElementById("signup_instead")
      .addEventListener("click", switchMode);
    mode = LOGIN;
  } else if (mode === LOGIN) {
    mode = SIGNUP;
    window.location.reload();
  }
}

function sha512(str) {
  return crypto.subtle
    .digest("SHA-512", new TextEncoder("utf-8").encode(str))
    .then((buf) => {
      return Array.prototype.map
        .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    });
}

function validate() {
  // Check for gender selected
  if (gender.value === "Null") {
    showError();
    return false;
  }
  // Check for a valid email
  else if (!validateEmail()) {
    return false;
  }
  // Check for accepting terms and conditions
  else if (!agree.checked) {
    showError("<h3>You have to agree to the terms and conditions.</h3>");
    return false;
  }
  // Check all fields are filled
  fields.forEach(function (it) {
    if (!check(it)) {
      return false;
    }
  });
  return true;
}

function validateLogin(){
    return validateEmail() && validatePassword();
}

function validatePassword(){
    return check(fields[3]);
}

function validateEmail() {
  if (!fields[2].value.includes("@") || !fields[2].value.includes(".")) {
    showError("Please enter a valid email.");
    return false;
  }
  return true;
}

function check(it) {
  if (it.value == null || it.value.trim() === "") {
    showError();
    console.log("object");
    return false;
  }
  return true;
}

function showError(text = "Please fill all the fields.") {
  error.style.display = "flex";
  error.innerHTML = "<h3>" + text + "</h3>";
}