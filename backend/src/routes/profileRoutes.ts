import { Router, Request, Response } from 'express';
import { protect } from '../middlewares/authMiddleware';
import prisma from '../config/db';

const router = Router();

router.use(protect);

// Buscar todos os perfis do usuario
router.get('/', async (req: Request, res: Response) => {
    try {
         const profiles = await prisma.profile.findMany({
             where: { userId: req.user?.id }
         });
         
         res.json({ profiles });
    } catch (err) {
         res.status(500).json({ error: 'Erro ao buscar perfis' });
    }
});

// Buscar Telefone Salvo
router.get('/phone', async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            select: { phone: true }
        });
        res.json({ phone: user?.phone || '' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar telefone' });
    }
});

router.put('/phone', async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;
        
        // FORÇA ABSOLUTA: Limpa telefone se já usado por outra conta (mesma lógica do authController)
        if (phone && phone.trim() !== '') {
            const phoneUser = await prisma.user.findFirst({
                where: { phone, id: { not: req.user?.id } }
            });
            if (phoneUser) {
                await prisma.user.update({
                    where: { id: phoneUser.id },
                    data: { phone: null }
                });
            }
        }

        await prisma.user.update({
            where: { id: req.user?.id },
            data: { phone: phone === '' ? null : phone }
        });

        res.status(200).json({ message: 'Telefone atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar telefone' });
    }
});

export default router;
