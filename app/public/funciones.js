const inputs =  document.querySelector(".input-container")
const xco = document.querySelectorAll(".input-container .x-container");
let alerticon = '<i class="fa-solid fa-triangle-exclamation" style="color: #f00505;"></i>'
const alertIconAdded = Array(xco.length).fill(false);
const children = document.querySelectorAll('.x-container input');

export function campoVacio(datos){
    let i = 0
    for (let key in datos){
        if (datos[key] === "") {
            inputs.children[i].classList.add('vacio')
            if (!alertIconAdded[i]) { 
                xco[i].insertAdjacentHTML('beforeend', alerticon)
                alertIconAdded[i] = true
                children.forEach(child => {
                    if (child.type === 'password') {
                        child.classList.add('password-input-active')
                    }
                })    
            }   
            } else {
            inputs.children[i].classList.remove('vacio')
            const icon = xco[i].querySelector('.fa-triangle-exclamation');
            if (icon) {
                icon.parentNode.removeChild(icon);
                alertIconAdded[i] = false
                if (children[i].type ==='password'){
                    children[i].classList.remove('password-input-active')    
                }
            } 
        }
        i++
    }       
}
