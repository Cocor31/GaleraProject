/*************************/
/*** Import used modules */
const DB = require("../db.config")
const Note = DB.Note
const Formateur = DB.Formateur
const Eleve = DB.Eleve
const Module = DB.Module


/*****************************************/
/*** Unit route for Note resource */

exports.getAllNotes = (req, res) => {
    Note.findAll()
        .then(notes => res.json({ data: notes }))
        .catch(e => res.status(500).json({ message: "Database Error", error: e }))
}

exports.getNote = async (req, res) => {
    let pid_formateur = parseInt(req.params.id_formateur)
    let pid_eleve = parseInt(req.params.id_eleve)

    // Vérification si le champ id est présent et cohérent
    if (!pid_formateur || !pid_eleve) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let note = await Note.findOne({ where: { id_formateur: pid_formateur, id_eleve: pid_eleve } })
        // Test si résultat
        if (note === null) {
            return res.status(404).json({ message: `This note does not exist !` })
        }
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: note })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.getNoteFormateur = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let notes = await Note.findAll({ where: { id_formateur: pid } })
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: notes })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.getNoteEleve = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let notes = await Note.findAll({ where: { id_eleve: pid } })
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: notes })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.addNote = async (req, res) => {
    const { id_formateur, id_eleve, value, comment, module_id } = req.body

    // Validations des données reçues
    if (!id_formateur || !id_eleve || !value || !comment || !module_id) {
        return res.status(400).json({ message: `Missing Data` })
    }

    try {
        // Vérification si donnée existe déja
        let note = await Note.findOne({ where: { id_formateur: id_formateur, id_eleve: id_eleve }, raw: true })
        if (note !== null) {
            return res.status(409).json({ message: `The note for formateur ${id_formateur} by eleve ${id_eleve} already exists !` })
        }
        // Vérification si formateur existe
        let formateur = await Formateur.findOne({ where: { id: id_formateur } })
        if (formateur === null) {
            return res.status(404).json({ message: `The formateur chosen for this note does not exist !` })
        }
        // Vérification si eleve existe
        let eleve = await Eleve.findOne({ where: { id: id_eleve } })
        if (eleve === null) {
            return res.status(404).json({ message: `The eleve chosen for this note does not exist !` })
        }
        // Vérification si module existe
        let myModule = await Module.findOne({ where: { id: module_id } })
        if (myModule === null) {
            return res.status(404).json({ message: `The module chosen for this note does not exist !` })
        }
        // Vérification si formateur est associé au module
        if (parseInt(myModule.id_formateur) !== parseInt(id_formateur)) {
            return res.status(404).json({ message: `The module chosen for this note is not associated with this formateur !` })
        }
        // Création
        note = await Note.create(req.body)
        return res.json({ message: 'Note Created', data: note })
    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

// exports.updateNote = async (req, res) => {
//     let pid = parseInt(req.params.id)

//     return res.json({ message: `Note id:${pid} Updated`})
// }

exports.deleteNote = async (req, res) => {
    let pid_formateur = parseInt(req.params.id_formateur)
    let pid_eleve = parseInt(req.params.id_eleve)

    // Vérification si le champ id est présent et cohérent
    if (!pid_formateur || !pid_eleve) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Suppression
        let count = await Note.destroy({ where: { id_formateur: pid_formateur, id_eleve: pid_eleve } })

        // Test si résultat
        if (count === 0) {
            return res.status(404).json({ message: `This note does not exist !` })
        }
        // Message confirmation Deletion
        return res.json({ message: `Note (id_formateur: ${pid_formateur} id_eleve: ${pid_eleve} ) Successfully Deleted. ${count} row(s) deleted` })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}