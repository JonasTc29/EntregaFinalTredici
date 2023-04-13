// --- FUNCIONES ---

function calcularTotal()
{
    let total = 0;
    for (let i = 0; i < miCarrito.listaCarrito.length; i++)
    {
        let productoActual = miCarrito.listaCarrito[i];
        let precioTotalProducto = productoActual.cantActual * productoActual.precio;
        total = total + precioTotalProducto;
    }
    document.getElementById("printTotalCarrito").innerHTML = `$${total}`;
}

// --- CLASES ---
 
class Carrito
{
    constructor()
    {
        this.listaCarrito = this.obtenerCarritoDeStorage();
        for (let i = 0; i < this.listaCarrito.length; i++) {
            const item = this.listaCarrito[i];
            this.agregarAModal(item);
        }
    }

    obtenerCarritoDeStorage() {
        let miCarrito = localStorage.getItem("carrito");
        return JSON.parse(miCarrito) || [];
    }

    actualizarCarritoEnStorage()
    {
        localStorage.setItem("carrito", JSON.stringify(this.listaCarrito));
    }

    existeEnCarrito(id) {
        return this.listaCarrito.some(prod => prod.id == id);
    }

    alertaProductoAgregado(nombreProducto)
    {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Se ha añadido el producto al carrito: \n${nombreProducto}`,
            showConfirmButton: false,
            timer: 1500
          });
    }

    alertaProductoQuitado(nombreProducto)
    {
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: `Se ha quitado una unidad del producto \n${nombreProducto} del carrito`,
            showConfirmButton: false,
            timer: 1500
          });
    }

    agregarAModal(nuevoProducto) {
        let prueba_carrito = document.getElementById("contenedor_carrito");
        prueba_carrito.innerHTML += `
        <div class="card row-prod-carrito" id="fila-prod-${nuevoProducto.id}" style="width: 18rem;">
            <img src= "${nuevoProducto.rutaImg}" class="img-fluid rounded-start prod-carrito-img" />
            <div class="card-body prod-carrito" id=prod-carrito-${nuevoProducto.id}">
                <h5 class="card-title">${nuevoProducto.nombre}</h5>
                <p class="card-text" id="det-prod-carrito-${nuevoProducto.id}">
                    Precio: $${nuevoProducto.precio} x ${nuevoProducto.cantActual} unid.
                </p>
                <button type="button" class="btn btn-primary btn-sm btn-agregar" onclick="quitarDelCarrito(${nuevoProducto.id})">
                    <i class="fas fa-minus"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm btn-agregar" onclick="agregarACarrito(${nuevoProducto.id})">
                    <i class="fas fa-plus"></i>
                </button>   
            </div>  
        </div>
        `;  
    }

    agregarProducto(id)
    {
        console.log("Agregando el producto con id " + id + " al carrito")
        if (this.existeEnCarrito(id))
        {
            // Encuentro el producto en el carrito
            let prod = this.listaCarrito.find(prod => prod.id == id); // Doble igual y no triple porque el id viene como string y el de prod disponibles es numero
            
            if (prod.stockDisponible - 1 >= 0)
            {
                prod.cantActual += 1;
                prod.stockDisponible -= 1;

                // Actualizo la cantidad del producto ya existente en el carrito
                let detalleProd = document.getElementById(`det-prod-carrito-${prod.id}`);
                detalleProd.innerHTML = `
                <p class="card-text det-prod-carrito-${prod.id}">
                    Precio: $ ${prod.precio} x ${prod.cantActual} unid.
                </p>`;

                this.actualizarCarritoEnStorage();
                this.alertaProductoAgregado(prod.nombre);
            }
            else
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Sin stock disponible',
                    text: `No hay más stock disponible del producto: ${prod.nombre}`
                  });
            }
        }
        else
        {
            // Agrego la card del nuevo producto al carrito
            const prodEnGaleria = productosDisponibles.find(prod => prod.id == id);
            
            let nuevoProducto = { ...prodEnGaleria };            
            nuevoProducto.cantActual += 1;
            nuevoProducto.stockDisponible -= 1;
            
            this.listaCarrito.push(nuevoProducto);
            
            this.agregarAModal(nuevoProducto);
            addListeners();
            this.actualizarCarritoEnStorage();
            this.alertaProductoAgregado(nuevoProducto.nombre);
        }
    }

    vaciarCarrito()
    {
        let filasDelCarrito = document.querySelectorAll('.row-prod-carrito');
        for (let i = 0; i < filasDelCarrito.length; i++) {
            filasDelCarrito[i].remove();
        }
        this.listaCarrito= []; 
        this.actualizarCarritoEnStorage();
        calcularTotal();
    }

    quitarProducto(id) 
    {
        let prod = this.listaCarrito.find(prod => prod.id == id);
        if (prod.cantActual - 1 > 0)
        {
            prod.cantActual -= 1;
            prod.stockDisponible += 1;
            
            // Actualizo la cantidad del producto ya existente en el carrito
            let detalleProd = document.getElementById(`det-prod-carrito-${prod.id}`);
            detalleProd.innerHTML = `
            <p class="card-text det-prod-carrito-${prod.id}">
                Precio: $ ${prod.precio} x ${prod.cantActual} unid.
            </p>`;
            
            this.actualizarCarritoEnStorage();
            this.alertaProductoQuitado(prod.nombre);
        }
        else
        {
            // Saco el producto del carrito
            let detalleProd = document.getElementById(`fila-prod-${prod.id}`);            
            detalleProd.remove();
         
            // Ahora borro del carrito el último elemento de ese producto
            let indiceDelProducto = this.listaCarrito.indexOf(prod);
            this.listaCarrito.splice(indiceDelProducto, 1);

            this.actualizarCarritoEnStorage();
            calcularTotal();
          
            this.alertaProductoQuitado(prod.nombre);
        }
    }
}

function agregarACarrito(elem) {
    let id = isNaN(elem) ? elem.id : elem;
    miCarrito.agregarProducto(id);
}

function quitarDelCarrito(elem) {
    let id = isNaN(elem) ? elem.id : elem;
    miCarrito.quitarProducto(id);
}

function vaciarCarrito() {
    miCarrito.vaciarCarrito();
}

// Para que se actualice el valor total del carrito cada vez que se agregue un producto
function addListeners() {
    let botonesAgregar = document.querySelectorAll('.btn-agregar');
    for (var i = 0 ; i < botonesAgregar.length; i++) {
        botonesAgregar[i].addEventListener('click', (event) => {
            calcularTotal();
        }); 
     }
     document.querySelector('.btn-vaciar').addEventListener('click', () => {
        vaciarCarrito();
     });
}

// Function para finalizar compra -> Muestra fin de compra exitosa y vacía el carrito
function finalizarCompra()
{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: '¡Compra finalizada exitosamente!',
        showConfirmButton: false,
        timer: 1500
      })
    miCarrito.vaciarCarrito();

    // Limpio el HTML
    let contenedorCarrito = document.getElementById("contenedor_carrito");
    contenedorCarrito.innerHTML = "";

    calcularTotal();
    localStorage.clear();
}

// --- CÓDIGO ---

async function obtenerProductosDisponibles() {
    const res = await fetch('./prod-disp.json');
    const listaProds = await res.json();
    return listaProds;
}

// Variables globales y main

let productosDisponibles = null;
let miCarrito = null;

async function main() {
    productosDisponibles = await obtenerProductosDisponibles();
    miCarrito = new Carrito();
    calcularTotal();
    addListeners();
}

main();