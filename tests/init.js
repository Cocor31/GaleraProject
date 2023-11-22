// const adminCtrl = require('../controllers/admin')
const DB = require("../db.config")
const Admin = DB.Admin

const bcrypt = require('bcrypt')



exports.initAdminUser = async () => {
    const name = "admin"
    const password = "nimda"

    // Validations des données reçues
    if (!name || !password) {
        if (process.env.LOG_ROUTE_REQUEST.toUpperCase() === "YES") {
            console.log("Missing Data")
        }
        return
    }

    try {
        // Vérification si donnée existe déja
        let admin = await Admin.findOne({ where: { name: name, }, raw: true })
        if (admin !== null) {
            if (process.env.LOG_ROUTE_REQUEST.toUpperCase() === "YES") {
                console.log(`The admin ${name} already exists !`)
            }
            return
        }
        // Password Hash
        let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))

        // Création
        admin = await Admin.create({ name: name, password: hash })
        if (process.env.LOG_ROUTE_REQUEST.toUpperCase() === "YES") {
            console.log(`Admin Created!`)
        }

    } catch (err) {
        console.log(`Database Error`, err)
    }
}
