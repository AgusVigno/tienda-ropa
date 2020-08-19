function Usuario(nombre, correo, password){
    this.nombre = nombre;
    this.correo = correo;
    this.password = password;
}

function Producto(nombre, cantidad, precio) {
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
}

function Carrito(){
    let carrito = [];

    this.obtenerProductos = () => carrito;

    this.agregarProducto = (producto) => carrito.push(producto);
    
    this.eliminarProducto = () => {
        //hay que implementar la eliminación
    };

    this.comprar = () => {
        //hay que implementar la compra
    }

    this.validarStock = () => {
        //hay que implementar la validación del stock
    }

}

//implementar todo el modulo de usuarios, en caso de darlo en el curso.
function Usuarios() {
    let usuarios = [];

    this.obtenerUsuarios = () => usuarios;

    this.agregarUsuario = (usuario) => usuarios.push(usuario);
    
    this.eliminarUsuario = () => {
        //hay que implementar la eliminación
    };

    this.login = (usuario) => {
        //hay que implementar el login
    }

    this.logout = (usuario) => {
        //hay que implementar el logout
    }
}

//obtengo una instancia del carrito
let carrito = new Carrito();

//obtengo instancias de algunos productos
let produco1 = new Producto("Remera", 1, 150);
let produco2 = new Producto("Bufanda", 2, 50);
let produco3 = new Producto("Jean", 1, 300);

//agrego productos al carrito
carrito.agregarProducto(produco1);
carrito.agregarProducto(produco2);
carrito.agregarProducto(produco3);

//obtengo el listado de productos del carrito
let listado = carrito.obtenerProductos();

//imprimo el listado de productos del carrito
console.log(listado);  