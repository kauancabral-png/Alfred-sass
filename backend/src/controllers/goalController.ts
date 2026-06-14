import { Request, Response } from 'express';
import prisma from '../config/db';

export const getGoals = async (req: Request, res: Response) => {
    try {
        const queryProfileId = req.query.profileId as string;
        let targetProfileId = queryProfileId;

        if (!targetProfileId) {
            const user = await prisma.user.findUnique({
                where: { id: req.user?.id },
                include: { profiles: true }
            });

            if (!user || user.profiles.length === 0) {
                return res.status(404).json({ message: 'Perfil não encontrado' });
            }
            targetProfileId = user.profiles[0].id;
        }

        const goals = await prisma.goal.findMany({ where: { profileId: targetProfileId } });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar metas' });
    }
};

export const createGoal = async (req: Request, res: Response) => {
    try {
        const { name, targetValue, deadline, profileId } = req.body;
        let targetProfileId = profileId;

        if (!targetProfileId) {
            const user = await prisma.user.findUnique({
                where: { id: req.user?.id },
                include: { profiles: true }
            });
            targetProfileId = user!.profiles[0].id;
        }

        const date = deadline ? new Date(deadline) : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

        const goal = await prisma.goal.create({
            data: {
                name,
                targetValue: Number(targetValue),
                deadline: date,
                profileId: targetProfileId
            }
        });
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar meta' });
    }
};

export const updateGoal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, targetValue, currentValue } = req.body;

        const goal = await prisma.goal.update({
            where: { id },
            data: {
                name: name !== undefined ? name : undefined,
                targetValue: targetValue !== undefined ? Number(targetValue) : undefined,
                currentValue: currentValue !== undefined ? Number(currentValue) : undefined
            }
        });
        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar meta' });
    }
};

export const deleteGoal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.goal.delete({ where: { id } });
        res.json({ message: 'Meta removida' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao remover meta' });
    }
};
