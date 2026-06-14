import axios from 'axios';

const FB_PIXEL_ID = process.env.FB_PIXEL_ID || '1633816441286750';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

// ⚡️ MODULO DE CONVERSÕES ALFRED (CAPI) ⚡️
export const fbTrackServer = async (eventName: string, userData: any = {}, customData: any = {}) => {
    if (!FB_ACCESS_TOKEN) {
        console.warn('⚠️ FB_ACCESS_TOKEN nao configurado no Backend. Rastreio CAPI desativado.');
        return;
    }

    try {
        const payload = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    user_data: {
                        client_ip_address: userData.ip || '0.0.0.0',
                        client_user_agent: userData.userAgent || 'Unknown',
                        ...userData
                    },
                    custom_data: customData,
                }
            ]
        };

        const res = await axios.post(
            `https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events`,
            payload,
            {
                params: { access_token: FB_ACCESS_TOKEN },
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log(`✅ Evento CAPI [${eventName}] enviado com sucesso pro Facebook!`);
        return res.data;
    } catch (error: any) {
        console.error(`❌ Erro CAPI [${eventName}]:`, error.response?.data || error.message);
    }
};
