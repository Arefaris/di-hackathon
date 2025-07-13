import bcrypt from 'bcrypt';
import {
    createUser,
    getUserByUsername,
    getAllUsers,
    getUserById,
    updateUserById
} from '../models/userModel.js';

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: "Username and password are required." });
        }

        const existingUser = await getUserByUsername(username);

        if (existingUser) {
            return res.status(409).json({ msg: "Username already taken." });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const [newUser] = await createUser({ username, password_hash });
        res.status(201).json({ msg: "User registered", user: { id: newUser.id, username: newUser.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to register user." });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: "Username and password are required." });
        }

        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials." });
        }

        //Save user data in a session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isLoggedIn = true;
        req.session.save();

        res.status(200).json({ msg: "Login successful", user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to log in." });
    }
};

export const logoutUser = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ msg: "Failed to log out." });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ msg: "Logout successful" });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to log out." });
    }
};

export const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    next();
};

export const getAllUsersHandler = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users.map(({ id, username }) => ({ id, username })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to fetch users." });
    }
};

export const getUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ msg: `User with ID ${id} not found.` });
        }
        res.status(200).json({ id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to fetch user." });
    }
};

export const updateUserByIdHandler = async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).json({ msg: "Provide at least one field: username or password." });
    }

    try {
        const updates = {};
        if (username) updates.username = username;
        if (password) updates.password_hash = await bcrypt.hash(password, 10);
        const updatedUser = await updateUserById(id, updates);
        if (!updatedUser) {
            return res.status(404).json({ msg: `User with ID ${id} not found.` });
        }

        res.status(200).json({ msg: "User updated", user: { id: updatedUser.id, username: updatedUser.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to update user." });
    }
};