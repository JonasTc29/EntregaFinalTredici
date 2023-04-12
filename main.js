// --- FUNCIONES ---

function mialerta()
{  
    alert("Reservas únicamente por WhatsApp");
}

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
        
        this.listaCarrito= []; 
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
            calcularTotal() ;
          
            // falta actualizar el valor del total también
            this.alertaProductoQuitado(prod.nombre);
        }
    }
}

// --- CÓDIGO ---

// Productos de la galería como JSON
const productosDisponibles = [
    {id: 1, nombre: "Whey Protein ENA", precio: 6000, stockDisponible: 10, cantActual: 0, rutaImg: "./Assets/Proteena.png"},
    {id: 2, nombre: "Proteina Bsn Chocolate", precio:18000, stockDisponible:5,cantActual: 0, rutaImg: "./Assets/ProteB.jpg"},
    {id: 3, nombre: "Proteina Bsn Vainilla", precio:18000, stockDisponible:5,cantActual: 0, rutaImg: "./Assets/Vainillabsn.png"},
    {id: 4,nombre:  "Proteina Muscletech",precio: 15000, stockDisponible:15, cantActual: 0, rutaImg:"./Assets/ProteMuscletech.png"},
    {id: 5, nombre: "Proteina Star", precio:4800, stockDisponible:5, cantActual: 0, rutaImg:"./Assets/Protestar.png"},
    {id: 6, nombre: "Proteina Cellucor",precio: 20000,stockDisponible: 4, cantActual: 0, rutaImg:"./Assets/Proteincelu.png"},
    {id: 7, nombre: "Quemador ENA",precio: 2200, stockDisponible:15, cantActual: 0, rutaImg:"./Assets/Quemadorena.webp"},
    {id: 8, nombre: "Quemador BPI Sports", precio: 4000,stockDisponible: 10, cantActual: 0, rutaImg:"./Assets/Quemadorhp.png"},
    {id: 9, nombre: "Quemador Ultra Tech", precio: 3500,stockDisponible: 10, cantActual: 0, rutaImg:"./Assets/Quemadorultra.webp"}, 
    {id: 10, nombre: "Quemador Universal", precio: 7500,stockDisponible: 10, cantActual: 0, rutaImg:"./Assets/Quemadoruniversal.webp"},
    {id: 11, nombre: "Quemador Women Keto", precio: 3000,stockDisponible: 1, cantActual: 0, rutaImg:"./Assets/Quemadorwomen.png"},
    {id: 12, nombre: "Quemador Black",precio:  4000, stockDisponible:3, cantActual: 0, rutaImg:"./Assets/Quemadorblack.jpg"}, 
 ];
// El carrito empieza vacío
let miCarrito = new Carrito();

function agregarACarrito(elem) {
    let id = isNaN(elem) ? elem.id : elem;
    miCarrito.agregarProducto(id);
}

function quitarDelCarrito(elem) {
    let id = isNaN(elem) ? elem.id : elem;
    miCarrito.quitarProducto(id);
}

calcularTotal(); // despues lo voy a mover

// Para que se actualice el valor total del carrito cada vez que se agregue un producto
function addListeners() {
    let botonesAgregar = document.querySelectorAll('.btn-agregar');
    for (var i = 0 ; i < botonesAgregar.length; i++) {
        botonesAgregar[i].addEventListener('click', (event) => {
            calcularTotal();
        }); 
     }
}

addListeners();

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