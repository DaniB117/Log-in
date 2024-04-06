import  { campoVacio }  from './funciones.js'

const mensajeError = document.getElementsByClassName("error")[0]

document.getElementById("login-form").addEventListener("submit", async (e) =>{
    e.preventDefault();

    const formData = new FormData(e.target)

    // Obtener el valor del campo de formulario 'user'
    let datos = {
        user: formData.get('user'),
        password: formData.get('password')
    }
    //Tambien se puede usar e.target.user.value
    
    const res = await fetch("http://localhost:1234/api/login",{
        method: "POST",
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify(datos)
    })

    if (!res.ok) {  
        campoVacio(datos)
        return mensajeError.classList.remove("escondido")
    }
    
    const resJson = await res.json();
    if (resJson.redirect){
        campoVacio(datos)
        mensajeError.classList.add("escondido")
        window.location.href = resJson.redirect
    }
})