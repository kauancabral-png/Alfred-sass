import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, ChevronDown } from 'lucide-react';

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
    <div className="min-h-screen bg-[#000000] font-sans text-white selection:bg-white selection:text-black" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #000000;
        }

        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
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

        /* Glassmorphism Phone */
        .phone-mockup {
          box-shadow: 0 0 50px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1);
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-white/10 py-3 px-6 flex justify-between items-center transition-all">
         <div className="flex items-center">
            <img src="/logo-alfred-white.png" alt="Alfred" className="h-5 md:h-6 object-contain" />
         </div>
         <div className="flex items-center gap-4">
            <NavLink to="/login" className="hidden md:block font-medium text-sm text-neutral-400 hover:text-white transition-colors">
               Entrar
            </NavLink>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
         <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tighter reveal text-white">
            Deja de trabajar para tu dinero. <br/> 
            Deja que Alfred lo organice.
         </h1>
         
         <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mb-8 reveal leading-relaxed font-medium">
            Todo lo que entra y sale de tu cuenta, organizado de forma automática e inteligente. Sin hojas de cálculo, sin sorpresas.
         </p>

         <button onClick={handleCheckout} className="reveal bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)] mb-16">
            Comenzar ahora
         </button>

         {/* Phone Mockup - Hero Image */}
         <div className="reveal relative w-full max-w-[320px] mx-auto h-[600px] bg-[#0a0a0a] rounded-[3rem] border-[6px] border-[#1a1a1a] phone-mockup overflow-hidden flex flex-col">
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
               <div className="w-32 h-6 bg-[#1a1a1a] rounded-b-3xl"></div>
            </div>
            
            {/* App UI Concept */}
            <div className="flex-1 w-full bg-[#050505] p-5 pt-12 relative flex flex-col">
               <h3 className="text-left text-neutral-500 font-bold text-xs uppercase tracking-widest mb-1">Mi Saldo</h3>
               <p className="text-left text-white font-black text-3xl mb-8 tracking-tighter">$ 4,250.00</p>
               
               <div className="flex gap-2 mb-8">
                  <div className="flex-1 bg-[#111] border border-white/5 rounded-2xl p-4">
                     <p className="text-green-400 font-black text-lg">+$5k</p>
                     <p className="text-neutral-500 text-xs font-semibold">Ingresos</p>
                  </div>
                  <div className="flex-1 bg-[#111] border border-white/5 rounded-2xl p-4">
                     <p className="text-red-400 font-black text-lg">-$750</p>
                     <p className="text-neutral-500 text-xs font-semibold">Gastos</p>
                  </div>
               </div>

               <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">🍔</div>
                     <div>
                        <p className="text-sm font-bold text-white">Comida</p>
                        <p className="text-xs text-neutral-500">McDonalds</p>
                     </div>
                  </div>
                  <p className="text-sm font-bold text-white">-$ 15.00</p>
               </div>
               
               <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">🚗</div>
                     <div>
                        <p className="text-sm font-bold text-white">Transporte</p>
                        <p className="text-xs text-neutral-500">Uber</p>
                     </div>
                  </div>
                  <p className="text-sm font-bold text-white">-$ 8.50</p>
               </div>

               {/* Floating WhatsApp Notification */}
               <div className="absolute top-32 -left-8 md:-left-16 bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-2xl p-3 flex items-center gap-3 animate-bounce shadow-green-500/20" style={{ animationDuration: '3s' }}>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-black text-sm">A</div>
                  <p className="text-xs font-bold text-white max-w-[120px] leading-tight">No olvides pagar tu tarjeta hoy! 💳</p>
               </div>
            </div>
         </div>
      </section>

      {/* Bancos (Prova Social) */}
      <section className="py-12 border-y border-white/5 bg-[#050505] overflow-hidden flex flex-col items-center reveal">
         <p className="text-xs font-bold text-neutral-500 mb-6 text-center uppercase tracking-widest">Bancos que ya confían:</p>
         <div className="w-full relative flex overflow-x-hidden">
            <div className="logo-carousel whitespace-nowrap flex items-center gap-12 px-6 text-2xl font-black text-neutral-800">
               <span>NUBANK</span><span>ITAÚ</span><span>BRADESCO</span><span>SANTANDER</span><span>BBVA</span><span>INTER</span>
               <span>NUBANK</span><span>ITAÚ</span><span>BRADESCO</span><span>SANTANDER</span><span>BBVA</span><span>INTER</span>
            </div>
         </div>
      </section>

      {/* Feature 1 */}
      <section className="py-20 px-6 max-w-lg md:max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
         <div className="reveal flex-1 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black mb-4 text-white leading-[1.1] tracking-tight">¿Sorpresas en la factura? Comigo, no.</h3>
            <p className="text-neutral-400 text-base mb-6 leading-relaxed font-medium">Sé lo que es abrir la factura y no entender nada. Alfred analiza tus gastos y te avisa antes de que pierdas el control.</p>
            <button onClick={handleCheckout} className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors mx-auto md:mx-0 block">
               Descubrir sorpresas
            </button>
         </div>
         <div className="reveal flex-1 w-full flex justify-center">
             <div className="w-full max-w-[280px] bg-[#111] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] -mr-10 -mt-10"></div>
                <div className="relative z-10">
                   <h4 className="text-xl font-black text-white mb-1">Alerta de Gasto</h4>
                   <p className="text-neutral-400 text-xs mb-4">Gasto inusual detectado.</p>
                </div>
                <div className="relative z-10 bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl shadow-lg">
                   <p className="text-red-400 font-black text-2xl mb-1 tracking-tighter">-$ 42.00</p>
                   <p className="text-xs font-bold text-neutral-500 uppercase">Uber - Hoy</p>
                </div>
            </div>
         </div>
      </section>

      {/* Feature 2 */}
      <section className="py-20 px-6 max-w-lg md:max-w-4xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10 bg-[#050505]">
         <div className="reveal flex-1 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black mb-4 text-white leading-[1.1] tracking-tight">Te muestro hacia dónde va tu dinero.</h3>
            <p className="text-neutral-400 text-base mb-6 leading-relaxed font-medium">Categorización automática con Inteligencia Artificial. Encuentro patrones para que ahorres sin sufrir.</p>
            <button onClick={handleCheckout} className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors mx-auto md:mx-0 block">
               Categorizar gastos
            </button>
         </div>
         <div className="reveal flex-1 w-full flex justify-center">
             <div className="w-full max-w-[280px] bg-[#111] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -ml-10 -mb-10"></div>
                <div className="relative z-10">
                   <h4 className="text-xl font-black text-white mb-1">Ahorro Inteligente</h4>
                   <p className="text-neutral-400 text-xs mb-4">Suscripciones sin uso.</p>
                </div>
                <div className="relative z-10 bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl shadow-lg">
                   <p className="text-green-400 font-black text-2xl mb-1 tracking-tighter">+$ 15.00</p>
                   <p className="text-xs font-bold text-neutral-500 uppercase">Netflix Duplicado</p>
                </div>
            </div>
         </div>
      </section>

      {/* WhatsApp Feature */}
      <section className="py-20 px-6 max-w-lg md:max-w-4xl mx-auto flex flex-col items-center gap-10">
         <div className="reveal text-center">
            <h3 className="text-3xl md:text-4xl font-black mb-4 text-white leading-[1.1] tracking-tight">Pregunta de tu manera que yo entiendo.</h3>
            <p className="text-neutral-400 text-base mb-6 leading-relaxed font-medium max-w-xl mx-auto">Un mayordomo en tu bolsillo, directamente en WhatsApp. Conversa conmigo como si fuera un amigo.</p>
            <button onClick={handleCheckout} className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors block mx-auto">
               Hablar con Alfred
            </button>
         </div>
         <div className="reveal w-full max-w-[320px] bg-[#111] rounded-[2rem] p-5 border border-white/10 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-black text-black shadow-lg">A</div>
               <div>
                  <p className="font-bold text-white text-sm">Alfred</p>
                  <p className="text-xs text-green-400 font-semibold">En línea</p>
               </div>
            </div>
            <div className="flex flex-col gap-4 text-sm">
               <div className="bg-[#1a1a1a] p-3.5 rounded-2xl rounded-tl-none self-start max-w-[85%] border border-white/5">
                  <p className="text-white font-medium">Encontré un pago de $150. ¿Es de la Empresa?</p>
               </div>
               <div className="bg-white p-3.5 rounded-2xl rounded-tr-none self-end max-w-[85%]">
                  <p className="text-black font-bold">Sí, por favor.</p>
               </div>
               <div className="bg-[#1a1a1a] p-3.5 rounded-2xl rounded-tl-none self-start max-w-[85%] border border-white/5">
                  <p className="text-white font-medium">✅ Flujo de caja empresarial actualizado.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Como Funciono (Vertical Timeline) */}
      <section className="py-24 px-6 bg-[#050505]">
         <div className="max-w-lg mx-auto reveal">
            <h2 className="text-3xl md:text-4xl font-black mb-16 text-center text-white tracking-tight">Como eu funciono</h2>
            
            <div className="relative border-l border-white/10 ml-6 md:ml-10 space-y-12">
               
               <div className="relative pl-8">
                  <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]">1</div>
                  <h4 className="font-black text-xl text-white mb-2">Conexión de cuenta</h4>
                  <p className="text-neutral-400 text-sm font-medium leading-relaxed">Te conectas a tu banco vía Open Finance de forma segura, con encriptación a nivel bancario.</p>
               </div>

               <div className="relative pl-8">
                  <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]">2</div>
                  <h4 className="font-black text-xl text-white mb-2">Lectura de tus datos</h4>
                  <p className="text-neutral-400 text-sm font-medium leading-relaxed">Alfred lee tus ingresos y gastos. Modo "solo lectura", sin permiso para mover tu dinero.</p>
               </div>

               <div className="relative pl-8">
                  <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]">3</div>
                  <h4 className="font-black text-xl text-white mb-2">Análisis de IA</h4>
                  <p className="text-neutral-400 text-sm font-medium leading-relaxed">Clasifica y entiende a dónde va cada centavo para armar un perfil financiero preciso.</p>
               </div>

               <div className="relative pl-8">
                  <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]">4</div>
                  <h4 className="font-black text-xl text-white mb-2">Asistencia vía WhatsApp</h4>
                  <p className="text-neutral-400 text-sm font-medium leading-relaxed">Recibe alertas, haz preguntas y controla tu vida financiera directamente desde tu celular.</p>
               </div>

            </div>
         </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-[#000000] border-y border-white/5">
         <div className="max-w-sm md:max-w-md mx-auto reveal text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tighter">Planos e preços</h2>
            <p className="text-neutral-400 text-base font-medium mb-12">Un solo pago. Tu tranquilidad financiera siempre al día.</p>

            <div className="bg-[#0a0a0a] rounded-[2.5rem] p-8 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] text-left relative overflow-hidden">
               <div className="inline-block bg-white text-black text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">Vitalicio</div>
               <h3 className="text-2xl font-black text-white mb-2">Premium</h3>
               <p className="text-neutral-400 text-sm font-medium mb-6">El mayordomo completo para tu vida y negocio. Olvídate de mensualidades.</p>
               
               <div className="flex items-end gap-1 mb-6">
                  <span className="text-5xl font-black text-white tracking-tighter">$29.90</span>
                  <span className="text-neutral-500 font-bold text-sm mb-2">USD</span>
               </div>
               
               <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white opacity-80 shrink-0"/> <span className="text-sm font-medium text-neutral-300">Bancos ilimitados</span></div>
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white opacity-80 shrink-0"/> <span className="text-sm font-medium text-neutral-300">Perfil Personal y Empresarial</span></div>
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white opacity-80 shrink-0"/> <span className="text-sm font-medium text-neutral-300">Agentes autónomos con IA</span></div>
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white opacity-80 shrink-0"/> <span className="text-sm font-medium text-neutral-300">Pago único de por vida</span></div>
               </div>

               <button onClick={handleCheckout} className="w-full py-4 rounded-full font-black text-sm text-center bg-white text-black hover:scale-[1.02] transition-transform">
                  Assinar agora
               </button>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-2xl mx-auto reveal">
         <h2 className="text-3xl md:text-4xl font-black mb-10 text-center text-white tracking-tight">Preguntas Frecuentes</h2>
         <div className="space-y-3">
            <details className="group bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
               <summary className="flex justify-between items-center font-bold text-base text-white">
                  ¿Alfred es seguro?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-4 text-neutral-400 font-medium text-sm leading-relaxed">Sí, totalmente. Utilizamos encriptación de extremo a extremo y toda la lectura se hace a través de Open Finance. Nunca tenemos acceso a tus contraseñas.</p>
            </details>
            <details className="group bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
               <summary className="flex justify-between items-center font-bold text-base text-white">
                  ¿Alfred puede mover mi dinero?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-4 text-neutral-400 font-medium text-sm leading-relaxed">De ninguna manera. El acceso es exclusivamente en modo "solo lectura". Alfred analiza, proyecta e informa, pero la autoridad para mover tu dinero es siempre 100% tuya.</p>
            </details>
            <details className="group bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
               <summary className="flex justify-between items-center font-bold text-base text-white">
                  ¿Funciona para mi empresa?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-4 text-neutral-400 font-medium text-sm leading-relaxed">¡Sí! Con tu acceso Premium Vitalicio, tienes un botón en tu panel que alterna entre tus finanzas Personales y las de la Empresa, generando flujos de caja separados para no mezclar el dinero.</p>
            </details>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center bg-[#000000]">
         <img src="/logo-alfred-white.png" alt="Alfred" className="h-6 mx-auto mb-6 opacity-50" />
         <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest">&copy; 2026 Alfred SaaS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
