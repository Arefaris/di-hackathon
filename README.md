**Chat App**
This is a Node.js + Express + Socket.IO backend for a simple real-time chat application with authentication and persistent chat storage using PostgreSQL.

**Features**
User registration and login (username + password)

Session-based authentication using express-session

Socket.IO for real-time chat communication

PostgreSQL with knex.js for database queries

Chat persistence with support for private and group chats

Modular structure with routers, models, controllers, and middleware

**Getting Started**
You can follow these instructions to get your project up and running locally.

**Clone the Repository**
Clone the repository to your local machine:

```
git clone https://github.com/Arefaris/di-hackathon.git
cd di-hackathon
```

**Install Dependencies**
Install all necessary project dependencies:

```
npm install
```

**Set Up Environment Variables**
Create a `.env` file in the root directory of the project and populate it with the following variables:

```
DATABASE_URL=your_neon_connection_string # Your PostgreSQL connection string (e.g., Neon DB)
SESSION_SECRET=your_super_secret # Secret key for sessions (generate a strong one)
NODE_ENV=development # Or 'production' for production environment
ORIGIN_URL=http://localhost:3000 # Your frontend's URL if it's separate. Otherwise, this is the backend URL.
```

**Database Setup**
_Run Migrations_
Execute migrations to create the required database schema:

```
npx knex migrate:latest --knexfile ./knexfile.cjs
```

**Seed Sample Data (Optional)**
To add sample data for testing purposes, run the seed files:

```
npx knex seed:run --knexfile ./knexfile.cjs
```

**Start the Server**
After installing all dependencies and setting up the database, you can start the server:

```
npm start
```

Your application will be running at: http://localhost:3000 (replace port number with the value from `.env` file)
