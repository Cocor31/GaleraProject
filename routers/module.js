/*************************/
/*** Import used modules */
const express = require('express')
const logRouters = require("../middleware/logRouters")
const moduleCtrl = require('../controllers/module')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use(logRouters('Module'))

/************************************/
/*** Routes for module resource */
router.get('/', moduleCtrl.getAllModules)
router.get('/:id', moduleCtrl.getModule)
router.put('', moduleCtrl.addModule)
// router.patch('/:id', moduleCtrl.updateModule) 
router.delete('/:id', moduleCtrl.deleteModule)

module.exports = router