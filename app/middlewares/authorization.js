import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { readJSON } from '../read.js'

const usuarios = readJSON('./usuarios.json')
dotenv.config()

function soloAdmin(req, res, next) {
    const loggeado = revisarCookie(req)
    if(loggeado) return next()
    return res.redirect("/")
}

function soloPublico(req, res, next){
    const loggeado = revisarCookie(req)
    if(!loggeado) return next()
    return res.redirect("/admin")
}

function revisarCookie(req){
    try{
        const cookieJWT = req.headers.cookie.split("; ")
            .find(cookie => cookie.startsWith("jwt=")).slice(4)
        const decodificado = jwt.verify(cookieJWT, process.env.JWT_SECRET)
        const userCheck = usuarios.find(usuario => usuario.user == decodificado.user)
        if (!userCheck) return false
        return true
    } catch{
        return false
    }
    
}

export const methods = {
    soloAdmin,
    soloPublico
}