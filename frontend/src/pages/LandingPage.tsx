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
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
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
    <div className="min-h-screen bg-[#F7F7F5] font-sans text-[#1a1a1a] selection:bg-[#1a1a1a] selection:text-white" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #F7F7F5;
        }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .logo-carousel {
          display: flex;
          animation: scroll 25s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Oculta barra de rolagem */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #F7F7F5; 
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d1d1; 
          border-radius: 4px;
        }
      `}</style>

      {/* Navbar (Fixed & Minimalist) */}
      <nav className="fixed top-0 w-full z-50 bg-[#F7F7F5]/80 backdrop-blur-xl border-b border-[#E8E8E5] py-4 px-6 md:px-12 flex justify-between items-center transition-all">
         <div className="flex items-center gap-2">
            <img src="/logo-alfred-black.png" alt="Alfred" className="h-6 md:h-7 object-contain" />
         </div>
         <div className="flex items-center gap-4">
            <NavLink to="/login" className="hidden md:block font-semibold text-sm hover:text-gray-600 transition-colors">
               Entrar
            </NavLink>
            <button onClick={handleCheckout} className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-black transition-all hover:scale-105 shadow-md">
               Comenzar ahora
            </button>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
         <div className="inline-flex items-center gap-2 bg-white border border-[#E8E8E5] px-4 py-2 rounded-full mb-10 reveal shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">Tu Mayordomo Financiero Inteligente</span>
         </div>
         
         <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black mb-8 leading-[1.05] tracking-tighter reveal text-[#1a1a1a] max-w-4xl mx-auto">
            No administres tu dinero solo. Deja que <span className="text-green-600">Alfred</span> lo haga.
         </h1>
         
         <p className="text-[#666] text-lg md:text-2xl max-w-3xl mb-12 reveal leading-relaxed font-medium">
            Todo lo que entra y sale de tu cuenta personal y de tu empresa, organizado de forma automática e inteligente. Sin hojas de cálculo.
         </p>

         <div className="flex flex-col items-center gap-4 reveal w-full md:w-auto">
            <button onClick={handleCheckout} className="w-full md:w-auto bg-[#1a1a1a] text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">
               Conocer a mi nuevo mayordomo <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm font-medium text-[#888] mt-2 flex items-center gap-1">
               <Lock className="w-4 h-4" /> Conexión 100% segura. Acceso de por vida.
            </p>
         </div>
      </section>

      {/* Mockup Dashboard */}
      <section className="px-6 pb-24 reveal max-w-6xl mx-auto">
         <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-[#E8E8E5] p-2 md:p-4 shadow-2xl relative overflow-hidden group">
            <div className="bg-[#F7F7F5] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-[#E8E8E5] aspect-[16/10] md:aspect-video flex items-center justify-center relative">
               <img src="/dashboard-preview.png" alt="Alfred Dashboard" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000" />
            </div>
         </div>
      </section>

      {/* Prova Social (Bancos) */}
      <section className="py-16 border-y border-[#E8E8E5] bg-white overflow-hidden flex flex-col items-center reveal">
         <p className="text-sm font-bold text-[#888] mb-8 text-center">Bancos que ya confían (Open Finance):</p>
         <div className="w-full relative flex overflow-x-hidden">
            <div className="logo-carousel whitespace-nowrap flex items-center gap-20 px-10 text-3xl font-black text-[#E8E8E5]">
               <span>NUBANK</span><span>ITAÚ</span><span>BRADESCO</span><span>SANTANDER</span><span>BBVA</span><span>INTER</span>
               <span>NUBANK</span><span>ITAÚ</span><span>BRADESCO</span><span>SANTANDER</span><span>BBVA</span><span>INTER</span>
            </div>
         </div>
      </section>

      {/* Funcionalidades (Agitação da Dor) */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
         <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div className="reveal flex flex-col justify-center">
               <h3 className="text-3xl md:text-5xl font-black mb-6 text-[#1a1a1a] leading-[1.1] tracking-tight">¿Sorpresas en la tarjeta? <br/>Con Alfred, nunca más.</h3>
               <p className="text-[#666] text-lg mb-8 leading-relaxed font-medium">Sé lo que es abrir la factura y no entender nada. Alfred analiza tus gastos, entiende tus hábitos y te avisa antes de que pierdas el control.</p>
               <button onClick={handleCheckout} className="bg-white border border-[#E8E8E5] text-[#1a1a1a] px-8 py-4 rounded-full font-bold w-max hover:bg-[#F7F7F5] transition-colors shadow-sm">
                  Descubrir sorpresas
               </button>
            </div>
            <div className="reveal bg-white rounded-[3rem] p-10 border border-[#E8E8E5] shadow-xl aspect-square flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                <div className="relative z-10">
                   <h4 className="text-xl font-bold text-[#1a1a1a] mb-2">Alerta de Gasto</h4>
                   <p className="text-[#666]">Gasto inusual detectado en Uber.</p>
                </div>
                <div className="relative z-10 bg-white border border-red-100 p-6 rounded-3xl shadow-lg">
                   <p className="text-red-500 font-black text-2xl mb-1">-$ 42.00</p>
                   <p className="text-sm font-bold text-[#888]">Hoy, 14:30h</p>
                </div>
            </div>

            <div className="reveal bg-white rounded-[3rem] p-10 border border-[#E8E8E5] shadow-xl aspect-square flex flex-col justify-between md:order-3 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
                <div className="relative z-10">
                   <h4 className="text-xl font-bold text-[#1a1a1a] mb-2">Ahorro Inteligente</h4>
                   <p className="text-[#666]">Suscripciones que no usas.</p>
                </div>
                <div className="relative z-10 bg-white border border-green-100 p-6 rounded-3xl shadow-lg">
                   <p className="text-green-600 font-black text-2xl mb-1">+$ 15.00</p>
                   <p className="text-sm font-bold text-[#888]">Netflix (Duplicado)</p>
                </div>
            </div>
            <div className="reveal flex flex-col justify-center md:order-4">
               <h3 className="text-3xl md:text-5xl font-black mb-6 text-[#1a1a1a] leading-[1.1] tracking-tight">Te muestro hacia dónde va tu dinero.</h3>
               <p className="text-[#666] text-lg mb-8 leading-relaxed font-medium">Analizo tus gastos, encuentro patrones y te muestro dónde puedes ahorrar sin sufrir. Categorización automática con Inteligencia Artificial.</p>
               <button onClick={handleCheckout} className="bg-white border border-[#E8E8E5] text-[#1a1a1a] px-8 py-4 rounded-full font-bold w-max hover:bg-[#F7F7F5] transition-colors shadow-sm">
                  Categorizar gastos
               </button>
            </div>
         </div>
      </section>

      {/* Diferencial WhatsApp (Estética ultra limpa) */}
      <section className="py-32 bg-white px-6 border-y border-[#E8E8E5]">
         <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 reveal">
               <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">Pregunta a tu manera que yo te entiendo.</h2>
               <p className="text-[#666] mb-10 text-xl font-medium">Habla conmigo como si estuvieras con un amigo. Un mayordomo en tu bolsillo, directamente en WhatsApp.</p>
               <button onClick={handleCheckout} className="bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl">
                  Conversar con Alfred
               </button>
            </div>
            <div className="flex-1 reveal flex justify-center w-full">
               <div className="w-full max-w-md bg-[#F7F7F5] rounded-[3rem] p-8 border border-[#E8E8E5] shadow-2xl relative">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg">A</div>
                     <div>
                        <p className="font-bold text-[#1a1a1a] text-lg">Alfred</p>
                        <p className="text-sm text-green-600 font-semibold">En línea</p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-6">
                     <div className="bg-white p-4 rounded-3xl rounded-tl-none self-start max-w-[85%] shadow-sm border border-[#E8E8E5]">
                        <p className="text-[#1a1a1a] font-medium">¡Hola! Encontré un pago de $150 en "Material de oficina". ¿Lo pongo en la cuenta de tu Empresa?</p>
                     </div>
                     <div className="bg-[#1a1a1a] p-4 rounded-3xl rounded-tr-none self-end max-w-[85%] shadow-xl">
                        <p className="text-white font-medium">Sí, por favor.</p>
                     </div>
                     <div className="bg-white p-4 rounded-3xl rounded-tl-none self-start max-w-[85%] shadow-sm border border-[#E8E8E5]">
                        <p className="text-[#1a1a1a] font-medium">✅ Listo. Flujo de caja empresarial actualizado.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Como Funciono / Segurança */}
      <section className="py-32 px-6 bg-[#F7F7F5]">
         <div className="max-w-6xl mx-auto reveal">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-[#1a1a1a] tracking-tight">Cómo funciono</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="p-8 bg-white rounded-[2.5rem] border border-[#E8E8E5] hover:shadow-xl transition-shadow">
                  <Lock className="w-10 h-10 text-[#1a1a1a] mb-6" />
                  <h4 className="font-black text-xl text-[#1a1a1a] mb-3">Encriptación de punta</h4>
                  <p className="text-[#666] font-medium leading-relaxed">Tus datos protegidos con AES-256, el mismo estándar que usan los bancos suizos.</p>
               </div>
               <div className="p-8 bg-white rounded-[2.5rem] border border-[#E8E8E5] hover:shadow-xl transition-shadow">
                  <Key className="w-10 h-10 text-[#1a1a1a] mb-6" />
                  <h4 className="font-black text-xl text-[#1a1a1a] mb-3">No pido contraseñas</h4>
                  <p className="text-[#666] font-medium leading-relaxed">La conexión se hace vía Open Finance directo con tu banco. Tú tienes el control.</p>
               </div>
               <div className="p-8 bg-white rounded-[2.5rem] border border-[#E8E8E5] hover:shadow-xl transition-shadow">
                  <EyeOff className="w-10 h-10 text-[#1a1a1a] mb-6" />
                  <h4 className="font-black text-xl text-[#1a1a1a] mb-3">Solo lectura</h4>
                  <p className="text-[#666] font-medium leading-relaxed">Solo leo tus datos para ayudarte. No puedo realizar transacciones.</p>
               </div>
               <div className="p-8 bg-white rounded-[2.5rem] border border-[#E8E8E5] hover:shadow-xl transition-shadow">
                  <ShieldCheck className="w-10 h-10 text-[#1a1a1a] mb-6" />
                  <h4 className="font-black text-xl text-[#1a1a1a] mb-3">Regulado Oficialmente</h4>
                  <p className="text-[#666] font-medium leading-relaxed">Open Finance es una tecnología oficial, regulada por el Banco Central.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing - Oferta Vitalícia */}
      <section className="py-32 px-6 bg-white border-y border-[#E8E8E5]">
         <div className="max-w-4xl mx-auto reveal">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-6xl font-black mb-6 text-[#1a1a1a] tracking-tight">Planes y precios</h2>
               <p className="text-[#666] text-xl font-medium">Un solo pago. Tu tranquilidad financiera siempre al día.</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1">
                     <div className="inline-block bg-white/10 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6">Acceso Vitalicio</div>
                     <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Premium</h3>
                     <p className="text-gray-400 font-medium mb-8">El mayordomo completo para tu vida y tu negocio. Olvídate de las mensualidades.</p>
                     <div className="flex items-end gap-2 mb-2">
                        <span className="text-6xl md:text-7xl font-black text-white">$29.90</span>
                        <span className="text-gray-400 font-bold text-xl mb-2">USD</span>
                     </div>
                     <p className="text-green-400 font-bold">Pago único de por vida.</p>
                  </div>

                  <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                     <div className="space-y-6 mb-10">
                        <div className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-green-400 shrink-0"/> <span className="font-semibold text-white">Bancos ilimitados</span></div>
                        <div className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-green-400 shrink-0"/> <span className="font-semibold text-white">Perfil Personal y Empresarial</span></div>
                        <div className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-green-400 shrink-0"/> <span className="font-semibold text-white">Agentes autónomos con IA (WhatsApp)</span></div>
                        <div className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-green-400 shrink-0"/> <span className="font-semibold text-white">Análisis avanzados y DRE</span></div>
                     </div>

                     <button onClick={handleCheckout} className="w-full py-5 rounded-full font-black text-lg text-center bg-white text-[#1a1a1a] hover:bg-gray-100 hover:scale-[1.02] transition-all shadow-xl">
                        Suscribirse al Premium
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 max-w-3xl mx-auto reveal">
         <h2 className="text-3xl md:text-5xl font-black mb-16 text-center text-[#1a1a1a] tracking-tight">Preguntas Frecuentes</h2>
         <div className="space-y-4">
            <details className="group bg-white rounded-3xl border border-[#E8E8E5] p-6 [&_summary::-webkit-details-marker]:hidden hover:border-gray-300 transition-colors cursor-pointer shadow-sm">
               <summary className="flex justify-between items-center font-bold text-lg text-[#1a1a1a]">
                  ¿Alfred es seguro?
                  <ChevronDown className="w-6 h-6 transition group-open:rotate-180 text-gray-400" />
               </summary>
               <p className="mt-4 text-[#666] font-medium leading-relaxed">Sí, totalmente. Utilizamos encriptación de extremo a extremo y toda la lectura se hace a través de Open Finance. Nunca tenemos acceso a tus contraseñas.</p>
            </details>
            <details className="group bg-white rounded-3xl border border-[#E8E8E5] p-6 [&_summary::-webkit-details-marker]:hidden hover:border-gray-300 transition-colors cursor-pointer shadow-sm">
               <summary className="flex justify-between items-center font-bold text-lg text-[#1a1a1a]">
                  ¿Alfred puede mover mi dinero?
                  <ChevronDown className="w-6 h-6 transition group-open:rotate-180 text-gray-400" />
               </summary>
               <p className="mt-4 text-[#666] font-medium leading-relaxed">De ninguna manera. El acceso es exclusivamente en modo "solo lectura". Alfred analiza, proyecta e informa, pero la autoridad para mover tu dinero es siempre 100% tuya.</p>
            </details>
            <details className="group bg-white rounded-3xl border border-[#E8E8E5] p-6 [&_summary::-webkit-details-marker]:hidden hover:border-gray-300 transition-colors cursor-pointer shadow-sm">
               <summary className="flex justify-between items-center font-bold text-lg text-[#1a1a1a]">
                  ¿Funciona para mi empresa?
                  <ChevronDown className="w-6 h-6 transition group-open:rotate-180 text-gray-400" />
               </summary>
               <p className="mt-4 text-[#666] font-medium leading-relaxed">¡Sí! Con tu acceso Premium Vitalicio, tienes un botón en tu panel que alterna entre tus finanzas Personales y las de la Empresa, generando flujos de caja separados para no mezclar el dinero.</p>
            </details>
            <details className="group bg-white rounded-3xl border border-[#E8E8E5] p-6 [&_summary::-webkit-details-marker]:hidden hover:border-gray-300 transition-colors cursor-pointer shadow-sm">
               <summary className="flex justify-between items-center font-bold text-lg text-[#1a1a1a]">
                  ¿Tengo que pagar mensualidades?
                  <ChevronDown className="w-6 h-6 transition group-open:rotate-180 text-gray-400" />
               </summary>
               <p className="mt-4 text-[#666] font-medium leading-relaxed">No. Es un pago único de $29.90. No hay cuotas mensuales ni costos ocultos. Compras una vez y lo usas para siempre.</p>
            </details>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-[#E8E8E5] text-center bg-[#F7F7F5]">
         <img src="/logo-alfred-black.png" alt="Alfred" className="h-8 mx-auto mb-8 opacity-80" />
         <p className="text-[#888] text-sm font-bold uppercase tracking-widest">&copy; 2026 Alfred SaaS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
