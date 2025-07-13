import { Router } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

// Static HTML-pages routes (from public folder)

// Public routes
router.get('/login', isNotAuthenticated, (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'login', 'index.html'));
});

router.get('/reg', isNotAuthenticated, (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'reg', 'index.html'));
});

// Protected routes (only for authorized users)
router.get('/chat', isAuthenticated, (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'chat', 'index.html'));
});

router.get('/create', isAuthenticated, (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'create', 'index.html'));
});

router.get('/join', isAuthenticated, (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'join', 'index.html'));
});

// Root route
router.get('/', (req, res) => {
    if (req.session && req.session.isLoggedIn) {
        res.redirect('/chat');
    } else {
        res.redirect('/login');
    }
});

export default router;