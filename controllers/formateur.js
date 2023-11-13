/*************************/
/*** Import used modules */
const DB = require("../db.config")
const Formateur = DB.Formateur

const bcrypt = require('bcrypt')


/*****************************************/
/*** Unit route for Formateur resource */

exports.getAllFormateurs = (req, res) => {
    Formateur.findAll()
        .then(formateurs => res.json({ data: formateurs }))
        .catch(e => res.status(500).json({ message: "Database Error", error: e }))
}

exports.getFormateur = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let formateur = await Formateur.findOne({ where: { id: pid } })
        // Test si résultat
        if (formateur === null) {
            return res.status(404).json({ message: `This formateur does not exist !` })
        }
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: formateur })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.addFormateur = async (req, res) => {
    const { lastname, firstname, email, password } = req.body

    // Validations des données reçues
    if (!lastname || !firstname || !email || !password) {
        return res.status(400).json({ message: `Missing Data` })
    }

    try {
        // Vérification si donnée existe déja
        let formateur = await Formateur.findOne({ where: { lastname: lastname, firstname: firstname }, raw: true })
        if (formateur !== null) {
            return res.status(409).json({ message: `The formateur ${lastname} ${firstname} already exists !` })
        }
        // Password Hash
        let hash = await bcrypt.hash(password, parseInt("process.env.BCRYPT_SALT_ROUND"))
        req.body.password = hash
        // Création
        formateur = await Formateur.create(req.body)
        return res.json({ message: 'Formateur Created', data: formateur })
    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

// exports.updateFormateur = async (req, res) => {
//     let pid = parseInt(req.params.id)

//     return res.json({ message: `Formateur id:${pid} Updated` })
// }

exports.deleteFormateur = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Suppression
        let count = await Formateur.destroy({ where: { id: pid } })

        // Test si résultat
        if (count === 0) {
            return res.status(404).json({ message: `This formateur does not exist !` })
        }
        // Message confirmation Deletion
        return res.json({ message: `Formateur (id: ${pid} ) Successfully Deleted. ${count} row(s) deleted` })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}