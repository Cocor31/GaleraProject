/*************************/
/*** Import used modules */
const { DataTypes } = require('sequelize')

/*************************/
/*** Import used modules */
module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(64),
            is: /^[0-9a-f]{64}$/i,        // Ici une contrainte de données
            allowNull: false
        },
    })
    return Admin
}