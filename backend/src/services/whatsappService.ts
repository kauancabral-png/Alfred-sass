import prisma from '../config/db';
import OpenAI from 'openai';

/**
 * 🕵️‍♂️ MÁQUINA DE PARSE ALFRED (V10 - ULTRA RESILIENTE) 🤖
 */
async function alfredParse(message: string, categoriesStr: string): Promise<{ description: string, amount: number, type: 'INCOME' | 'EXPENSE', profile: 'PERSONAL' | 'BUSINESS', categoryName?: string } | null> {
    const text = message.toLowerCase().trim();
    if (!text) throw new Error("TEXT_EMPTY_TRANSCRIPTION_FAILED");
    
    // 1. TENTAR IA (GROQ) PRIMEIRO COM PROMPT AVANÇADO DE NLP FINANCEIRO
    if (process.env.GROQ_API_KEY) {
        try {
            const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
            const systemPrompt = `You are an expert financial AI parsing audio transcriptions.
Your goal is to extract financial transactions from messy, casual spoken language (Portuguese/Spanish/English).

RULES:
1. AMOUNT: The user will often spell out numbers (e.g. "cinquenta e cinco reais", "trinta e dois e noventa", "cemzão", "un peso con cincuenta"). You MUST convert these spelled-out words into a clean float number (e.g., 55.00, 32.90, 100.00, 1.50). NEVER leave it as 0 if a number is spoken.
2. TYPE: Map to "EXPENSE" if the user spent money (gastei, paguei, comprei, uber, ifood, mercado, pão). Map to "INCOME" if the user received money (recebi, vendi, caiu na conta, pix de fulano, salário).
3. PROFILE: Map to "BUSINESS" if the context mentions company, negócio, empresa, pj, trabalho. Otherwise "PERSONAL".
4. DESCRIPTION: Create a clean, short description (max 3 words). E.g. "gastei 50 no posto" -> "Posto de Gasolina". "comprei pão" -> "Padaria".
5. CATEGORY: Choose the best fitting category from this exact list: [${categoriesStr}]. If none fit, create a short new one.

Output MUST be strictly valid JSON matching this structure:
{"description":"short desc", "amount": 10.50, "type":"INCOME"|"EXPENSE", "profile":"PERSONAL"|"BUSINESS", "categoryName":"..."}`;

            const response = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0,
                response_format: { type: "json_object" }
            });
            const result = JSON.parse(response.choices[0].message.content || '{}');
            if (result.amount && result.type) return result as any;
            throw new Error(`GROQ_RETURNED_INVALID_JSON: ${response.choices[0].message.content}`);
        } catch (e: any) { 
            console.error("❌ [BOT AI ERROR]:", e); 
            throw new Error("GROQ_ERROR: " + e.message);
        }
    }

    // 2. FALLBACK REGEX PURO (CASO A IA FALHE OU NÃO TENHA API KEY) 🧱
    const pureNumberMatch = text.match(/^(\d+[.,]?\d*)$/);
    if (pureNumberMatch) {
        return { description: 'Gasto rápido', amount: parseFloat(pureNumberMatch[1].replace(',', '.')), type: 'EXPENSE', profile: 'PERSONAL' };
    }

    // 3. REGEX DE ELITE (FALHA ZERO) ⚔️
    const expenseRegex = /(gastei|gasté|gaste|paguei|pagué|compro|compré|despesa|gasto|menos|pagamento|-|saída|salida|custo|costo|pago|comi).*?(\d+[.,]?\d*)/i;
    const incomeRegex = /(recebi|recibí|ganhei|gané|entrou|entró|dinheiro|dinero|lucro|ingreso|\+|vendi|vendí|recebimento|reembolso|pix).*?(\d+[.,]?\d*)/i;

    const expMatch = text.match(expenseRegex);
    const incMatch = text.match(incomeRegex);

    if (expMatch && expMatch[2]) {
        return { 
            description: text.replace(expMatch[0], '').replace(/[^\w\s]/gi, '').trim() || 'Gasto', 
            amount: parseFloat(expMatch[2].replace(',', '.')), 
            type: 'EXPENSE', 
            profile: (text.includes('empresa') || text.includes('negócio') || text.includes('negocio') || text.includes('pj') || text.includes('trabalho') || text.includes('trabajo')) ? 'BUSINESS' : 'PERSONAL' 
        };
    }

    if (incMatch && incMatch[2]) {
        return { 
            description: text.replace(incMatch[0], '').replace(/[^\w\s]/gi, '').trim() || 'Ingreso', 
            amount: parseFloat(incMatch[2].replace(',', '.')), 
            type: 'INCOME', 
            profile: (text.includes('empresa') || text.includes('negócio') || text.includes('negocio') || text.includes('pj') || text.includes('trabalho') || text.includes('trabajo')) ? 'BUSINESS' : 'PERSONAL' 
        };
    }

    // 4. ÚLTIMA TENTATIVA: CASO TRAGA SÓ O NÚMERO EM QUALQUER LUGAR DA FRASE
    const anyNumberMatch = text.match(/(\d+[.,]?\d*)/);
    if (anyNumberMatch) {
       return { description: text.replace(anyNumberMatch[0], '').trim() || 'Anotación rápida', amount: parseFloat(anyNumberMatch[0].replace(',', '.')), type: 'EXPENSE', profile: 'PERSONAL' };
    }

    return null;
}

