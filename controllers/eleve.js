/*************************/
/*** Import used modules */
const DB = require("../db.config")
const Eleve = DB.Eleve
const Formation = DB.Formation

const bcrypt = require('bcrypt')


/*****************************************/
/*** Unit route for Eleve resource */

exports.getAllEleves = (req, res) => {
    Eleve.findAll()
        .then(eleves => res.json({ data: eleves }))
        .catch(e => res.status(500).json({ message: "Database Error", error: e }))
}

exports.getEleve = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let eleve = await Eleve.findOne({ where: { id: pid } })
        // Test si résultat
        if (eleve === null) {
            return res.status(404).json({ message: `This eleve does not exist !` })
        }
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: eleve })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.addEleve = async (req, res) => {
    const { lastname, firstname, email, password, id_formation } = req.body

    // Validations des données reçues
    if (!lastname || !firstname || !email || !password || !id_formation) {
        return res.status(400).json({ message: `Missing Data` })
    }

    try {
        // Vérification si donnée existe déja
        let eleve = await Eleve.findOne({ where: { lastname: lastname, firstname: firstname }, raw: true })
        if (eleve !== null) {
            return res.status(409).json({ message: `The eleve ${lastname} ${firstname} already exists !` })
        }
        // Vérification si email existe déja
        eleve = await Eleve.findOne({ where: { email: email }, raw: true })
        if (eleve !== null) {
            return res.status(409).json({ message: `This email already exists for another eleve !` })
        }
        // Vérification si formation existe
        let formation = await Formation.findOne({ where: { id: id_formation } })
        if (formation === null) {
            return res.status(404).json({ message: `The formation chosen for this eleve does not exist !` })
        }
        // Password Hash
        let hash = await bcrypt.hash(password, parseInt("process.env.BCRYPT_SALT_ROUND"))
        req.body.password = hash
        // Création
        eleve = await Eleve.create(req.body)
        return res.json({ message: 'Eleve Created', data: eleve })
    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

// exports.updateEleve = async (req, res) => {
//     let pid = parseInt(req.params.id)

//     return res.json({ message: `Eleve id:${pid} Updated` })
// }

exports.deleteEleve = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Suppression
        let count = await Eleve.destroy({ where: { id: pid } })

        // Test si résultat
        if (count === 0) {
            return res.status(404).json({ message: `This eleve does not exist !` })
        }
        // Message confirmation Deletion
        return res.json({ message: `Eleve (id: ${pid} ) Successfully Deleted. ${count} row(s) deleted` })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}