/*************************/
/*** Import used modules */
const express = require('express')
const logRouters = require("../middleware/logRouters")
const contactCtrl = require('../controllers/contact')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use(logRouters('Contact'))

/************************************/
/*** Routes for eleve resource */
router.get('/', contactCtrl.getAllContact)
router.get('/:id', contactCtrl.getContact)
router.put('', contactCtrl.addContact)
// router.patch('/:id', contactCtrl.updateContact) 
router.delete('/:id', contactCtrl.deleteContact)

module.exports = router