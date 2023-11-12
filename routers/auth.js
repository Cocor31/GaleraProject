/*************************/
/*** Import used modules */
const express = require('express')
const authCtrl = require('../controllers/auth')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use((req, res, next) => {
    const event = new Date()
    console.log('AUTH Time:', event.toString())
    next()
})

/**********************************/
/*** Routes for auth resource */
// router.post('/signup', authCtrl.signup)
router.post('/eleve/login', authCtrl.loginEleve)
router.post('/formateur/login', authCtrl.loginFormateur)
router.post('/admin/login', authCtrl.loginAdmin)

module.exports = router