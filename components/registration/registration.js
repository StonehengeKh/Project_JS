class RegisterPage extends HTMLElement {
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
        async function setAttrs(newVal, html, getValues) {
            let resp =  await  Promise.all([
                fetch(newVal)
                    .then(response => response.text()),
                fetch(`components/registration/registration.css`)
                    .then(response => response.text())
            ])
            html.innerHTML = await resp[0];
            html.appendChild(document.createElement("style")).textContent = await resp[1];
            await getValues()
        }
        setAttrs(newVal, html, getValues)
    }


    getData () {
        this.userName = this.shadow.querySelector("#input-name")
        this.userEmail = this.shadow.querySelector("#input-email")
        this.userEmail.disabled = true
        this.userPassword = this.shadow.querySelector("#input-password1")
        this.userPassword.disabled = true
        this.checkPassword = this.shadow.querySelector("#input-password2")
        this.checkPassword.disabled = true
        this.userPhoto = this.shadow.querySelector("#input-file")
        this.button = this.shadow.querySelector("#register-button")
        this.preview = this.shadow.querySelector("#preview-image")
        this.errorSpace = this.shadow.querySelector("#err")
        this.button.disabled = true
        this.button.innerHTML = "Fill all inputs"
        this.button.style.background = "grey"
        this.userPassword.onchange = function (event) {
            document.cookie = `hash=${Sha256.hash(event.target.value)}`
        }.bind(this)
        this.preview.style.display = "none"
        this.userName.onchange = function (event) {
            event.target.valid = event.target.value.length > 2
            if(event.target.valid) {
                this.errorSpace.innerHTML = ""
                this.userEmail.disabled = false
            } else {
                this.errorSpace.innerHTML = "Enter correct name"
                this.userEmail.disabled = true
            }
        }.bind(this)

        this.userEmail.onchange = function (event) {
            let err = this.errorSpace
            let check = event.target.value
            let pas1 = this.userPassword
            let pas2 = this.checkPassword
            let emInp = this.userEmail
            async function letCheck (pas1, pas2, check ) {
                let response = await fetch("https://fea13-alex.glitch.me/users");
                let data = await response.json();
                let isReg = data.some(obj => obj.email === check)
                let vali = !isReg
                if (vali && check.indexOf("@") > 0) {
                    err.innerHTML = ""
                    emInp.style.color = "green"
                    pas1.disabled = false
                    pas2.disabled = false
                }
                if (check.indexOf("@") < 0){
                    err.innerHTML = "Enter correct email"
                    emInp.style.color = "red"
                    pas1.disabled = true
                    pas2.disabled = true
                }
                if (!vali) {
                    err.innerHTML = "Your email is busy"
                    emInp.style.color = "red"
                    pas1.disabled = true
                    pas2.disabled = true
                }
            }
            letCheck(pas1, pas2, check)
        }.bind(this)

        this.userPhoto.onchange = function ( event ) {
//            this.preview.style.display = "none"
            let photo = event.target.files[0]
            if ( photo.type.indexOf( "image" ) === -1 ) {
                this.errorSpace.innerHTML = "Wrong type of file"
                this.preview.style.display = "none"
                this.userPhoto.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size > 500000 ) {
                this.errorSpace.innerHTML = "Image size is too big"
                this.preview.style.display = "none"
                this.userPhoto.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size <= 500000 ) {
                this.errorSpace.innerHTML = ""
                let picture = URL.createObjectURL ( photo )
                this.preview.style.display = "block"
                this.preview.src = btoa(picture)
                this.userPhoto.valid = true
                if(this.checkPassword.valid && this.userPhoto.valid && this.userName.valid) {
                    this.button.disabled = false
                    this.button.style.background = "#43a06d"
                    this.button.innerHTML = "Register"
                } else {
                    this.button.disabled = true
                }
            }}.bind(this)

        this.userPassword.oninput = function ( event ) {
            let pass = event.target.value
            event.target.valid = pass.length > 8 && !!pass.match ( /\d/ ) && !!pass.match ( /\D/ )
            event.target.style.color = event.target.valid ? "#43a06d" : "red"
            this.checkPassword.disabled = !event.target.valid
        }.bind(this)

        this.checkPassword.oninput = function ( event ) {
            event.target.valid = event.target.value === this.userPassword.value
            event.target.style.color = event.target.valid ? "blue" : "red"
            if(this.checkPassword.valid && this.userPhoto.valid && this.userName.valid) {
                this.button.disabled = false
                this.button.style.background = "#43a06d"
                this.button.innerHTML = "Register"
            } else {
                this.button.disabled = false
            }
            var passSha = Sha256.hash(event.target.value)
            return passSha
        }.bind(this)

        this.button.onclick = function (event) {
            this.button.remove()
            fetch("https://fea13-alex.glitch.me/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: this.userName.value,
                    email: this.userEmail.value,
                    avatar: this.preview.src,
                    userPassword: `hash=${Sha256.hash(this.userPassword.value)}`
                })
            }).then(
                response => response.json())
                .then(response => {
                    document.cookie =`userId=${response.id}; hash=${response.userPassword}`
                    let event = new Event("new-user")
                    event.userData = response
                    main.dispatchEvent(event)
                })

            this.remove()
            document.body.style.overflow = 'auto'
            document.getElementById("sign-up").style.display = "none"
            document.getElementById("sign-in").style.display = "none"
            document.getElementById("log-out").style.display = "inline"
            document.getElementById("head-user-name").style.display = "inline"
            document.getElementById("small-avatar").style.display = "inline"
        }.bind(this)

        this.shadow.querySelector("#exit-block").onclick = function(event) {
            this.remove()
            document.body.style.overflow = 'auto'
        }.bind(this)

    }

}
customElements.define("register-page", RegisterPage)