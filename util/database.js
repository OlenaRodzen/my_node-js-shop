const Sequelize = require('sequelize');

const sequelize = new Sequelize.Sequelize('shop', 'root', 'dsFG65*gv&*!?Df', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
