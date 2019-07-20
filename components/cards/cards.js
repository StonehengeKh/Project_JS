class DataCard extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })
        this.shadow.innerHTML = `
        <div class="card" id="card">
            <div class="img-block">
                <img class="image" src="" alt="Photo" id="image">
            </div>
            <div class="title">
                <h4 class="title-card" id="title-card"></h4>
            </div>
            <div class="text">
                <span class="text-card" id="text-card"></span>
            </div>
            <div class="btn-block">
                <button class="btn-card" id="change-card">Change</button>
                <button class="btn-card" id="delete-card">Delete</button>
            </div>
        </div>
        `

        let css = document.createElement("style")
        css.textContent = `
        .card {
            width: 330px;
            height: 420px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            margin: 20px;
            border: 2px solid grey;
            border-radius: 20px;
        }
        
        .img-block {
        
        }
        
        .image {
            width: 300px;
            height: auto;
            border-radius: 10px;
        }
        
        .title-card {
        
        }
        
        .text-card {
        
        }
        
        .btn-card {
            background-color: grey;
            border: 2px solid grey;
            width: 80px;
            border-radius: 5px;
            margin: 0 10px;
            color: white;
            text-transform: uppercase;
            padding: 2px;
        }
        
        .btn-card:hover {
            background-color: #43a06d;
        }
        
        .btn-block {
            display: flex;
        }
        `
        this.shadow.appendChild(css)
    }
    connectedCallback() {
        this.getButton()
    }
    static get observedAttributes() {
        return ["photo", "title", "text"]
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        this.getData(attrName, newVal)
    }

    getData = function (attrName, newVal) {
        this.photoCard = this.shadow.querySelector("#image")
        this.titleCard = this.shadow.querySelector("#title-card")
        this.textCard = this.shadow.querySelector("#text-card")

        if (attrName === "photo") {
            this.photoCard.src = newVal
        }
        if (attrName === "title") {
            this.titleCard.innerHTML = newVal
        }
        if (attrName === "text") {
            this.textCard.innerHTML = newVal
        }
    }
    getButton = function () {
        let button = this.shadow.querySelector("#buybut")
        let divall = this.shadow.querySelector("#greenitem")
        button.onclick = function butOncl(event) {
            let price = this.price.innerHTML.split("$")[0]
            let name = this.name.innerHTML
            let pic = this.image.src
            button.style.background = "url(img/Layer_5_copy.png) center no-repeat green"
            button.style.transform = "scale(1.2)"
            divall.style.border = "3px solid green"
            main.userBasket.push(
                {
                    article: name,
                    price: price,
                    picture: `img/${pic.split("img/")[1]}`,
                }
            )
            main.cartButton.innerHTML = `CART (${main.userBasket.length})`
            main.addEventListener("delete-item", (event) => {
                button.style.background = "url(img/Layer_5_copy.png) center no-repeat #7db122"
                button.style.transform = "scale(0.8)"
                divall.style.border = "none"
                button.onclick = butOncl.bind(this)
            })
            button.onclick = function (event) {
                let name = this.name.innerHTML
                main.userBasket.forEach(item => {
                    if (item.article === name) {
                        main.userBasket.splice(main.userBasket.indexOf(item), 1)
                        button.style.background = "url(img/Layer_5_copy.png) center no-repeat #7db122"
                        button.style.transform = "scale(0.8)"
                        divall.style.border = "none"
                        main.cartButton.innerHTML = `CART (${main.userBasket.length})`
                        button.onclick = butOncl.bind(this)
                    }
                })
            }.bind(this)
        }.bind(this)
    }
}
customElements.define("item-card", DataCard)