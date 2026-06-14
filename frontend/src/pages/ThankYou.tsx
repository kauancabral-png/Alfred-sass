import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-xl w-full rounded-[3rem] shadow-2xl p-10 md:p-14 text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
          Pagamento Aprovado!
        </h1>
        
        <p className="text-lg text-slate-600 mb-10 leading-relaxed font-bold italic">
          Seja bem-vindo ao time, Mestre! Acesse o Alfred em <a href="https://www.seualfred.site/login" className="text-blue-600 underline font-black">seualfred.site/login</a> usando seu e-mail de compra. Sua senha inicial é: <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-900">alfred123</span>.
        </p>

        <a 
          href="https://www.seualfred.site/login"
          className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 px-8 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-3 text-xl uppercase tracking-tight"
        >
          Acessar Agora <ArrowRight className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
