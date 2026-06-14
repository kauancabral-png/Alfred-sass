import { PrismaClient } from '@prisma/client';

// Configurando e instanciando o Prisma Client para acesso ao Postgres
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
