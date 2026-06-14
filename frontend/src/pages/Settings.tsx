import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, Bell, Lock, CheckCircle, PieChart, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [name, setName] = useState('');
  
  // States of Security & Notifications
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [currency, setCurrency] = useState('$');
  const [locale, setLocale] = useState('es-MX');

  const [apiUrl, setApiUrl] = useState('https://fincontrol-saas-production.up.railway.app/api');

  useEffect(() => {
    setName(localStorage.getItem('userName') || 'Usuário Administrador');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) setEmail(savedEmail);
    
    setNotifyEmail(localStorage.getItem('notifyEmail') !== 'false');
    setNotifyWhatsapp(localStorage.getItem('notifyWhatsapp') === 'true');
    setCurrency(localStorage.getItem('userCurrency') || '$');
    setLocale(localStorage.getItem('userLocale') || 'es-MX');

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

    fetchProfile(envUrl);
  }, []);

  const fetchProfile = async (url: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${url}/auth/me`, {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
         const data = await res.json();
         if (data.phone) setPhoneInput(data.phone);
         if (data.name) setName(data.name);
      }
    } catch (e) { console.error(e) }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       const token = localStorage.getItem('token');
       const res = await fetch(`${apiUrl}/auth/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name, phone: phoneInput })
       });
       if (res.ok) {
          localStorage.setItem('userName', name);
          confetti({
             particleCount: 100,
             spread: 70,
             origin: { y: 0.6 },
             colors: ['#10b981', '#3b82f6', '#f59e0b']
          });
          toast.success('¡Configuraciones guardadas y WhatsApp sincronizado! 💎🚀', { style: { background: '#10b981', color: 'white', fontWeight: 'bold' }});
       } else {
          toast.error("Erro ao salvar. Este número pode estar em uso por outra conta sua.");
       }
    } catch (e) {
       toast.error("Error en la conexión con el Panel Principal");
    }
  };


  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) localStorage.setItem('userEmail', email);
    toast('Credenciais atualizadas com segurança! (Simulação de sistema)');
    setCurrentPassword('');
    setNewPassword('');
  };

  const toggleNotifyEmail = () => {
    const newVal = !notifyEmail;
    setNotifyEmail(newVal);
    localStorage.setItem('notifyEmail', String(newVal));
  };

  const toggleNotifyWhatsapp = () => {
    const newVal = !notifyWhatsapp;
    setNotifyWhatsapp(newVal);
    localStorage.setItem('notifyWhatsapp', String(newVal));
  };

  const handleSaveRegional = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userCurrency', currency);
    localStorage.setItem('userLocale', locale);
    toast.success('¡Preferencias regionales actualizadas! Reiniciando vista...');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Configuraciones Base</h1>
        <p className="text-slate-500 mt-1">Gestiona tu panel y personaliza tu cuenta principal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Sidebar das configs */}
         <div className="space-y-2 md:col-span-1">
            <button onClick={() => setActiveTab('perfil')} className={`w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center gap-3 ${activeTab==='perfil' ? 'bg-white border border-primary/20 text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
               <User className="w-5 h-5"/> Mi Perfil y Bot ZAP
            </button>
            <button onClick={() => setActiveTab('notificacoes')} className={`w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center gap-3 ${activeTab==='notificacoes' ? 'bg-white border border-primary/20 text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
               <Bell className="w-5 h-5"/> Notificaciones
            </button>
            <button onClick={() => setActiveTab('regional')} className={`w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center gap-3 ${activeTab==='regional' ? 'bg-white border border-primary/20 text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
               <PieChart className="w-5 h-5"/> Locales y Moneda
            </button>
            <button onClick={() => setActiveTab('seguranca')} className={`w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center gap-3 ${activeTab==='seguranca' ? 'bg-white border border-primary/20 text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
               <Lock className="w-5 h-5"/> Seguridad
            </button>
         </div>

         {/* Content Area */}
         <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
            {activeTab === 'perfil' && (
              <div className="fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Personalización de Exhibición e IA</h3>
                <form className="space-y-4 max-w-lg" onSubmit={handleSaveProfile}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre (Como desees)</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tu WhatsApp (Para el Bot IA)</label>
                    <input type="text" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="Ej: 521XXXXXXXXXX (Solo Números!)" className="w-full px-4 py-3 border border-green-200 rounded-xl text-sm bg-green-50 outline-none focus:ring-2 focus:ring-green-500/50" />
                    <p className="text-[10px] text-green-700 mt-2 font-bold uppercase tracking-widest">⚠️ Ingresa el número con el código de país para que Alfred te reconozca.</p>
                  </div>
                  <div className="pt-4">
                     <button type="submit" className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all text-sm flex gap-2 items-center active:scale-95">
                       <CheckCircle className="w-4 h-4" /> ¡Aplicar y Sincronizar!
                     </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notificacoes' && (
              <div className="fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Preferencias de Alerta</h3>
                <div className="space-y-4 max-w-lg">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Resumen Semanal</h4>
                      <p className="text-xs text-slate-500 mt-1">Recibir email cada lunes con el balance de la semana.</p>
                    </div>
                    <div onClick={toggleNotifyEmail} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifyEmail ? 'bg-primary' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notifyEmail ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Gastos Altas no WhatsApp</h4>
                      <p className="text-xs text-slate-500 mt-1">Alerta imediato ao transacionar acima de $ 1.000,00.</p>
                    </div>
                    <div onClick={toggleNotifyWhatsapp} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifyWhatsapp ? 'bg-primary' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notifyWhatsapp ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'regional' && (
              <div className="fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Configuración Regionales de Moneda</h3>
                <form className="space-y-6 max-w-lg" onSubmit={handleSaveRegional}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Moneda Principal</label>
                      <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="$">$ (México, USA, Col, Chi, Arg)</option>
                        <option value="€">€ (España, Portugal)</option>
                        <option value="R$">R$ (Brasil)</option>
                        <option value="Gs">Gs (Paraguay)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Formato Regional</label>
                      <select 
                        value={locale} 
                        onChange={(e) => setLocale(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="es-MX">Español (México)</option>
                        <option value="en-US">English (USA)</option>
                        <option value="es-CO">Español (Colombia)</option>
                        <option value="es-CL">Español (Chile)</option>
                        <option value="es-AR">Español (Argentina)</option>
                        <option value="es-ES">Español (España)</option>
                        <option value="pt-PT">Português (Portugal)</option>
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="es-PY">Español (Paraguay)</option>
                        <option value="es-EC">Español (Ecuador)</option>
                        <option value="es-PA">Español (Panamá)</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <p className="text-xs text-orange-800 leading-relaxed font-bold">💎 ALFRED TIP: Al cambiar la moneda, todos tus balances actuales se mostrarán en el nuevo símbolo. Asegúrate de configurar el formato de tu país para ver los decimales correctamente.</p>
                  </div>
                  <button type="submit" className="bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                    Guardar Preferencias
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'seguranca' && (
              <div className="fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Acceso y Credenciales</h3>
                <form className="space-y-4 max-w-lg" onSubmit={handleSaveSecurity}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cambiar E-mail Base</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu email actual" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Actual (Para confirmación)</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="pt-4">
                     <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all text-sm flex gap-2 items-center">
                       <Lock className="w-4 h-4" /> Actualizar Acceso
                     </button>
                  </div>
                </form>
              </div>
            )}
         </div>
      </div>
    </Layout>
  );
}
