/*************************/
/*** Import used modules */
const Contact = require("../models/contact");


/*****************************************/
/*** Unit route for Eleve resource */

exports.getAllContact = (req, res) => {
    Contact.find()
        .then(contacts => res.json({ data: contacts }))
        .catch(e => res.status(500).json({ message: "Database Error", error: e }))
}

exports.getContact = async (req, res) => {
    let pid = String(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let contact = await Contact.findOne({ _id: pid })
        // Test si résultat
        if (contact === null) {
            return res.status(404).json({ message: `This contact does not exist !` })
        }
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: contact })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.addContact = async (req, res) => {
    const { email, subject, message } = req.body

    // Validations des données reçues
    if (!email || !subject || !message) {
        return res.status(400).json({ message: `Missing Data` })
    }

    try {
        // Vérification si donnée existe déja

        // Création
        let contact = new Contact({
            ...req.body
        })
        contact = await contact.save()
        return res.json({ message: 'Contact Created', data: contact })
    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

// exports.updateContact = async (req, res) => {
//     let pid = parseInt(req.params.id)

//     return res.json({ message: `Contact id:${pid} Updated` })
// }

exports.deleteContact = async (req, res) => {
    let pid = String(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let contact = await Contact.findOne({ _id: pid })
        // Test si résultat
        if (contact === null) {
            return res.status(404).json({ message: `This contact does not exist !` })
        }
        // Suppression
        let info_delete = await Contact.deleteOne({ _id: pid })
        return res.json({ message: `Contact (id: ${pid} ) Successfully Deleted. ${info_delete.deletedCount} object(s) deleted` })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}