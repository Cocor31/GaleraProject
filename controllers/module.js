/*************************/
/*** Import used modules */
const DB = require("../db.config")
const Module = DB.Module
const Formation = DB.Formation
const Formateur = DB.Formateur

/*****************************************/
/*** Unit route for Module resource */

exports.getAllModules = (req, res) => {
    Module.findAll()
        .then(modules => res.json({ data: modules }))
        .catch(e => res.status(500).json({ message: "Database Error", error: e }))
}

exports.getModule = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let myModule = await Module.findOne({ where: { id: pid } })
        // Test si résultat
        if (myModule === null) {
            return res.status(404).json({ message: `This module does not exist !` })
        }
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: myModule })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.addModule = async (req, res) => {
    const { nom, id_formation, id_formateur } = req.body

    // Validations des données reçues
    if (!nom || !id_formation || !id_formateur) {
        return res.status(400).json({ message: `Missing Data` })
    }

    try {
        // Vérification si donnée existe déja
        let myModule = await Module.findOne({ where: { nom: nom, id_formation: id_formation }, raw: true })
        if (myModule !== null) {
            return res.status(409).json({ message: `The module ${nom} already exists for the id_formation ${id_formation} !` })
        }
        // Vérification si formation existe
        let formation = await Formation.findOne({ where: { id: id_formation } })
        if (formation === null) {
            return res.status(404).json({ message: `The formation chosen for this module does not exist !` })
        }
        // Vérification si formateur existe
        let formateur = await Formateur.findOne({ where: { id: id_formateur } })
        if (formateur === null) {
            return res.status(404).json({ message: `The formateur chosen for this module does not exist !` })
        }
        // Création
        myModule = await Module.create(req.body)
        return res.json({ message: 'Module Created', data: myModule })
    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

// exports.updateModule = async (req, res) => {
//     let pid = parseInt(req.params.id)

//     return res.json({ message: `Module id:${pid} Updated` })
// }

exports.deleteModule = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Suppression
        let count = await Module.destroy({ where: { id: pid } })

        // Test si résultat
        if (count === 0) {
            return res.status(404).json({ message: `This module does not exist !` })
        }
        // Message confirmation Deletion
        return res.json({ message: `Module (id: ${pid} ) Successfully Deleted. ${count} row(s) deleted` })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}