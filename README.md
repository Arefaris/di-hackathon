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
Clone the repo:

bash
Copy
Edit
git clone https://github.com/yourusername/chat-app-server.git
cd chat-app-server
Install dependencies:

bash
Copy
Edit
npm install
Set up environment variables:

Create a .env file in the root with the following:

ini
Copy
Edit
DATABASE_URL=your_neon_connection_string
SESSION_SECRET=your_super_secret
NODE_ENV=development
ORIGIN_URL=http://localhost:3000
Set up the database:

**Run migrations:**

bash
Copy
Edit
npx knex migrate:latest --knexfile ./knexfile.cjs
Seed sample data (optional):

bash
Copy
Edit  
npx knex seed:run --knexfile ./knexfile.cjs
Start the server:

bash
Copy
Edit
npm start
Your app will be running at http://localhost:3000
