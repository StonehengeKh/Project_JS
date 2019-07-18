class ContentPage extends HTMLElement {
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
                fetch(`components/content/content.css`)
                    .then(response => response.text())
            ])
            html.innerHTML = await resp[0];
            html.appendChild(document.createElement("style")).textContent = await resp[1];
            await getValues()
        }
        setAttrs(newVal, html, getValues)
    }


    getData () {
        this.titleCards = this.shadow.querySelector("#title-add-data")
        this.textCards = this.shadow.querySelector("#name-add-text")
        this.photoCards = this.shadow.querySelector("#name-add-photo")
        this.btnCards = this.shadow.querySelector("#add-data-btn")
        this.errorSpace = this.shadow.querySelector("#error")

        this.titleCards.onchange = function (event) {
            event.target.valid = event.target.value.length > 2
            if(event.target.valid) {
                this.errorSpace.innerHTML = ""
                this.userEmail.disabled = false
            } else {
                this.errorSpace.innerHTML = "Enter correct title"
                this.userEmail.disabled = true
            }
        }.bind(this)

        this.photoCards.onchange = function ( event ) {
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
            }
        }.bind(this)

        this.textCards.onchange = function ( event ) {
            event.target.valid = event.target.value.length > 20
        }.bind(this)

        this.btnCards.onclick = function (event) {
            this.button.remove()
            fetch("https://fea13-alex.glitch.me/content", {
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
        }.bind(this)

        this.shadow.querySelector("#exit-block").onclick = function(event) {
            this.remove()
            document.body.style.overflow = 'auto'
        }.bind(this)

    }

}
customElements.define("content-page", ContentPage)