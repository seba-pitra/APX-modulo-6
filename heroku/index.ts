import * as express from "express"

const app = express();
const port = process.env.PORT || 3000//el valor de la constante nos la da heroku y sino es 3000
app.get("/hola",(req,res) => {
    res.json({
        message:"hola soy el servidor, heroku"
    })
})

app.listen(port,()=> {//en heroku no decidimos el puerto nosotros, el decide. Para enterarnos cual es el puerto
                      //usaremos las variables ambientes(var q viene del sistema operativo)
    console.log("hola soy express corriendo en el puerto: " + port);
    
})