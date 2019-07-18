class UserCabinet extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({
            mode: "closed"
        })
        this.shadow.innerHTML = `
            <link rel="stylesheet" href="myCabinet.css">
            <section>
                <h3></h3>
                <img src="">
                <input type="text" value="">
                <input type="file" value="">
            </section>
        `

    }
    static get

    setHandlers() {
        let photo = this.shadow.querySelector("#input-img")
        let text = this.shadow.querySelector("#input-name")
        let name
    }
}