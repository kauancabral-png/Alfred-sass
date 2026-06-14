import { Router } from 'express';
import { fbTrackServer } from '../services/facebookService';

const router = Router();

// Rota de Rastreio Server-Side
router.post('/track-checkout', async (req, res) => {
    const { eventName, clientData } = req.body;
    
    // Pegar IP do cliente real se possivel
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    try {
        await fbTrackServer(eventName || 'InitiateCheckout', {
            ip_address: typeof clientIp === 'string' ? clientIp : '0.0.0.0',
            client_user_agent: userAgent || 'Unknown'
        });
        
        res.status(200).json({ success: true, message: 'Evento CAPI disparado!' });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

export default router;
