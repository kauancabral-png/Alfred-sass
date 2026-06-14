# FinControl SaaS 🚀

O **FinControl SaaS** é uma aplicação completa e escalável capaz de gerenciar a vida financeira de pessoas e pequenas empresas num formato de software como serviço (SaaS), desenvolvida para ser rápida, visualmente premium e mobile-first.

## 🧱 Arquitetura e Stack
- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide Icons (Monolítico, pronto para Vercel).
- **Backend:** Node.js, Express, Prisma (ORM), PostgreSQL, Stripe Webhooks e JWT (Pronto para Railway).

---

## 💻 Instalação Local

### 1. Requisitos
- Node.js `v18+` instalado
- PostgreSQL rodando localmente (ou uma URL de DB online)

### 2. Rodando o Backend (API)
1. Abra um terminal e vá para a pasta `backend/`.
2. Rode `npm install`.
3. Crie um arquivo `.env` na raiz do backend baseado no `.env.example`. Altere `DATABASE_URL` com as suas credenciais do Banco PostgreSQL.
4. Rode as migrações no banco: `npx prisma migrate dev --name init`
5. Puxe os dados iniciais gerados (caso tenha): `npx prisma generate`
6. Inicie o servidor: `npm run dev` (Irá rodar na porta 8080).

### 3. Rodando o Frontend (UI)
1. Abra outro terminal e vá para a pasta `frontend/`.
2. Rode `npm install`.
3. Inicie o ambiente de desenvolvimento: `npm run dev`.
4. Acesse pelo navegador na porta indicada pelo Vite (geralmente `http://localhost:5173/`).

---

## 🚀 Como fazer o Deploy

### Backend no Railway (Rápido e Prático)
1. Crie uma conta no [Railway](https://railway.app/).
2. Conecte seu repositório Github (suba todo este código numa pasta no Github).
3. No Railway, clique em **"New -> Database -> Add PostgreSQL"**.
4. Em seguida, clique em **"New -> GitHub Repo"** e selecione onde está a sua API.
5. Acesse as "Variables" do seu backend no painel do Railway e adicione:
   - `DATABASE_URL` (copie da tela do PostgreSQL que o Railway acabou de criar)
   - `JWT_SECRET` (crie um hash forte)
   - `STRIPE_SECRET_KEY` (sua chave do Stripe)
   - `STRIPE_WEBHOOK_SECRET`
6. O Railway irá gerar o script `npm start` automaticamente. A API está no ar! Pegue a *Public URL*.

### Frontend na Vercel
1. Crie uma conta na [Vercel](https://vercel.com/).
2. Clique em **"Add New Project"** e conecte o GitHub selecionando a raiz onde a pasta `/frontend` está.
3. Nas configurações ('Framework Preset'), marque como **Vite**.
4. Defina o *Root Directory* para a pasta `frontend`.
5. Em Environment Variables, adicione a URL base da sua API criada no Railway. Ex: `VITE_API_URL=https://fincontrol-api...`
6. Clique em **Deploy**. A Vercel cuida do build (`npm run build`).

---

## 📂 Visão Geral e Próximos Passos
O núcleo do banco, webhooks, telas do Dashboard (Gráficos), Login e rotas protegidas já foram idealizados. 

Para a integração do Bot do WhatsApp, veja `backend/src/services/whatsapp.ts` (ou a documentação do Twilio que pode ser adicionada lá) e referencie `user.phone` garantido no Registration via Prisma.
