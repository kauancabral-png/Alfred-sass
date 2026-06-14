import toast from 'react-hot-toast';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { MessageCircle, CheckCircle } from 'lucide-react';

import confetti from 'canvas-confetti';

export default function Bot() {
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('https://fincontrol-saas-production.up.railway.app/api');

  React.useEffect(() => {
    // 🔥 AUTO-DISCOVERY DE API
    let envUrl = ((import.meta as any).env.VITE_API_URL || '').replace(/\/$/, '');
    if (envUrl) {
        setApiUrl(envUrl);
    } else if (window.location.origin.includes('up.railway.app')) {
        setApiUrl(window.location.origin + '/api');
    } else {
        setApiUrl('https://fincontrol-saas-production.up.railway.app/api');
        envUrl = 'https://fincontrol-saas-production.up.railway.app/api';
    }

    // FUNÇÃO REFORÇADA: O Alfred busca no cofre toda vez que entra na sala! 🏹🎩
    const fetchPhone = async (url: string) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        console.log("Alfred buscando telefone para o Mestre...");
        const res = await fetch(`${url}/profiles/phone`, {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
           const data = await res.json();
           if (data.phone) {
                console.log("Telefone encontrado:", data.phone);
                setPhoneInput(data.phone);
           }
        }
      } catch (err) {
        console.error("Falha na memória do Alfred:", err);
      }
    };
    
    fetchPhone(envUrl);
  }, []); // A montagem do componente no React Router acionará isso! 🥂🍷🎩

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Tu Cerebro de WhatsApp</h1>
        <p className="text-slate-500 mt-1">Configura el Robot Matriz en tu cuenta.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Conectar Robot por WhatsApp</h2>
            </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-slate-600 font-medium mb-2">1. Añade la Inteligencia Artificial al contacto</p>
            <p className="text-xs text-slate-500 mb-3">Guarda el número de abajo o manda un mensaje directo al Robot FinControl.</p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-mono text-slate-800 font-medium">+1 (415) 523-8886</span>
              <a href="https://wa.me/14155238886?text=join%20add-outline" target="_blank" rel="noreferrer" className="text-green-600 text-xs font-bold hover:underline">Abrir en WhatsApp</a>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-slate-600 font-medium mb-2">2. Digite seu Telefone Personal para o robô te reconhecer</p>
            <p className="text-xs text-slate-500 mb-3">La API usará tu número como Login único cuando lleguen los mensajes.</p>
            <input 
              type="text" 
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
              placeholder="(11) 90000-0000"
            />
          </div>

          <div className="bg-green-50 text-green-800 p-5 rounded-2xl text-xs font-bold border border-green-100 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span>COMANDO DE ACTIVACIÓN MAESTRO:</span>
              </div>
              <button 
                 onClick={() => {
                   navigator.clipboard.writeText('join add-outline');
                   toast.success("¡Listo! Ahora pega en el WhatsApp de Alfred 🥂🎩");
                 }}
                 className="w-full bg-white border-2 border-green-200 py-3 rounded-xl flex justify-between items-center px-4 hover:border-green-400 transition-all group"
              >
                 <span className="text-base font-mono">join add-outline</span>
                 <span className="text-[10px] text-slate-400 group-hover:text-green-600 transition-colors uppercase font-bold text-slate-800">Clic para copiar</span>
              </button>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                 ¡El señor necesita enviar este comando primero para que Twilio libere la conversación con nosotros! 🥂🎩
              </p>
          </div>

          <button 
                onClick={async () => {
                   if (!phoneInput) {
                       return toast.error("¡Por favor, completa el número primero!");
                   }
                   try {
                     const token = localStorage.getItem('token');
                     const res = await fetch(`${apiUrl}/profiles/phone`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ phone: phoneInput })
                     });
                      if (res.ok) {
                        confetti({
                           particleCount: 100,
                           spread: 70,
                           origin: { y: 0.6 },
                           colors: ['#10b981', '#3b82f6', '#f59e0b']
                        });
                        toast.success("¡Teléfono activado y sincronizado! Tu Robot ya te está escuchando.", { style: { background: '#10b981', color: 'white', fontWeight: 'bold' }});
                        // Sincronizando o estado local para garantir que o número continue lá 🛡️🎩
                        const updatedData = await res.json();
                        // Nao limpamos o input!
                      } else {
                        toast.error("Error al guardar el número. Tal vez este número ya esté activado en otra cuenta.");
                     }
                   } catch (err) {
                     toast.error("Falla al contactar a nuestro servidor principal.");
                   }
                }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
          >
            Guardar mi Número Activo <CheckCircle className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </Layout>
  );
}
