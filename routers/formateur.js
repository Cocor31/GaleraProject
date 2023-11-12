/*************************/
/*** Import used modules */
const express = require('express')
const formateurCtrl = require('../controllers/formateur')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use((req, res, next) => {
    const event = new Date()
    console.log('Formateur Time:', event.toString())
    next()
})

/************************************/
/*** Routes for formateur resource */
router.get('/', formateurCtrl.getAllFormateurs)
router.get('/:id', formateurCtrl.getFormateur)
router.put('', formateurCtrl.addFormateur)
// router.patch('/:id', formateurCtrl.updateFormateur)   
router.delete('/:id', formateurCtrl.deleteFormateur)

module.exports = router