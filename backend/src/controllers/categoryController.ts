import { Request, Response } from 'express';
import prisma from '../config/db';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, type, profileId } = req.body;
        const category = await prisma.category.create({
            data: { name, type, profileId }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar categoria' });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const { profileId } = req.query;
        const categories = await prisma.category.findMany({
            where: { profileId: profileId as string }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar categorias' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id } });
        res.status(200).json({ message: 'Categoria removida' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar categoria' });
    }
};
