/*************************/
/*** Import used modules */
const { Sequelize } = require('sequelize')

/*************************/
/*** Récupération variables de connexion */
const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = JSON.parse(process.env.MARIA_DB_PARAMS)

/*************************/
/*** Connexion à la base de donnée */
let sequelize = new Sequelize(
    DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false
}
)

/*************************/
/*** Appel des modèles */
const db = {}
db.sequelize = sequelize
db.Formation = require('./models/formation')(sequelize)
db.Formateur = require('./models/formateur')(sequelize)
db.Eleve = require('./models/eleve')(sequelize)
db.Module = require('./models/module')(sequelize)
db.Note = require('./models/note')(sequelize)
db.Admin = require('./models/admin')(sequelize)

/*************************/
/*** Mise en place des relations */
db.Formation.hasMany(db.Eleve, { foreignKey: 'id_formation' })
db.Eleve.belongsTo(db.Formation, { foreignKey: 'id_formation' })

db.Formation.hasMany(db.Module, { foreignKey: 'id_formation' })
db.Module.belongsTo(db.Formation, { foreignKey: 'id_formation' })

db.Formateur.hasMany(db.Module, { foreignKey: 'id_formateur' })
db.Module.belongsTo(db.Formateur, { foreignKey: 'id_formateur' })

db.Formateur.hasMany(db.Note, { foreignKey: 'id_formateur' })
db.Note.belongsTo(db.Formateur, { foreignKey: 'id_formateur', onDelete: 'cascade' })

db.Eleve.hasMany(db.Note, { foreignKey: 'id_eleve' })
db.Note.belongsTo(db.Eleve, { foreignKey: 'id_eleve' })


/*************************/
/*** Synchronisation des modèles */
db.sequelize.sync({ alter: true })     // permet de synchroniser les models JS avec les tables dans la BDD

module.exports = db