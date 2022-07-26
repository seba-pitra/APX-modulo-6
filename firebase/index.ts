import * as express from "express";
import { json } from "body-parser";
import { firestore } from "./db";

const app = express();
const port = 3000;
const usersCollection = firestore.collection("users")

app.use(json())

app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const userDoc = usersCollection.doc(userId);
    userDoc.get().then(userSnap => {
      const userData = userSnap.data();
      res.json(userData)
  })
});

app.post('/users', (req, res) => {
    const newUserDoc = usersCollection.doc();
      newUserDoc.create(req.body).then(() => {
        res.json({
        id: newUserDoc.id,
      });
    })
});

app.patch('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const userDoc = usersCollection.doc(userId);
    const updateObject = req.body;
    updateObject.updatedAt = new Date();

    userDoc.update(updateObject).then(result => {
      console.log(result);
      res.json( {message: "ok"} )
  })
});

app.delete('/users:userId', (req, res) => {
  res.status(204);
});

app.listen(port, () => {
    console.log("puerto montado");
})