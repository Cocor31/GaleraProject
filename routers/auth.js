/*************************/
/*** Import used modules */
const express = require('express')
const logRouters = require("../middleware/logRouters")
const authCtrl = require('../controllers/auth')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use(logRouters('AUTH'))

/**********************************/
/*** Routes for auth resource */
// router.post('/signup', authCtrl.signup)
router.post('/eleve/login', authCtrl.loginEleve)
router.post('/formateur/login', authCtrl.loginFormateur)
router.post('/admin/login', authCtrl.loginAdmin)

module.exports = router