import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Rota para criar um novo usuário e conta base
router.post('/register', register);

// Rota de autenticacao de login do usuario
router.post('/login', login);

// Rotas protegidas (Usuario precisa de um Token)
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
