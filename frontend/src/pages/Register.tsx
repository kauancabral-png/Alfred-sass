import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock, Mail, User, Phone, CheckCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://fincontrol-saas-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.toLowerCase().trim(), password, whatsappNumber: phone })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao registrar');
      
      localStorage.setItem('token', data.token);
      if (data.user && data.user.name) {
          localStorage.setItem('userName', data.user.name);
      }
      navigate('/dashboard');
    } catch (err) {
      toast('Aviso: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans items-center relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 fade-in">
        <div className="flex justify-center flex-col items-center">
          <img src="/logo-alfred-black.png" alt="Alfred" className="w-24 h-24 object-contain rounded-2xl mb-4 shadow-xl shadow-slate-200" />
          <h2 className="text-center text-3xl font-extrabold text-slate-900 mb-2">
             Crie sua conta
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
             Já tem uma conta? <NavLink to="/login" className="font-medium text-primary hover:underline">Faça login</NavLink>
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 fade-in">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-4" onSubmit={handleRegister}>
            
            {/* Nome */}
            <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm bg-slate-50 outline-none" placeholder="Nome Completo" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm bg-slate-50 outline-none" placeholder="Email (voce@empresa.com)" required />
              </div>
            </div>

             {/* Phone */}
             <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm bg-slate-50 outline-none" placeholder="WhatsApp (DDD) 90000-0000" />
              </div>
              <p className="text-xs text-slate-400 mt-1 ml-1">Para integração via Bot</p>
            </div>

            {/* Senha */}
            <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm bg-slate-50 outline-none" placeholder="Defina sua senha" required />
              </div>
            </div>

            <div className="pt-2">
              <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-primary hover:bg-primary-light focus:outline-none transition-all">
                <CheckCircle className="w-5 h-5" />
                {loading ? 'Processando...' : 'Criar Conta Gratuita'}
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-400 mt-4">
              Ao se cadastrar, você concorda com nossos Termos de Uso.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
