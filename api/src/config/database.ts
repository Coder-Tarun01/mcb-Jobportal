import { Sequelize } from 'sequelize';

const dbPath = process.env.DB_PATH || './database.sqlite';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
