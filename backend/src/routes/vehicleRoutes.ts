import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();
const router = Router();

// Listar todas as manutenções do perfil do usuário
router.get('/', protect, async (req: any, res) => {
  try {
    const profileId = req.query.profileId;
    let targetProfileId = profileId;
    
    if (!targetProfileId) {
      const profile = await prisma.profile.findFirst({ where: { userId: req.user.id } });
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      targetProfileId = profile.id;
    }

    const maintenances = await prisma.vehicleMaintenance.findMany({
      where: { profileId: targetProfileId },
      orderBy: { date: 'desc' }
    });
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Adicionar nova manutenção
router.post('/', protect, async (req: any, res) => {
  const { service, local, amount, date, status, reminder, profileId } = req.body;
  try {
    let targetProfileId = profileId;
    if (!targetProfileId) {
      const profile = await prisma.profile.findFirst({ where: { userId: req.user.id } });
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      targetProfileId = profile.id;
    }

    const maintenance = await prisma.vehicleMaintenance.create({
      data: {
        service,
        local,
        amount: Number(amount),
        date: date ? new Date(date) : new Date(),
        status: status || "Concluído",
        reminder: reminder ? new Date(reminder) : null,
        profileId: targetProfileId
      }
    });

    // Também adiciona como uma transação de despesa automática!
    await prisma.transaction.create({
      data: {
        description: `Manutenção: ${service}`,
        amount: -Math.abs(Number(amount)),
        type: 'EXPENSE',
        date: date ? new Date(date) : new Date(),
        profileId: targetProfileId
      }
    });

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Deletar manutenção
router.delete('/:id', protect, async (req: any, res) => {
  try {
    const profile = await prisma.profile.findFirst({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    await prisma.vehicleMaintenance.deleteMany({
      where: { id: req.params.id, profileId: profile.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
