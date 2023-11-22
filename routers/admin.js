/*************************/
/*** Import used modules */
const express = require('express')
const logRouters = require("../middleware/logRouters")
const adminCtrl = require('../controllers/admin')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use(logRouters('Admin'))

/************************************/
/*** Routes for admin resource */
router.get('/', adminCtrl.getAllAdmins)
router.get('/:id', adminCtrl.getAdmin)
router.put('', adminCtrl.addAdmin)
// router.patch('/:id', adminCtrl.updateAdmin)
router.delete('/:id', adminCtrl.deleteAdmin)

module.exports = router