import { fbTrackServer } from '../services/facebookService';
import express, { Router, Request, Response } from 'express';
import prisma from '../config/db';
import { handleIncomingMessage } from '../services/whatsappService';
import { sendWelcomeEmail } from '../services/emailService';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';

const router = Router();

/**
 * 🎙️ DOWNLOAD DE AUDIO ROBUSTO (AXIOS + BASIC AUTH) 🎩
 */
const downloadAudio = async (url: string, dest: string): Promise<void> => {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    const config: any = {
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': 'Alfred-Bot'
        }
    };

    if (sid && token) {
        config.auth = {
            username: sid,
            password: token
        };
    }

    const response = await axios.get(url, config);
    fs.writeFileSync(dest, Buffer.from(response.data as any));
};

function deepFindEmail(obj: any): string | null {
    if (!obj) return null;
    if (typeof obj === 'string') {
        const emailMatch = obj.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) return emailMatch[0].toLowerCase().trim();
    }
    if (typeof obj === 'object') {
        for (const key in obj) {
            const result = deepFindEmail(obj[key]);
            if (result) return result;
        }
    }
    return null;
}

// Recursively collect all string values to avoid false-positives matching JSON schema keys (e.g. `canceled_at: null`)
function extractValues(obj: any): string {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    if (typeof obj === 'object') {
        return Object.values(obj).map(extractValues).join(' ');
    }
    return '';
}

function isKillerStatus(obj: any): boolean {
    const valuesStr = extractValues(obj).toUpperCase();
    return ['REFUND', 'CANCEL', 'EXPIRED', 'CHARGEBACK', 'ESTORNO', 'DEVOLVIDO', 'ATRASADO', 'BLOQUEADO', 'BLOCKED'].some(w => valuesStr.includes(w));
}

function isSuccessStatus(obj: any): boolean {
    const valuesStr = extractValues(obj).toUpperCase();
    return ['APPROVED', 'COMPLETED', 'PAID', 'SUCCESS', 'APROVADO', 'PAGO', 'CONCLUIDO'].some(w => valuesStr.includes(w));
}

const processUniversalWebhook = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const email = deepFindEmail(payload);
        if (!email) return res.status(200).json({ status: 'Ok' });

        if (isKillerStatus(payload)) {
            await prisma.user.updateMany({ where: { email }, data: { plan: 'FREE' } });
            await fbTrackServer('SubscriptionCancel', { em: email });
            return res.status(200).json({ status: 'Processed_Kill' });
        }

        if (isSuccessStatus(payload)) {
            const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
            
            // Verifica se é plano Anual/Vitalício pelas palavras no json da compra
            const strPayload = JSON.stringify(payload).toUpperCase();
            const grantedPlan = (strPayload.includes('ANNUAL') || strPayload.includes('ANUAL') || strPayload.includes('VITALICIO') || strPayload.includes('LIFETIME')) ? 'ANNUAL' : 'MONTHLY';
            
            // Segurança Anti-Crash: Telefone vazio ('') gera erro de duplicate no PostgreSQL, deve ser null.
            let rawPhone = payload.customer?.phone || payload.data?.buyer?.checkout_phone || null;
            if (rawPhone) rawPhone = String(rawPhone).substring(0, 19); // Garante que seja String e evita estourar limite do DB
            
            let finalUser = user;
            
            if (user) {
                finalUser = await prisma.user.update({ where: { id: user.id }, data: { plan: grantedPlan } });
            } else {
                const bcrypt = require('bcryptjs');
                finalUser = await prisma.user.create({
                    data: {
                        name: payload.customer?.name || payload.data?.buyer?.name || 'Membro Ouro',
                        email,
                        password: await bcrypt.hash('alfred123', 10),
                        phone: rawPhone,
                        plan: grantedPlan
                    }
                });
                await prisma.profile.create({ data: { userId: finalUser.id, name: 'Mi Perfil Alfred', type: 'PERSONAL' } });
                await prisma.profile.create({ data: { userId: finalUser.id, name: 'Mi Negocio Alfred', type: 'BUSINESS' } });
                try {
                    // Fire and forget (não espera terminar para responder a Hotmart rápido)
                    sendWelcomeEmail(email, 'Mestre', 'alfred123').catch(e => console.error('BG Email failed', e));
                } catch (e) { console.error('Email block failed', e); }
            }
            
            // Fire and forget: rastreamento de Pixel
            fbTrackServer('Purchase', { em: email, ph: finalUser.phone?.replace(/\D/g, '') || '', fn: finalUser.name.split(' ')[0] }, { value: 37, currency: 'BRL' }).catch(e => console.error('FB Track Error:', e));
            
            return res.status(200).json({ status: 'Processed_Grant' });
        }
        res.status(200).json({ status: 'Processed_NoAction' });
    } catch (err) { res.status(200).json({ status: 'Error' }); }
};

router.post('/kirvano', processUniversalWebhook);
router.post('/hotmart', processUniversalWebhook);

/**
 * 🎙️ WHATSAPP BOT: TEXTO E ÁUDIO 🎩
 */
router.post('/whatsapp', express.urlencoded({ extended: true }), async (req: Request, res: Response) => {
    try {
        const from = req.body.From; 
        let body = req.body.Body || ''; 
        const mediaUrl = req.body.MediaUrl0;
        const mediaType = req.body.MediaContentType0;

        // Se o corpo estiver vazio mas tiver áudio, transcrevemos!
        if (!body && mediaUrl && mediaType?.includes('audio')) {
             console.log("🎙️ [ÁUDIO DETECTADO]: Processando via Groq...");
             
             if (process.env.GROQ_API_KEY) {
                  const tmpFile = path.join(os.tmpdir(), `alfred-${Date.now()}.ogg`);
                  try {
                      await downloadAudio(mediaUrl, tmpFile);
                      console.log("✅ [ÁUDIO BAIXADO]: Iniciando Whisper...");
                      
                      const groq = new OpenAI({ 
                          apiKey: process.env.GROQ_API_KEY, 
                          baseURL: "https://api.groq.com/openai/v1" 
                      });
                      
                      const transcription = await groq.audio.transcriptions.create({ 
                          file: fs.createReadStream(tmpFile) as any, 
                          model: 'whisper-large-v3' 
                      });
                      
                      body = transcription.text;
                      console.log(`📝 [AUDIO TRANSCRITO]: "${body}"`);
                      
                      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
                  } catch (audioErr: any) {
                      console.error("❌ [ERRO ÁUDIO]:", audioErr.message || audioErr);
                      body = ""; 
                  }
             } else {
                  console.error("⚠️ [GROQ_API_KEY] não configurada no servidor.");
             }
        }

        let reply = "¡Alfred a su disposición, señor! Envíe un mensaje para comenzar.";
        if (from) {
             reply = await handleIncomingMessage(from, body);
        }

        res.set('Content-Type', 'text/xml');
        return res.status(200).send(`<Response><Message>${reply}</Message></Response>`);
    } catch (err: any) {
        console.error("🔥 [FIREWALL WHATSAPP ERROR]:", err.message || err);
        res.status(200).send(`<Response><Message>Señor, perdóneme. Tuve um error interno. Por favor, intente enviar texto por ahora.</Message></Response>`);
    }
});

export default router;
