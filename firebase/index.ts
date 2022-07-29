import * as express from "express";
import { json } from "body-parser";
import { firestore,rtdb } from "./db";
import { v4 as uuidv4} from "uuid"//libreria para hacer id's muy complejos
import * as cors from "cors"

const app = express();
const port = 3000;

app.use(json())
app.use(cors())

// En el state aclaro que la peticion a mi API es "post" asi que va a hacer lo indicado en el endpoint debajo.
// Si el state hace una solicitud con verbo "get" se enviarian al state los datos q estructuro en get endpoint "get"
app.post('/messages/', (req, res) => {
    const chatroomRef = rtdb.ref("/chatrooms/general/messages")
    chatroomRef.push(req.body, (error) => {//pusheo los datos del state(req.body) a mi rtdb
      console.log(req.body);
      res.json("todo ok")
    })
});

app.listen(port, () => {
    console.log("El puerto funciona en el numero:" + port);
})