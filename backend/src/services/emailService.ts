import nodemailer from 'nodemailer';

// ⚡️ ALFRED MAIL ENGINE - VERSIÓN DEFINITIVA NOIR ESPAÑOL 🎩 ⚡️
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, name: string, pass: string = 'alfred123') => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP no configurado. Alfred silenció el envío.');
        return;
    }

    const mailOptions = {
        from: `"Alfred Financeiro" <${process.env.SMTP_USER}>`,
        to: to,
        subject: `🎩 ¡Acceso Liberado! Bienvenido a Alfred, Señor ${name}!`,
        html: `
        <div style="font-family: 'Helvetica', Arial, sans-serif; background-color: #ffffff; padding: 40px; margin: 0; color: #000000; line-height: 1.5;">
            <div style="max-width: 600px; margin: 0 auto; border: 2px solid #000000; border-radius: 40px; padding: 50px; overflow: hidden;">
                
                <!-- LOGO ALFRED NOIR -->
                <div style="text-align: center; margin-bottom: 50px;">
                    <h1 style="color: #000000; font-size: 42px; font-weight: 900; margin: 0; letter-spacing: -2px;">ALFRED</h1>
                    <p style="color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px;">Su Gestión de Élite</p>
                </div>

                <div style="margin-bottom: 40px;">
                    <h2 style="font-size: 26px; font-weight: 900; color: #000000; margin-bottom: 20px;">¡Hola, Señor ${name}! 🏛️</h2>
                    <p style="font-size: 16px; color: #334155; font-weight: 500; margin-bottom: 30px;">Su pago ha sido confirmado y vuestra excelencia ya posee acceso premium a nuestra plataforma financiera. A continuación se presentan sus credenciales:</p>
                    
                    <!-- DADOS DE ACESSO DESTACADOS (ESPAÑOL) -->
                    <div style="background-color: #f8fafc; border: 1px solid #000000; padding: 30px; margin: 40px 0; border-radius: 25px;">
                        <p style="margin: 0; font-size: 13px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px;">📧 E-MAIL DE COMPRA (LOGIN):</p>
                        <p style="margin: 5px 0 20px 0; font-size: 18px; font-weight: 600; color: #000000;">${to}</p>
                        
                        <p style="margin: 0; font-size: 13px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px;">🔑 CONTRASEÑA DE ACCESO:</p>
                        <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 900; color: #000000;">alfred123</p>
                    </div>

                    <a href="https://fincontrol-saas.vercel.app/login" style="background-color: #000000; color: #ffffff; padding: 22px 40px; border-radius: 50px; text-decoration: none; font-weight: 900; display: block; text-align: center; font-size: 18px;">ENTRAR AL PANEL AHORA →</a>

                    <hr style="border: 0; border-top: 2px solid #f1f5f9; margin: 50px 0;" />

                    <!-- TUTORIAL WHATSAPP (ESPAÑOL) -->
                    <h3 style="font-size: 20px; font-weight: 900; color: #000000; margin-bottom: 20px;">🤖 Cómo Activar el Robot en WhatsApp</h3>
                    
                    <div style="border: 2px dashed #000000; padding: 30px; border-radius: 30px; background-color: #f8fafc;">
                        <p style="margin: 0; font-size: 14px; color: #000000; font-weight: 700; margin-bottom: 15px;">Siga estos 2 simples pasos:</p>
                        <p style="margin: 10px 0; font-size: 15px; color: #334155; font-weight: 500;">
                            1. Agregue el número: <b style="font-size: 18px; color: #000000;">+1 (415) 523-8886</b><br>
                            2. Envíe EXACTAMENTE este código en la conversación:
                        </p>
                        <div style="background-color: #000000; padding: 20px; border-radius: 15px; text-align: center; margin-top: 20px;">
                            <code style="font-size: 28px; font-weight: 900; color: #ffffff;">join add-outline</code>
                        </div>
                    </div>

                    <div style="margin-top: 60px; text-align: center;">
                        <p style="font-size: 12px; color: #94a3b8; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                            &copy; ${new Date().getFullYear()} Alfred Saas - Su Gestión de Élite.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email Master NOIR ESPAÑOL enviado a: ${to}`);
    } catch (error) {
        console.error(`❌ Error en Alfred Mail Noir ESPAÑOL:`, error);
    }
};
