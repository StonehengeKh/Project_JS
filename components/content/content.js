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
        let postField = this.shadow.querySelector("#post-field")
        async function getItems(postField) {
            let items = await (await fetch("https://fea13-alex.glitch.me/content")).json()
            items.forEach(element => {
                let item = document.createElement("data-card")
                item.setAttribute("markup", "components/cards/cards.html")
                item.setAttribute("title", element.title)
                item.setAttribute("message", element.message)
                item.setAttribute("picture", element.photo)
                postField.appendChild(item)
            });
        }
        getItems(postField)

        this.titleCards = this.shadow.querySelector("#title-add-data")
        this.textCards = this.shadow.querySelector("#name-add-text")
        this.textCards.disabled = true
        this.photoCards = this.shadow.querySelector("#name-add-photo")
        this.photoCards.disabled = true
        this.btnCards = this.shadow.querySelector("#add-data-btn")
        this.errorSpace = this.shadow.querySelector("#error")
        // this.previewTitle = this.shadow.querySelector("#title-card")
        // this.previewText = this.shadow.querySelector("#text-card")
        // this.previewPhoto = this.shadow.querySelector("#image-post")

        async function loadPage() {
            let items = await (await fetch("https://fea13-alex.glitch.me/content")).json()

            items.forEach(item => {
                let card = document.createElement("div")
                card.className = "card"
                card.style.border = "2px solid white"

                let imgBlocks = card.appendChild(document.createElement("div"))
                imgBlocks.className = "img-block"
                let img = imgBlocks.appendChild(document.createElement("img"))
                img.className = "image-post"
                img.src = item.photo

                let titleBlocks = card.appendChild(document.createElement("div"))
                titleBlocks.className = "title"
                let titles = titleBlocks.appendChild(document.createElement("h4"))
                titles.className = "title-card"
                titles.innerHTML = item.title

                let textBlocks = card.appendChild(document.createElement("div"))
                textBlocks.className = "title"
                let texts = textBlocks.appendChild(document.createElement("span"))
                texts.className = "text-card"
                texts.innerHTML = item.message

                // let btnBlock = card.appendChild(document.createElement("div"))
                // btnBlock.className = "btn-card"
                // btnBlock.id = "btn-card"
                // let btnDelete = btnBlock.appendChild(document.createElement("button"))
                // btnDelete.className = "btn-delete"
                // btnDelete.id = "btn-delete"
                // btnDelete.innerText = "Delete"

                postField.appendChild(card)
            })
        }
        loadPage()

        this.titleCards.onchange = function (event) {
            event.target.valid = event.target.value.length > 2
            // this.previewTitle.innerHTML = event.target.value
            if(event.target.valid) {
                this.errorSpace.innerHTML = ""
                this.textCards.disabled = false
            } else {
                this.errorSpace.innerHTML = "Enter more long title"
                this.textCards.disabled = true
            }
        }.bind(this)

        this.textCards.onchange = function ( event ) {
            event.target.valid = event.target.value.length > 10
            // this.previewText.innerHTML = event.target.value
            if(event.target.valid) {
                this.errorSpace.innerHTML = ""
                this.photoCards.disabled = false
            } else {
                this.errorSpace.innerHTML = "Enter more long message"
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
            if (photo.type.indexOf ( "image" ) === 0 && photo.size > 800000 ) {
                this.errorSpace.innerHTML = "Image size is too big"
                this.photoCards.valid = false
            }
            if (photo.type.indexOf ( "image" ) === 0 && photo.size <= 800000 ) {
                // reader.onload = function (ev) {
                //     this.previewPhoto.src = ev.target.result
                // }.bind(this)
                this.errorSpace.innerHTML = ""
                // this.previewPhoto.style.display = "block"

                this.photoCards.valid = true
                if(this.photoCards.valid && this.titleCards.valid) {
                    this.btnCards.disabled = false
                } else {
                    this.btnCards.disabled = true
                }
            }
        }.bind(this)

        this.btnCards.onclick = function (event) {
            if(this.photoCards.valid && this.titleCards.valid && this.textCards.valid) {
                fetch("https://fea13-alex.glitch.me/content", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: this.titleCards.value,
                        message: this.textCards.value,
                        photo: this.previewPhoto.src
                    })
                }).then(
                    response => response.json())
            }

                // .then(response => {
                //     let card = document.createElement("div")
                //     card.className = "card"
                //
                //     let imgBlocks = card.appendChild(document.createElement("div"))
                //     imgBlocks.className = "img-block"
                //     let img = imgBlocks.appendChild(document.createElement("img"))
                //     img.src = response.photo
                //
                //     let titleBlocks = card.appendChild(document.createElement("div"))
                //     titleBlocks.className = "title"
                //     let titles = titleBlocks.appendChild(document.createElement("h4"))
                //     titles.className = "title-card"
                //     titles.innerHTML = response.title
                //
                //     let textBlocks = card.appendChild(document.createElement("div"))
                //     textBlocks.className = "title"
                //     let texts = textBlocks.appendChild(document.createElement("span"))
                //     texts.className = "text-card"
                //     texts.innerHTML = response.message
                //
                //     postField.appendChild(card)
                // })
        }.bind(this)
    }
}
customElements.define("content-page", ContentPage)