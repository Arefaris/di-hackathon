import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// POST /register: Allow users to register by providing a username and password. Hash the password using bcrypt before storing it in the database
router.post('/register', userController.registerUser);

// POST /login: Allow users to login by providing their username and password. Compare the hashed password from the JSON file with the provided password.
router.post('/login', userController.loginUser);

// GET /users: Retrieve a list of all registered users from the database
router.get('/users', userController.getAllUsers);

// GET /users/:id: Retrieve a specific user by ID from the database
router.get('/users/:id', userController.getUserById);

// PUT /users/:id: Update a user’s information by ID in the database
router.put('/users/:id', userController.updateUserById);

export default router;
