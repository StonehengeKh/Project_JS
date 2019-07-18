class AboutUsPage extends HTMLElement {
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
        this.setAttribute("markup", "./components/aboutUS/aboutUS.html")
        this.setAttribute("css", "./components/aboutUS/aboutUS.css")
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


}
customElements.define("aboutus-page", AboutUsPage)