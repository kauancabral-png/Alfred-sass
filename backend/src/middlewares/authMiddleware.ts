import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
             user?: { id: string };
        }
    }
}

// Prisma import duplicado removido 🎩🥂

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Pega o token do header no formato 'Bearer <token>'
            token = req.headers.authorization.split(' ')[1];

            // Verifica as credenciais
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            
            if (!user) {
                return res.status(401).json({ message: 'Usuario não encontrado no banco' });
            }

            // ==========================================
            // CÓDIGO DA MÁQUINA DE ASSINATURA (FIREWALL)
            // ==========================================
            const userPhonePure = (user.phone || '').replace(/\D/g, '');
            const isMaster = user.email.toLowerCase() === 'kauankun114@gmail.com' || userPhonePure === '13996824672' || userPhonePure === '5513996824672' || userPhonePure.slice(-9) === '996824672';
            
            // 🔥 TRAVA REATIVADA! Só permite acesso a quem PAGOU (Plano Premium).
            if (!isMaster && user.plan === 'FREE') {
                return res.status(403).json({ message: 'PAYWALL', error: 'Você precisa ser assinante Premium para acessar a plataforma.' });
            }

            req.user = { id: decoded.id };

            next();
        } catch (error) {
             console.error(error);
             res.status(401).json({ message: 'Nao autorizado, falha no token' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Nao autorizado, sem token presente' });
    }
};
