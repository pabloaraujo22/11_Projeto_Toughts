const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectado ao Banco!')
} catch (error) {
    console.log(`Não foi possivel conectar ao Banco: ${error}`)
}

module.exports = sequelize