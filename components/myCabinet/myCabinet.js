class UserCabinet extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })
        this.css = document.createElement("style")
        this.shadow.appendChild(this.css)
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
            let resp =  await Promise.all([
                fetch(newVal)
                    .then(response => response.text()),
                fetch(`components/myCabinet/myCabinet.css`)
                    .then(response => response.text())
            ])
            html.innerHTML = await resp[0];
            html.appendChild(document.createElement("style")).textContent = await resp[1];
            await getValues()
            await getDatas()
        }
        setAttrs(newVal, html, getValues)
    }

    getData(){
        this.errorSpace = this.shadow.querySelector("#error-cab")
        this.currentImg = this.shadow.querySelector("#now-avatar")
        this.currentImg.src = main.currentUser.photo
        this.userPhoto = this.shadow.querySelector("#change-avatar")
        this.userPhoto.valid = true
        this.currentName = this.shadow.querySelector("#now-name")
        this.currentName.innerHTML = main.currentUser.name
        this.changeName = this.shadow.querySelector("#change-name")
        this.changeName.value = main.currentUser.name
        this.changeName.valid = true
        this.changeNameButton = this.shadow.querySelector("#change-name-button")
        this.currentEmail = this.shadow.querySelector("#now-email")
        this.currentEmail.innerHTML = main.currentUser.email
        this.changeEmail = this.shadow.querySelector("#change-email")
        this.changeEmail.value = main.currentUser.email
        this.changeEmail.valid = true
        this.changeEmailButton = this.shadow.querySelector("#change-email-button")
        this.oldPassInput = this.shadow.querySelector("#input-old-password")
        this.enterNewPass1 = this.shadow.querySelector("#input-new-password1")
        this.enterNewPass2 = this.shadow.querySelector("#input-new-password2")
        this.savePassButton = this.shadow.querySelector("#change-password-button")
        this.savePassButton.disabled = true
        this.enterNewPass1.disabled = true
        this.enterNewPass2.disabled = true
        this.deleteUser = this.shadow.querySelector("#del-user")

        this.userPhoto.onchange = function ( event ) {
            let photo = event.target.files[0]

            if ( photo.type.indexOf( "image" ) === -1 ) {
                this.errorSpace.innerHTML = "Wrong type of file"
                this.userPhoto.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size > 500000 ) {
                this.errorSpace.innerHTML = "Image size is too big"
                this.userPhoto.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size <= 500000 ) {
                let reader = new FileReader
                reader.readAsDataURL(photo)
                this.errorSpace.innerHTML = ""
                this.userPhoto.valid = true
                reader.onload = function (ev) {
                    photo = ev.target.result
                    fetch(`https://fea13-alex.glitch.me/users/${main.currentUser.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            avatar: photo
                        })
                    }).then(response => response.json())
                        .then(response => {
                            this.currentImg.src = response.avatar
                            main.currentUser.photo = response.avatar
                        })
                }.bind(this)
            }
        }.bind(this)

        this.currentName.onchange = function (event) {
            event.target.valid = event.target.value.length > 2

            if (event.target.valid) {
                this.errorSpace.innerHTML = ""
                this.userEmail.disabled = false
            } else {
                this.errorSpace.innerHTML = "Enter correct name"
                this.userEmail.disabled = true
            }
        }.bind(this)

        this.changeNameButton.onclick = function (event) {
            fetch(`https://fea13-alex.glitch.me/users/${main.currentUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: this.changeName.value,
                })
            }).then(
                response => response.json())
                .then(response => {
                    let event = new Event("new-user")
                    event.userData = response
                    main.dispatchEvent(event)
                    this.currentName.innerHTML = event.userData.name
                })
        }.bind(this)

        this.changeEmail.onchange = function (event) {
            let err = this.errorSpace
            let check = event.target.value
            let emInp = this.changeEmail
            if (check != main.currentUser.email) {
                async function letCheck (check ) {
                    let response = await fetch("https://fea13-alex.glitch.me/users");
                    let data = await response.json();
                    let isReg = data.some(obj => obj.email === check)
                    let vali = !isReg

                    if (vali && check.indexOf("@") > 0) {
                        err.innerHTML = ""
                        emInp.style.color = "green"
                        emInp.valid = true
                    }
                    if (check.indexOf("@") < 0){
                        err.innerHTML = "Enter correct email"
                        emInp.style.color = "red"
                        emInp.valid = false
                    }
                    if (!vali) {
                        err.innerHTML = "Your email is busy"
                        emInp.style.color = "red"
                        emInp.valid = false
                    }
                }
                letCheck(check)
            } else {
                err.innerHTML = ""
                emInp.style.color = "green"
                emInp.valid = true
            }
        }.bind(this)

        this.changeEmailButton.onclick = function () {
            fetch(`https://fea13-alex.glitch.me/users/${main.currentUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.changeEmail.value,
                })
            }).then(
                response => response.json())
                .then(response => {
                    let event = new Event("new-user")
                    event.userData = response
                    main.dispatchEvent(event)
                    this.currentEmail.innerHTML = event.userData.email
                })
        }.bind(this)

        this.oldPassInput.oninput = function (event) {
            let passSha = Sha256.hash(event.target.value)
            if (`hash=${passSha}` === main.currentUser.hash ) {
                this.enterNewPass1.disabled = false
                this.errorSpace.innerHTML = ""
                this.oldPassInput.valid = true
            } else {
                this.errorSpace.innerHTML = "Enter correct old password"
                this.oldPassInput.valid = false
            }
        }.bind(this)

        this.enterNewPass1.oninput = function ( event ) {
            let pass = event.target.value
            event.target.valid = pass.length > 8 && !!pass.match ( /\d/ ) && !!pass.match ( /\D/ )
            event.target.style.color = event.target.valid ? "blue" : "red"
            this.enterNewPass2.disabled = !event.target.valid
        }.bind(this)

        this.enterNewPass2.oninput = function ( event ) {
            event.target.valid = event.target.value === this.enterNewPass1.value
            event.target.style.color = event.target.valid ? "blue" : "red"
            if (event.target.valid && this.enterNewPass1.valid && this.oldPassInput.valid) {
                this.savePassButton.disabled = false
                this.savePassButton.style.background = "green"
            } else{
                this.savePassButton.disabled = true
                this.savePassButton.style.background = "red"
            }
        }.bind(this)

        this.savePassButton.onclick = function (event) {
            fetch(`https://fea13-alex.glitch.me/users/${main.currentUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userPassword: `hash=${Sha256.hash(this.enterNewPass1.value)}`,
                })
            }).then(
                response => response.json())
                .then(response => {
                    document.cookie =`userId=${response.id}; hash=${response.userPassword}`
                    let event = new Event("new-user")
                    event.userData = response
                    main.dispatchEvent(event)
                })
        }.bind(this)

        this.deleteUser.onclick = function (event) {
            alert("You want delete?")
            fetch(`https://fea13-alex.glitch.me/users/${main.currentUser.id}`, {
                method: "DELETE",
            }).then(
                () => {
                    main.openUserAccount.style.display = "none"
                    main.logOutButton.style.display = "none"
                    main.openRegPage.style.display = "inline"
                    main.openLogPage.style.display = "inline"
                    main.openLogName.style.display = "none"
                    document.cookie =`userId= ; hash= `
                    main.currentUser = null
                }
            )
        }.bind(this)
    }
}

customElements.define("user-cabinet", UserCabinet)