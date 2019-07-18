\class .х--ь\Card extends HTMLElement {
    constructor() {
        super()
        // debugger
        this.shadow = this.attachShadow({ mode: "closed" })
        this.shadow.innerHTML = `
        <div class="item" id="greenitem">
    <div class="image">
            <img src="" alt="img" id="imageGlass">
    </div>
    <div class="infoabotitem">
        <div class="price">
<span class="nameofitem" id="nameofitem">
</span>
<span class="priceofitem" id="priceofitem">
</span>
        </div>
        <div class="buybutton" id="buybut">
        </div>
    </div>
</div>
        `

        let css = document.createElement("style")
        css.textContent = `
        .item{
            width: 233px;
            height: 318px;
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.5s ease;
            background: rgba(168, 205, 211, 0.527);
            margin-bottom: 7px;
            }
            .buybutton{
                background: url(img/Layer_5_copy.png) no-repeat center #7db122;
                width: 47px;
            height: 47px;
            border-radius: 50%;
            transition: all 0.7s ease;
            }
            .buybutton:hover{
                cursor: pointer;
                background-size:80%;
                transform: scale(1.2);
                background: green;
                background: url(img/Layer_5_copy.png) no-repeat center green;
            }
            .infoabotitem{
                display: flex;
                justify-content: space-between;
                padding: 5px;
            }
            
            .price{
                display: flex;
                flex-direction: column;
                justify-content: center
            }
            
            .priceofitem{
                text-align: center;
                font-size: 30px;
                color: green;
                font-weight: bold;
            }
            
            .item:hover{
                transform: scale(1.1);
            box-shadow: 2px 3px #07576b9d;
            
            }
            
            .item:hover .buybutton{
                transform: rotate(360deg);
                width: 55px;
            height: 55px;
            border: 3px solid green;
            }
            
            .item *{
                cursor: default;
            }
        `
        this.shadow.appendChild(css)



    }
    connectedCallback() {
        this.getButton()

    }
    static get observedAttributes() {
        return ["price", "name", "picture"]
    }
    attributeChangedCallback(attrName, oldVal, newVal) {

        this.getData(attrName, newVal)

    }
    getData = function (attrName, newVal) {
        this.image = this.shadow.querySelector("#imageGlass")
        this.name = this.shadow.querySelector("#nameofitem")
        this.price = this.shadow.querySelector("#priceofitem")

        if(attrName === "price") {
            this.price.innerHTML = `${newVal}$`
        }
        if (attrName === "name") {
            this.name.innerHTML = newVal
        }
        if(attrName === "picture") {
            this.image.src = newVal
        }
    }
    getButton = function () {
        let button =  this.shadow.querySelector("#buybut")
        let divall =  this.shadow.querySelector("#greenitem")
        button.onclick = function butOncl (event) {
            let price =  this.price.innerHTML.split("$")[0]
            let name = this.name.innerHTML
            let pic = this.image.src
            button.style.background = "url(img/Layer_5_copy.png) center no-repeat green"
            button.style.transform = "scale(1.2)"
            divall.style.border = "3px solid green"
            main.userBasket.push(
                { article: name,
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
            button.onclick = function(event) {
                let name = this.name.innerHTML
                main.userBasket.forEach( item => {
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
customElements.define("item-card", ItemCard)

//  fetch("https://curasa.glitch.me/topics", {
// method: "POST",
// headers: {
//     "Content-Type": "application/json"
// },
// body: JSON.stringify({
//     name: "Glass VZ-300-UF400",
//     price: 299,
//     picture: "blob:https://alexkurasa.github.io/11bb4e8e-42ed-4877-9d7b-bfe490a1a52e",
//     add: "featured"
// })
// }).then(
// response => response.json()).then(res => console.log(res))