import React, { useState } from 'react';
import axios from 'axios';
import { Database, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('ANNUAL');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      setError('A Chave Secreta e o Email são obrigatórios!');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const isDev = window.location.hostname === 'localhost';
      const baseUrl = isDev ? 'http://localhost:5000' : 'https://alfred-backend-8t7n.onrender.com';
      
      const queryParams = new URLSearchParams({
        email: email.trim(),
        plan: plan,
      });
      
      if (name) queryParams.append('name', name);
      if (phone) queryParams.append('phone', phone);

      const url = `${baseUrl}/api/admin/force-create/${token}?${queryParams.toString()}`;
      
      const response = await axios.get(url);
      setResult(response.data);
      
      // Limpa os campos após o sucesso
      setEmail('');
      setName('');
      setPhone('');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Erro ao conectar com o Servidor Mestre.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col md:flex-row">
      {/* Esquerda - Header */}
      <div className="md:w-1/3 bg-[#0a0a0d] p-8 border-r border-[#1a1a24] flex flex-col justify-center">
        <div className="flex items-center gap-3 text-[#B08900] mb-6">
          <ShieldCheck size={40} />
          <h1 className="text-3xl font-bold font-outfit text-white">Painel Master</h1>
        </div>
        <p className="text-gray-400 mb-8 border-l-4 border-[#B08900] pl-4">
          Área restrita de resgate administrativo. Utilize a Chave Secreta para injetar ou modificar contas diretamente no cofre do Banco de Dados.
        </p>
        
        <div className="bg-red-900/20 text-red-400 p-4 rounded-xl border border-red-900/40 mt-auto flex gap-3">
          <AlertTriangle className="shrink-0" />
          <span className="text-sm">Ações feitas por aqui não podem ser desfeitas e ignoram qualquer barreira de pagamento da Hotmart.</span>
        </div>
      </div>

      {/* Direita - Painel */}
      <div className="md:w-2/3 p-8 flex items-center justify-center">
        <div className="w-full max-w-xl bg-[#0f0f13] border border-[#22222c] rounded-2xl p-6 shadow-2xl">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* SecKey */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#B08900] flex items-center gap-2">
                <Database size={16} /> JWT Secret (Chave do Cofre)
              </label>
              <input 
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Cole o valor da var JWT_SECRET da Railway..."
                className="w-full bg-[#18181f] text-gray-200 border border-[#2c2c35] rounded-lg px-4 py-3 outline-none focus:border-[#B08900] transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Email do Cliente *</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@gmail.com"
                  className="w-full bg-[#18181f] text-gray-200 border border-[#2c2c35] rounded-lg px-4 py-3 outline-none focus:border-[#B08900] transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Plano Imputado</label>
                <select 
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full bg-[#18181f] text-gray-200 border border-[#2c2c35] rounded-lg px-4 py-3 outline-none focus:border-[#B08900] transition"
                >
                  <option value="ANNUAL">Vitalício / Premium (ANNUAL)</option>
                  <option value="MONTHLY">Assinatura Mensal (MONTHLY)</option>
                  <option value="FREE">Cortar Acesso (FREE)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Nome (Opcional)</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full bg-[#18181f] text-gray-200 border border-[#2c2c35] rounded-lg px-4 py-3 outline-none focus:border-[#B08900] transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Telefone (Opcional)</label>
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+5511999999999"
                  className="w-full bg-[#18181f] text-gray-200 border border-[#2c2c35] rounded-lg px-4 py-3 outline-none focus:border-[#B08900] transition"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                ❌ {error}
              </div>
            )}

            {result && (
              <div className="p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-200">
                <h3 className="font-bold mb-2 flex items-center gap-2"><UserCheck size={18} /> {result.mensagem || 'Sucesso!'}</h3>
                {result.email && <div className="text-sm">📧 Email: {result.email}</div>}
                {result.plano && <div className="text-sm">⭐ Plano: {result.plano}</div>}
                {result.senhaX_PADRAO_GERADA && <div className="text-sm font-mono mt-1 pt-1 border-t border-green-500/20">🔑 Senha: {result.senhaX_PADRAO_GERADA}</div>}
                {result.senha_padrao && <div className="text-sm mt-1">{result.senha_padrao}</div>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-xl font-bold text-[#1f1a00] bg-gradient-to-r from-[#B08900] to-[#E3BA1D] hover:from-[#c29600] hover:to-[#f1c519] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-[#1f1a00]/30 border-t-[#1f1a00] rounded-full animate-spin" />
              ) : (
                <>Forçar Injeção no DB</>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
