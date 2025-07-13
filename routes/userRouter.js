import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserByIdHandler,
  requireAuth
} from '../controllers/userController.js';
import {
    validateUsernameAndPassword,
    validateUpdate
} from '../middleware/validation.js';

const router = express.Router();

// POST /register: Allow users to register by providing a username and password. Hash the password using bcrypt before storing it in the database
router.post('/register', validateUsernameAndPassword, registerUser);

// POST /login: Allow users to login by providing their username and password. Compare the hashed password from the JSON file with the provided password.
router.post('/login', validateUsernameAndPassword, loginUser);

// POST /logout: Log the user out by destroying their session and clearing the session cookie.
router.post('/logout', logoutUser);

// GET /users: Retrieve a list of all registered users from the database
router.get('/users', requireAuth, getAllUsersHandler);

// GET /users/:id: Retrieve a specific user by ID from the database
router.get('/users/:id', requireAuth, getUserByIdHandler);

// PUT /users/:id: Update a user’s information by ID in the database
router.put('/users/:id', requireAuth, validateUpdate, updateUserByIdHandler);

export default router;
