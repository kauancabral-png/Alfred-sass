import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans p-6 md:p-20">
      <div className="max-w-4xl mx-auto">
        <NavLink to="/" className="flex items-center gap-2 text-primary font-black mb-10 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Alfred
        </NavLink>
        
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-primary/10 rounded-2xl"><FileText className="w-8 h-8 text-primary" /></div>
           <h1 className="text-4xl font-black tracking-tight">Termos de Uso</h1>
        </div>

        <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
          <p>Última atualização: Abril de 2026</p>
          
          <h2 className="text-2xl font-black text-slate-900 mt-10">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar o Alfred, você concorda inteiramente com estes termos e com a nossa Política de Privacidade. O Alfred é um serviço de assinatura de software (SaaS) para gestão financeira.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10">2. Uso Permitido</h2>
          <p>
             O Alfred é para uso pessoal e empresarial legal. Você concorda em fornecer informações verdadeiras e em não usar a ferramenta para atividades ilícitas, lavagem de dinheiro ou qualquer ato criminoso.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10">3. Isenção de Responsabilidade</h2>
          <p>
            O Alfred é uma ferramenta de auxílio na gestão financeira. Não somos conselheiros financeiros licenciados e não garantimos ganhos financeiros ou lucros através do uso do sistema. As decisões financeiras tomadas através do Alfred são de sua inteira responsabilidade.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10">4. Pagamentos e Reembolsos</h2>
          <p>
             O pagamento é realizado através de plataformas integradas (Hotmart/Kirvano). Você tem direito ao arrependimento da compra em até 7 dias, conforme o Código de Defesa do Consumidor brasileiro.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10">5. Encerramento de Conta</h2>
          <p>
             Reservamo-nos o direito de encerrar contas que violem estes termos sem aviso prévio. Em caso de reembolso, o acesso ao serviço é revogado instantaneamente.
          </p>
        </div>
      </div>
    </div>
  );
}
