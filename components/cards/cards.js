class DataCard extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })
        this.shadow.innerHTML = `
        <div class="card" id="card">
            <div class="img-block">
                <img class="image" src="" alt="Photo" id="image-post">
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
    }
    static get observedAttributes() {
        return ["photo", "title", "text"]
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        this.getData(attrName, newVal)
    }

    getData = function (attrName, newVal) {
        this.photoCard = this.shadow.querySelector("#image-post")
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
}
customElements.define("data-card", DataCard)