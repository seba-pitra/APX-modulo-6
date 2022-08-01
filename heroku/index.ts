import * as express from "express"//

const app = express();
const port = process.env.PORT || 3000//el valor de la constante nos la da heroku y sino es 3000

// $ export USER_FULLNAME=seba ==>> declaracion de variables de ambientes
//NODE_ENV es una variable de ambiente muy conocida q usamos.Tiene dos posibles valores:
//"development" y "production".
//De alguna manera, tenemos q hacer q nuestra computadora el valor de ella sea "development" y 
//cuando la subamos a heroku sea "production". Lo solucionamos con la libreria "dotenv"

app.get("/env",(req,res) => {
    res.json({
        environment:process.env.NODE_ENV
    })
})

app.get("/hola",(req,res) => {
    res.json({
        message:"hola soy el servidor, soy heroku"
    })
})

app.use(express.static("dist"))//cualquier archivo q este en la carpta q le indico en este caso "dist" debe ser servido

app.get("*", (req,res) => {
    res.sendFile(__dirname + "/dist/index.html")//dirname es una referencia al carpeta donde estoy en este caso "heroku-prueba"
})

app.listen(port,()=> {//en heroku no decidimos el puerto nosotros, el decide. Para enterarnos cual es el puerto
                      //usaremos las variables ambientes(var q viene del sistema operativo)
    console.log("hola soy express corriendo en el puerto: " + port);
    
})