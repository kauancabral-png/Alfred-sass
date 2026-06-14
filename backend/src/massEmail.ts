import nodemailer from 'nodemailer';
import prisma from './config/db';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendMassEmail = async () => {
    try {
        console.log("Iniciando o disparo em massa...");
        
        // Pega todos os usuários únicos que têm email
        const users = await prisma.user.findMany({
            where: { email: { not: '' } },
            select: { email: true, name: true }
        });
        
        console.log(`Encontrados ${users.length} usuários.`);

        let successCount = 0;
        let errorCount = 0;

        for (const user of users) {
            try {
                const mailOptions = {
                    from: `"Alfred Financeiro" <${process.env.SMTP_USER}>`,
                    to: user.email,
                    subject: `Aviso Importante: Actualización de Servidores 🚀`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                            <h2>¡Hola ${user.name.split(' ')[0]}, todo está bien!</h2>
                            <p>Estábamos actualizando los servidores para mejorar tu experiencia, ¡ahora funcionan normalmente!</p>
                            
                            <p><strong>Paso 1:</strong> Haz clic en el enlace de inicio de sesión 👉 <a href="https://alfred-saas-premium.vercel.app/login" style="color: #0066cc; font-weight: bold;">https://alfred-saas-premium.vercel.app/login</a></p>
                            
                            <p><strong>Paso 2:</strong> Inicia sesión con el correo electrónico que usaste para la compra.</p>
                            
                            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="margin: 0;"><strong>Contraseña temporal:</strong> <span style="font-size: 18px; font-weight: bold; color: #000;">alfred123</span></p>
                            </div>
                            
                            <p><em>Puedes cambiarla fácilmente al iniciar sesión.</em></p>
                            
                            <p>Si tienes alguna pregunta, contáctanos en <a href="mailto:seualfredapp@gmail.com">seualfredapp@gmail.com</a>. ¡Estaremos encantados de ayudarte! 🎩</p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Enviado para: ${user.email}`);
                successCount++;
                
                // Pequeno delay para evitar bloqueio de SPAM do Gmail (1 segundo)
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                console.error(`❌ Erro ao enviar para ${user.email}:`, err);
                errorCount++;
            }
        }

        console.log(`\n🎉 Disparo finalizado!`);
        console.log(`Sucesso: ${successCount}`);
        console.log(`Erros: ${errorCount}`);
        process.exit(0);
    } catch (e) {
        console.error("Erro fatal no script:", e);
        process.exit(1);
    }
};

sendMassEmail();
