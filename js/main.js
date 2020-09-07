//me guardo la pagina actual html
let pagina_actual = window.location.href;

//recupero el listado de productos de la "BD"
let productos = productosBD;

//recupero el carrito de productos
let carrito = document.querySelector('#carrito-productos');
let carrito_productos = [];

if(pagina_actual.includes('index.html')){
    //se cargan los productos en el home
    cargarProductos();

    //se inicializa el carrito de compras
    actualizarCarrito();

    //Eventos
    //Agregar un evento al hacer click en el corazon de cada producto
    const megustas = document.querySelectorAll('.fa-heart');
    megustas.forEach( megusta => {
        megusta.parentNode.addEventListener('click', () => {
            alert("Te gusta el producto.   :)");
        });
    });

    //Agregar un evento para validar que se ingreso un correo electrónico en la suscripción del newsletter
    const correo = document.querySelector('.subscription-form input');
    correo.addEventListener('blur', (e) => {
        validarCorreoEvento(e);
    });

}else if(pagina_actual.includes('registro.html')){
    let usuario = {
        "nombre": document.querySelector('#nombre'),
        "apellido": document.querySelector('#apellido'),
        "email": document.querySelector('#email'),
        "password": document.querySelector('#password'),
        "username": document.querySelector('#username'),
    }
    if(validarUsuario(usuario)){
        //guardar en localStorage
        localStorage.setItem(usuario.username, usuario);
    };
}

//Funciones
//agregar un producto al carrito de compras
function agregarProductoCarrito(productoId){
    //buscar producto en el arreglo de productos
    let producto = productos.filter(prod => prod.id === productoId)[0];

    if(producto){ //si existe el producto seleccionado desde el home
        //crear producto nuevo
        let productoHtml = crearProductoCarrito(producto);
    
        //agrego el producto al carrito (por ahora solo el precio, mas adelante el objeto producto)
        carrito_productos.push(producto);
    
        //mostrar alerta
        mostrarAlertaExitoCarrito();
    
        //agrego el producto al listado de productos en el carrito
        carrito.prepend(productoHtml);
    
        //actualizo el listado a mostrar en el carrito
        actualizarCarrito();   
    }else{
        alert('Producto no encontado');
    }
}

function crearProductoCarrito(prod){
    //creo un nuevo contenedor html para el producto
    let producto = document.createElement('div');
    producto.classList.add('media');

    //creo el html del nuevo producto en el carrito
    producto.innerHTML = `
        <a class="pull-left" href="#">
            <img  class="media-object" src="${prod.imagen}" alt="imagen producto">
        </a>
        <div class="media-body">
            <h4 class="media-heading"><a href="#">${prod.nombre}</a></h4>
            <div class="cart-price">
            <span>1 x</span>
            <span>${prod.precio}</span>
            </div>
            <h5><strong>$${prod.precio}</strong></h5>
        </div>
        <a href="#" class="remove" onclick="eliminarProductoCarrito(event, ${prod.id})"><i class="far fa-times-circle"></i></a>
    `;
    return producto;
}

//eliminar un producto del carrito de compras
function eliminarProductoCarrito(event, productoId){
    //elimino el producto del DOM
    let producto = event.target.parentNode.parentNode;
    producto.parentNode.removeChild(producto);

    //elimino el producto del arreglo de productos del carrito
    carrito_productos = carrito_productos.filter(producto => producto.id !== productoId);

    //actualizo el listado a mostrar en el carrito
    actualizarCarrito();
}

//visualizar un producto en el modal, al hacer click en la lupa sobre cada producto.
function verProducto(productoId){
    let producto = productos.filter(prod => prod.id === productoId)[0];
    document.querySelector('.modal-image img').setAttribute("src", `${producto.imagen}`);
    document.querySelector('.product-title').textContent = producto.nombre;
    document.querySelector('.product-price').textContent = `$${producto.precio}`;
}

function actualizarCarrito(){
    let total = calcularTotal();
    if(total === 0){
        let texto = document.createElement('h4');
        texto.setAttribute("id", "sin-productos");
        texto.textContent = 'No hay productos agregados';
        carrito.appendChild(texto);

        let total = document.querySelector('#carrito-total');
        if(total){
            total.parentNode.removeChild(total);
        }
    }else if(carrito_productos.length === 1 && !document.querySelector('#carrito-total')){
        //elimino mensaje que no hay productos agregados
        let texto = document.querySelector('#sin-productos');
        if(texto){
            texto.parentNode.removeChild(texto);
        }

        //agrego el total y los botones para realizar la compra y ver carrito
        let botones = carritoBotones(total);
        carrito.appendChild(botones);
    }else{
        //actulizo el precio total
        document.querySelector('.total-price').textContent = total;
    }
}

