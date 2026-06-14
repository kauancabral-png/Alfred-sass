import express from 'express';
import prisma from './config/db';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import transactionRoutes from './routes/transactionRoutes';
import goalRoutes from './routes/goalRoutes';
import webhookRoutes from './routes/webhookRoutes';
import trackingRoutes from './routes/trackingRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import marketRoutes from './routes/marketRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app = express();

// MIDDLEWARES DE ELITE - CONFIGURADOS PARA MÁXIMA COMPATIBILIDADE
app.use(helmet({
    contentSecurityPolicy: false, // Desabilitado para evitar bloqueio de scripts/api em domínios cruzados
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: '*', // Permite qualquer origem para evitar o erro de CORS em navegadores de apps (Facebook, Instagram, Zap)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Assassino de Cache
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rotas
app.use('/api/webhooks', webhookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/track', trackingRoutes);

// Rota de Reparo de Emergência
app.get('/api/admin/repair-profiles', async (req, res) => {
    try {
        const usersWithoutProfiles = await prisma.user.findMany({ where: { profiles: { none: {} } } });
        let count = 0;
        for (const user of usersWithoutProfiles) {
            await prisma.profile.create({ data: { userId: user.id, name: 'Perfil Alfred', type: 'PERSONAL' } });
            count++;
        }
        res.json({ message: `Reparo Completo! ${count} usuários agora têm Perfil.` });
    } catch (err) {
        res.status(500).json({ error: 'Erro no Reparo' });
    }
});

// Resgate do VIP: Ernesto
app.get('/api/admin/fix-ernesto', async (req, res) => {
    try {
        const email = "drernestopalencia@gmail.com";
        const phone = "+50376010319";
        
        let user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
        
        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { plan: 'ANNUAL', phone: phone }
            });
            return res.json({ message: 'Concluído: O dr. Ernesto já existia, o plano dele foi atualizado para VITALÍCIO (ANNUAL) e acesso liberado!', email: user.email });
        } else {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('alfred123', 10);
            const newUser = await prisma.user.create({
                data: {
                    name: "Dr. Ernesto Palencia",
                    email: email,
                    phone: phone,
                    password: hashedPassword,
                    plan: 'ANNUAL'
                }
            });
            await prisma.profile.create({ data: { userId: newUser.id, name: 'Mi Perfil Alfred', type: 'PERSONAL' } });
            await prisma.profile.create({ data: { userId: newUser.id, name: 'Mi Negocio Alfred', type: 'BUSINESS' } });
            return res.json({ message: 'Nova conta VIP criada! Entregue essas credenciais', email, password: 'alfred123', phone: newUser.phone });
        }
    } catch (err: any) {
        res.status(500).json({ error: 'Erro no resgate VIP', details: err.message });
    }
});

// BYPASS TEMPORÁRIO PARA CONSERTAR O PASSADO: LIBERAÇÃO EM MASSA
app.get('/api/admin/release-everyone', async (req, res) => {
    try {
        const result = await prisma.user.updateMany({
            where: { plan: 'FREE' },
            data: { plan: 'ANNUAL' }
        });
        return res.json({ message: 'BOOOOOOM! Todos os ' + result.count + ' clientes travados foram promovidos a Vitalícios e agora conseguem logar!' });
    } catch(e:any) { res.status(500).json({ error: e.message }); }
});

// DISPARO EM MASSA DE EMAIL DE ATUALIZAÇÃO
app.get('/api/admin/send-mass-email', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { email: { not: '' } },
            select: { email: true, name: true }
        });
        
        let successCount = 0;
        
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Executa em background para nao dar timeout na request
        setTimeout(async () => {
            for (const user of users) {
                try {
                    const mailOptions = {
                        from: \`"Alfred Financeiro" <\${process.env.SMTP_USER}>\`,
                        to: user.email,
                        subject: \`Aviso Importante: Actualización de Servidores 🚀\`,
                        html: \`
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                                <h2>¡Hola \${user.name.split(' ')[0]}, todo está bien!</h2>
                                <p>Estábamos actualizando los servidores, ¡ahora funcionan normalmente!</p>
                                
                                <p><strong>Paso 1:</strong> Haz clic en el enlace de inicio de sesión 👉 <a href="https://alfred-saas-premium.vercel.app/login" style="color: #0066cc; font-weight: bold;">https://alfred-saas-premium.vercel.app/login</a></p>
                                
                                <p><strong>Paso 2:</strong> Inicia sesión con el correo electrónico que usaste para la compra.</p>
                                
                                <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <p style="margin: 0;"><strong>Contraseña temporal:</strong> <span style="font-size: 18px; font-weight: bold; color: #000;">alfred123</span></p>
                                </div>
                                
                                <p><em>Puedes cambiarla al iniciar sesión.</em></p>
                                
                                <p>Si tienes alguna pregunta, contáctanos en <a href="mailto:seualfredapp@gmail.com">seualfredapp@gmail.com</a>. ¡Estaremos encantados de ayudarte! 🎩</p>
                            </div>
                        \`
                    };
                    await transporter.sendMail(mailOptions);
                    successCount++;
                    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
                } catch (e) {}
            }
            console.log(\`Mass email complete. Sent: \${successCount}\`);
        }, 100);

        return res.json({ message: \`Disparo em massa iniciado para \${users.length} clientes em background!\` });
    } catch(e:any) { res.status(500).json({ error: e.message }); }
});

// Painel Secreto: Criação Manual de Membros Pelo Navegador
app.get('/api/admin/force-create/:token', async (req, res) => {
    try {
        // Usa a chave de segurança JWT_SECRET como senha de acesso ao painel
        if (req.params.token !== process.env.JWT_SECRET) {
            return res.status(403).json({ error: 'Acesso Negado: Senha Incorreta' });
        }

        const { email, phone, name, plan } = req.query as any;
        if (!email) return res.status(400).json({ error: 'Você precisa colocar o email na URL! ex: ?email=cliente@gmail.com' });

        const finalPlan = ['FREE', 'MONTHLY', 'BIANNUAL', 'ANNUAL'].includes(plan ? plan.toUpperCase() : '') ? plan.toUpperCase() : 'MONTHLY';
        const finalName = name || 'Membro VIP';
        const finalPhone = phone || '';

        let user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
        
        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { plan: finalPlan as any, phone: finalPhone }
            });
            return res.json({ 
                sucesso: true, 
                mensagem: `Cliente atualizado! O plano dele agora é ${finalPlan}.`,
                email: user.email,
                senha_padrao: 'Se ele havia mudado a senha, a senha antiga dele continua valendo.'
            });
        }

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('alfred123', 10);
        
        const newUser = await prisma.user.create({
            data: {
                name: finalName,
                email: email.toLowerCase().trim(),
                phone: finalPhone,
                password: hashedPassword,
                plan: finalPlan as any
            }
        });
        
        await prisma.profile.create({ data: { userId: newUser.id, name: 'Mi Perfil Alfred', type: 'PERSONAL' } });
        await prisma.profile.create({ data: { userId: newUser.id, name: 'Mi Negocio Alfred', type: 'BUSINESS' } });
        
        return res.json({ 
            sucesso: true, 
            mensagem: 'Conta nova CRIADA com sucesso!', 
            email: newUser.email, 
            senhaX_PADRAO_GERADA: 'alfred123',
            plano: finalPlan,
            telefone: newUser.phone
        });
        
    } catch (err: any) {
        res.status(500).json({ error: 'Erro interno no banco', details: err.message });
    }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: '1.1.0' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("🔥 [API ERROR]:", err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno do Servidor' });
});

export default app;
