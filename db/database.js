import Sequelize from 'sequelize';

const db = new Sequelize('codegig', 'postgres', 'gizmopup77', {
  host: 'localhost',
  dialect: 'postgres',
});

export default db;
