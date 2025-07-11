import dotenv from 'dotenv';
import knex from 'knex';
dotenv.config();

//Configure Neon-base database connection. Use connection string format from .env-file


const connectionString = process.env.DATABASE_URL;
export const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
        migrations: {
            directory: './migrations'
        }
    }
});

export default db;