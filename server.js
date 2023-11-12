/*************************/
/*** Import used modules */
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


/*************************/
/*** Connexion à la base de donnée */
let DB = require('./db.config')


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
// const auth_router = require('./routers/auth')
const formation_router = require('./routers/formation')
const formateur_router = require('./routers/formateur')
const eleve_router = require('./routers/eleve')
const note_router = require('./routers/note')
const module_router = require('./routers/module')
// const admin_router = require('./routers/admin')


/****************************/
/*** Routage principal*/
app.get('/', (req, res) => res.send("I'm online good job !"))

// app.use('/auth', auth_router)
app.use('/formation', formation_router)
app.use('/formateur', formateur_router)
app.use('/eleve', eleve_router)
app.use('/note', note_router)
app.use('/module', module_router)
// app.use('/admin', admin_router)

app.all("*", (req, res) => res.status(501).send('What the hell are you doing !?!'))


/****************************/
/*** Démarrage de l'API*/
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB Connexion OK')
        DB.sequelize.authenticate()
            .then(() => console.log('MariaDB Connexion OK'))
            .then(() => {
                app.listen(process.env.API_PORT, () => {
                    console.log(`This server is running on port ${process.env.API_PORT}. Have fun !`)
                })
            })
            .catch(e => console.log('Database Error - MariaDB', e))
    })
    .catch(e => console.log('Database Error - MongoDB', e))



