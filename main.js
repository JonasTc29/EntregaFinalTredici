// --- FUNCIONES ---

function mialerta()
{  
    alert("Reservas únicamente por WhatsApp");
}

function funcionInicial()
{
    let cantidadError = 0;
    let seleccion = prompt("Bienvenido/a a Suplementos Buildhealth, ¿es usted mayor de 18 años? (SI o NO)");

    while (seleccion !== "SI" && seleccion !== "si" &&
           seleccion !== "NO" && seleccion !== "no")
    {
        cantidadError++;
        if (cantidadError > 3)
        {
            alert ("Te equivocaste demasiadas veces, ¡hasta pronto!");
            window.location.href = "https://www.google.com/";
            break;
        }
        alert("Por favor ingrese SI o NO");
        seleccion = prompt("Bienvenido, ¿es usted mayor de edad? (SI o NO)");
    }

    if (seleccion=== "no" || seleccion === "NO")
    { 
        alert ("Gracias por visitar nuestro sitio, ¡hasta pronto!");
        window.location.href = "https://www.google.com/";
    }
}

function inicializarProductosDisponibles() {
    return [
        new Producto(1, "Whey Protein ENA", 6000, 10),
        new Producto(2, "Proteina Bsn Chocolate", 18000, 5),
        new Producto(3, "Proteina Bsn Vainilla", 18000, 5),
        new Producto(4, "Proteina Muscletech", 15000, 15),
        new Producto(5, "Proteina Star", 4800, 5),
        new Producto(6, "Proteina Cellucor", 20000, 4),
        new Producto(7, "Quemador ENA", 2200, 15),
        new Producto(8, "Quemador BPI Sports", 4000, 10),
        new Producto(9, "Quemador Ultra Tech", 3500, 10), 
        new Producto(10, "Quemador Universal", 7500, 10),
        new Producto(11, "Quemador Women Keto", 3000, 0),
        new Producto(12, "Quemador Black", 4000, 3)    
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
    let printTotal = "$" + total;
    document.getElementById("printTotalCarrito").innerHTML = printTotal;
}

// --- CLASES ---

class Producto
{
    constructor(id, nombre, precio, stockDisponible)
    {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stockDisponible = stockDisponible;
        this.cantActual = 0;
    }
 
    getDescripcion() {
        return "Nombre : " + this.nombre + "\nPrecio: " + this.precio;
    }
 
    getStockDisponible() { return this.stockDisponible; }
 
    getCantActual() { return this.cantActual; }
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

    agregarProducto(id)
    {
        console.log("Agregando el producto con id " + id + " al carrito")
        if (this.existeEnCarrito(id))
        {
            // encontrar el producto en nuestro carrito y despues
            let prod = this.listaCarrito.find(prod => prod.id == id); // Doble igual y no triple porque el id viene como string y el de prod disponibles es numero
            console.log("el prod " + prod.nombre + " ya existe en el carrito, la cantidad actual es " + prod.cantActual + " y el stock disponible es " + prod.stockDisponible);
            
            if (prod.stockDisponible - 1 >= 0) {
                // Aumentar cantidad del producto en el carrito  
                prod.cantActual += 1;
                // restar el stock
                prod.stockDisponible -= 1;
                console.log("agregamos 1 unidad y ahora cantActual: " + prod.cantActual + " y el stockDisponible es " + prod.stockDisponible);
            }
            else
            {
                alert("No hay más stock disponible del producto: " + prod.nombre);
            }
        }
        else
        {
            let nuevoProducto = productosDisponibles.find(prod => prod.id == id);
            nuevoProducto.cantActual += 1;
            nuevoProducto.stockDisponible -= 1;
            this.listaCarrito.push(nuevoProducto);
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

funcionInicial();

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


