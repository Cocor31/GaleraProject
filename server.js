/*************************/
/*** Import used modules */
const app = require("./app");

/*************************/
/*** Connexion à la base de donnée */
let DB = require('./db.config')
const mongoose = require('mongoose')



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



