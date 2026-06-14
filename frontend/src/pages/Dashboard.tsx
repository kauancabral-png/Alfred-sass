import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  ArrowUp, ArrowDown, Bell, Plus, Minus, Mic, MessageCircle, FileText, Download,
  ShoppingCart, Car, Target, TrendingUp, TrendingDown, Info, ChevronDown, Activity, 
  MapPin, CheckCircle, Settings
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [market, setMarket] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [profileMode, setProfileMode] = useState<'personal' | 'business'>(() => {
    return (localStorage.getItem('profileMode') as 'personal' | 'business') || 'personal';
  });

  const userName = localStorage.getItem('userName') || 'Mestre';
  const userCurrency = localStorage.getItem('userCurrency') || 'R$';
  const userLocale = localStorage.getItem('userLocale') || 'pt-BR';
  const avatarUrl = localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${userName}&background=0D8ABC&color=fff&rounded=true`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const activeId = localStorage.getItem('activeProfileId');
        if (activeId) {
          const headers = { Authorization: `Bearer ${token}` };
          const [txRes, goalsRes, vehiclesRes, marketRes] = await Promise.all([
             fetch(`https://alfred-backend-8t7n.onrender.com/api/transactions?profileId=${activeId}&_t=${Date.now()}`, { headers }),
             fetch(`https://alfred-backend-8t7n.onrender.com/api/goals?profileId=${activeId}`, { headers }),
             fetch(`https://alfred-backend-8t7n.onrender.com/api/vehicles?profileId=${activeId}`, { headers }),
             fetch(`https://alfred-backend-8t7n.onrender.com/api/market?profileId=${activeId}`, { headers }),
          ]);
          
          if (txRes.ok) setTransactions(await txRes.json());
          if (goalsRes.ok) setGoals(await goalsRes.json());
          if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
          if (marketRes.ok) setMarket(await marketRes.json());
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();

    const handleStorageChange = () => {
      const mode = localStorage.getItem('profileMode') as 'personal' | 'business';
      if (mode) setProfileMode(mode);
    };
    window.addEventListener('profileModeChanged', handleStorageChange);
    return () => window.removeEventListener('profileModeChanged', handleStorageChange);
  }, [profileMode]);

  const toggleProfile = (mode: 'personal' | 'business') => {
     if(profileMode === mode) return;
     setProfileMode(mode);
     localStorage.setItem('profileMode', mode);
     // Trigger globally so layout updates its sidebar selection
     window.dispatchEvent(new Event('profileModeChanged'));
  };

  const formatMoney = (val: number) => `${userCurrency} ${val.toLocaleString(userLocale, { minimumFractionDigits: 2 })}`;

  // Cálculos Básicos
  const incomes = transactions.filter(t => t.type === 'INCOME');
  const expenses = transactions.filter(t => t.type === 'EXPENSE');
  
  const totalIncome = incomes.reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = Math.abs(expenses.reduce((acc, t) => acc + Number(t.amount), 0));
  const balance = totalIncome - totalExpense;
  const savings = totalIncome > 0 ? (balance > 0 ? balance : 0) : 0;
  const savingsGoalProgress = totalIncome > 0 ? Math.min(100, Math.round((savings / (totalIncome * 0.2)) * 100)) : 0; // Exemplo: meta de guardar 20%

  // Gráfico de Fluxo
  const chartData = useMemo(() => {
    const data: Record<string, { name: string, Receitas: number, Despesas: number }> = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const day = date.toLocaleDateString(userLocale, { day: '2-digit', month: '2-digit' });
      if (!data[day]) data[day] = { name: day, Receitas: 0, Despesas: 0 };
      if (t.type === 'INCOME') data[day].Receitas += Number(t.amount);
      else data[day].Despesas += Math.abs(Number(t.amount));
    });
    return Object.values(data).reverse().slice(-14); // Últimos 14 dias
  }, [transactions, userLocale]);

  const recentTx = transactions.slice(0, 5);

  const renderInsights = () => {
      // IA Simples Baseada em Regras para gerar insights
      const insights = [];
      if (totalExpense > 0) {
         insights.push({ icon: ShoppingCart, text: `Seus gastos totais representam ${((totalExpense/totalIncome)*100 || 0).toFixed(0)}% da sua receita este mês.`, color: 'text-green-500', bg: 'bg-green-50' });
      }
      const carExpenses = vehicles.reduce((acc, v) => acc + v.amount, 0);
      if (carExpenses > 0) {
         insights.push({ icon: Car, text: `Seu veículo custou ${formatMoney(carExpenses)} nos últimos 30 dias.`, color: 'text-orange-500', bg: 'bg-orange-50' });
      }
      if (goals.length > 0) {
         const goal = goals[0];
         const pct = ((goal.currentValue / goal.targetValue) * 100).toFixed(0);
         insights.push({ icon: Target, text: `Você está a ${pct}% da sua meta de ${goal.name}.`, color: 'text-purple-500', bg: 'bg-purple-50' });
      }
      if (insights.length === 0) {
         insights.push({ icon: CheckCircle, text: `Tudo tranquilo por aqui. Continue registrando seus gastos.`, color: 'text-blue-500', bg: 'bg-blue-50' });
      }
      return insights;
  };

  return (
    <Layout>
      <div className="animate-in fade-in duration-500 font-sans pb-20">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                 Olá, {userName}! <span className="text-2xl">👋</span>
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Seu mordomo financeiro está organizando suas finanças.</p>
           </div>

           <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-gray-100 shadow-sm">
              {/* Seletor de Perfil */}
              <div className="flex items-center bg-gray-50 rounded-full px-1 py-1 mr-2 border border-gray-100">
                 <button 
                    onClick={() => toggleProfile('personal')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${profileMode === 'personal' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                 >
                    Pessoal
                 </button>
                 <button 
                    onClick={() => toggleProfile('business')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${profileMode === 'business' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                 >
                    Empresarial
                 </button>
              </div>

              {/* Notificações */}
              <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
                 <Bell className="w-5 h-5 text-gray-600" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Avatar */}
              <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" />
           </div>
        </div>

        {/* LINHA 1: CARDS DE RESUMO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {/* Saldo Atual */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-[160px]">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-gray-500">Saldo Atual</span>
                    <Info className="w-3 h-3 text-gray-300" />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(balance)}</h2>
                 <p className="text-[11px] font-bold text-green-500 flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3" /> 18% <span className="text-gray-400 font-medium">comparado ao mês passado</span>
                 </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
                 {/* Sparkline Simulada com SVG básico */}
                 <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-green-500" fill="currentColor">
                    <path d="M0,30 L0,15 Q10,5 20,15 T40,15 T60,10 T80,20 T100,5 L100,30 Z" />
                 </svg>
              </div>
           </div>

           {/* Receitas */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                 <ArrowUp className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Receitas do Mês</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(totalIncome)}</h2>
                 <p className="text-xs text-gray-400 font-medium mt-1">{incomes.length} entradas</p>
              </div>
              <p className="text-[11px] font-bold text-green-500 flex items-center gap-1 mt-1">
                 <ArrowUp className="w-3 h-3" /> 12% <span className="text-gray-400 font-medium">comparado ao mês passado</span>
              </p>
           </div>

           {/* Despesas */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-red-400 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                 <ArrowDown className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Despesas do Mês</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(totalExpense)}</h2>
                 <p className="text-xs text-gray-400 font-medium mt-1">{expenses.length} gastos</p>
              </div>
              <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1">
                 <ArrowDown className="w-3 h-3" /> 8% <span className="text-gray-400 font-medium">comparado ao mês passado</span>
              </p>
           </div>

           {/* Economia */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                 <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Economia do Mês</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(savings)}</h2>
              </div>
              <div className="mt-2">
                 <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mb-1">
                    <span>Meta atingida: {savingsGoalProgress}%</span>
                 </div>
                 <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${savingsGoalProgress}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* LINHA 2: GRÁFICO E TRANSAÇÕES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           {/* Fluxo de Caixa (Ocupa 65% em telas grandes) */}
           <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-gray-900">Fluxo de Caixa</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 mr-4">
                       <span className="flex items-center gap-1 text-xs font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-green-500"></div> Receitas</span>
                       <span className="flex items-center gap-1 text-xs font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-red-500"></div> Despesas</span>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                       Últimos 30 dias <ChevronDown className="w-3 h-3" />
                    </button>
                 </div>
              </div>
              <div className="flex-1 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDes" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} tickFormatter={(val) => `R$ ${val/1000}k`} />
                       <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                          labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                       />
                       <Area type="monotone" dataKey="Receitas" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" />
                       <Area type="monotone" dataKey="Despesas" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDes)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Últimas Movimentações (35%) */}
           <div className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black text-gray-900">Últimas Movimentações</h3>
                 <NavLink to="/transactions" className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">Ver todas</NavLink>
              </div>
              <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2">
                 {recentTx.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm font-medium mt-10">Nenhuma movimentação.</div>
                 ) : (
                    recentTx.map(t => (
                       <div key={t.id} className="flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                {t.type === 'INCOME' ? <ArrowUp className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                             </div>
                             <div>
                                <p className="font-bold text-gray-900 text-sm">{t.description}</p>
                                <p className="text-[11px] text-gray-500 font-medium">{t.category?.name || 'Geral'}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className={`font-black text-sm ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                                {t.type === 'INCOME' ? '' : ''}{formatMoney(Math.abs(Number(t.amount)))}
                             </p>
                             <p className="text-[10px] text-gray-400 font-medium">Painel Web</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* LINHA 3: RECURSOS EXCLUSIVOS ALFRED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           
           {/* Metas de Vida */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-sm font-black text-gray-900">Metas de Vida</h4>
                 <NavLink to="/goals" className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Ver todas</NavLink>
              </div>
              {goals.length > 0 ? (
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                       <Target className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="flex-1">
                       <p className="font-bold text-gray-900 text-sm mb-1">{goals[0].name}</p>
                       <p className="text-[10px] text-gray-500 font-medium mb-2">{formatMoney(goals[0].currentValue)} / {formatMoney(goals[0].targetValue)}</p>
                       <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-green-500 h-full rounded-full" style={{ width: `${(goals[0].currentValue / goals[0].targetValue) * 100}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-700">{((goals[0].currentValue / goals[0].targetValue) * 100).toFixed(0)}%</span>
                       </div>
                       <p className="text-[9px] text-gray-400 mt-2">Você alcançará sua meta em 3 meses.</p>
                    </div>
                 </div>
              ) : (
                 <p className="text-xs text-gray-400 font-medium">Nenhuma meta configurada.</p>
              )}
           </div>

           {/* Supermercado Inteligente */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-sm font-black text-gray-900">Supermercado</h4>
                 <NavLink to="/mercado" className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Ver todas</NavLink>
              </div>
              {market.length > 0 ? (
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 border border-orange-100">
                       <ShoppingCart className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                       <p className="font-bold text-gray-900 text-sm mb-1">{market[0].productName}</p>
                       <p className="text-xs text-gray-500 font-medium mb-1">Melhor preço: <span className="font-black text-gray-900">{formatMoney(market[0].bestPrice)}</span></p>
                       <p className="text-[10px] text-gray-400 font-medium mb-2">Local: <span className="font-bold text-gray-600">{market[0].establishment}</span></p>
                       <p className="text-[10px] font-bold text-red-500 flex items-center gap-1"><ArrowUp className="w-3 h-3"/> 12% <span className="text-gray-400 font-normal">desde a última compra</span></p>
                    </div>
                 </div>
              ) : (
                 <p className="text-xs text-gray-400 font-medium">Nenhum produto monitorado.</p>
              )}
           </div>

           {/* Garagem Alfred */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-sm font-black text-gray-900">Garagem Alfred</h4>
                 <NavLink to="/veiculos" className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Ver detalhes</NavLink>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Car className="w-6 h-6 text-gray-400" />
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm mb-1">Veículo Principal</p>
                    <p className="text-xs text-gray-500 font-medium mb-1">Gasto mensal: <span className="font-black text-gray-900">{formatMoney(vehicles.reduce((a,b)=>a+b.amount,0))}</span></p>
                    <p className="text-[10px] text-gray-400 mb-3">Próxima revisão: 15/06/2026</p>
                    
                    <div className="flex gap-2">
                       <div className="w-6 h-6 bg-gray-50 rounded border border-gray-200 flex items-center justify-center" title="Combustível"><Activity className="w-3 h-3 text-gray-500" /></div>
                       <div className="w-6 h-6 bg-gray-50 rounded border border-gray-200 flex items-center justify-center" title="Manutenção"><Settings className="w-3 h-3 text-gray-500" /></div>
                       <div className="w-6 h-6 bg-gray-50 rounded border border-gray-200 flex items-center justify-center" title="Documentos"><FileText className="w-3 h-3 text-gray-500" /></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Resumo Inteligente IA */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-sm font-black text-gray-900">Resumo Inteligente</h4>
                 <button className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Ver todos</button>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                 {renderInsights().slice(0,3).map((insight, idx) => (
                    <div key={idx} className="flex gap-3">
                       <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${insight.bg}`}>
                          <insight.icon className={`w-3 h-3 ${insight.color}`} />
                       </div>
                       <p className="text-[10px] text-gray-600 font-medium leading-relaxed">{insight.text}</p>
                    </div>
                 ))}
              </div>
           </div>

        </div>

        {/* RODAPÉ: AÇÕES RÁPIDAS */}
        <div>
           <h4 className="text-sm font-black text-gray-900 mb-4">Ações Rápidas</h4>
           <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100 hover:bg-green-100 transition-colors">
                 <Plus className="w-4 h-4" /> Registrar Receita
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold border border-red-100 hover:bg-red-100 transition-colors">
                 <Minus className="w-4 h-4" /> Registrar Despesa
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors">
                 <Mic className="w-4 h-4" /> Enviar Áudio
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors">
                 <MessageCircle className="w-4 h-4" /> Abrir WhatsApp
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                 <FileText className="w-4 h-4" /> Gerar Relatório
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-100 transition-colors">
                 <Download className="w-4 h-4" /> Exportar CSV
              </button>
           </div>
        </div>

      </div>
    </Layout>
  );
}
