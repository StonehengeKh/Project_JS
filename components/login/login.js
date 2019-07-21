class LogPage extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })
    }
    connectedCallback() {
    }
    static get observedAttributes() {
        return ["markup"]
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        let html = this.shadow
        let getValues = this.getData.bind(this)
        let getDatas = this.getData.bind(this)
        async function setAttrs(newVal, html, getValues) {
            let resp =  await  Promise.all([
                fetch(newVal)
                    .then(response => response.text()),
                fetch(`components/login/login.css`)
                    .then(response => response.text())
            ])
            html.innerHTML = await resp[0];
            html.appendChild(document.createElement("style")).textContent = await resp[1];
            await getValues()
            await getDatas()
        }
        setAttrs(newVal, html, getValues)
    }
    getData () {
        this.userEmail = this.shadow.querySelector("#input-email")
        this.userPassword = this.shadow.querySelector("#input-password")
        this.button = this.shadow.querySelector("#log-button")
        this.errorSpace = this.shadow.querySelector("#err")
        this.button.disabled = true

        this.userPassword.onchange = function (event) {
            document.cookie = `hash=${Sha256.hash(event.target.value)}`
            event.target.valid = event.target.value.length >= 6
            if (this.userPassword.valid && this.userEmail.valid){
                this.button.disabled = false
            }
        }.bind(this)

        this.userEmail.onchange = function (event) {
            event.target.valid = event.target.value.length >= 3 && event.target.value.indexOf("@") > 0
            if (this.userPassword.valid && this.userEmail.valid){
                this.button.disabled = false
            }
        }.bind(this)

        this.shadow.querySelector("#exit-block").onclick = function(event) {
            this.remove()
        }.bind(this)
        this.button.onclick = function (event) {
            let email = this.userEmail.value
            let pass = Sha256.hash(this.userPassword.value)
            let err = this.errorSpace
            let window = this
            async function userDates(email, pass) {
                let response = await fetch("https://fea13-alex.glitch.me/users")
                let arrayOfObj = await response.json()
                let currentUser = arrayOfObj.find( function(user) {
                    return user.email === email})
                if (currentUser) {
                    if(currentUser.userPassword === `hash=${pass}`) {
                        debugger
                        document.cookie =`userId=${currentUser.id}`
                        err.innerHTML = ""
                        main.openRegPage.style.display = "none"
                        main.openLogPage.style.display = "none"
                        main.logOutButton.style.display = "inline"
                        main.openUserAccount.style.display = "inline"
                        main.nameUserButton.style.display = "inline"
                        console.log(main.currentUser)
                        let event = new Event("new-user")
                        event.userData = currentUser
                        main.dispatchEvent(event)
                        window.remove()
                        main.nameUserButton.innerHTML = main.currentUser.name

                    } else {
                        err.innerHTML = "Wrong password"
                    }
                } else {
                    err.innerHTML = "Wrong email"
                }
            }
            userDates(email, pass)
        }.bind(this)
    }
}

customElements.define("log-page", LogPage)