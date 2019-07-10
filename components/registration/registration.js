class RegisterPage extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({
            mode: "open"
        })
    }

    static get observedAttributes() {
        return ["markup", "css"]
    }

    connectedCallback() {
        this.setAttribute("markup", "./components/registration/registration.html")
        this.setAttribute("css", "./components/registration/registration.css")
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        fetch(newVal).then(response => response.text())
            .then(response => {
                if (attrName === "markup") {
                    let scripts = this.shadow.innerHTML.split("<script>").length === 1 ?
                        "" : this.shadow.innerHTML.split("<script>")[1].split("</script>")[0]
                    let styles = this.shadow.innerHTML.split("<style>").length === 1 ?
                        "" : this.shadow.innerHTML.split("<style>")[1].split("</style>")[0]
                    this.shadow.innerHTML = response + `<style> ${styles} </style>` + scripts
                }
                if (attrName === "css") {
                    let html = this.shadow.innerHTML.split("<style>")
                    let end = html.length === 1 ? "" : html[1].split("</style>")[1]
                    this.shadow.innerHTML = html[0] + `<style> ${response}</style>` + end
                }
            }).then(res => this.getData())
    }
    getData () {
        this.exitBlock = this.shadow.querySelector("#exit-block")
        this.userName = this.shadow.querySelector("#input-name")
        this.userEmail = this.shadow.querySelector("#input-email")
        this.userEmail.disabled = true
        this.userPassword = this.shadow.querySelector("#input-password1")
        this.userPassword.disabled = true
        this.checkPassword = this.shadow.querySelector("#input-password2")
        this.checkPassword.disabled = true
        this.userPhone = this.shadow.querySelector("#input-phone")
        this.userPhone.disabled = true
        this.userPhoto = this.shadow.querySelector("#input-file")
        this.button = this.shadow.querySelector("#register-button")
        this.preview = this.shadow.querySelector("#preview-image")
        this.errorMessages = this.shadow.querySelector("#err")
        this.button.disabled = true
        this.button.innerHTML = "Fill all fields"
        this.button.style.background = "grey"
        this.userPassword.onchange = function (event) {
            document.cookie = `hash=${Sha256.hash(event.target.value)}`
        }.bind(this)
        this.preview.style.display = "none"
        this.userName.onchange = function (event) {
            event.target.valid = event.target.value.length >= 2
            if(event.target.valid) {
                this.errorMessages.innerHTML = ""
                this.userEmail.disabled = false
                this.userPhone.disabled = false
            }
            else {
                this.errorMessages.innerHTML = "Enter correct name"
                this.userEmail.disabled = true
                this.userPhone.disabled = true
            }
        }.bind(this)
        this.userEmail.onchange = function (event) {
            let err = this.errorMessages
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
            this.preview.style.display = "none"
            let photo = event.target.files[0] ? event.target.files[0] : null
            if ( photo.type.indexOf( "image" ) === -1 ) {
                this.errorMessages.innerHTML = "Wrong type of file"
                this.preview.style.display = "none"
                this.userPhoto.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size > 500000 ) {
                this.errorMessages.innerHTML = "Image size is too big"
                this.preview.style.display = "none"
                this.userPhoto.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size <= 500000 ) {
                this.errorMessages.innerHTML = ""
                let picture = URL.createObjectURL ( photo )
                this.preview.style.display = "block"
                this.preview.src = picture
                this.userPhoto.valid = true
                if(this.userPhone.valid && this.checkPassword.valid &&
                    this.userPhoto.valid && this.userName.valid) {
                    this.button.disabled = false
                    this.button.style.background = "green"
                    this.button.innerHTML = "Register"
                }
                else {
                    this.button.disabled = true
                }
            }}.bind(this)
        this.userPassword.oninput = function ( event ) {
            let pass = event.target.value
            event.target.valid = pass.length > 8 && !!pass.match ( /\d/ ) && !!pass.match ( /\D/ )
            event.target.style.color = event.target.valid ? "blue" : "red"
            this.checkPassword.disabled = !event.target.valid
        }.bind(this)
        this.checkPassword.oninput = function ( event ) {
            event.target.valid = event.target.value === this.userPassword.value
            event.target.style.color = event.target.valid ? "blue" : "red"
            if(this.userPhone.valid && this.checkPassword.valid &&
                this.userPhoto.valid && this.userName.valid) {
                    this.button.disabled = false
                    this.button.style.background = "green"
                    this.button.innerHTML = "Register"
            }
            else {
                this.button.disabled = false
            }
            var passwSha = Sha256.hash(event.target.value)
            return passwSha
        }.bind(this)
        this.userPhone.onchange = function(event) {
            event.target.valid = event.target.value.length >= 10
            if (event.target.valid) {
                this.errorMessages.innerHTML = ""
                this.userPassword.disabled = false
                this.checkPassword.disabled = false
            }
            else {
                this.errorMessages.innerHTML = "Enter correct phone number"
                this.userPassword.disabled = true
                this.checkPassword.disabled = true
            }
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
                    phone: this.userPhone.value,
                    avatar: this.preview.src,
                    userPassword: `hash=${Sha256.hash(this.userPassword.value)}`
                })
            }).then(
                response => response.json())
                .then(response => document.cookie =`userId=${response.id}; hash=${response.userPassword}`)
            closeWindow()
            // document.getElementById("openRegPage").style.display = "none"
            // document.getElementById("openLogPage").style.display = "none"
            // document.getElementById("logOut").style.display = "inline"
            // document.getElementById("account").style.display = "inline"
            // document.getElementById("wishList").style.display = "inline"
        }.bind(this)

        this.exitBlock.onclick = function (event) {
            RegisterPage.remove()

        }
    }

}
customElements.define("register-page", RegisterPage)