import firebase from "firebase"

const firebaseConfig = {
    apiKey: "bJhYbbAfZ9obzhaZwSlVugOP30rLmAq7t8uVNYS2",
    databaseURL: "https://apx-dwf-m6-d5de9-default-rtdb.firebaseio.com/",
    authDomain: "apx-dwf-m6-d5de9.firebaseapp.com",
}
const app = firebase.initializeApp(firebaseConfig)
const rtdb = firebase.database(app);

export { rtdb }