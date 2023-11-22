/*************************/
/*** Import used modules */
const express = require('express')
const logRouters = require("../middleware/logRouters")
const formationCtrl = require('../controllers/formation')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use(logRouters('Formation'))

/************************************/
/*** Routes for formation resource */
router.get('/', formationCtrl.getAllFormations)
router.get('/:id', formationCtrl.getFormation)
router.put('', formationCtrl.addFormation)
// router.patch('/:id', formationCtrl.updateFormation)
router.delete('/:id', formationCtrl.deleteFormation)

module.exports = router