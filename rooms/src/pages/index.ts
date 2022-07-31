// import { Route, Router } from "@vaadin/router"
import { state } from "../state"

class Home extends HTMLElement {
    connectedCallback() {
        this.render()
        const form = this.querySelector(".form")
        form?.addEventListener("submit", (e) => {
            e.preventDefault()
            const target = e.target as any
            const name = target.nombre.value
            state.setNombre(name)
            // Router.go("/chat")
        })
    }
    render() {
        this.innerHTML = `
        <h1 class="title">Bienvenido</h1>
        <form class="form">
          <div>
            <label class="label">Tu nombre</label>
          </div>
          <input type="text" name="nombre" class="input">
          <button class="button">Comenzar</button>
        </form>
        `
    }
}
customElements.define("home-page", Home)