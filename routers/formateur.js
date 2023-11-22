/*************************/
/*** Import used modules */
const express = require('express')
const logRouters = require("../middleware/logRouters")
const formateurCtrl = require('../controllers/formateur')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use(logRouters('Formateur'))

/************************************/
/*** Routes for formateur resource */
router.get('/', formateurCtrl.getAllFormateurs)
router.get('/:id', formateurCtrl.getFormateur)
router.put('', formateurCtrl.addFormateur)
// router.patch('/:id', formateurCtrl.updateFormateur)   
router.delete('/:id', formateurCtrl.deleteFormateur)

module.exports = router