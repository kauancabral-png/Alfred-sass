import prisma from '../config/db';
import OpenAI from 'openai';

/**
 * 🕵️‍♂️ MÁQUINA DE PARSE ALFRED (V10 - ULTRA RESILIENTE) 🤖
 */
async function alfredParse(message: string, categoriesStr: string): Promise<{ description: string, amount: number, type: 'INCOME' | 'EXPENSE', profile: 'PERSONAL' | 'BUSINESS', categoryName?: string } | null> {
    const text = message.toLowerCase().trim();
    
    // 1. TENTAR IA (GROQ) PRIMEIRO PARA OBTER A CATEGORIA INTELIGENTE
    if (process.env.GROQ_API_KEY) {
        try {
            const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
            const prompt = `JSON ONLY: Analyze this message: "${message}". Format: {"description":"desc","amount":num,"type":"INCOME|EXPENSE","profile":"PERSONAL|BUSINESS","categoryName":"..."}. You MUST assign an appropriate category from this exact list: [${categoriesStr}]. If none fit, return a short new category name. Extract numbers properly.`;
            const response = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: "llama-3.3-70b-versatile",
                temperature: 0,
                response_format: { type: "json_object" }
            });
            const result = JSON.parse(response.choices[0].message.content || '{}');
            if (result.amount && result.type) return result as any;
        } catch (e) { console.error("❌ [BOT AI ERROR]:", e); }
    }

    // 2. FALLBACK REGEX PURO (CASO A IA FALHE) 🧱
    const pureNumberMatch = text.match(/^(\d+[.,]?\d*)$/);
    if (pureNumberMatch) {
        return { description: 'Gasto rápido', amount: parseFloat(pureNumberMatch[1].replace(',', '.')), type: 'EXPENSE', profile: 'PERSONAL' };
    }

    // 2. REGEX DE ELITE (FALHA ZERO) ⚔️
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

        // Localizar Usuário (Busca Global por Sufixo 9 Dígitos)
        const allUsers = await prisma.user.findMany({ include: { profiles: true } });
        const user = allUsers.find(u => {
            const dbPhone = (u.phone || '').replace(/\D/g, '');
            return (dbPhone.slice(-9) === pureIncomingPhone.slice(-9));
        });

        if (!user) return "¡Hola! Habla Alfred. 🕵️‍♂️ Tu número de WhatsApp no está vinculado a ninguna cuenta en mi panel de control.";

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
            return `¡Anotado en el perfil *${targetProfile.name}*! 🕵️‍♂️🎩\n${parsed.type === 'INCOME' ? '📈 Ingreso' : '📉 Gasto'}: R$ ${parsed.amount.toLocaleString('pt-BR')} en "${parsed.description}".\nCategoría AI: *${txn.category?.name || 'General'}*\n\n¡Abre tu Dashboard ahora, todo fue sincronizado! 😉`;
        }

        return `Perdón, ${user.gender === "feminino" ? 'Señora' : 'Señor'}. 🫠 No identifiqué el valor exacto de la operación. 

Intenta decir algo como: 
👉 *"Gasté 30 en el supermercado"* 
👉 *"Recibí 500 de la venta de zapatos"*`;

    } catch (error) {
        console.error("🔥 [FATAL BOT ERROR]:", error);
        return "Alfred tuvo un pequeño mareo técnico con el servidor. Siento mucho la demora, repítame por favor.";
    }
};
