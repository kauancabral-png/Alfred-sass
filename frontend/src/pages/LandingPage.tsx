import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, EyeOff, Key, CheckCircle2, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const checkoutUrl = "https://pay.hotmart.com/L105225408E?checkoutMode=10&bid=1781537060087";

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
       document.documentElement.style.scrollBehavior = 'auto';
       hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleCheckout = () => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-white selection:text-black" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #050505;
        }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .logo-carousel {
          display: flex;
          animation: scroll 25s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505; 
        }
        ::-webkit-scrollbar-thumb {
          background: #333; 
          border-radius: 4px;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
         <div className="flex items-center gap-2">
            <img src="/logo-alfred-white.png" alt="Alfred" className="h-6 md:h-7 object-contain" />
         </div>
         <div className="flex items-center gap-6">
            <NavLink to="/login" className="hidden md:block font-medium text-sm text-neutral-400 hover:text-white transition-colors">
               Entrar
            </NavLink>
            <button onClick={handleCheckout} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
               Comenzar ahora
            </button>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
         <div className="inline-flex items-center gap-2 bg-[#111] border border-white/10 px-4 py-2 rounded-full mb-10 reveal shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">TU MAYORDOMO FINANCIERO INTELIGENTE</span>
         </div>
         
         <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black mb-8 leading-[1.05] tracking-tighter reveal text-white max-w-4xl mx-auto">
            Deja de trabajar para tu dinero. <br className="hidden lg:block"/> 
            Deja que Alfred lo organice.
         </h1>
         
         <p className="text-neutral-400 text-lg md:text-2xl max-w-3xl mb-12 reveal leading-relaxed font-medium">
            Todo lo que entra y sale de tu cuenta personal y de tu empresa, organizado de forma automática e inteligente. Sin hojas de cálculo.
         </p>

         <div className="flex flex-col items-center gap-4 reveal w-full md:w-auto">
            <button onClick={handleCheckout} className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3">
               Conocer a mi nuevo mayordomo <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm font-medium text-neutral-500 mt-2 flex items-center gap-1">
               <Lock className="w-4 h-4" /> Conexión 100% segura. Acceso de por vida.
            </p>
         </div>
      </section>

      {/* Mockup Dashboard */}
      <section className="px-6 pb-32 reveal max-w-6xl mx-auto">
         <div className="bg-[#111] rounded-[2rem] md:rounded-[3rem] border border-white/10 p-2 md:p-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 aspect-[16/10] md:aspect-video flex items-center justify-center relative">
               <img src="/dashboard-preview.png" alt="Alfred Dashboard" className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-1000" />
               {/* Subtle Glow */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>
         </div>
      </section>

      {/* Prova Social (Bancos) */}
      <section className="py-16 border-y border-white/5 bg-[#0a0a0a] overflow-hidden flex flex-col items-center reveal">
         <p className="text-sm font-bold text-neutral-500 mb-8 text-center uppercase tracking-widest">Bancos que ya confían (Open Finance):</p>
         <div className="w-full relative flex overflow-x-hidden">
            <div className="logo-carousel whitespace-nowrap flex items-center gap-20 px-10 text-3xl font-black text-neutral-800">
               <span>NUBANK</span><span>ITAÚ</span><span>BRADESCO</span><span>SANTANDER</span><span>BBVA</span><span>INTER</span>
               <span>NUBANK</span><span>ITAÚ</span><span>BRADESCO</span><span>SANTANDER</span><span>BBVA</span><span>INTER</span>
            </div>
         </div>
      </section>

      {/* Funcionalidades (Agitação da Dor) */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
         <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div className="reveal flex flex-col justify-center">
               <h3 className="text-4xl md:text-5xl font-black mb-6 text-white leading-[1.1] tracking-tight">¿Sorpresas en la tarjeta? <br/>Con Alfred, nunca más.</h3>
               <p className="text-neutral-400 text-lg mb-8 leading-relaxed font-medium">Sé lo que es abrir la factura y no entender nada. Alfred analiza tus gastos, entiende tus hábitos y te avisa antes de que pierdas el control.</p>
               <button onClick={handleCheckout} className="bg-[#111] border border-white/10 text-white px-8 py-4 rounded-full font-bold w-max hover:bg-[#1a1a1a] transition-colors">
                  Descubrir sorpresas
               </button>
            </div>
            
            <div className="reveal bg-[#111] rounded-[3rem] p-10 border border-white/10 shadow-2xl aspect-square flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-red-500/20 transition-all duration-700"></div>
                <div className="relative z-10">
                   <h4 className="text-2xl font-black text-white mb-2 tracking-tight">Alerta de Gasto</h4>
                   <p className="text-neutral-400 font-medium">Gasto inusual detectado en Uber.</p>
                </div>
                <div className="relative z-10 bg-[#1a1a1a] border border-white/5 p-6 rounded-3xl shadow-lg">
                   <p className="text-red-400 font-black text-3xl mb-1 tracking-tighter">-$ 42.00</p>
                   <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Hoy, 14:30h</p>
                </div>
            </div>

            <div className="reveal bg-[#111] rounded-[3rem] p-10 border border-white/10 shadow-2xl aspect-square flex flex-col justify-between md:order-3 relative overflow-hidden group hover:border-white/20 transition-all">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -ml-20 -mb-20 group-hover:bg-green-500/20 transition-all duration-700"></div>
                <div className="relative z-10">
                   <h4 className="text-2xl font-black text-white mb-2 tracking-tight">Ahorro Inteligente</h4>
                   <p className="text-neutral-400 font-medium">Suscripciones que no usas.</p>
                </div>
                <div className="relative z-10 bg-[#1a1a1a] border border-white/5 p-6 rounded-3xl shadow-lg">
                   <p className="text-green-400 font-black text-3xl mb-1 tracking-tighter">+$ 15.00</p>
                   <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Netflix (Duplicado)</p>
                </div>
            </div>
            
            <div className="reveal flex flex-col justify-center md:order-4">
               <h3 className="text-4xl md:text-5xl font-black mb-6 text-white leading-[1.1] tracking-tight">Te muestro hacia dónde va tu dinero.</h3>
               <p className="text-neutral-400 text-lg mb-8 leading-relaxed font-medium">Analizo tus gastos, encuentro patrones y te muestro dónde puedes ahorrar sin sufrir. Categorización automática con Inteligencia Artificial.</p>
               <button onClick={handleCheckout} className="bg-[#111] border border-white/10 text-white px-8 py-4 rounded-full font-bold w-max hover:bg-[#1a1a1a] transition-colors">
                  Categorizar gastos
               </button>
            </div>
         </div>
      </section>

      {/* Diferencial WhatsApp */}
      <section className="py-32 bg-[#0a0a0a] px-6 border-y border-white/5">
         <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 reveal">
               <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[1.05] tracking-tighter text-white">Pregunta a tu manera que yo te entiendo.</h2>
               <p className="text-neutral-400 mb-10 text-xl font-medium leading-relaxed">Habla conmigo como si estuvieras con un amigo. Un mayordomo en tu bolsillo, directamente en WhatsApp.</p>
               <button onClick={handleCheckout} className="bg-white text-black px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  Conversar con Alfred
               </button>
            </div>
            <div className="flex-1 reveal flex justify-center w-full">
               <div className="w-full max-w-md bg-[#111] rounded-[3rem] p-8 border border-white/10 shadow-2xl relative">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-black text-black text-xl shadow-lg">A</div>
                     <div>
                        <p className="font-bold text-white text-lg">Alfred</p>
                        <p className="text-sm text-green-400 font-semibold">En línea</p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-6">
                     <div className="bg-[#1a1a1a] p-5 rounded-3xl rounded-tl-none self-start max-w-[85%] border border-white/5">
                        <p className="text-white font-medium">¡Hola! Encontré un pago de $150 en "Material de oficina". ¿Lo pongo en la cuenta de tu Empresa?</p>
                     </div>
                     <div className="bg-white p-5 rounded-3xl rounded-tr-none self-end max-w-[85%] shadow-xl">
                        <p className="text-black font-bold">Sí, por favor.</p>
                     </div>
                     <div className="bg-[#1a1a1a] p-5 rounded-3xl rounded-tl-none self-start max-w-[85%] border border-white/5">
                        <p className="text-white font-medium">✅ Listo. Flujo de caja empresarial actualizado.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Como Funciono / Segurança */}
      <section className="py-32 px-6 bg-[#050505]">
         <div className="max-w-6xl mx-auto reveal">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-white tracking-tight">Cómo funciono</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="p-8 bg-[#111] rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group">
                  <Lock className="w-10 h-10 text-white mb-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <h4 className="font-black text-xl text-white mb-3">Encriptación de punta</h4>
                  <p className="text-neutral-400 font-medium leading-relaxed">Tus datos protegidos con AES-256, el mismo estándar que usan los bancos suizos.</p>
               </div>
               <div className="p-8 bg-[#111] rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group">
                  <Key className="w-10 h-10 text-white mb-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <h4 className="font-black text-xl text-white mb-3">No pido contraseñas</h4>
                  <p className="text-neutral-400 font-medium leading-relaxed">La conexión se hace vía Open Finance directo con tu banco. Tú tienes el control.</p>
               </div>
               <div className="p-8 bg-[#111] rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group">
                  <EyeOff className="w-10 h-10 text-white mb-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <h4 className="font-black text-xl text-white mb-3">Solo lectura</h4>
                  <p className="text-neutral-400 font-medium leading-relaxed">Solo leo tus datos para ayudarte. No puedo realizar transacciones.</p>
               </div>
               <div className="p-8 bg-[#111] rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group">
                  <ShieldCheck className="w-10 h-10 text-white mb-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <h4 className="font-black text-xl text-white mb-3">Regulado Oficialmente</h4>
                  <p className="text-neutral-400 font-medium leading-relaxed">Open Finance es una tecnología oficial, regulada por el Banco Central.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing - Oferta Vitalícia */}
      <section className="py-32 px-6 bg-[#0a0a0a] border-y border-white/5">
         <div className="max-w-4xl mx-auto reveal">
            <div className="text-center mb-16">
               <h2 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter leading-none">Planes y precios.</h2>
               <p className="text-neutral-400 text-xl font-medium">Un solo pago. Tu tranquilidad financiera siempre al día.</p>
            </div>

            <div className="bg-[#111] rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
               {/* Ambient Glow */}
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1">
                     <div className="inline-block bg-white/10 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6">Acceso Vitalicio</div>
                     <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Premium</h3>
                     <p className="text-neutral-400 font-medium mb-8 text-lg">El mayordomo completo para tu vida y negocio. Olvídate de mensualidades.</p>
                     <div className="flex items-end gap-2 mb-2">
                        <span className="text-7xl md:text-8xl font-black text-white tracking-tighter">$29.90</span>
                        <span className="text-neutral-500 font-bold text-xl mb-3">USD</span>
                     </div>
                     <p className="text-green-400 font-bold tracking-wide uppercase text-sm mt-4">Pago único de por vida.</p>
                  </div>

                  <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-10 md:pt-0 md:pl-12">
                     <div className="space-y-6 mb-12">
                        <div className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-white shrink-0 opacity-80"/> <span className="font-semibold text-lg text-white">Bancos ilimitados</span></div>
                        <div className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-white shrink-0 opacity-80"/> <span className="font-semibold text-lg text-white">Perfil Personal y Empresarial</span></div>
                        <div className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-white shrink-0 opacity-80"/> <span className="font-semibold text-lg text-white">Agentes autónomos con IA</span></div>
                        <div className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-white shrink-0 opacity-80"/> <span className="font-semibold text-lg text-white">Análisis avanzados y DRE</span></div>
                     </div>

                     <button onClick={handleCheckout} className="w-full py-6 rounded-full font-black text-xl text-center bg-white text-black hover:scale-[1.03] transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                        CONTRATAR PREMIUM
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 max-w-3xl mx-auto reveal">
         <h2 className="text-4xl md:text-5xl font-black mb-16 text-center text-white tracking-tight">Preguntas Frecuentes</h2>
         <div className="space-y-4">
            <details className="group bg-[#111] rounded-3xl border border-white/5 p-8 [&_summary::-webkit-details-marker]:hidden hover:border-white/20 transition-all cursor-pointer">
               <summary className="flex justify-between items-center font-bold text-xl text-white">
                  ¿Alfred es seguro?
                  <ChevronDown className="w-6 h-6 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-6 text-neutral-400 font-medium leading-relaxed text-lg">Sí, totalmente. Utilizamos encriptación de extremo a extremo y toda la lectura se hace a través de Open Finance. Nunca tenemos acceso a tus contraseñas.</p>
            </details>
            <details className="group bg-[#111] rounded-3xl border border-white/5 p-8 [&_summary::-webkit-details-marker]:hidden hover:border-white/20 transition-all cursor-pointer">
               <summary className="flex justify-between items-center font-bold text-xl text-white">
                  ¿Alfred puede mover mi dinero?
                  <ChevronDown className="w-6 h-6 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-6 text-neutral-400 font-medium leading-relaxed text-lg">De ninguna manera. El acceso es exclusivamente en modo "solo lectura". Alfred analiza, proyecta e informa, pero la autoridad para mover tu dinero es siempre 100% tuya.</p>
            </details>
            <details className="group bg-[#111] rounded-3xl border border-white/5 p-8 [&_summary::-webkit-details-marker]:hidden hover:border-white/20 transition-all cursor-pointer">
               <summary className="flex justify-between items-center font-bold text-xl text-white">
                  ¿Funciona para mi empresa?
                  <ChevronDown className="w-6 h-6 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-6 text-neutral-400 font-medium leading-relaxed text-lg">¡Sí! Con tu acceso Premium Vitalicio, tienes un botón en tu panel que alterna entre tus finanzas Personales y las de la Empresa, generando flujos de caja separados para no mezclar el dinero.</p>
            </details>
            <details className="group bg-[#111] rounded-3xl border border-white/5 p-8 [&_summary::-webkit-details-marker]:hidden hover:border-white/20 transition-all cursor-pointer">
               <summary className="flex justify-between items-center font-bold text-xl text-white">
                  ¿Tengo que pagar mensualidades?
                  <ChevronDown className="w-6 h-6 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-6 text-neutral-400 font-medium leading-relaxed text-lg">No. Es un pago único de $29.90. No hay cuotas mensuales ni costos ocultos. Compras una vez y lo usas para siempre.</p>
            </details>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center bg-[#050505]">
         <img src="/logo-alfred-white.png" alt="Alfred" className="h-8 mx-auto mb-8 opacity-50 hover:opacity-100 transition-opacity" />
         <p className="text-neutral-600 text-sm font-bold uppercase tracking-[0.2em]">&copy; 2026 Alfred SaaS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
