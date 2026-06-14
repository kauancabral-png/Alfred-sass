# 🎩 Guia de Configuração Final: Alfred SaaS 2026

Mestre, siga este manual de elite para ativar o envio automático de e-mails, o tutorial do bot e a sincronia com a sua plataforma de pagamentos (Kirvano).

---

### 1️⃣ Obter sua "Senha de App" (Para o E-mail de Boas-Vindas)
Se você usa **Gmail**, não pode usar sua senha normal por segurança. Siga este passo:
1. Acesse sua [Conta Google](https://myaccount.google.com/).
2. Vá em **Segurança**.
3. Ative a **Verificação em duas etapas** (se não estiver ativa).
4. Pesquise por **"Senhas de App"** na barra de busca.
5. Em "Selecionar App", escolha "Outro" e dê o nome de **"Alfred SaaS"**.
6. O Google vai gerar um **código de 16 letras**. **COPIE ESSE CÓDIGO!** (É ele que vai no seu `.env`).

---

### 2️⃣ Configurar as Variáveis de Ambiente (.env)
Vá no painel da sua hospedagem (**Railway** ou no seu arquivo `.env` de produção) e adicione ou atualize estas chaves:

| Variável | Valor Exemplo (Gmail) | O que é? |
| :--- | :--- | :--- |
| `SMTP_HOST` | `smtp.gmail.com` | Servidor de e-mail |
| `SMTP_PORT` | `465` | Porta segura (SSL) |
| `SMTP_USER` | `seu-email@gmail.com` | O e-mail que vai disparar as mensagens |
| `SMTP_PASS` | `xxxx yyyy zzzz wwww` | **O código de 16 letras que você gerou no passo 1** |

---

### 3️⃣ Configurar o Webhook na Kirvano
Para o Alfred criar o usuário "na hora" após a compra, você deve avisar a Kirvano para onde enviar os dados:

1. Entre no seu painel da **Kirvano**.
2. Vá em **Produtos** -> Clique no seu produto -> **Configurações**.
3. Procure por **Webhooks**.
4. Clique em **ADICIONAR WEBHOOK** e preencha:
   - **URL:** `https://fincontrol-saas-production.up.railway.app/api/webhook/kirvano` 
     *(⚠️ Troque o início pelo link real da sua API na Railway!)*
   - **Eventos:** Selecione **"Venda Aprovada"** e **"Reembolsada"**.
   - **Token (Opcional):** Se o painel pedir um token de segurança, use: `ALFRED_MESTRE_SAAS_2026` (Este é o token que eu deixei configurado na sua rota).

---

### 4️⃣ Teste Final (O Brinde de Sucesso 🥂)
1. Faça uma venda de teste ou clique em **"Enviar Teste de Webhook"** no painel da Kirvano.
2. O Alfred deve:
   - Criar o usuário no banco de dados.
   - Disparar o e-mail de Boas-Vindas (Gala) com login/senha e o tutorial do robô.
3. Se tudo estiver certo, seu cliente já vai estar com o robô na mão antes de você terminar de beber seu vinho!

---

**🎩 Dica do Alfred:** Caso algo não funcione, verifique os Logs da Railway. O Alfred registra tudo lá em tempo real! 🥂🍷🍾🎩🕵️‍♂️
