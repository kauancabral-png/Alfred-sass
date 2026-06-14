import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2, Star, Target, Zap, ShieldCheck, Wallet } from 'lucide-react';

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [userPercent, setUserPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Opções do Quiz
  const questions = [
    {
      title: "Qual é o seu nível atual de controle financeiro?",
      subtitle: "Seja 100% sincero com o seu Mordomo.",
      options: [
        { label: "Principiante", sub: "Anoto em papel ou não anoto nada.", value: "beginner", percent: 30 },
        { label: "Intermediário", sub: "Uso planilhas, mas esqueço de atualizar.", value: "intermediate", percent: 65 },
        { label: "Profissional", sub: "Tenho controle, mas perco muito tempo.", value: "pro", percent: 95 },
      ]
    }
  ];

  // Efeito de Progress Bar
  useEffect(() => {
    const totalSteps = questions.length + 2; 
    setProgress(((step + 1) / totalSteps) * 100);
  }, [step]);

  const handleOptionClick = (percent: number) => {
    setUserPercent(percent);
    startProcessing();
  };

  const startProcessing = () => {
    setLoading(true);
    setStep(questions.length + 1); 
    
    setTimeout(() => {
      setLoading(false);
      setStep(questions.length + 2); 
    }, 4000);
  };

  const goToPlans = () => {
    navigate('/#planos');
    setTimeout(() => {
      document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -z-10"></div>

      {/* Progress Bar Top */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-white transition-all duration-500 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-xl w-full">
        
        {/* Logo Alfred */}
        <div className="flex justify-center mb-12">
          <img src="/logo-alfred-white.png" alt="Alfred" className="h-10 object-contain opacity-80" />
        </div>

        {/* --- STEP 0: INTRO --- */}
        {step === 0 && !loading && (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-400 mb-6 uppercase tracking-widest">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Diagnóstico Financeiro de Elite
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Tudo o que você precisa é <span className="text-neutral-500 italic font-semibold">organizar sua vida.</span>
            </h1>
            <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
              O Alfred vai salvar sua saúde financeira em apenas 2 minutos. Vamos começar?
            </p>
            <button 
              onClick={() => setStep(1)}
              className="w-full bg-white text-black font-black py-5 rounded-2xl text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Vamos com tudo! <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* --- STEPS DE PERGUNTAS --- */}
        {step > 0 && step <= questions.length && !loading && step !== questions.length + 1 && (
          <div className="animate-fade-in">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 block">
              Pergunta {step} de {questions.length}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {questions[step-1].title}
            </h2>
            <p className="text-neutral-500 mb-8">
              {questions[step-1].subtitle}
            </p>

            <div className="space-y-4">
              {questions[step-1].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt.percent)}
                  className="w-full p-6 bg-[#0f0f0f] border border-white/5 rounded-2xl text-left hover:border-white/20 hover:bg-[#141414] transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-white transition-colors">{opt.label}</h4>
                    <p className="text-sm text-neutral-500">{opt.sub}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STEP: PROCESSAMENTO (LOADING) --- */}
        {loading && (
          <div className="text-center py-20 animate-pulse">
            <div className="relative w-24 h-24 mx-auto mb-10">
              <Loader2 className="w-full h-full text-white animate-spin opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Criando seu sistema personalizado...</h2>
            <div className="space-y-3">
              <p className="text-neutral-500 text-sm animate-bounce">Configurando o Mordomo no seu WhatsApp...</p>
              <p className="text-neutral-600 text-[10px] uppercase tracking-tighter">Criptografando cofres centrais...</p>
            </div>
          </div>
        )}

        {/* --- STEP FINAL: RESULTADO --- */}
        {step === questions.length + 1 && !loading && (
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              Seu sistema está <span className="text-green-500">100% pronto!</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-12 leading-relaxed">
              Detectamos falhas graves no seu controle atual, mas o Alfred já preparou o terreno para sua evolução. 
              <strong> Bem-vindo ao time dos organizados.</strong>
            </p>

            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl mb-12 text-left flex items-start gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-yellow-500" />
               </div>
               <div>
                  <h4 className="font-bold mb-1">Diagnóstico Concluído</h4>
                  <p className="text-sm text-neutral-500">Seu nível de organização detectado foi de {userPercent}%. Ao ativar o Alfred, elevamos seu controle para <strong>100%</strong> imediatamente.</p>
               </div>
            </div>

            <button 
              onClick={goToPlans}
              className="w-full bg-white text-black font-black py-5 rounded-2xl text-xl hover:scale-[1.05] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] mb-6"
            >
              Organizar minhas finanças agora
            </button>
            <p className="text-xs text-neutral-600 font-bold uppercase tracking-widest">
              Garantia total de satisfação ou seu dinheiro de volta.
            </p>
          </div>
        )}

      </div>

      {/* Footer Simples */}
      <footer className="fixed bottom-8 opacity-20 text-[10px] uppercase tracking-widest font-bold">
        Alfred Intelligence &copy; 2026
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
