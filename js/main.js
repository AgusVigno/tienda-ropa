
//recupero el carrito de productos
let carrito = document.querySelector('#carrito-productos');
let cantidad_productos = 0; //la idea es guardar los productos como objeto mas adelante
let total = 0;

actualizarCarrito();

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
    validarCorreo(e);
});


//Funciones
//agregar un producto al carrito de compras
function agregarProductoCarrito(imagen, nombre, precio){
    //crear producto nuevo
    let producto = crearProductoCarrito(imagen, nombre, precio);

    //agrego el producto al carrito (por ahora solo el precio, mas adelante el objeto producto)
    cantidad_productos++;
    total += precio;

    //agrego el producto al listado de productos en el carrito
    carrito.prepend(producto);

    //actualizo el listado a mostrar en el carrito
    actualizarCarrito();   
}

function crearProductoCarrito(imagen, nombre, precio){
    //creo un nuevo contenedor html para el producto
    let producto = document.createElement('div');
    producto.classList.add('media');

    //creo el html del nuevo producto en el carrito
    producto.innerHTML = `
        <a class="pull-left" href="#">
            <img  class="media-object" src="images/shop/products/${imagen}" alt="imagen producto">
        </a>
        <div class="media-body">
            <h4 class="media-heading"><a href="#">${nombre}</a></h4>
            <div class="cart-price">
            <span>1 x</span>
            <span>${precio}</span>
            </div>
            <h5><strong>$${precio}</strong></h5>
        </div>
        <a href="#" class="remove" onclick="eliminarProductoCarrito(event)"><i class="far fa-times-circle"></i></a>
    `;
    return producto;
}

//eliminar un producto del carrito de compras
function eliminarProductoCarrito(event){
    //elimino el producto del DOM
    let producto = event.target.parentNode.parentNode;
    producto.parentNode.removeChild(producto);
    
    //elimino el producto del arreglo de productos en el carrito
    let precio = event.target.parentNode.parentNode.childNodes[3].textContent.split('$');
    total -= precio[1]; 
    cantidad_productos--;

    //actualizo el listado a mostrar en el carrito
    actualizarCarrito();
}

//visualizar un producto en el modal, al hacer click en la lupa sobre cada producto.
function verProducto(imagen, nombre, precio){
    document.querySelector('.modal-image img').setAttribute("src", `images/shop/products/${imagen}`);
    document.querySelector('.product-title').textContent = nombre;
    document.querySelector('.product-price').textContent = `$${precio}`;
}

function actualizarCarrito(){
    if(total === 0){
        let texto = document.createElement('h4');
        texto.setAttribute("id", "sin-productos");
        texto.textContent = 'No hay productos agregados';
        carrito.appendChild(texto);

        let total = document.querySelector('#carrito-total');
        if(total){
            total.parentNode.removeChild(total);
        }
    }else if(cantidad_productos === 1 && !document.querySelector('#carrito-total')){
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

//validar correo utilizado expresion regular, aceptando caracteres de UTF-8.
function validarCorreo (event){
    let correo = event.target.value; 

    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(correo)){
        alert("La dirección de email " + correo + " es correcta.");
    } else {
        alert("La dirección de email es incorrecta.");
    }
}