import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans p-6 md:p-20">
      <div className="max-w-4xl mx-auto">
        <NavLink to="/" className="flex items-center gap-2 text-primary font-black mb-10 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Alfred
        </NavLink>
        
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-primary/10 rounded-2xl"><Shield className="w-8 h-8 text-primary" /></div>
           <h1 className="text-4xl font-black tracking-tight">Política de Privacidade</h1>
        </div>

        <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
          <p>Última atualização: Abril de 2026</p>
          
          <h2 className="text-2xl font-black text-slate-900 mt-10">1. Coleta de Dados</h2>
          <p>
            O Alfred coleta dados básicos para o funcionamento do serviço, como Nome, E-mail e Número de WhatsApp (para integração com o bot). Seus dados financeiros registrados no bot ou no dashboard são armazenados de forma segura e criptografada.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10">2. Uso das Informações</h2>
          <p>
            Utilizamos suas informações exclusivamente para:
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Processar suas transações financeiras no dashboard;</li>
              <li>Permitir a interação via WhatsApp;</li>
              <li>Enviar atualizações críticas de segurança e serviço via e-mail;</li>
              <li>Melhorar a experiência da plataforma Alfred.</li>
            </ul>
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos ou alugamos seus dados para terceiros. Suas informações só são compartilhadas com provedores de serviços essenciais (como processadores de pagamento e serviços de envio de e-mail) sob estrita confidencialidade.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10">4. Seguridad</h2>
          <p>
            Implementamos medidas de segurança de nível bancário para proteger seus dados contra acesso não autorizado, alteração ou destruição.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10">5. Seus Direitos</h2>
          <p>
            Você pode solicitar a exclusão total de sua conta e de todos os dados associados a qualquer momento através do suporte ou configurações do painel.
          </p>
        </div>
      </div>
    </div>
  );
}
