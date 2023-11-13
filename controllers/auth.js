/*************************/
/*** Import used modules */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const admin = require('../models/admin')

const DB = require("../db.config")
const Admin = DB.Admin
const Eleve = DB.Eleve
const Formateur = DB.Formateur

/**********************************/
/*** Unit route for Auth resource */

// exports.signup = async (req, res) => {
//     const { email, password } = req.body

//     // Check data from request
//     if (!email || !password) {
//         return res.status(400).json({ message: 'Missing Data' })
//     }

//     try {

//         // Password Hash
//         let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
//         req.body.password = hash


//     } catch (err) {
//         console.log(err)
//     }
// }
exports.loginEleve = async (req, res) => {
    const { email, password } = req.body
    // Check data from request
    if (!email || !password) {
        return res.status(400).json({ message: 'Bad credentials' })
    }

    try {
        // Get admin
        let eleve = await Eleve.findOne({ where: { email: email } })
        // Test si résultat
        if (eleve === null) {
            return res.status(404).json({ message: `This eleve does not exist !` })
        }
        // Password check  
        let test = await bcrypt.compare(password, eleve.password)
        if (!test) {
            return res.status(401).json({ message: 'Wrong password' })
        }

        // JWT generation
        const token = jwt.sign({
            payload: { userId: eleve.id, group: "eleve" }
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

        return res.json({ access_token: token })
    } catch (err) {
        console.log(err)
    }
}

exports.loginFormateur = async (req, res) => {
    const { email, password } = req.body
    // Check data from request
    if (!email || !password) {
        return res.status(400).json({ message: 'Bad credentials' })
    }

    try {
        // Get admin
        let formateur = await Formateur.findOne({ where: { email: email } })
        // Test si résultat
        if (formateur === null) {
            return res.status(404).json({ message: `This formateur does not exist !` })
        }
        // Password check  
        console.log(password)
        let test = await bcrypt.compare(password, formateur.password)
        if (!test) {
            return res.status(401).json({ message: 'Wrong password' })
        }

        // JWT generation
        const token = jwt.sign({
            payload: { userId: formateur.id, group: "formateur" }
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

        return res.json({ access_token: token })
    } catch (err) {
        console.log(err)
    }
}


exports.loginAdmin = async (req, res) => {
    const { name, password } = req.body
    // Check data from request
    if (!name || !password) {
        return res.status(400).json({ message: 'Bad credentials' })
    }

    try {
        // Get admin
        let admin = await Admin.findOne({ where: { name: name } })
        // Test si résultat
        if (admin === null) {
            return res.status(404).json({ message: `This admin does not exist !` })
        }
        // Password check  
        let test = await bcrypt.compare(password, admin.password)
        if (!test) {
            return res.status(401).json({ message: 'Wrong password' })
        }

        // JWT generation
        const token = jwt.sign({
            payload: { userId: admin.id, group: "admin" }
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

        return res.json({ access_token: token })
    } catch (err) {
        console.log(err)
    }
}