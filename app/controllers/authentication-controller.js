import bcryptjs from 'bcryptjs'
import { readJSON } from '../read.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { enviarMailVerificacion } from '../services/mail.service.js'
const usuarios = readJSON('./usuarios.json')

dotenv.config()

async function login(req, res){
    console.log(req.body)
    const user = req.body.user
    const password = req.body.password

    if (!user || !password){
        return res.status(400).send({status: "Error", message: "Los campos estan incompletos"})
    }
    const userCheck = usuarios.find(usuario => usuario.user == user && usuario.verificado == true)
    if (!userCheck){
        return res.status(400).send({status: "Error", message: "Error durante el login"})
    }
    const loginCorrecto = await bcryptjs.compare(password, userCheck.password)
    if (!loginCorrecto)
    {
        return res.status(400).send({status: "Error", message: "Error durante el login"})
    }
    const token =jwt.sign({user:userCheck.user},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION})

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        path: "/"
    }

    res.cookie("jwt", token, cookieOption)
    return res.send({status:"ok", message:"Usuario loggeado", redirect: "/admin"})
}

async function register(req, res){
    console.log(req.body)
    const user = req.body.user
    const password = req.body.password
    const email = req.body.email

    if (!user || !password || !email){
        return res.status(400).send({status: "Error", message: "Los campos estan incompletos"})
    }

    const userCheck = usuarios.find(usuario => usuario.user == user)
    if (userCheck){
        return res.status(400).send({status: "Error", message: "Ya existe un usuario con este nombre"})
    }
    const salt = await bcryptjs.genSalt(5)
    const hashPassword = await bcryptjs.hash(password,salt)
    
    //Enviar mail de verificacion
    const tokenVerificacion = jwt.sign(
        {user:user},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRATION}
    )
    

    const mail = await enviarMailVerificacion(email, tokenVerificacion)
    console.log(mail)
    if(mail.accepted === 0){
        return res(500).send({status: "Error", message: "Error enviando mail de verificación"})
    }

    const nuevoUsuario = {
        user, email, password: hashPassword, verificado:false
    }
    console.log(nuevoUsuario)
    usuarios.push(nuevoUsuario)
    return res.status(201).send({status: "ok", message: `Usuario ${nuevoUsuario.user} agregado`, redirect:"/"})
}

function verificarCuenta(req,res){
    try{
        if(!req.params.token){
            return res.redirect("/")
        }
        const decodificada = jwt.verify(req.params.token, process.env.JWT_SECRET)
        if(!decodificada || !decodificada.user){
            return res.redirect("/").send({status:"error", message: "Error en el token"})
        }
        const token =jwt.sign({user:decodificada.user},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRATION})
    
        const cookieOption = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
            path: "/"
        }

        const indexUserCheck = usuarios.findIndex(usuario => usuario.user == decodificada.user)
        usuarios[indexUserCheck].verificado = true
    
        res.cookie("jwt", token, cookieOption)
        console.log("USUARIO VERIFICADO")
        res.redirect("/")
    } catch(err){
        res.status(500)
        res.redirect("/")
    }
}

export const methods = {
    login,
    register,
    verificarCuenta
}