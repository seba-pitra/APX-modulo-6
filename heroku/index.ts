class User {
    nombre:string;
    getNombre() {
        return this.nombre
    }
}

const seba = new User()
seba.nombre = "sebaa pitra"
console.log(seba.getNombre());
