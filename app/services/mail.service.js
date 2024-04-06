import nodemailer, { createTransport } from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }

})

export async function enviarMailVerificacion(direccion, token){
    return await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to: direccion,
        subject:"Verificacion de nueva cuenta - Naqver",  
        html: crearMailVerificacion(token)
    })
}

function crearMailVerificacion(token){
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            html{
                background-color: white;
            }
            body{
                max-width: 600px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin:auto;
                background-color: rgb(229, 255, 246);
                padding: 40px;
                border-radius: 5px;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <h1>Verificación de correo eletrónico.</h1>
        <p>Se ha creado una cuenta en Naqver con este correo</p>
        <br/>
        <p>Si usted no creó esta cuenta, ingnore este correo.</p>
        <p>Si usted creo la cuenta, verifiquela <a href="http://localhost:1234/verificar/${token}" target="_blank" rel="noopener noreferrer">haciendo click aqui</a>.</p>
    </body>
    </html>`
}