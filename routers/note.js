/*************************/
/*** Import used modules */
const express = require('express')
const logRouters = require("../middleware/logRouters")
const noteCtrl = require('../controllers/note')
const jwtCheck = require("../middleware/jwtCheck");

/***************************/
/*** Get Expresss's router */
let router = express.Router()

/*********************************************/
/*** Middleware to log date for each request */
router.use(logRouters('Note'))

/************************************/
/*** Routes for note resource */
router.get('/', jwtCheck(['admin']), noteCtrl.getAllNotes)
router.get('/formateur/:id', jwtCheck(['admin']), noteCtrl.getNoteFormateur)
router.get('/eleve/:id', jwtCheck(['admin']), noteCtrl.getNoteEleve)
router.get('/:id_formateur/:id_eleve', jwtCheck(['admin']), noteCtrl.getNote)
router.put('', jwtCheck(['admin', 'eleve']), noteCtrl.addNote)
// router.patch('/:id', noteCtrl.updateNote)  
router.delete('/:id_formateur/:id_eleve', jwtCheck(['admin']), noteCtrl.deleteNote)

module.exports = router