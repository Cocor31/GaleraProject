/*************************/
/*** Import used modules */
const express = require('express')
const cors = require('cors')
const jwtCheck = require("./middleware/jwtCheck");
const logRouters = require("./middleware/logRouters")


/************************/
/*** API Initialization */
const app = express()

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


/****************************/
/*** Import routers modules */
const auth_router = require('./routers/auth')
const formation_router = require('./routers/formation')
const formateur_router = require('./routers/formateur')
const eleve_router = require('./routers/eleve')
const note_router = require('./routers/note')
const module_router = require('./routers/module')
const admin_router = require('./routers/admin')
const contact_router = require('./routers/contact')


/****************************/
/*** Routage principal*/
app.get('/', (req, res) => res.send("I'm online good job !"))

app.use('/auth', auth_router)
app.use('/formation', jwtCheck(['admin']), formation_router)
app.use('/formateur', jwtCheck(['admin']), formateur_router)
app.use('/eleve', jwtCheck(['admin']), eleve_router)
app.use('/note', note_router)
app.use('/module', jwtCheck(['admin']), module_router)
app.use('/admin', jwtCheck(['admin']), admin_router)        // <= Remove this MiddleWare for Create First Admin User
app.use('/contact', contact_router)

app.all("*", (req, res) => res.status(501).send('What the hell are you doing !?!'))


module.exports = app;