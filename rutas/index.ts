import * as express from "express";

const app = express();
const port = 3000;

//USERS
app.get('/users', (req, res) => {
  res.json([ "todos los usuarios" ]);
});

app.get('/users/:userId', (req, res) => {
  res.json(req.params);
});
//En estas dos funciones(get y post) va a ir todo el codigo que va a ir a la base 
//de datos para crear o alterar un usuario.
//Regla basica: Hay que exponer la mennor cantidad posible
app.post('/users', (req, res) => {
  res.json({
    id: req.params.id,
    name: "tu nombre rey"
  });
});

app.patch('/users/:userId', (req, res) => {//aca necesitamos un id y los dos puntos le indican q lo q viene ed dinamico
    res.json({
        id: req.params.userId,
        name: "tu nombre rey"
    });
});

app.delete('/users:userId', (req, res) => {
  res.status(204);
});


//PRODUCTS
app.get('/products', (req, res) => {
  res.json([ "todos los productos" ]);
});

app.get('/products/:productsId', (req, res) => {
  res.json(req.params);
});

app.post('/products', (req, res) => {
  res.json({
    id: 1,
    name: "tu nombre rey"
  });
});

app.patch('/products/:productsId', (req, res) => {//aca necesitamos un id
    res.json({
        id: req.params.productsId,
        name: "tu nombre modificado rey"
    });
});

app.delete('/products/:productsId', (req, res) => {
  res.status(204);
});

app.listen(port, () => {
    console.log("puerto montado");
})