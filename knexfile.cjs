console.log('knexfile.cjs is being loaded!');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const knex = 
module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: path.join(__dirname, './config/migrations')
    },
    seeds: {
      directory: path.join(__dirname, './config/seeds')
    }
  }
};