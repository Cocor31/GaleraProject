/*************************/
/*** Import used modules */
const { Sequelize } = require('sequelize')

/*************************/
/*** Connexion à la base de donnée */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
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

/*************************/
/*** Synchronisation des modèles */
db.sequelize.sync({ alter: true })     // permet de synchroniser les models JS avec les tables dans la BDD

module.exports = db