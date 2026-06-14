import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Zap, ArrowRight, CheckCircle2, LayoutDashboard, Wallet, BarChart3, Star, CheckSquare, ArrowRightLeft, Target, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  const checkoutMensal = "https://pay.hotmart.com/W105152228M?off=7p28xyyz&checkoutMode=10";
  const checkoutSemestral = "https://pay.hotmart.com/W105152228M?off=vrm69oh4&checkoutMode=10";
  const checkoutAnual = "https://pay.hotmart.com/W105152228M?off=b2f03eae&checkoutMode=10";

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal-hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
       document.documentElement.style.scrollBehavior = 'auto';
       hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleCheckout = (url: string) => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-primary selection:text-white" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <style>{`
        .reveal-hidden {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <img src="/logo-alfred-white.png" alt="Alfred Logo" className="h-8 md:h-10 object-contain" />
         </div>
         <NavLink to="/login" className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-neutral-200 transition-all shadow-xl shadow-white/5">
            Meu Painel
         </NavLink>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
         <div className="inline-flex items-center gap-2 bg-neutral-900/50 border border-white/10 px-4 py-2 rounded-full mb-8 reveal-hidden">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Seguridad de Elite</span>
         </div>
         
         <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter reveal-hidden uppercase">
            Domine seu<br />
            <span className="bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">CAPITAL.</span>
         </h1>
         
         <p className="text-neutral-400 text-lg md:text-2xl max-w-2xl mb-12 reveal-hidden leading-relaxed italic">
            Alfred é o mordomo financeiro inteligente que vive no seu WhatsApp e no seu navegador. Controle total, esforço zero.
         </p>

         <div className="flex flex-col md:flex-row gap-4 reveal-hidden">
            <button onClick={() => document.getElementById('planos')?.scrollIntoView({behavior: 'smooth'})} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-base md:text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10 flex items-center gap-3 uppercase tracking-tight">
               Começar Agora <ArrowRight className="w-6 h-6" />
            </button>
            <NavLink to="/login" className="bg-neutral-900 border border-white/10 px-12 py-5 rounded-2xl font-black text-base md:text-lg hover:bg-neutral-800 transition-all uppercase tracking-tight">
               Entrar no Sistema
            </NavLink>
         </div>
      </section>

      {/* Mockup Dashboard */}
      <section className="px-6 pb-40 reveal-hidden max-w-6xl mx-auto">
         <div className="bg-neutral-900 rounded-[3rem] border border-white/10 p-4 md:p-8 shadow-[0_0_150px_rgba(255,255,255,0.05)] relative overflow-hidden group">
            <div className="bg-[#0c0c0c] rounded-[2rem] overflow-hidden border border-white/5 aspect-video flex items-center justify-center relative">
               <img src="/dashboard-preview.png" alt="Alfred Dashboard" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent"></div>
               <div className="absolute center flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 mb-4 animate-pulse">
                     <Zap className="w-10 h-10 text-white fill-white" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-40 bg-[#050505]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             <div className="reveal-hidden p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><MessageCircle className="w-7 h-7" /></div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Alfred WhatsApp</h3>
                <p className="text-neutral-500 leading-relaxed font-bold italic">Registre seus gastos apenas enviando mensagens. Alfred categoriza e atualiza seu painel automaticamente para você.</p>
             </div>
             <div className="reveal-hidden p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><LayoutDashboard className="w-7 h-7" /></div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Painel Mestre</h3>
                <p className="text-neutral-500 leading-relaxed font-bold italic">Visualize fluxo de caixa, metas e dívidas em uma interface de alto luxo, desenhada para clareza absoluta e decisões rápidas.</p>
             </div>
             <div className="reveal-hidden p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><ArrowRightLeft className="w-7 h-7" /></div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Perfis Duais</h3>
                <p className="text-neutral-500 leading-relaxed font-bold italic">Gerencie sua vida pessoal e suas empresas no mesmo painel. Separação total de contas, controle unificado de patrimônio.</p>
             </div>
          </div>
      </section>

      {/* Prices */}
      <section id="planos" className="py-40 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 reveal-hidden">
               <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-none">Um Valor.<br/>Controle Total 🏛️</h2>
               <p className="text-neutral-500 text-lg md:text-2xl max-w-2xl mx-auto font-bold italic">Sem letras miúdas. Alfred foi desenhado para elevar seu status financeiro desde o primeiro dia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
               {/* Mensual */}
               <div className="bg-[#0a0a0a] rounded-[3rem] p-10 border border-white/10 flex flex-col hover:border-white/30 transition-colors h-full min-h-[550px] shadow-2xl">
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-widest text-neutral-400">Mensal</h3>
                  <p className="text-neutral-500 text-sm mb-10 font-bold">Assinatura Mês a Mês</p>
                  <div className="mb-2"><span className="text-6xl font-black">R$ 37</span><span className="text-neutral-500 font-black">/mês</span></div>
                  <p className="text-neutral-600 text-sm mb-12 font-bold">Cancele quando quiser, sem perguntas chatas.</p>
                  <ul className="space-y-6 mb-12 flex-1 text-sm text-neutral-300 font-bold uppercase tracking-tight">
                     <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-white shrink-0"/> Acesso total ao Painel Web</li>
                     <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-white shrink-0"/> Robô Alfred Sem Limites</li>
                     <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-white shrink-0"/> Relatórios Estratégicos</li>
                  </ul>
                  <button onClick={() => handleCheckout(checkoutMensal)} className="w-full py-5 rounded-[1.8rem] font-black text-center bg-white text-black hover:bg-neutral-200 transition-all text-sm uppercase tracking-widest">
                     Contratar Mensal
                  </button>
               </div>

               {/* Semestral - Destacado */}
               <div className="bg-[#111] rounded-[3rem] p-10 md:p-14 border-4 border-white flex flex-col relative shadow-[0_0_100px_rgba(255,255,255,0.1)] transform lg:-translate-y-8 h-full z-10 min-h-[650px]">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-[12px] font-black px-6 py-3 rounded-full uppercase tracking-widest shadow-2xl">O Mais Vendido 🔥</div>
                  <h3 className="text-3xl font-black mb-2 text-white uppercase tracking-[0.2em] mt-4">Semestral</h3>
                  <p className="text-neutral-400 text-sm mb-12 font-bold italic">Acesso por 6 Meses de Elite</p>
                  <div className="mb-4 flex flex-col items-start">
                     <span className="text-3xl font-black text-white italic">R$ 147,00</span>
                  </div>
                  <p className="text-orange-500 font-black text-sm mb-12 uppercase tracking-tight">Pagamento Único (Economize R$ 75)</p>
                  <ul className="space-y-6 mb-12 flex-1 text-base text-neutral-200 font-black uppercase tracking-tight">
                     <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-white shrink-0"/> Tudo do Plano Mensal</li>
                     <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-white shrink-0"/> Suporte Mestre Prioritário</li>
                     <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-white shrink-0"/> Backup Diário do Patrimônio</li>
                  </ul>
                  <button onClick={() => handleCheckout(checkoutSemestral)} className="w-full py-6 rounded-[2rem] font-black text-xl text-center bg-white text-black hover:scale-[1.05] transition-transform shadow-2xl shadow-white/20 uppercase tracking-widest">
                     CONTRATAR AGORA 💎
                  </button>
               </div>

               {/* Anual */}
               <div className="bg-[#0a0a0a] rounded-[3rem] p-10 border border-white/10 flex flex-col hover:border-white/30 transition-colors h-full min-h-[550px] shadow-2xl">
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-widest text-neutral-400 font-sans">Anual</h3>
                  <p className="text-neutral-500 text-sm mb-10 font-bold font-sans">Acesso por 12 Meses</p>
                  <div className="mb-4 flex flex-col">
                     <span className="text-5xl font-black text-white font-sans italic">R$ 197,00</span>
                  </div>
                  <p className="text-neutral-600 font-black text-sm mb-12 uppercase tracking-widest font-sans">Evolução Total (Menos de R$ 17/mês)</p>
                  <button onClick={() => handleCheckout(checkoutAnual)} className="w-full py-5 rounded-[1.8rem] font-black text-center bg-[#111] border border-white/20 text-white hover:bg-white hover:text-black transition-all text-sm uppercase tracking-widest font-sans">
                     Contratar Anual
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-32 border-t border-white/5 text-center bg-black">
         <img src="/logo-alfred-white.png" alt="Alfred Logo" className="h-10 mx-auto mb-10 opacity-60" />
         <p className="text-neutral-600 text-sm font-black uppercase tracking-[0.5em]">&copy; 2026 Alfred SaaS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
