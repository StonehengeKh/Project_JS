class ContentPage extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })
        this.css = document.createElement("style")
        this.shadow.appendChild(this.css)
    }

    connectedCallback() {
        // this.getData()
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
                fetch(`components/content/content.css`)
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
        this.titleCards = this.shadow.querySelector("#title-add-data")
        this.textCards = this.shadow.querySelector("#name-add-text")
        this.textCards.disabled = true
        this.photoCards = this.shadow.querySelector("#name-add-photo")
        this.photoCards.disabled = true
        this.btnCards = this.shadow.querySelector("#add-data-btn")
        this.errorSpace = this.shadow.querySelector("#error")

        this.titleCards.onchange = function (event) {
            event.target.valid = event.target.value.length > 2
            if(event.target.valid) {
                this.errorSpace.innerHTML = ""
                this.textCards.disabled = false
            } else {
                this.errorSpace.innerHTML = "Enter correct title"
                this.textCards.disabled = true
            }
        }.bind(this)

        this.textCards.onchange = function ( event ) {
            event.target.valid = event.target.value.length > 10
            if(event.target.valid) {
                this.errorSpace.innerHTML = ""
                this.photoCards.disabled = false
            } else {
                this.errorSpace.innerHTML = "Enter correct title"
                this.photoCards.disabled = true
        }}.bind(this)

        this.photoCards.onchange = function ( event ) {
            let reader = new FileReader
            let photo = event.target.files[0]
            reader.readAsDataURL(photo)
            if ( photo.type.indexOf( "image" ) === -1 ) {
                this.errorSpace.innerHTML = "Wrong type of file"
                this.photoCards.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size > 500000 ) {
                this.errorSpace.innerHTML = "Image size is too big"
                this.photoCards.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size <= 500000 ) {
                reader.onload = function (ev) {
                    this.preview.src = ev.target.result
                }.bind(this)
                this.errorSpace.innerHTML = ""
                let picture = URL.createObjectURL ( photo )
                this.preview.style.display = "block"
                this.preview.src = btoa(picture)
                this.photoCards.valid = true
                if(this.photoCards.valid && this.titleCards.valid) {
                    this.button.disabled = false
                } else {
                    this.button.disabled = true
                }
            }
        }.bind(this)

        this.btnCards.onclick = function (event) {
            fetch("https://fea13-alex.glitch.me/content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: this.titleCards.value,
                    text: this.textCards.value,
                    photo: this.photoCards.src
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
    }
}
customElements.define("content-page", ContentPage)