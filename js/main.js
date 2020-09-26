//tiempo para alertas
const TIEMPO = 2000; //2 segundos

//me guardo la pagina actual html
let pagina_actual = window.location.href;

//recupero el listado de productos de la "BD" por medio de AJAX, formato JSON
const apiURL = './js/productos.json';

//recupero el carrito de productos
let carrito = document.querySelector('#carrito-productos');
let carrito_productos = [];

if(pagina_actual.includes('index.html') || !pagina_actual.includes('.html')){
    //se cargan los productos en el home
    const productos = getProductos();

    //se inicializa el carrito de compras
    actualizarCarrito();

    //Eventos  
    //Agregar un evento al hacer click en el corazon de cada producto
    $(document).ready(function(){
        $('.fa-heart').click(function(){
            alert("Te gusta el producto.   :)");
        })
    });  

    //Agregar un evento para validar que se ingreso un correo electrónico en la suscripción del newsletter
    const $suscripcion = $('.subscription-form input');
    $suscripcion.blur((e) => validarCorreoEvento(e) );

}else if(pagina_actual.includes('registro.html')){
    let usuario = {
        "nombre": $('#nombre').val(),
        "apellido": $('#apellido').val(),
        "email": $('#email').val(),
        "password": $('#password').val(),
        "username": $('#username').val(),
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
    let producto = productos.find(prod => prod.id === productoId);
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
    let producto = productos.find(prod => prod.id === productoId);
    $('.modal-image img').attr("src", `${producto.imagen}`);
    $('.product-title').text(producto.nombre);
    $('.product-price').text(`$${producto.precio}`);
}

function actualizarCarrito(){
    let total = calcularTotal();
    console.log(total);
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
        console.log('entra:',!document.querySelector('#carrito-total'));
        //elimino mensaje que no hay productos agregados
        let texto = document.querySelector('#sin-productos');
        if(texto){
            texto.parentNode.removeChild(texto);
        }

        //agrego el total y los botones para realizar la compra y ver carrito
        let botones = carritoBotones(total);
        carrito.appendChild(botones);
    }else{
        console.log('else: ', document.querySelector('.total-price'));
        //actualizo el precio total
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
    $('.alert').addClass('show');
    setTimeout(function () {
        $('.alert').removeClass('show');
    }, TIEMPO);
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

//Cargar Productos
function cargarProductos(productos){
    let productosHtml = document.querySelector('.productos');
    productos.forEach( producto => {
        let productoHtml = crearProducto(producto);
        productosHtml.appendChild(productoHtml);
    });
}

//Registro de un nuevo usuario
function onSubmitForm(event){
    event.preventDefault();
    let usuario = {
        "nombre": $('#nombre').val(),
        "apellido": $('#apellido').val(),
        "email": $('#email').val(),
        "username": $('#username').val(),
        "password": $('#password').val(),
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

function onSubmitLogin(event){
    event.preventDefault();
    let username = $('#username').val();
    let password = $('#password').val();
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
   $('.alert').addClass('show');
    setTimeout(function () {
       $('.alert').removeClass('show');
    }, TIEMPO);
}
function mostrarAlertaCorreoExitoso(){
    $('.alerta-success').addClass('show');
    setTimeout(function () {
        $('.alerta-success').removeClass('show');
    }, TIEMPO);
}
function mostrarAlertaCorreoError(){
    $('.alerta-error').addClass('show');
    setTimeout(function () {
        $('.alerta-error').removeClass('show');
    }, TIEMPO);
}
function mostrarAlertaErrorLogin(){
    $('.alerta.alert-danger').addClass('show');
    setTimeout(function () {
        $('.alerta.alert-danger').removeClass('show');
    }, TIEMPO);
}

function getProductos(){
    $.ajax({
        method: "GET",
        contentType: "application/json",
        dataType: 'json',
        url: apiURL
    }).done((data) => {
        productos = data;
        cargarProductos(data);
    }).fail((error) => {
        console.log(error);
    });
}