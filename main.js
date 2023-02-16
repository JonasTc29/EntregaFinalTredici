function mialerta()
{  
    alert("Reservas únicamente por WhatsApp");
}

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

