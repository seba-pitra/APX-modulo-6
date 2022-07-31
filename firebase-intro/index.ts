import * as express from "express";
import { firestore,rtdb } from "./chat-db";
import * as cors from "cors"
import { v4 as uuidv4} from "uuid" //libreria para crear id complejos

const app = express();
const port = 3000;
const usersCollection = firestore.collection("users")
const roomsCollection = firestore.collection("rooms")

app.use(express.json()) 
app.use(cors())

app.post('/signup', (req, res) => {//en el body nos llegara un email
//vamos a ir a firestore y crear un user q tenga este email y le genere un id. Si ya existe le diremos q ya 
//tiene una cuenta y si no le retornaremos un id.
    const email = req.body.email;
    const nombre = req.body.nombre
    usersCollection.where("email", "==", email)//va a ir a buscar ala firestore los documentos q coincidan con lo q le pasemos
    .get()//ejecutamos esta busqueda con esta funcion get y devuelve una promesa
    .then(searchResponse => {
        if(searchResponse.empty) {
            //empty quiere decir q no exite nada asi q podemos crear
            usersCollection.add({//con el metodo "add" podemos agregar un objeto a la coleccion
                email,
                nombre
            }).then((newUserRef) => {
                res.json({
                    id: newUserRef.id,
                    new: true
                })//respondemos con el id q crea la firestore para el obj creado
                //este id va a ser la llave para identificar quienes somos
            })
        } else {
            res.status(400).json({
                // id: searchResponse.docs[0].id//aqui esta el documento q buscamos si ya existe
                message: "user already exist"
            })
        }
    })
});

//necesitamos un endpoint pra q el user se loguee
app.post('/auth', (req, res) => {
    const { email } = req.body//esto es lo mismo q "const email = req.body.email"
    usersCollection.where("email", "==", email)
    .get()
    .then((searchResponse) => {
        if(searchResponse.empty) {
            res.status(400).json({
                message:"not found"
            })
        } else {//si no esta empty(vacio) es xq encontro el email
            res.json({
                id: searchResponse.docs[0].id//aqui esta el documento q buscamos si ya existe
            })
        }
    })
});



app.post('/rooms', (req, res) => {//este va a crear un room  y nos devolvera un id cortito q vera el user q creo el room.
    const {userId} = req.body//sin id no va a crear un room xq no esta registrado en la base de datos
    usersCollection
      .doc(userId.toString())
      .get()//vamos a buscar en los users collection "el userId"
      .then(doc => {
        if(doc.exists) {//si el "userId" existe 
            const roomRef = rtdb.ref("rooms/" + uuidv4())//creamos en la rtdb una room con un id complejo.
            roomRef.set({//una vez q lo crea y lo inicializa usando "set" va al "then"
                messages: [],
                owner: userId
            })
            .then(() => {//aqui en el firestore se genera un id corto y para la rtdb un id largo
                const roomLongId = roomRef.key;//id largo
                const roomId = ( 1000 + Math.floor(Math.random() * 999) ).toString();//este va a ser el id cortito
                roomsCollection
                   .doc(roomId)//se crea en el firestore un documento con id sencillo y adentro va a estar...(linea 81)
                   .set({
                    rtdbRoom: roomLongId//(linea 79)...este id largo q usaremos para comunicarnos con la sala
                   })
                   .then(() => {
                       res.json({
                          id: roomId//al fianl de todo responderemos con nuestro id "amigable" q es el documento del firetore
                       })
                   })    
            }) 
        } else {
            res.status(401).json({
                message:"no existe"
            })
        }
    });
});

app.get('/rooms/:roomId', (req, res) => {//Aqui pedimos el id complejo si conocemos el id corto.Ademas le tiene q llegar un userId
    // req.query. Aqui recibimos el userId que le pasamos como parametro
    const {userId} = req.query
    const {roomId} = req.params
    usersCollection
      .doc(userId.toString())
      .get()
      .then(doc => {
        if(doc.exists) {
            roomsCollection.doc(roomId)
               .get() 
               .then(snap => {//el snap es una foto del doc, en este caso del doc "roomId" q contiene el id de la rtdb
                const data = snap.data()
                res.json(data)
               }) 
        } else {
            res.status(401).json({
                message:"no existe"
            })
        }
    });
});

app.listen(port, () => {
    console.log("El puerto funciona en el numero:" + port);
})

//El proceso de autenticacion se trata de habilitar alguna forma desde nuestro backend para q los clientes
//q se conecten desde nuestra web puedan decir quien son