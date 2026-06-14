import { handleIncomingMessage } from './src/services/whatsappService';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const from = "whatsapp:+5513996824672";
    const body = "Gastei 50 no teste agora";
    console.log("🧪 [TESTE INICIADO] 🤖");
    const reply = await handleIncomingMessage(from, body);
    console.log("🎩 [ALFRED REPLY]:", reply);
}
test();
