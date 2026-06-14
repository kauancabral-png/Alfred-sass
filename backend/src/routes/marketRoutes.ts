import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();
const router = Router();

// Listar todos os comparativos de mercado do perfil do usuário
router.get('/', protect, async (req: any, res) => {
  try {
    const profileId = req.query.profileId as string;
    if (!profileId) return res.status(400).json({ error: 'profileId is required' });

    const comparisons = await prisma.marketComparison.findMany({
      where: { profileId, profile: { userId: req.user.id } }, // Ensure user owns the profile
      orderBy: { productName: 'asc' }
    });
    res.json(comparisons);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Adicionar novo comparativo de produto
router.post('/', protect, async (req: any, res) => {
  const { productName, bestPrice, establishment, lastPrice, trend, quantity, profileId } = req.body;
  try {
    if (!profileId) return res.status(400).json({ error: 'profileId is required' });

    const comparison = await prisma.marketComparison.create({
      data: {
        productName,
        bestPrice: Number(bestPrice),
        quantity: quantity ? Number(quantity) : 1,
        establishment,
        lastPrice: lastPrice ? Number(lastPrice) : null,
        trend: trend || 'down',
        profileId: profileId
      }
    });

    // INTEGRAÇÃO DASHBOARD: Adiciona como Gasto Automático
    await prisma.transaction.create({
      data: {
        description: `[MERCADO] ${productName} (${establishment})`,
        amount: -Math.abs(Number(bestPrice)),
        type: 'EXPENSE',
        date: new Date(),
        profileId: profileId
      }
    });

    res.status(201).json(comparison);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Atualizar produto
router.put('/:id', protect, async (req: any, res) => {
  const { productName, bestPrice, establishment, quantity, profileId } = req.body;
  try {
    if (!profileId) return res.status(400).json({ error: 'profileId is required' });

    const updated = await prisma.marketComparison.updateMany({
      where: { id: req.params.id, profileId: profileId },
      data: { productName, bestPrice: Number(bestPrice), establishment, quantity: Number(quantity) || 1 }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Deletar produto
router.delete('/:id', protect, async (req: any, res) => {
  try {
    const profileId = req.query.profileId as string;
    if (!profileId) return res.status(400).json({ error: 'profileId is required' });

    await prisma.marketComparison.deleteMany({
      where: { id: req.params.id, profileId: profileId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
