// FUNCIONES

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

function calcularTotal()
{
    let precios = document.querySelectorAll('.precio'); //selecciono todos los precios de los productos
    let total = 0;
    for (let i = 0; i < precios.length; i++) {
        let precioNumero = parseInt(precios[i].innerHTML.slice(2)); //convierto el valor del precio de string a numero para poder sumarlo
        total = total + precioNumero;
    }   
    let printTotal = "De comprar todos los productos de la web, el valor total del carrito sería de $ " + total;
    document.getElementById("printTotalCarrito").innerHTML = printTotal;
}

// CÓDIGO

funcionInicial();

calcularTotal();
