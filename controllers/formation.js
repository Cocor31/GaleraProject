/*************************/
/*** Import used modules */
const DB = require("../db.config")
const Formation = DB.Formation


/*****************************************/
/*** Unit route for Formation resource */

exports.getAllFormations = (req, res) => {
    Formation.findAll()
        .then(formations => res.json({ data: formations }))
        .catch(e => res.status(500).json({ message: "Database Error", error: e }))
}

exports.getFormation = async (req, res) => {
    let pid = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!pid) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    try {
        // Récupération
        let formation = await Formation.findOne({ where: { id: pid } })
        // Test si résultat
        if (formation === null) {
            return res.status(404).json({ message: `This formation does not exist !` })
        }
        // Renvoi de l'Objet trouvé pour cet Id
        return res.json({ data: formation })

    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

exports.addFormation = async (req, res) => {
    const { nom, debut, fin } = req.body

    // Validations des données reçues
    if (!nom || !debut || !fin) {
        return res.status(400).json({ message: `Missing Data` })
    }

    try {
        // Vérification si donnée existe déja
        let formation = await Formation.findOne({ where: { nom: nom }, raw: true })
        if (formation !== null) {
            return res.status(409).json({ message: `The formation ${nom} already exists !` })
        }
        // Création
        formation = await Formation.create(req.body)
        return res.json({ message: 'Formation Created', data: formation })
    } catch (err) {
        return res.status(500).json({ message: `Database Error`, error: err })
    }
}

// exports.updateFormation = async (req, res) => {
//     let pid = parseInt(req.params.id)

//     return res.json({ message: `Formation id:${pid} Updated` })
// }

// exports.deleteFormation = (req, res) => {
//     let pid = parseInt(req.params.id)

//     return res.status(204).json({})
// }