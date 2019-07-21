// https://fea13-alex.glitch.me/users
// https://fea13-alex.glitch.me/content
// https://fea13-alex.glitch.me/information


const main = document.getElementsByTagName("main")[0]
main.openLogPage = document.getElementById("sign-in")
main.openRegPage = document.getElementById("sign-up")
main.openLogName = document.getElementById("head-user-name")
main.logOutButton = document.getElementById("sign-out")
main.openUserAccount = document.getElementById("cabinet")
main.openPageContent = document.getElementById("page-content")
main.nameUserButton = document.getElementById("head-user-name")


main.getCookie = function() {
    function getCookies () {
        var res = document.cookie.split ( "; " ).map (
            x =>  {
                var tmp = x.split ( "=" )
                var elem = {}
                elem [ tmp [0] ] = tmp [1]
                return elem
            })
        return Object.assign ( {}, ...res )
    }
    main.cookieObj = getCookies()
    if (main.cookieObj.userId && main.cookieObj.hash) {
        async function getUser() {
            let response = await fetch(`https://fea13-alex.glitch.me/users/${main.cookieObj.userId}`)
            let user = await response.json()
            if (`hash=${main.cookieObj.hash}` === user.userPassword){
                main.currentUser = {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                    photo: user.avatar
                }
                console.log("curUser", main.currentUser)
                main.openUserAccount.style.display = "inline"
                main.openLogPage.style.display = "none"
                main.openRegPage.style.display = "none"
                main.logOutButton.style.display = "inline"
                main.openLogName.style.display = "inline"
                main.openUserAccount.innerHTML = main.currentUser.name
            }
        }
        getUser()
    } else {
        this.openUserAccount.style.display = "none"
        this.logOutButton.style.display = "none"
        this.openRegPage.style.display = "inline"
        this.openLogPage.style.display = "inline"
        this.openLogName.style.display = "none"
    }
}
main.getCookie()

main.logOutButton.onclick = function (event) {
    this.openUserAccount.style.display = "none"
    this.logOutButton.style.display = "none"
    this.openRegPage.style.display = "inline"
    this.openLogPage.style.display = "inline"
    this.openLogName.style.display = "none"
    document.cookie =`userId= ; hash= `
    main.currentUser = null
}.bind(main)

main.openUserAccount.onclick = function (event) {
    main.innerHTML = ""
    const userAccount = document.createElement("user-cabinet")
    userAccount.setAttribute("markup", "components/myCabinet/myCabinet.html")
    this.appendChild(userAccount)
}.bind(main)

main.nameUserButton.onclick = function (event) {
    main.innerHTML = ""
    const userAccount = document.createElement("user-cabinet")
    userAccount.setAttribute("markup", "components/myCabinet/myCabinet.html")
    this.appendChild(userAccount)
}.bind(main)

main.openRegPage.onclick = function (event) {
    const regPage = document.createElement("register-page")
    regPage.setAttribute("markup", "components/registration/registration.html")
    this.appendChild(regPage)
}.bind(main)

main.openLogPage.onclick = function (event) {
    const logPage = document.createElement("log-page")
    logPage.setAttribute("markup", "components/login/login.html")
    this.appendChild(logPage)
}.bind(main)

main.openPageContent.onclick = openPageContent
function openPageContent(event) {
    const contentPage = document.createElement("content-page")
    contentPage.setAttribute("markup", "components/content/content.html")
    main.innerHTML = ""
    main.appendChild(contentPage)
    location.hash = "home"
}
openPageContent()

main.addEventListener("new-user", createCurrentUser)

function createCurrentUser (event) {
    main.currentUser = {
        name: event.userData.name,
        email: event.userData.email,
        id: event.userData.id,
        photo: event.userData.avatar
    }
}