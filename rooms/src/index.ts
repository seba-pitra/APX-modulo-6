import "./pages/index"
import "./pages/chat"
import "./router"
import { state } from "./state"

(() => {
    state.init()
    state.setEmailAndFullName("seeba5050@gmail.com", "seba")
    state.signIn((err) => {
        if(err) console.error("hubo error en el sigin");
        
        state.askNewRoom(() => {
            state.accessToRoom()
        });
    })

    // //al comenzar
    // state.init()
    // //recupera el state del localSotrage
    // const cs = state.getState();
    // if(cs.rtdbRooomId && cs.userId) {
    //     Router.push("/chat")
    // }
})()




