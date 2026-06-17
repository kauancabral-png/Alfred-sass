import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, ChevronDown, Utensils, Home, Star } from 'lucide-react';

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

  const scrollToHowItWorks = () => {
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    document.getElementById('planes-y-precios')?.scrollIntoView({ behavior: 'smooth' });
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

        /* Float animations for notifications */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(15px); }
        }
        .animate-float {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-slower 5s ease-in-out infinite;
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
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
         <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tighter reveal text-white">
            Deja de trabajar para tu dinero. <br/> 
            Deja que Alfred lo organice.
         </h1>
         
         <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mb-8 md:mb-10 reveal leading-relaxed font-medium">
            Todo lo que entra y sale de tu cuenta, organizado de forma automática e inteligente. Sin hojas de cálculo, sin sorpresas.
         </p>

         <button onClick={scrollToHowItWorks} className="reveal bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)] mb-12 md:mb-16">
            Conoce cómo funciona
         </button>

         {/* Phone Wrapper */}
         <div className="reveal relative w-full max-w-[320px] mx-auto mt-4 md:mt-10">
            
            {/* Notification 1: Comida (Floating Outside Left) */}
            <div className="absolute bottom-32 -left-[15%] md:-left-[35%] z-30 bg-[#111] border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-2xl shadow-black/80 animate-float min-w-[240px] md:min-w-[280px]">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                     <Utensils className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold text-white tracking-tight leading-tight">Comida a domicilio</p>
                     <p className="text-xs text-neutral-400">Alimentación • 28 de Jun</p>
                  </div>
               </div>
               <p className="text-sm font-black text-white shrink-0">-$ 42.00</p>
            </div>

            {/* Notification 2: Hospedagem (Floating Outside Right) */}
            <div className="absolute bottom-8 -right-[10%] md:-right-[25%] z-30 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-2xl shadow-black/80 animate-float-delayed min-w-[240px] md:min-w-[280px]">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
                     <Home className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold text-white tracking-tight leading-tight">Alojamiento</p>
                     <p className="text-xs text-neutral-400">Viajes • 24 de Jun</p>
                  </div>
               </div>
               <p className="text-sm font-black text-white shrink-0">-$ 120.00</p>
            </div>

            {/* WhatsApp Reminder */}
            <div className="absolute -top-6 md:-left-[20%] z-30 bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-green-500/10 rounded-2xl p-3 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
               <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-black text-sm shrink-0">A</div>
               <p className="text-xs font-bold text-white max-w-[140px] leading-tight text-left">¡No olvides pagar tu tarjeta hoy! 💳</p>
            </div>

            {/* Phone Mask */}
            <div className="w-full h-[600px] bg-[#0a0a0a] rounded-[3rem] border-[6px] border-[#1a1a1a] phone-mockup overflow-hidden flex flex-col relative z-20">
               <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-40">
                  <div className="w-32 h-6 bg-[#1a1a1a] rounded-b-3xl"></div>
               </div>
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
               </div>
            </div>
         </div>
      </section>

      {/* Target Audience (NEW: Para quem é) */}
      <section className="py-20 md:py-24 px-6 bg-[#050505] border-y border-white/5">
         <div className="max-w-6xl mx-auto reveal text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-12 text-white tracking-tight">¿Para quién es Alfred?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all text-left group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <span className="text-2xl">💻</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Freelancers</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">Para profesionales independientes que no tienen tiempo de anotar cada gasto y necesitan separar sus ingresos personales de los del trabajo automáticamente.</p>
               </div>
               <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all text-left group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Agencias</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">Para dueños de agencias que manejan presupuestos de clientes y necesitan conciliación bancaria instantánea sin contratar un contador extra.</p>
               </div>
               <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all text-left group">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <span className="text-2xl">🏪</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Pequeños Negocios</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">Para emprendedores que quieren ver el flujo de caja, el Estado de Resultados y saber exactamente cuánto dinero sobra al fin de mes sin esfuerzo.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Feature 1 */}
      <section className="py-16 md:py-24 px-6 max-w-lg md:max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
         <div className="reveal flex-1 w-full flex justify-center order-2 md:order-1 relative">
             <div className="relative w-full max-w-[400px] rounded-[2.5rem] overflow-hidden group">
                 <img src="/feature_lifestyle_1.png" alt="Usuario Alfred" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-luminosity hover:mix-blend-normal" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                 {/* Floating UI Element */}
                 <div className="absolute bottom-6 left-6 right-6 z-10 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-xs font-bold text-neutral-400 uppercase">Alerta de Gasto</p>
                       <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    </div>
                    <p className="text-red-400 font-black text-2xl tracking-tighter">-$ 42.00</p>
                 </div>
             </div>
         </div>
         <div className="reveal flex-1 text-left order-1 md:order-2">
            <h3 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white leading-[1.1] tracking-tight">¿Sorpresas en la factura? Conmigo, no.</h3>
            <p className="text-neutral-400 text-base md:text-lg mb-6 md:mb-8 leading-relaxed font-medium">Sé lo que es abrir la factura y no entender nada. Alfred analiza tus gastos en tiempo real y te avisa antes de que pierdas el control.</p>
            <button onClick={scrollToPricing} className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors">
               Descubrir sorpresas
            </button>
         </div>
      </section>

      {/* Feature 2 */}
      <section className="py-16 md:py-24 px-6 max-w-lg md:max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16 bg-[#000000]">
         <div className="reveal flex-1 w-full flex justify-center order-2 md:order-1 relative">
             <div className="relative w-full max-w-[400px] rounded-[2.5rem] overflow-hidden group">
                 <img src="/feature_lifestyle_2.png" alt="Ahorro Inteligente" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-luminosity hover:mix-blend-normal" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                 {/* Floating UI Element */}
                 <div className="absolute top-6 left-6 z-10 bg-[#1a1a1a]/90 backdrop-blur-md border border-green-500/20 p-5 rounded-2xl shadow-2xl">
                    <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Ahorro detectado</p>
                    <p className="text-green-400 font-black text-2xl tracking-tighter">+$ 15.00</p>
                 </div>
             </div>
         </div>
         <div className="reveal flex-1 text-left order-1 md:order-2">
            <h3 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white leading-[1.1] tracking-tight">Te muestro hacia dónde va tu dinero.</h3>
            <p className="text-neutral-400 text-base md:text-lg mb-6 md:mb-8 leading-relaxed font-medium">Categorización automática con Inteligencia Artificial. Encuentro patrones oscuros en tus compras para que ahorres sin sufrir.</p>
            <button onClick={scrollToPricing} className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors">
               Categorizar gastos
            </button>
         </div>
      </section>

      {/* WhatsApp Feature */}
      <section className="py-16 md:py-24 px-6 max-w-lg md:max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
         <div className="reveal flex-1 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl md:text-5xl font-black mb-4 md:mb-6 text-white leading-[1.1] tracking-tight">Pregunta a tu manera que yo entiendo.</h3>
            <p className="text-neutral-400 text-base md:text-lg mb-6 md:mb-8 leading-relaxed font-medium max-w-xl mx-auto md:mx-0">Un mayordomo en tu bolsillo, directamente en WhatsApp. Conversa conmigo como si fuera un amigo.</p>
            <button onClick={scrollToPricing} className="bg-white text-black px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors mx-auto md:mx-0 block">
               Hablar con Alfred
            </button>
         </div>
         <div className="reveal flex-1 w-full flex justify-center mt-6 md:mt-0">
            {/* Phone Mockup Frame for WhatsApp */}
            <div className="relative w-full max-w-[320px] h-[600px] bg-[#0a0a0a] rounded-[3rem] border-[6px] border-[#1a1a1a] phone-mockup overflow-hidden flex flex-col shadow-2xl">
               <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                  <div className="w-32 h-6 bg-[#1a1a1a] rounded-b-3xl"></div>
               </div>
               <div className="flex-1 w-full bg-[#050505] relative flex flex-col">
                  <div className="bg-[#111] border-b border-white/5 px-5 py-5 pt-10 flex items-center gap-4">
                     <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-black text-black shadow-lg shrink-0">A</div>
                     <div>
                        <p className="font-bold text-white text-sm">Alfred</p>
                        <p className="text-[11px] text-green-400 font-semibold">En línea</p>
                     </div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col gap-6 overflow-y-auto bg-[url('https://i.pinimg.com/1200x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center bg-blend-overlay bg-black/90">
                     <div className="bg-[#202c33] p-4 rounded-2xl rounded-tl-none self-start max-w-[90%] shadow-md border border-white/5">
                        <p className="text-white text-sm leading-relaxed">Encontré un pago de $150 en "Material de oficina". ¿Es de la Empresa?</p>
                        <p className="text-[10px] text-neutral-400 text-right mt-1">14:02</p>
                     </div>
                     <div className="bg-[#005c4b] p-4 rounded-2xl rounded-tr-none self-end max-w-[90%] shadow-md">
                        <p className="text-white text-sm leading-relaxed">Sí, por favor.</p>
                        <p className="text-[10px] text-green-200 text-right mt-1">14:05 ✓✓</p>
                     </div>
                     <div className="bg-[#202c33] p-4 rounded-2xl rounded-tl-none self-start max-w-[90%] shadow-md border border-white/5">
                        <p className="text-white text-sm leading-relaxed">✅ Listo. Flujo de caja empresarial actualizado.</p>
                        <p className="text-[10px] text-neutral-400 text-right mt-1">14:05</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Video Demonstrativo (NEW) */}
      <section className="py-16 md:py-24 px-6 bg-[#000000] border-t border-white/5">
         <div className="max-w-4xl mx-auto reveal text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-full text-xs font-bold mb-6">
               <span className="animate-pulse">🔴</span> Mira la magia en vivo
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">Míralo en acción</h2>
            <p className="text-neutral-400 text-lg mb-10 font-medium max-w-2xl mx-auto">Descubre cómo Alfred categoriza gastos y responde a tus comandos por WhatsApp en tiempo real.</p>
            
            <div className="relative w-full aspect-[9/16] md:aspect-video bg-[#111] rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(34,197,94,0.15)] overflow-hidden group">
               <iframe 
                  src="https://player.vimeo.com/video/1202304487?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" 
                  className="absolute top-0 left-0 w-full h-full" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowFullScreen
               ></iframe>
            </div>
         </div>
      </section>

      {/* Como Funciono */}
      <section id="como-funciona" className="py-16 md:py-24 px-6 bg-[#050505] border-t border-white/5">
         <div className="max-w-lg mx-auto reveal">
            <h2 className="text-3xl md:text-5xl font-black mb-12 md:mb-16 text-center text-white tracking-tight">Cómo funciona Alfred</h2>
            
            <div className="relative border-l border-white/10 ml-6 md:ml-10 space-y-12 md:space-y-16">
               <div className="relative pl-10">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]">1</div>
                  <h4 className="font-black text-xl md:text-2xl text-white mb-2 md:mb-3">Añade a Alfred a tus contactos</h4>
                  <p className="text-neutral-400 text-sm md:text-base font-medium leading-relaxed">Sin instalar apps pesadas. Simplemente guarda el número de Alfred en tu agenda y mándale un "Hola" en WhatsApp para activar tu mayordomo personal al instante.</p>
               </div>
               <div className="relative pl-10">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]">2</div>
                  <h4 className="font-black text-xl md:text-2xl text-white mb-2 md:mb-3">Panel inteligente</h4>
                  <p className="text-neutral-400 text-sm md:text-base font-medium leading-relaxed">Visualiza tu flujo de caja, DRE y métricas vitales en gráficos simples de entender. Un clic para alternar entre perfil personal y negocio.</p>
               </div>
               <div className="relative pl-10">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]">3</div>
                  <h4 className="font-black text-xl md:text-2xl text-white mb-2 md:mb-3">Inteligencia Autónoma</h4>
                  <p className="text-neutral-400 text-sm md:text-base font-medium leading-relaxed">Mi inteligencia artificial no solo clasifica; te avisa de gastos inusuales, sugiere recortes de suscripciones y proyecta tu futuro financiero.</p>
               </div>
               <div className="relative pl-10">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]">4</div>
                  <h4 className="font-black text-xl md:text-2xl text-white mb-2 md:mb-3">Tu mayordomo en WhatsApp</h4>
                  <p className="text-neutral-400 text-sm md:text-base font-medium leading-relaxed">Añade entradas de efectivo mediante fotos de recibos o audios, pregunta cuánto puedes gastar el fin de semana o recibe alertas directo en tu chat.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 md:py-24 px-6 bg-[#000000] overflow-hidden relative">
         <div className="max-w-6xl mx-auto reveal">
            <h2 className="text-3xl md:text-5xl font-black mb-8 md:mb-12 text-center text-white tracking-tight">Testimonios</h2>
            
            <div className="md:hidden flex items-center justify-center gap-2 mb-6 text-neutral-500 animate-pulse">
               <span className="text-xs font-bold uppercase tracking-widest">Desliza para ver más</span>
               <span className="text-lg">👉</span>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar pl-4 md:pl-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
               <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

               <div className="shrink-0 w-[85vw] max-w-[420px] snap-center bg-[#111] rounded-[2.5rem] p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-green-500/10 transition-colors duration-500"></div>
                  <div>
                    <div className="flex gap-1 mb-6 md:mb-8 text-yellow-400 relative z-10">
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    </div>
                    <p className="text-white font-bold text-lg md:text-xl leading-relaxed tracking-tight mb-8 md:mb-10 relative z-10 group-hover:text-green-50 transition-colors">
                       "La IA que finalmente hace fácil entender tu flujo de caja sin abrir una hoja de cálculo. Me ahorra horas cada semana en la conciliación bancaria de mi agencia."
                    </p>
                  </div>
                  <div className="flex justify-between items-center relative z-10 border-t border-white/5 pt-6 mt-auto">
                     <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center font-bold text-black text-base md:text-lg">C</div>
                        <div>
                           <p className="font-bold text-white text-sm md:text-base">Carlos M.</p>
                           <p className="text-[10px] md:text-xs text-neutral-400">CEO, Agência TechStore</p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                     </div>
                  </div>
               </div>

               <div className="shrink-0 w-[85vw] max-w-[420px] snap-center bg-[#111] rounded-[2.5rem] p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-[50px] group-hover:bg-green-500/10 transition-colors duration-500"></div>
                  <div>
                    <div className="flex gap-1 mb-6 md:mb-8 text-yellow-400 relative z-10">
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    </div>
                    <p className="text-white font-bold text-lg md:text-xl leading-relaxed tracking-tight mb-8 md:mb-10 relative z-10 group-hover:text-green-50 transition-colors">
                       "Lo que más me gusta es poder enviar un audio al WhatsApp diciendo cuánto gasté y él se encarga del resto. Es pura magia negra tecnológica."
                    </p>
                  </div>
                  <div className="flex justify-between items-center relative z-10 border-t border-white/5 pt-6 mt-auto">
                     <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 flex items-center justify-center font-bold text-white text-base md:text-lg">M</div>
                        <div>
                           <p className="font-bold text-white text-sm md:text-base">Miguel T.</p>
                           <p className="text-[10px] md:text-xs text-neutral-400">Freelancer</p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                     </div>
                  </div>
               </div>

               <div className="shrink-0 w-[85vw] max-w-[420px] snap-center bg-[#111] rounded-[2.5rem] p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-green-500/10 transition-colors duration-500"></div>
                  <div>
                    <div className="flex gap-1 mb-6 md:mb-8 text-yellow-400 relative z-10">
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    </div>
                    <p className="text-white font-bold text-lg md:text-xl leading-relaxed tracking-tight mb-8 md:mb-10 relative z-10 group-hover:text-green-50 transition-colors">
                       "El panel de control es hermoso y carga al instante. Pude identificar gastos ocultos en suscripciones que ni recordaba que tenía."
                    </p>
                  </div>
                  <div className="flex justify-between items-center relative z-10 border-t border-white/5 pt-6 mt-auto">
                     <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 flex items-center justify-center font-bold text-white text-base md:text-lg">S</div>
                        <div>
                           <p className="font-bold text-white text-sm md:text-base">Sofía R.</p>
                           <p className="text-[10px] md:text-xs text-neutral-400">Consultora</p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                     </div>
                  </div>
               </div>

               <div className="shrink-0 w-[85vw] max-w-[420px] snap-center bg-[#111] rounded-[2.5rem] p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-[50px] -ml-10 -mb-10 group-hover:bg-green-500/10 transition-colors duration-500"></div>
                  <div>
                    <div className="flex gap-1 mb-6 md:mb-8 text-yellow-400 relative z-10">
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" /><Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    </div>
                    <p className="text-white font-bold text-lg md:text-xl leading-relaxed tracking-tight mb-8 md:mb-10 relative z-10 group-hover:text-green-50 transition-colors">
                       "Nunca he sido bueno con los números, pero Alfred lo hace todo tan intuitivo que ahora me emociona ver cómo va mi DRE a fin de mes."
                    </p>
                  </div>
                  <div className="flex justify-between items-center relative z-10 border-t border-white/5 pt-6 mt-auto">
                     <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white text-base md:text-lg">J</div>
                        <div>
                           <p className="font-bold text-white text-sm md:text-base">Javier P.</p>
                           <p className="text-[10px] md:text-xs text-neutral-400">Dueño de Comercio</p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* Pricing with Anchoring, Scarcity and Bonuses */}
      <section id="planes-y-precios" className="py-16 md:py-24 px-6 bg-[#050505] border-t border-white/5">
         <div className="max-w-sm md:max-w-md mx-auto reveal text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tighter">Planes y precios</h2>
            <p className="text-neutral-400 text-sm md:text-base font-medium mb-8">Un solo pago. Tu tranquilidad financiera siempre al día.</p>
            
            {/* Scarcity */}
            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-full text-xs font-bold mb-10 animate-pulse">
               <span>🔥</span> Licencias vitalicias limitadas a los primeros 500 fundadores.
            </div>

            <div className="bg-[#0a0a0a] rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] text-left relative overflow-hidden">
               <div className="inline-block bg-white text-black text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-6 md:mb-8">Premium Vitalicio</div>
               <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3">Alfred Mayordomo</h3>
               <p className="text-neutral-400 text-xs md:text-sm font-medium mb-6">El asistente completo para tu vida y negocio. Sin pagos mensuales.</p>
               
               {/* Anchoring */}
               <div className="mb-2 text-neutral-500 text-sm line-through font-bold">Valor real: $250.00/año</div>
               
               <div className="flex items-end gap-1 mb-8">
                  <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">$29.90</span>
                  <span className="text-neutral-500 font-bold text-sm mb-2">USD</span>
               </div>
               
               <div className="space-y-4 md:space-y-5 mb-8">
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white opacity-80 shrink-0"/> <span className="text-sm font-medium text-neutral-300">Panel de control personalizado</span></div>
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white opacity-80 shrink-0"/> <span className="text-sm font-medium text-neutral-300">Mayordomo en WhatsApp</span></div>
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white opacity-80 shrink-0"/> <span className="text-sm font-medium text-neutral-300">Perfil Empresarial y Personal</span></div>
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white opacity-80 shrink-0"/> <span className="text-sm font-medium text-neutral-300">Soporte prioritario</span></div>
                  <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0"/> <span className="text-sm font-bold text-white">Sin compromisos</span></div>
               </div>

               {/* Bonuses highlighted */}
               <div className="pt-6 mt-6 border-t border-white/5 mb-8">
                  <p className="text-[10px] font-black text-green-400 mb-4 uppercase tracking-widest">Incluye Bonos Especiales:</p>
                  <div className="flex items-start gap-3 mb-3"><Star className="w-5 h-5 text-yellow-400 shrink-0"/> <span className="text-sm font-bold text-white">Guía de Impuestos Personales y Agencia</span></div>
                  <div className="flex items-start gap-3"><Star className="w-5 h-5 text-yellow-400 shrink-0"/> <span className="text-sm font-bold text-white">Acceso Prioritario a nuevas funciones IA</span></div>
               </div>

               <button onClick={handleCheckout} className="w-full py-3.5 md:py-4 rounded-full font-black text-sm md:text-base text-center bg-green-500 text-black hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  Obtener Alfred Ahora
               </button>
            </div>
         </div>
      </section>

      {/* Guarantee (NEW) */}
      <section className="py-16 px-6 max-w-4xl mx-auto reveal text-center">
         <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            <div className="md:w-1/3 flex justify-center relative z-10">
               <img src="/guarantee_badge.png" alt="7 Días de Garantía" className="w-48 h-48 object-contain hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]" />
            </div>
            <div className="md:w-2/3 text-left relative z-10">
               <h3 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">Garantía incondicional de 7 días</h3>
               <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-medium">Usa Alfred durante 7 días enteros. Conéctalo, hazle preguntas en WhatsApp y ve cómo categoriza tus gastos. Si no crees que te ahorra horas de estrés e incrementa tu control financiero, te devolvemos el 100% de tu inversión. Sin preguntas, sin burocracia.</p>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-6 max-w-2xl mx-auto reveal">
         <h2 className="text-3xl md:text-5xl font-black mb-10 md:mb-12 text-center text-white tracking-tight">Preguntas Frecuentes</h2>
         <div className="space-y-4">
            <details className="group bg-[#0a0a0a] rounded-2xl border border-white/5 p-5 md:p-8 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-white/10 transition-colors">
               <summary className="flex justify-between items-center font-bold text-base md:text-lg text-white">
                  ¿Alfred es seguro?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-4 md:mt-6 text-neutral-400 font-medium text-sm md:text-base leading-relaxed">Sí, totalmente. Utilizamos encriptación de extremo a extremo. Nunca tenemos acceso a tus contraseñas y tus datos están resguardados bajo normas internacionales.</p>
            </details>
            <details className="group bg-[#0a0a0a] rounded-2xl border border-white/5 p-5 md:p-8 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-white/10 transition-colors">
               <summary className="flex justify-between items-center font-bold text-base md:text-lg text-white">
                  ¿Alfred puede mover mi dinero?
                  <ChevronDown className="w-5 h-5 transition group-open:rotate-180 text-neutral-500" />
               </summary>
               <p className="mt-4 md:mt-6 text-neutral-400 font-medium text-sm md:text-base leading-relaxed">De ninguna manera. El acceso es exclusivamente analítico. Alfred consolida la información, proyecta y avisa, pero la autoridad para mover tu dinero es siempre 100% tuya.</p>
            </details>
         </div>
      </section>

      {/* Final CTA (NEW) */}
      <section className="py-24 px-6 bg-[#000000] border-t border-white/5 text-center">
         <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[1.1]">Toma el control de tu dinero hoy mismo.</h2>
            <p className="text-neutral-400 text-lg mb-10 font-medium">Deja que la IA haga el trabajo pesado mientras tú te enfocas en crecer tu negocio y disfrutar tu vida.</p>
            <button onClick={handleCheckout} className="bg-white text-black px-10 py-4 md:py-5 rounded-full font-black text-base hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
               Comenzar ahora por solo $29.90
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-10 md:py-16 border-t border-white/5 text-center bg-[#050505]">
         <img src="/logo-alfred-white.png" alt="Alfred" className="h-5 md:h-6 mx-auto mb-6 md:mb-8 opacity-50" />
         <p className="text-neutral-600 text-[10px] md:text-xs font-bold uppercase tracking-widest">&copy; 2026 Alfred SaaS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
