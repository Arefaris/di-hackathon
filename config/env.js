import dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL
    || !process.env.SESSION_SECRET 
    || !process.env.ORIGIN_URL) {
    console.error('SESSION_SECRET is not defined!');
    process.exit(1);
}