export const handleIncomingMessage = async (fromNumber: string, messageBody: string): Promise<string> => {
    try {
        console.log(`📡 [BOT INCOMING]: Recv from ${fromNumber} -> "${messageBody}"`);
        const pureIncomingPhone = fromNumber.replace(/\D/g, ''); 

        // Localizar Usuário Otimizado (Busca Leve)
        const allUsersSlim = await prisma.user.findMany({ select: { id: true, phone: true } });
        const matchedUserId = allUsersSlim.find(u => (u.phone || '').replace(/\D/g, '').slice(-9) === pureIncomingPhone.slice(-9))?.id;
        
        if (!matchedUserId) return "¡Hola! Habla Alfred. 🕵️‍♂️ Tu número de WhatsApp no está vinculado a ninguna cuenta en mi panel de control.";

        const user = await prisma.user.findUnique({ where: { id: matchedUserId }, include: { profiles: true } });
        if (!user) return "Error de carga.";

        // --- COMANDOS PRIORITÁRIOS ---
        const text = messageBody.toLowerCase().trim();
        
        if (text === 'status' || text.includes('quien soy')) {
            const lastTx = await prisma.transaction.findFirst({ 
                where: { profile: { userId: user.id } },
                orderBy: { createdAt: 'desc' }
            });
            return `🎩 *Reporte del Sistema Alfred:*
👤 *Nombre:* ${user.name}
📧 *E-mail:* ${user.email}
📱 *Teléfono:* ${user.phone}
🏦 *Perfiles:* ${user.profiles.length} (Personal/Empresa)
📅 *Última Acción:* ${lastTx ? `${lastTx.description} ($ ${Math.abs(lastTx.amount)})` : 'Ninguna'}

¡Dime algo como "Gasté 50 en combustible" para empezar el control! 🕵️‍♂️`;
        }

        if (user.profiles.length === 0) return "Señor, no tiene perfiles creados en el panel. Por favor cree un perfil 'Personal' o 'Empresa'.";

        if (text.includes("saldo") || text.includes("balance") || text.includes("reporte") || text.includes("relatorio") || text.includes("resumen")) {
             const targetProfile = text.includes('empresa') || text.includes('negocio') ? (user.profiles.find(p => p.type === 'BUSINESS') || user.profiles[1] || user.profiles[0]) : (user.profiles.find(p => p.type === 'PERSONAL') || user.profiles[0]);
             const { _sum } = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { profileId: targetProfile.id } });
             
             const lastTxList = await prisma.transaction.findMany({
                 where: { profileId: targetProfile.id },
                 orderBy: { createdAt: 'desc' },
                 take: 3
             });
             
             let reportStr = lastTxList.map(t => `${t.type === 'INCOME' ? '📈' : '📉'} ${t.description}: $ ${Math.abs(t.amount).toLocaleString('es-LA')}`).join('\n');
             
             return `Señor, su saldo actual en *${targetProfile.name}* es: *$ ${(_sum.amount || 0).toLocaleString('es-LA', { minimumFractionDigits: 2 })}*\n\n*Últimos movimientos:*\n${reportStr || 'Sin movimientos recientes.'}`;
        }

        // Pegar categorias existentes do usuário para dar contexto à IA
        const targetProfileInit = text.includes('empresa') || text.includes('negocio') || text.includes('pj') 
             ? (user.profiles.find(p => p.type === 'BUSINESS') || user.profiles[0])
             : (user.profiles.find(p => p.type === 'PERSONAL') || user.profiles[0]);
             
        const existingCategoriesList = await prisma.category.findMany({ where: { profileId: targetProfileInit.id } });
        const categoriesStr = existingCategoriesList.map(c => c.name).join(', ') || 'Lazer, Alimentação, Compras, Transporte, Saúde';

        // --- PARSE DA TRANSAÇÃO ---
        const parsed = await alfredParse(messageBody, categoriesStr);

        if (parsed && parsed.amount) {
            const targetProfile = (parsed.profile === 'BUSINESS') 
                ? (user.profiles.find(p => p.type === 'BUSINESS') || user.profiles[0])
                : (user.profiles.find(p => p.type === 'PERSONAL') || user.profiles[0]);

            // Lógica de Categoria Inteligente 🏛️
            let categoryId: string | undefined = undefined;
            const existingCategories = await prisma.category.findMany({ where: { profileId: targetProfile.id } });
            
            if (parsed.categoryName) {
                let cat = existingCategories.find(c => c.name.toLowerCase().includes(parsed.categoryName!.toLowerCase()) || parsed.categoryName!.toLowerCase().includes(c.name.toLowerCase()));
                
                if (!cat) {
                    cat = await prisma.category.create({
                        data: { name: parsed.categoryName, profileId: targetProfile.id, type: parsed.type }
                    });
                }
                categoryId = cat.id;
            }

            const txn = await prisma.transaction.create({
                data: {
                    description: parsed.description,
                    amount: parsed.type === 'INCOME' ? parsed.amount : -parsed.amount,
                    type: parsed.type,
                    date: new Date(),
                    profileId: targetProfile.id,
                    categoryId: categoryId
                },
                include: { category: true }
            });
            
            console.log(`✅ [SUCESSO]: ID ${txn.id} no perfil ${targetProfile.id}`);
            return `¡Anotado en el perfil *${targetProfile.name}*! 🕵️‍♂️🎩\n${parsed.type === 'INCOME' ? '📈 Ingreso' : '📉 Gasto'}: $ ${parsed.amount.toLocaleString('es-LA', { minimumFractionDigits: 2 })} en "${parsed.description}".\nCategoría AI: *${txn.category?.name || 'General'}*\n\n¡Abre tu Dashboard ahora, todo fue sincronizado! 😉`;
        }

        return `Perdón, ${user.gender === "feminino" ? 'Señora' : 'Señor'}. 🫠 No identifiqué el valor exacto de la operación. 

Intenta decir algo como: 
👉 *"Gasté 30 en el supermercado"* 
👉 *"Recibí 500 de la venta de zapatos"*`;

    } catch (error: any) {
        console.error("🔥 [FATAL BOT ERROR]:", error);
        return `Alfred tuvo un mareo técnico. ERROR DETALLE: ${error.message}. Repítame por favor.`;
    }
};
