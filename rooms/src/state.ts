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
        const chatroomsRef = rtdb.ref("/chatrooms/general");
        const currentState = this.getState();
        chatroomsRef.on("value", (snapshot) => {
            const messagesFromServer = snapshot.val();
            const messagesList = map(messagesFromServer.messages);
            currentState.messages = messagesList
            console.log(messagesList);
            
            this.setState(currentState)
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
    pushMessages(message: string) {
        const nombreDelState = this.data.nombre
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