var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.getNombre = function () {
        return this.nombre;
    };
    return User;
}());
var seba = new User();
seba.nombre = "sebaa pitra";
console.log(seba.getNombre());
