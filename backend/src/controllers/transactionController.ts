import { Request, Response } from 'express';
import prisma from '../config/db';

// Criar nova Receita ou Despesa
export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { description, amount, type, categoryId, categoryName, profileId, date } = req.body;

        // Se o profileId nao foi enviado, pega o profile main do usuario
        let targetProfileId = profileId;
        if (!targetProfileId) {
            const user = await prisma.user.findUnique({
                 where: { id: req.user?.id },
                 include: { profiles: true }
            });
            if (user && user.profiles.length > 0) {
                 targetProfileId = user.profiles[0].id;
            } else {
                 return res.status(404).json({ message: "Perfil não encontrado" });
            }
        }

        let finalCategoryId = categoryId;
        if (!finalCategoryId && categoryName) {
            // Busca a categoria pelo nome (case insensitive) ou cria 
            let cat = await prisma.category.findFirst({
               where: { name: { equals: categoryName, mode: 'insensitive' } }
            });
            if (!cat) {
               cat = await prisma.category.create({ data: { name: categoryName, type, profileId: targetProfileId } });
            }
            finalCategoryId = cat.id;
        }

        const transacao = await prisma.transaction.create({
            data: {
                description,
                amount: Number(amount),
                type,
                date: new Date(date),
                categoryId: finalCategoryId,
                profileId: targetProfileId,
            }
        });

        res.status(201).json(transacao);
    } catch (error) {
         res.status(500).json({ message: 'Erro ao criar transacao', error });
    }
};

// Pegar dashboard e transacoes de um perfil
export const getTransactions = async (req: Request, res: Response) => {
    try {
        const queryProfileId = req.query.profileId as string;
        let targetProfileId = queryProfileId;

        // 🛡️ SINCRONIZADOR DE PERFIS (PREVINE DESENCONTRO DE DADOS) 🕵️‍♂️🎩
        const userWithProfiles = await prisma.user.findUnique({
             where: { id: req.user?.id },
             include: { profiles: true }
        });

        if (!userWithProfiles || userWithProfiles.profiles.length === 0) {
            return res.status(404).json({ message: "Nenhum perfil encontrado para este usuário." });
        }

        // Se o profileId enviado não pertence ao usuário, usamos o principal dele automaticamente
        const userOwnsProfile = userWithProfiles.profiles.some(p => p.id === targetProfileId);
        if (!userOwnsProfile) {
            targetProfileId = userWithProfiles.profiles[0].id;
        }

        const transacoes = await prisma.transaction.findMany({
            where: {
                profileId: targetProfileId
            },
            include: { category: true },
            orderBy: { date: 'desc' }
        });

        res.status(200).json(transacoes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar transacoes' });
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
         const { id } = req.params;
         
         await prisma.transaction.delete({ where: { id } });
         res.status(200).json({ message: "Transacao deletada com sucesso!" });
    } catch (error) {
         res.status(500).json({ message: 'Erro ao remover transacao' });
    }
}

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { description, amount, type, date, categoryId } = req.body;

        const updated = await prisma.transaction.update({
            where: { id },
            data: {
                description,
                amount: amount ? Number(amount) : undefined,
                type,
                date: date ? new Date(date) : undefined,
                categoryId
            }
        });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao editar transação' });
    }
}
