// --- FUNCIONES ---

function mialerta()
{  
    alert("Reservas únicamente por WhatsApp");
}

function inicializarProductosDisponibles() {
    return [
        new Producto(1, "Whey Protein ENA", 6000, 10, "./Assets/Proteena.png" ),
        new Producto(2, "Proteina Bsn Chocolate", 18000, 5, "./Assets/ProteB.jpg"),
        new Producto(3, "Proteina Bsn Vainilla", 18000, 5, "./Assets/Vainillabsn.png"),
        new Producto(4, "Proteina Muscletech", 15000, 15, "./Assets/ProteMuscletech.png"),
        new Producto(5, "Proteina Star", 4800, 5, "./Assets/Protestar.png"),
        new Producto(6, "Proteina Cellucor", 20000, 4, "./Assets/Proteincelu.png"),
        new Producto(7, "Quemador ENA", 2200, 15, "./Assets/Quemadorena.webp"),
        new Producto(8, "Quemador BPI Sports", 4000, 10, "./Assets/Quemadorhp.png"),
        new Producto(9, "Quemador Ultra Tech", 3500, 10, "./Assets/Quemadorultra.webp"), 
        new Producto(10, "Quemador Universal", 7500, 10, "./Assets/Quemadoruniversal.webp"),
        new Producto(11, "Quemador Women Keto", 3000, 1, "./Assets/Quemadorwomen.png"),
        new Producto(12, "Quemador Black", 4000, 3, "./Assets/Quemadorblack.jpg"), 
    ];
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

class Producto
{
    constructor(id, nombre, precio, stockDisponible, rutaImg)
    {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stockDisponible = stockDisponible;
        this.cantActual = 0;
        this.rutaImg = rutaImg;
    }
}
 
class Carrito
{
    constructor()
    {
        this.listaCarrito = [];
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
            let nuevoProducto = productosDisponibles.find(prod => prod.id == id);
            
            nuevoProducto.cantActual += 1;
            nuevoProducto.stockDisponible -= 1;
            
            this.listaCarrito.push(nuevoProducto);
            
            let prueba_carrito = document.getElementById("contenedor_carrito");
            prueba_carrito.innerHTML += `
            <div class="card row-prod-carrito" style="width: 18rem;">
                <img src= "${nuevoProducto.rutaImg}" class="img-fluid rounded-start prod-carrito-img" alt="..." />
                <div class="card-body prod-carrito" id=prod-carrito-${nuevoProducto.id}">
                    <h5 class="card-title">${nuevoProducto.nombre}</h5>
                    <p class="card-text" id="det-prod-carrito-${nuevoProducto.id}">
                        Precio: $${nuevoProducto.precio} x ${nuevoProducto.cantActual} unid.
                    </p>
                </div>  
            </div>
            `;

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
        if (prod.cantActual - 1 >= 0)
        {
            prod.cantActual -= 1;
            prod.stockDisponible += 1;
        }
    }
}

// --- CÓDIGO ---

const productosDisponibles = inicializarProductosDisponibles();
let miCarrito = new Carrito();

function agregarACarrito(elem) {
    miCarrito.agregarProducto(elem.id);
}

calcularTotal(); // despues lo voy a mover

// Para que se actualice el valor total del carrito cada vez que se agregue un producto
let botonesAgregar = document.querySelectorAll('.btn-agregar');
for (var i = 0 ; i < botonesAgregar.length; i++) {
    botonesAgregar[i].addEventListener('click', (event) => {
        calcularTotal();
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
}