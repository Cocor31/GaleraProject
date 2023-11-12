/*************************/
/*** Import used modules */
const express = require('express')
const eleveCtrl = require('../controllers/eleve')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use((req, res, next) => {
    const event = new Date()
    console.log('Eleve Time:', event.toString())
    next()
})

/************************************/
/*** Routes for eleve resource */
router.get('/', eleveCtrl.getAllEleves)
router.get('/:id', eleveCtrl.getEleve)
router.put('', eleveCtrl.addEleve)
// router.patch('/:id', eleveCtrl.updateEleve) 
router.delete('/:id', eleveCtrl.deleteEleve)

module.exports = router