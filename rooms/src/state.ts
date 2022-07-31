import map from "lodash/map"
import {rtdb} from "./rtdb"

const API_BASE_URL = "http://localhost:3000"

export const state = {
    data: {
        email: "",
        fullName:"",
        userId: "",
        roomId: "",
        rtdbRoomId: "",
        messages: []
    },
    listeners: [],
    init() {
        const lastStorageState = localStorage.getItem("state")
    },
    listenRoom() {
        const cs = this.getState();
        const chatRoomRef = rtdb.ref("/rooms/" + cs.rtdbRoomId)
        chatRoomRef.on("value", snapshot => {
            const messagesFromServer = snapshot.val()
            const messagesList = map(messagesFromServer.messages)
            cs.messages = messagesList
            this.setState(cs)
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
    setEmailAndFullName(email:string, fullName:string) {
        const cs = this.getState()
        cs.fullName = fullName;
        cs.email = email
        this.setState(cs)
    },
    setState(newState) {
       this.data = newState;
       for (const cb of this.listeners) {
        cb();
       }
       localStorage.setItem("state", JSON.stringify(newState))
       console.log("soy el state y cambié", this.data);
    },
    signIn(callback) {
        const cs = this.getState()
        if(cs.email) {
            fetch(API_BASE_URL + "/auth", {
                method: "post",
                headers: {
                    'content-type': "application/json"
                },
                body: JSON.stringify({ email: cs.email })
            })
            .then(res => {
                return res.json()
            })
            .then(data => {
                cs.userId = data.id
                this.setState(cs)
                callback()
            })
        } else {
            console.error("no hay email en el state");
            callback()
        }
    },
    askNewRoom(callback?) {
        const cs = this.getState();
        if(cs.userId) {
            console.log(cs.userId);
            if(cs.userId) {
                fetch(API_BASE_URL + "/rooms", {
                    method: "post",
                    headers: {
                        'content-type': "application/json"
                    },
                    body: JSON.stringify({ userId: cs.userId })
                })
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    cs.roomId = data.id
                    this.setState(cs)
                    if (callback) {
                        callback()
                    }
                })
            } else {
                console.error("no hay email en el state");
                callback()
            }
        }
    },
    accessToRoom(callback?) {
        const cs = this.getState();
        const roomId = cs.roomId
        fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + cs.userId)
        .then(res => {
            return res.json()
        })
        .then(data => {
            cs.roomId = data.id
            this.listenRoom()
            this.setState(cs)
            if (callback) {
                callback()
            }
        })
    },
    subscribe(callback: (any) => any) {
       this.listeners.push(callback)
    }
  };