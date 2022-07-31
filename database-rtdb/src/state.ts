import map from "lodash/map"
import {rtdb} from "./rtdb"

const API_BASE_URL = "http://localhost:3000"

export const state = {
    data: {
      nombre:"",
      messages: []
    },
    listeners: [],
    init() {
//cada vez q haya un cambio o un msj nuevo, el state se va a enterar xq esta conectado a la rtdb
//el state se encarga de traer y guardar la informacion de los datos para q los comps puedan usarla
        const chatroomsRef = rtdb.ref("/chatrooms/general");//hacemos ref al lugar de la bd q tendrá todos los msj
        const currentState = this.getState();
        chatroomsRef.on("value", (snapshot) => {
            const messagesFromServer = snapshot.val();//cada vez q haya un cambio nos traeremos:
            const messagesList = map(messagesFromServer.messages);//como los msj de la bd son objetos lo convierto en array con esta funcion map
            currentState.messages = messagesList//solo esta parte(messages) del server y guardar en state
            console.log(messagesList);
            
            this.setState(currentState)//todos los comps van a tener acceso a los datos
        })
    },
    getState() {
      return this.data;
    },
    setNombre(nombre:string) {
        const currentState = this.getState();
        currentState.nombre = nombre
        this.setState(currentState) 
    },
    pushMessages(message: string) {//este msj va al backend. Para esto usamos el fetch con metodo "post"
        const nombreDelState = this.data.nombre//el nombre q le paso al state en la home-page
        fetch(API_BASE_URL + "/messages", {
            method: "post",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({
                from: nombreDelState,
                message: message
            })
        })
    },
    setState(newState) {
       this.data = newState;
       for (const cb of this.listeners) {
        cb();
       }
       console.log("soy el state y cambié", this.data);
    },
    subscribe(callback: (any) => any) {
       this.listeners.push(callback)
    }
  };