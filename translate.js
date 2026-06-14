const fs = require('fs');
const path = require('path');

const dictionary = {
    'Visão Estratégica': 'Visión Estratégica',
    'Transações': 'Transacciones',
    'Minhas Receitas': 'Mis Ingresos',
    'Meus Gastos': 'Mis Gastos',
    'Mercado': 'Supermercado',
    'Veículos': 'Vehículos',
    'Minhas Dívidas': 'Mis Deudas',
    'Minhas Metas': 'Mis Metas',
    'Gráficos': 'Gráficos',
    'Configuração': 'Configuración',
    'Dashboard de Negócios': 'Panel de Negocios',
    'Gestão de Contas & Bancos': 'Gestión de Cuentas y Bancos',
    'Fluxo de Caixa Real': 'Flujo de Caja Real',
    'DRE (Resultados)': 'Estado de Resultados (ER)',
    'Contas a Pagar & Receber': 'Cuentas por Pagar y Cobrar',
    'Folha de Pagamento (RH)': 'Nómina (RRHH)',
    'Insumos & Inventário': 'Insumos e Inventario',
    'Logística & Frota': 'Logística y Flota',
    'Análise de Planejamento': 'Análisis de Planificación',
    'Metas Financeiras (KPIs)': 'Metas Financieras (KPIs)',
    'Sair': 'Cerrar Sesión',
    'Área de Elite Bloqueada': 'Área de Élite Bloqueada',
    'Seu mordomo detectou que sua assinatura Alfred não está ativa. Regularize agora para retomar o controle do seu capital.': 'Tu mayordomo detectó que tu suscripción a Alfred no está activa. Regulariza ahora para retomar el control de tu capital.',
    'Regularizar Acesso': 'Regularizar Acceso',
    'Menu Principal': 'Menú Principal',
    'Olá': 'Hola',
    'Seus dados estão sendo atualizados em tempo real.': 'Tus datos se están actualizando en tiempo real.',
    'Pessoal': 'Personal',
    'Empresa': 'Empresa',
    'Saldo do Perfil': 'Saldo del Perfil',
    'este mês': 'este mes',
    'Total Entradas': 'Total Ingresos',
    'Total Saídas': 'Total Egresos',
    'Ver gastos de compras': 'Ver gastos de compras',
    'Gastos com combustível': 'Gastos con combustible',
    'Contas e Empréstimos': 'Cuentas y Préstamos',
    'Resumo por Categoria': 'Resumen por Categoría',
    'Ver Detalhes': 'Ver Detalles',
    'Aguardando dados das suas mensagens no WhatsApp...': 'Esperando datos de tus mensajes en WhatsApp...',
    'Fluxo de Caixa Mensal': 'Flujo de Caja Mensual',
    'Distribuição de Gastos': 'Distribución de Gastos',
    'Histórico de Movimentações': 'Historial de Movimientos',
    'Sem Registros': 'Sin Registros',
    'Central de Categorias': 'Central de Categorías',
    'Gestão tática de cada setor da sua vida e negócio.': 'Gestión táctica de cada sector de tu vida y negocio.',
    'Receitas': 'Ingresos',
    'Despesas': 'Egresos',
    'Moradia & Casa': 'Vivienda y Casa',
    'Lazer & Viagens': 'Ocio y Viajes',
    'Saúde & Cuidados': 'Salud y Cuidado',
    'Dívidas & Cartões': 'Deudas y Tarjetas',
    'Filtros': 'Filtros',
    'Adicionar ': 'Añadir ',
    'Adicionar': 'Añadir',
    'Novo Lançamento': 'Nuevo Lanzamiento',
    'Quanto? (Valor)': '¿Cuánto? (Valor)',
    'O que foi? (Descrição)': '¿Qué fue? (Descripción)',
    'Efetivar Agora': 'Efectuar Ahora',
    'Sincronização Alfred': 'Sincronización Alfred',
    'Tudo o que você lança aqui é interpretado pelo seu Mordomo no WhatsApp. Uma gestão unificada para quem não tem tempo a perder.': 'Todo lo que lanzas aquí es interpretado por tu Mayordomo en WhatsApp. Una gestión unificada para quienes no tienen tiempo que perder.',
    'Todos os Filtros': 'Todos los Filtros',
    'Informe um valor válido!': '¡Informa un valor válido!',
    'Informe uma descrição!': '¡Informa una descripción!',
    'Erro ao salvar. Tente novamente.': 'Error al guardar. Intenta nuevamente.',
    'Sem conexão com o servidor.': 'Sin conexión con el servidor.',
    'Lançado em': 'Lanzado en',
    'Seu Cérebro de WhatsApp': 'Tu Cerebro de WhatsApp',
    'Configure o Robô Matriz na sua conta.': 'Configura el Robot Matriz en tu cuenta.',
    'Conectar Robô por WhatsApp': 'Conectar Robot por WhatsApp',
    'Adicione a Inteligência Artificial no contato': 'Añade la Inteligencia Artificial al contacto',
    'Salve o número abaixo ou mande um zap direto para o Robô FinControl.': 'Guarda el número de abajo o manda un mensaje directo al Robot FinControl.',
    'Abrir no Zap': 'Abrir en WhatsApp',
    'Digite seu Telefone Pessoal para o robô te reconhecer': 'Digita tu Teléfono Personal para que el robot te reconozca',
    'A API usará seu número como Login único quando as mensagens chegarem.': 'La API usará tu número como Login único cuando lleguen los mensajes.',
    'COMANDO DE ATIVAÇÃO MESTRE:': 'COMANDO DE ACTIVACIÓN MAESTRO:',
    'Clique para copiar': 'Clic para copiar',
    'O senhor precisa enviar este comando primeiro para que a Twilio libere a conversa conosco!': '¡El señor necesita enviar este comando primero para que Twilio libere la conversación con nosotros!',
    'Por favor, preencha o número primeiro!': '¡Por favor, completa el número primero!',
    'Telefone ativado e sincronizado! Seu Robô já está te ouvindo.': '¡Teléfono activado y sincronizado! Tu Robot ya te está escuchando.',
    'Erro ao salvar número. Talvez esse número já esteja ativado em outra conta.': 'Error al guardar el número. Tal vez este número ya esté activado en otra cuenta.',
    'Falha ao contatar nosso servidor principal.': 'Falla al contactar a nuestro servidor principal.',
    'Salvar meu Número Ativo': 'Guardar mi Número Activo',
    'Pronto! Agora cole no WhatsApp do Alfred': '¡Listo! Ahora pega en el WhatsApp de Alfred',
    'Período:': 'Período:',
    'Hoje': 'Hoy',
    'Ontem': 'Ayer',
    'Últimos 7 dias': 'Últimos 7 días',
    'Últimos 30 dias': 'Últimos 30 días',
    'Últimos 3 Meses': 'Últimos 3 Meses',
    'Último Ano': 'Último Año',
};

const replaceInFile = (filePath) => {
    let raw = fs.readFileSync(filePath, 'utf8');
    for (const [pt, es] of Object.entries(dictionary)) {
        const regex = new RegExp(`(?<![a-zA-ZáéíóúÁÉÍÓÚñÑ_])(${pt})(?![a-zA-ZáéíóúÁÉÍÓÚñÑ_])`, 'g');
        raw = raw.replace(regex, es);
    }
    fs.writeFileSync(filePath, raw);
};

const walk = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walk(full);
        } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
            replaceInFile(full);
        }
    }
};

walk('./frontend/src/pages');
console.log("Terminado tradução das paginas.");
