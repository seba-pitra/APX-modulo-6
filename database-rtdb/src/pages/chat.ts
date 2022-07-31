import { state } from "../state"

type Message = {//declaramos un tipo para tipar el array "messages" de ChatPage
    from: string,
    message: string
}

class ChatPage extends HTMLElement {
    connectedCallback() {
        state.subscribe(() => {
            const currentState = state.getState();
            this.messages = currentState.messages;//pisaremos la propiedad messages con los messages del state
            this.render();//volvemos a escribir el render para q muestre las coasas actualizadas
        })
        this.render()
    }
    messages: Message[] = [];//voy a engancharme al state y cada vez q haya nuevos msjs los voy a meter en este arr
    addListeners() {
        const form = this.querySelector(".submit-message")
        form?.addEventListener("submit", (e) => {
            e.preventDefault()
            const target = e.target as any
            state.pushMessages(target["new-message"].value);//el form envia los messages al state
        })
    }
    render() {
        const currentState = state.getState()
        this.innerHTML = `
        <div>
        <h1 class="chat-title">Chat</h1>
          <div class="messages">
            ${  this.messages.map(m => {
                if (m.from == currentState.nombre) {
                    return `
                    <div class="myself">
                       <p class="my-message">${m.message}</p> 
                    </div>`;
                }
                if (m.from !== currentState.nombre) {
                    return `
                    <div class="other">
                      <h5 class="other-from">${m.from}</h5>
                      <p class="other-message">${m.message}</p>
                    </div>`;
                }}).join("") }
          </div>    
          <form class="submit-message">
             <input type="text" name="new-message" class="input">
             <button class="button">Enviar</button>
          </form>
        </div>
        `
        this.addListeners()
    }
}
customElements.define("chat-page", ChatPage)