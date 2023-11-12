/*************************/
/*** Import used modules */
const DB = require("../db.config")
const Admin = DB.Admin


/*****************************************/
/*** Unit route for Admin resource */

exports.getAllAdmins = (req, res) => {
    Admin.findAll()
        .then(admins => res.json({ data: admins }))
        .catch(e => res.status(500).json({ message: "Database Error", error: e }))
}

exports.getAdmin = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let admin = await Admin.findOne({ where: { id: pid } })
        // Test si résultat
        if (admin === null) {
            return res.status(404).json({ message: `This admin does not exist !` })
        }
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: admin })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.addAdmin = async (req, res) => {
    const { name } = req.body

    // Validations des données reçues
    if (!name) {
        return res.status(400).json({ message: `Missing Data` })
    }

    try {
        // Vérification si donnée existe déja
        let admin = await Admin.findOne({ where: { name: name, }, raw: true })
        if (admin !== null) {
            return res.status(409).json({ message: `The admin ${name} already exists !` })
        }

        // Création
        admin = await Admin.create(req.body)
        return res.json({ message: 'Admin Created', data: admin })
    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

// exports.updateAdmin = async (req, res) => {
//     let pid = parseInt(req.params.id)

//     return res.json({ message: `Admin id:${pid} Updated` })
// }

exports.deleteAdmin = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Suppression
        let count = await Admin.destroy({ where: { id: pid } })

        // Test si résultat
        if (count === 0) {
            return res.status(404).json({ message: `This admin does not exist !` })
        }
        // Message confirmation Deletion
        return res.json({ message: `Admin (id: ${pid} ) Successfully Deleted. ${count} row(s) deleted` })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}
