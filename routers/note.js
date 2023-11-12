/*************************/
/*** Import used modules */
const express = require('express')
const noteCtrl = require('../controllers/note')

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use((req, res, next) => {
    const event = new Date()
    console.log('Note Time:', event.toString())
    next()
})

/************************************/
/*** Routes for note resource */
router.get('/', noteCtrl.getAllNotes)
router.get('/formateur/:id', noteCtrl.getNoteFormateur)
router.get('/eleve/:id', noteCtrl.getNoteEleve)
router.get('/:id_formateur/:id_eleve', noteCtrl.getNote)
router.put('', noteCtrl.addNote)
// router.patch('/:id', noteCtrl.updateNote)  
router.delete('/:id_formateur/:id_eleve', noteCtrl.deleteNote)

module.exports = router