// connect registerPage

let signUp = document.getElementById("sign-up")
let registerUser = document.createElement("register-page")

signUp.onclick = function (event) {
    document.getElementById("registrationShow").appendChild(registerUser)
}

// connect loginPage

let signIn = document.getElementById("sign-in")
let logUser = document.createElement("log-page")

signIn.onclick = function (event) {
    document.getElementById("loginShow").appendChild(logUser)
}

