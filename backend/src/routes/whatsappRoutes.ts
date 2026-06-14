import { Router, Request, Response } from 'express';
import { handleIncomingMessage } from '../services/whatsappService';

const router = Router();

// Rota POST (Webhook) que o WhatsApp da Twilio vai bater toda vez que enviarem mensagem pro seu numero
router.post('/incoming', async (req: Request, res: Response) => {
    // Parâmetros padrao que a Twilio injeta no corpo da sua API
    const { From, Body } = req.body;
    
    // Nao deixamos o usuario (Twilio) esperando. Disparamos a promisse para gerenciar a logica
    handleIncomingMessage(From, Body);

    // Retorna XML vazio que e o padrao aceito pelo servidor base do Twilio para confirmar OK
    res.type('text/xml').send('<Response></Response>'); 
});

export default router;
