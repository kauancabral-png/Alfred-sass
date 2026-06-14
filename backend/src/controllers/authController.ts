import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

export const register = async (req: Request, res: Response) => {
    try {
        let { name, email, password, phone } = req.body;
        if (email) email = email.toLowerCase().trim();

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos obrigatorios faltaram' });
        }

        const userExists = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
        if (userExists) {
            return res.status(400).json({ message: 'Email ja cadastrado no sistema' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cria o usuario no banco de dados e ja cria um  perfil base para ele
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone: phone || null,
                plan: 'FREE', // Padrão: Sem acesso, precisa da Webhook da Hotmart para virar MONTHLY!
                profiles: {
                    create: [
                        { type: 'PERSONAL', name: 'Mi Perfil Personal' },
                        { type: 'BUSINESS', name: 'Mi Perfil Empresarial' }
                    ]
                }
            },
        });

        // Gera o JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '30d',
        });

        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuario', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        let { email, password } = req.body;
        if (email) email = email.toLowerCase().trim();

        const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
                expiresIn: '30d',
            });

            res.json({
                user: { id: user.id, name: user.name, email: user.email },
                token,
            });
        } else {
            res.status(401).json({ message: 'Credenciais invalidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor durante login' });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const rawUser = await prisma.user.findUnique({
            where: { id: req.user?.id },
            include: { profiles: true }
        });

        if (!rawUser) {
             return res.status(404).json({ message: 'Usuario nao encontrado' });
        }

        let profiles = rawUser.profiles;
        const hasPersonal = profiles.some(p => p.type === 'PERSONAL');
        const hasBusiness = profiles.some(p => p.type === 'BUSINESS');

        if (!hasPersonal || !hasBusiness) {
            if (!hasPersonal) {
                await prisma.profile.create({ data: { type: 'PERSONAL', userId: rawUser.id } });
            }
            if (!hasBusiness) {
                await prisma.profile.create({ data: { type: 'BUSINESS', userId: rawUser.id } });
            }
            // Fetch again with new profiles
            const updatedUser = await prisma.user.findUnique({
                where: { id: rawUser.id },
                include: { profiles: true }
            });
            return res.json(updatedUser);
        }

        res.json(rawUser);
    } catch (error) {
         res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name, email, phone } = req.body;
        
        // FORÇA ABSOLUTA: Se outro usuário tiver esse número, nós limpamos lá para que o Mestre possa assumir na conta atual!
        if (phone && phone.trim() !== '') {
            const phoneUser = await prisma.user.findFirst({
                where: { phone, id: { not: req.user?.id } }
            });
            if (phoneUser) {
                // Remove o telefone do outro usuário
                await prisma.user.update({
                    where: { id: phoneUser.id },
                    data: { phone: null }
                });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user?.id },
            data: {
               ...(name && { name }),
               ...(email && { email }),
               // O número do WhatsApp do próprio Mestre! Convertendo '' para null para não violar o @unique
               ...(phone !== undefined && { phone: phone.trim() === '' ? null : phone.trim() }) 
            }
        });

        res.json(updatedUser);
    } catch (error) {
         console.error("Erro ao atualizar perfil", error);
         res.status(500).json({ message: 'Erro ao atualizar dados mestre' });
    }
};
