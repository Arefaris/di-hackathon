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
import { protect, refreshAccessToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /register: Allow users to register by providing a username and password. Hash the password using bcrypt before storing it in the database
router.post('/register', validateUsernameAndPassword, registerUser);

// POST /login: Allow users to login by providing their username and password. Compare the hashed password from the JSON file with the provided password.
router.post('/login', validateUsernameAndPassword, loginUser);

// GET /logout: Log the user out by destroying their session and clearing the session cookie.
router.get('/logout', logoutUser);

// GET /refresh-token: Refresh the access token using a valid refresh token
router.get('/refresh-token', refreshAccessToken);

// Protected routes
// GET /users: Retrieve a list of all registered users from the database
router.get('/api/users', protect, getAllUsersHandler);

// GET /users/:id: Retrieve a specific user by ID from the database
router.get('/api/users/:id', protect, getUserByIdHandler);

// PUT /users/:id: Update a user’s information by ID in the database
router.put('/api/users/:id', protect, validateUpdate, updateUserByIdHandler);

// GET /me: Retrieve the currently logged-in user's information
router.get('/api/me', protect, (req, res) => {
    res.status(200).json({ username: req.user.username, userId: req.user.id });
})

export default router;
