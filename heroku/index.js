"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var port = process.env.PORT || 3000; //el valor de la constante nos la da heroku y sino es 3000
app.get("/hola", function (req, res) {
    res.json({
        message: "hola soy el servidor"
    });
});
app.listen(port, function () {
    //usaremos las variables ambientes(var q viene del sistema operativo)
    console.log("hola soy express corriendo en el puerto: " + port);
});
