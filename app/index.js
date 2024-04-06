import express from 'express'
import { __dirname } from './util.js'
import { methods as authentication } from './controllers/authentication-controller.js'
import { methods as authorization } from './middlewares/authorization.js'
import cookieParser from 'cookie-parser'
//Server
const app = express()

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})

//Configuracion. Esto es para hacerlas de alguna forma publicas
app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(cookieParser())
//Rutas
app.get("/", authorization.soloPublico, (req, res) => {
    res.sendFile(__dirname + "/public/pages/login.html")
})

app.get("/register",authorization.soloPublico, (req, res) => {
  res.sendFile(__dirname + "/public/pages/register.html")
})

app.get("/admin", authorization.soloAdmin, (req, res) => {
  res.sendFile(__dirname + "/public/pages/admin/admin.html")
})

app.post("/api/login", authentication.login)

app.post("/api/register", authentication.register)

app.get("/verificar/:token", authentication.verificarCuenta)
