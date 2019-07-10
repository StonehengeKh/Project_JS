class LogPage extends HTMLElement {
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
        this.setAttribute("markup", "./components/login/login.html")
        this.setAttribute("css", "./components/login/login.css")
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
        this.userEmail = this.shadow.querySelector("#input-email")
        this.userPassword = this.shadow.querySelector("#input-password")
        this.button = this.shadow.querySelector("#register-button")

        this.errorMessages = this.shadow.querySelector("#err")


        this.exitBlock.onclick = function (event) {
            LogPage.remove()
        }
    }

}
customElements.define("log-page", LogPage)