function carritoBotones(total){
    let info = document.createElement('div');
    info.setAttribute("id", 'carrito-total');
    info.innerHTML = `
        <div class="cart-summary">
            <span>Total: </span>
            <span class="total-price">$${total}</span>
        </div>
        <ul class="text-center cart-buttons">
            <li><a href="#" class="btn btn-small">Ver carrito</a></li>
            <li><a href="#" class="btn btn-small btn-solid-border">Comprar</a></li>
        </ul>
    `;
    return info;
}

function calcularTotal(){
    let total = 0;
    carrito_productos.forEach(producto => {
        total += producto.precio
    });
    return total;
}

//validar correo utilizado expresion regular, aceptando caracteres de UTF-8.
function validarCorreoEvento (event){
    let correo = event.target.value; 

    validarCorreo(correo) ? mostrarAlertaCorreoExitoso() : mostrarAlertaCorreoError();
}

//Mostrar alerta cuando se agrega un producto al carrito
function mostrarAlertaExitoCarrito(){
    document.querySelector('.alert').classList.add('show');
    setTimeout(function () {
        document.querySelector('.alert').classList.remove('show');
    }, 2000);
}

//Cargar productos
function cargarProductos() {
    let productos = document.querySelector('.productos');

    productosBD.forEach( producto => {
        let productoHtml = crearProducto(producto);
        productos.appendChild(productoHtml);
    })
}

//Crear un producto nuevo
function crearProducto(producto){
    let productoHtml = document.createElement('div');
    productoHtml.classList.add('col-md-4');
    productoHtml.innerHTML = `
        <div class="product-item">
            <div class="product-thumb">
                <img class="img-responsive" src="${producto.imagen}" alt="product-img">
                <div class="preview-meta">
                    <ul>
                        <li onclick="verProducto(${producto.id})">
                            <span  data-toggle="modal" data-target="#product-modal">
                                <i class="fas fa-search"></i>
                            </span>
                        </li>
                        <li><span><i class="fas fa-heart"></i></span></li>
                        <li onclick="agregarProductoCarrito(${producto.id})">
                            <span><i class="fas fa-cart-plus"></i></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="product-content">
                <h4><a href="product-single.html">${producto.nombre}</a></h4>
                <p class="price">$${producto.precio}</p>
            </div>
        </div>
    `;
    return productoHtml;
}

//Registro de un nuevo usuario
function onSubmitForm(event){
    event.preventDefault();
    let usuario = {
        "nombre": document.querySelector('#nombre').value,
        "apellido": document.querySelector('#apellido').value,
        "email": document.querySelector('#email').value,
        "username": document.querySelector('#username').value,
        "password": document.querySelector('#password').value,
    }
    if(validarUsuario(usuario)){
        //guardar en localStorage
        localStorage.setItem(usuario.username, JSON.stringify(usuario));

        //redirijo hacia el index.html o tambien podria ir a Login!
        window.location.href = '../index.html';
    }
}

function validarUsuario(usuario){
    if(!usuario.nombre || !usuario.apellido || !usuario.password){
        mostrarAlertaErrorRegistro();
        return false;
    }
    if(!validarCorreo(usuario.email)){
        mostrarAlertaErrorRegistro();
        return false;
    }
    if(localStorage.getItem(usuario.username)){
        mostrarAlertaErrorRegistro();
        return false;
    }
    return true;
}

function onSubmitLogin(){
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let user = JSON.parse(localStorage.getItem(username));

    user && user.password == password ? 
        window.location.href = '../index.html' : 
        mostrarAlertaErrorLogin();
}

//validacion de correo electrónico utilizando una expresión regular contemplando UTF-8.
function validarCorreo(correo){
    return(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(correo));
}

//Mostrar alertas
function mostrarAlertaErrorRegistro(){
    document.querySelector('.alert').classList.add('show');
    setTimeout(function () {
        document.querySelector('.alert').classList.remove('show');
    }, 2000);
}
function mostrarAlertaCorreoExitoso(){
    document.querySelectorAll('.alerta')[0].classList.add('show');
    setTimeout(function () {
        document.querySelectorAll('.alerta')[0].classList.remove('show');
    }, 2000);
}
function mostrarAlertaCorreoError(){
    document.querySelectorAll('.alerta')[1].classList.add('show');
    setTimeout(function () {
        document.querySelectorAll('.alerta')[1].classList.remove('show');
    }, 2000);
}
function mostrarAlertaErrorLogin(){
    document.querySelector('.alerta alert-danger').classList.add('show');
    setTimeout(function () {
        document.querySelector('.alerta alert-danger').classList.remove('show');
    }, 2000);
}