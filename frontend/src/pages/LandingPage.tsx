import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Smartphone, Lock, EyeOff, Key, CheckCircle2, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const checkoutUrl = "https://pay.hotmart.com/L105225408E?checkoutMode=10&bid=1781537060087";

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

  const handleCheckout = () => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-green-500 selection:text-white" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
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
        .logo-carousel {
          display: flex;
          animation: scroll 20s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-4 px-6 md:px-12 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-slate-900">ALFRED.</span>
         </div>
         <NavLink to="/login" className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-slate-800 transition-all shadow-md">
            Mi Panel
         </NavLink>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
         <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full mb-8 reveal-hidden">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-green-700">TU MAYORDOMO FINANCIERO INTELIGENTE</span>
         </div>
         
         <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight reveal-hidden text-slate-900">
            Deja de trabajar para tu dinero. <br className="hidden md:block"/> 
            <span className="text-green-500">Deja que Alfred organice todo.</span>
         </h1>
         
         <p className="text-slate-500 text-lg md:text-xl max-w-2xl mb-10 reveal-hidden leading-relaxed font-medium">
            Todo lo que entra y sale de tu cuenta personal y de tu empresa, organizado de forma automática e inteligente. Sin llenar hojas de cálculo. Sin sorpresas a fin de mes.
         </p>

         <div className="flex flex-col items-center gap-3 reveal-hidden">
            <button onClick={handleCheckout} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-base md:text-lg hover:scale-105 hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3">
               Conocer a mi nuevo mayordomo <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1">
               <Lock className="w-3 h-3" /> Conexión 100% segura vía Open Finance. Un solo pago, acceso de por vida.
            </p>
         </div>
      </section>

      {/* Mockup Dashboard */}
      <section className="px-6 pb-20 reveal-hidden max-w-6xl mx-auto">
         <div className="bg-white rounded-[2.5rem] border border-slate-200 p-2 md:p-4 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
            <div className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 aspect-video flex items-center justify-center relative">
               <img src="/dashboard-preview.png" alt="Alfred Dashboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
         </div>
      </section>

      {/* Prova Social */}
      <section className="py-10 border-y border-slate-200 bg-white overflow-hidden flex flex-col items-center reveal-hidden">
         <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 text-center">Alfred ya habla con fluidez con los bancos más grandes:</p>
         <div className="w-full relative flex overflow-x-hidden">
            <div className="logo-carousel whitespace-nowrap flex items-center gap-16 px-8 text-2xl font-black text-slate-300">
               <span>NUBANK</span><span>ITAÚ</span><span>BRADESCO</span><span>SANTANDER</span><span>BBVA</span><span>INTER</span>
               <span>NUBANK</span><span>ITAÚ</span><span>BRADESCO</span><span>SANTANDER</span><span>BBVA</span><span>INTER</span>
            </div>
         </div>
      </section>

      {/* Agitação da Dor */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
         <div className="grid md:grid-cols-2 gap-16">
            <div className="reveal-hidden">
               <h3 className="text-3xl font-black mb-4 text-slate-900 leading-tight">¿Sorpresas en la tarjeta de crédito? <br/>Con Alfred, nunca más.</h3>
               <p className="text-slate-500 mb-8 leading-relaxed font-medium">Alfred analiza tus gastos, entiende tus hábitos y te avisa antes de que pierdas el control. Une tu vida personal y empresarial en la misma plataforma, pero en cajones separados.</p>
               <button onClick={handleCheckout} className="text-green-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">Eliminar sorpresas <ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="reveal-hidden">
               <h3 className="text-3xl font-black mb-4 text-slate-900 leading-tight">Descubre exactamente hacia dónde se escapa tu dinero.</h3>
               <p className="text-slate-500 mb-8 leading-relaxed font-medium">Nuestra Inteligencia Artificial encuentra las suscripciones olvidadas, comisiones ocultas y patrones de gasto que están drenando tu presupuesto. Te sugiere dónde ahorrar sin recortar lo que te gusta.</p>
               <button onClick={handleCheckout} className="text-green-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">Optimizar mis gastos <ArrowRight className="w-4 h-4" /></button>
            </div>
         </div>
      </section>

      {/* Diferencial WhatsApp */}
      <section className="py-32 bg-slate-900 text-white px-6">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 reveal-hidden">
               <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Un mayordomo en tu bolsillo. Solo tienes que enviar un audio.</h2>
               <p className="text-slate-400 mb-10 text-lg">Deja de navegar por menús complejos. Pregúntale a Alfred por WhatsApp como si estuvieras hablando con tu contador de confianza.</p>
               <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                     <p className="font-medium text-slate-200">💬 "Alfred, ¿gasté mucho en comida a domicilio este mes?"</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                     <p className="font-medium text-slate-200">🎙️ "Alfred, registra un gasto empresarial de $150 en material de oficina."</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                     <p className="font-medium text-slate-200">📈 "Alfred, ¿cómo va mi meta del fondo de emergencia?"</p>
                  </div>
               </div>
            </div>
            <div className="flex-1 reveal-hidden flex justify-center">
               <div className="w-72 h-[500px] bg-slate-800 rounded-[3rem] border-8 border-slate-950 shadow-2xl flex flex-col overflow-hidden relative">
                  <div className="bg-green-600 w-full py-4 px-6 flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-green-600">A</div>
                     <div>
                        <p className="font-bold text-white leading-tight">Alfred</p>
                        <p className="text-[10px] text-green-200">En línea</p>
                     </div>
                  </div>
                  <div className="flex-1 bg-[#efeae2] p-4 flex flex-col gap-4">
                     <div className="bg-white p-3 rounded-2xl rounded-tl-none self-start max-w-[85%] shadow-sm">
                        <p className="text-sm text-slate-800">¡Hola! Soy Alfred. Acabo de identificar una suscripción duplicada de Netflix. ¿Quieres que la registre en tus finanzas?</p>
                     </div>
                     <div className="bg-[#d9fdd3] p-3 rounded-2xl rounded-tr-none self-end max-w-[85%] shadow-sm">
                        <p className="text-sm text-slate-800">Sí, por favor.</p>
                     </div>
                     <div className="bg-white p-3 rounded-2xl rounded-tl-none self-start max-w-[85%] shadow-sm">
                        <p className="text-sm text-slate-800">✅ Listo. Gasto registrado. Tu presupuesto mensual sigue en orden.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Segurança */}
      <section className="py-32 px-6 bg-white border-b border-slate-200">
         <div className="max-w-5xl mx-auto text-center reveal-hidden">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-slate-900">Tus datos protegidos como en una bóveda suiza.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <Lock className="w-8 h-8 text-green-600 mb-4" />
                  <h4 className="font-black text-slate-900 mb-2">Encriptación Nivel Bancario</h4>
                  <p className="text-sm text-slate-500 font-medium">Seguridad de extremo a extremo (AES-256) blindando cada transacción.</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <ShieldCheck className="w-8 h-8 text-green-600 mb-4" />
                  <h4 className="font-black text-slate-900 mb-2">Regulado Oficialmente</h4>
                  <p className="text-sm text-slate-500 font-medium">Integración mediante el sistema seguro y oficial de Open Finance.</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <EyeOff className="w-8 h-8 text-green-600 mb-4" />
                  <h4 className="font-black text-slate-900 mb-2">Modo Solo Lectura</h4>
                  <p className="text-sm text-slate-500 font-medium">Alfred analiza y aconseja, pero no puede hacer transferencias por ti.</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <Key className="w-8 h-8 text-green-600 mb-4" />
                  <h4 className="font-black text-slate-900 mb-2">Sin Contraseñas</h4>
                  <p className="text-sm text-slate-500 font-medium">La conexión se hace de banco a banco. Tú tienes el control absoluto.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing */}
      <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>
         <div className="max-w-3xl mx-auto relative z-10 reveal-hidden">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">Un solo pago. Tu tranquilidad financiera de por vida.</h2>
               <p className="text-slate-500 text-lg font-medium">Olvídate de las suscripciones mensuales. Alfred es tuyo para siempre con una inversión única.</p>
            </div>

            <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-2xl relative">
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">Oferta Vitalicia</div>
               
               <div className="text-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Plan Premium Vitalicio</h3>
                  <p className="text-slate-500 text-sm font-medium mb-8">El mayordomo completo para tu vida y tu negocio.</p>
                  <div className="flex justify-center items-end gap-1">
                     <span className="text-6xl font-black text-slate-900">$29.90</span>
                     <span className="text-slate-400 font-bold mb-2">USD</span>
                  </div>
                  <p className="text-green-600 font-bold text-sm mt-2">Pago único. Sin mensualidades.</p>
               </div>

               <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0"/> <span className="font-bold text-slate-700">Conexiones bancarias ilimitadas</span></div>
                  <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0"/> <span className="font-bold text-slate-700">Perfil Personal y Empresarial</span></div>
                  <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0"/> <span className="font-bold text-slate-700">Inteligencia Artificial en WhatsApp</span></div>
                  <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0"/> <span className="font-bold text-slate-700">Análisis profundo de flujo de caja</span></div>
                  <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0"/> <span className="font-bold text-slate-700">Actualizaciones gratuitas de por vida</span></div>
               </div>

               <button onClick={handleCheckout} className="w-full py-6 rounded-2xl font-black text-lg text-center bg-green-500 text-white hover:bg-green-600 hover:scale-[1.02] transition-all shadow-xl shadow-green-500/20">
                  QUIERO MI ACCESO A $29.90
               </button>
               
               <p className="text-center text-xs font-bold text-slate-400 mt-6">
                  🛡️ Garantía de 7 días. Si no organizamos tus finanzas, te devolvemos el 100%.
               </p>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 max-w-3xl mx-auto reveal-hidden">
         <h2 className="text-3xl font-black mb-12 text-center text-slate-900">Preguntas Frecuentes</h2>
         <div className="space-y-6">
            <details className="group bg-white rounded-2xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden">
               <summary className="flex justify-between items-center font-black text-slate-900 cursor-pointer">
                  ¿Alfred es seguro?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-slate-400" />
               </summary>
               <p className="mt-4 text-slate-500 font-medium leading-relaxed">Sí, totalmente. Utilizamos encriptación de extremo a extremo y toda la lectura se hace a través de Open Finance. Nunca tenemos acceso a tus contraseñas.</p>
            </details>
            <details className="group bg-white rounded-2xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden">
               <summary className="flex justify-between items-center font-black text-slate-900 cursor-pointer">
                  ¿Alfred puede mover mi dinero?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-slate-400" />
               </summary>
               <p className="mt-4 text-slate-500 font-medium leading-relaxed">De ninguna manera. El acceso es exclusivamente en modo "solo lectura". Alfred analiza, proyecta e informa, pero la autoridad para mover tu dinero es siempre 100% tuya.</p>
            </details>
            <details className="group bg-white rounded-2xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden">
               <summary className="flex justify-between items-center font-black text-slate-900 cursor-pointer">
                  ¿Funciona para mi empresa?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-slate-400" />
               </summary>
               <p className="mt-4 text-slate-500 font-medium leading-relaxed">¡Sí! Con tu acceso Premium Vitalicio, tienes un botón en tu panel que alterna entre tus finanzas Personales y las de la Empresa, generando flujos de caja separados para no mezclar el dinero.</p>
            </details>
            <details className="group bg-white rounded-2xl border border-slate-200 p-6 [&_summary::-webkit-details-marker]:hidden">
               <summary className="flex justify-between items-center font-black text-slate-900 cursor-pointer">
                  ¿Tengo que pagar mensualidades?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-slate-400" />
               </summary>
               <p className="mt-4 text-slate-500 font-medium leading-relaxed">No. Es un pago único de $29.90. No hay cuotas mensuales ni costos ocultos. Compras una vez y lo usas para siempre.</p>
            </details>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 text-center bg-white">
         <span className="text-xl font-black tracking-tighter text-slate-300 mb-6 block">ALFRED.</span>
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">&copy; 2026 Alfred SaaS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
