import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
async function main() {
    const user = await prisma.user.findFirst({
        where: { OR: [
            { phone: '13996824672' }, 
            { phone: '5513996824672' },
            { email: 'kauankun114@gmail.com' } // Master email
        ] }
    });
    console.log(JSON.stringify(user, null, 2));
}
main().catch(console.error);
