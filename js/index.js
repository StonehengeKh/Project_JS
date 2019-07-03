class RegisterPage extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({
            mode: "closed"
        })

    }

    static get observedAttributes() {
        return ["markup", "styles"]
    }

    connectedCallback() {}

    attributeChangedCallback(attrName, oldVal, newVal) {
        fetch(newVal).then(response => response.text())
            .then(response => {

                if (attrName === "markup") {
                    let scripts = this.shadow.innerHTML.split("<script>").length === 1 ?
                        "" : this.shadow.innerHTML.split("<script>")[1].split("</script>")[0]
                    let styles = this.shadow.innerHTML.split("<style>").length === 1 ?
                        "" : this.shadow.innerHTML.split("<style>")[1].split("</style>")[0]
                    this.shadow.innerHTML = response + `<style> ${styles} </style>`
                }

                if (attrName === "styles") {
                    let html = this.shadow.innerHTML.split("<style>")
                    let end = html.length === 1 ? "" : html[1].split("</style>")[1]
                    this.shadow.innerHTML = html[0] + `<style> ${response}</style>` + end
                }

            })
    }
}

customElements.define("register-page", RegisterPage)
let regPage = document.createElement("register-page")
regPage.setAttribute("markup", "../components/registration/registration.html")
regPage.setAttribute("css", "../components/registration/registration.css")

function openRegisterPage(event) {
    document.getElementById("registration").appendChild(regPage)
}

let homePage = document.createElement('register-page')
homePage.setAttribute("markup", "../chanks/homepage.html")
homePage.setAttribute("css", "../chanks/homepage.css")


function openHomePage(event) {

    document.getElementsByTagName("main")[0].innerHTML = ""
    document.getElementsByTagName("main")[0].appendChild(homePage)
    location.hash = "home"

}

document.getElementsByTagName("main")[0].appendChild(homePage)
location.hash = "home"