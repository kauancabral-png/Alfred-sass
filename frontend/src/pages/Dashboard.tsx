import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import { 
  MessageCircle, TrendingUp, TrendingDown, Activity, 
  Target, ShoppingCart, Car, DollarSign, Wallet, ArrowRight,
  ShieldCheck, Zap, ArrowUpRight, ArrowDownRight, Smartphone, Mic, Monitor
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [market, setMarket] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileMode, setProfileMode] = useState<'personal' | 'business'>(() => {
    return (localStorage.getItem('profileMode') as 'personal' | 'business') || 'personal';
  });

  const userName = localStorage.getItem('userName') || 'Usuário';
  const userCurrency = localStorage.getItem('userCurrency') || 'R$';
  const userLocale = localStorage.getItem('userLocale') || 'pt-BR';

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

  const isBusiness = profileMode === 'business';

  // Cálculos Básicos
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = Math.abs(transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount), 0));
  const balance = totalIncome - totalExpense;
  const savings = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const formatMoney = (val: number) => `${userCurrency} ${val.toLocaleString(userLocale, { minimumFractionDigits: 2 })}`;

  // Gráfico de Fluxo
  const chartData = useMemo(() => {
    const data: Record<string, { name: string, receitas: number, despesas: number }> = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.toLocaleDateString(userLocale, { month: 'short' });
      if (!data[month]) data[month] = { name: month, receitas: 0, despesas: 0 };
      if (t.type === 'INCOME') data[month].receitas += Number(t.amount);
      else data[month].despesas += Math.abs(Number(t.amount));
    });
    return Object.values(data).reverse().slice(-6); // Últimos 6 meses no gráfico
  }, [transactions, userLocale]);

  const recentTx = transactions.slice(0, 5);

  const renderPersonalRow1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1: Saúde Financeira */}
      <div className="glass rounded-[2rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-20"><ShieldCheck className="w-24 h-24 text-primary" /></div>
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 relative z-10">Saúde Financeira Alfred</h3>
        <div className="relative w-32 h-32 flex items-center justify-center mb-6 z-10">
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="64" cy="64" r="60" stroke="#2A2A2A" strokeWidth="8" fill="none" />
             <circle cx="64" cy="64" r="60" stroke="#00FF00" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset="49" className="transition-all duration-1000" />
           </svg>
           <div className="absolute flex flex-col items-center">
             <span className="text-3xl font-black text-white">87</span>
             <span className="text-[10px] text-primary font-bold uppercase">/ 100</span>
           </div>
        </div>
        <div className="relative z-10">
           <p className="text-xs text-neutral-500 font-medium mb-1">Saldo Atual</p>
           <p className="text-3xl font-black text-white mb-2">{formatMoney(balance)}</p>
           <p className="text-xs font-bold text-primary flex items-center gap-1 justify-center"><TrendingUp className="w-3 h-3" /> +18% vs Mês Passado</p>
        </div>
      </div>

      {/* Card 2: Resumo do Mês */}
      <div className="glass rounded-[2rem] p-8 flex flex-col justify-between">
         <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Resumo do Mês</h3>
         <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-neutral-400">Receitas</span>
               <span className="text-lg font-black text-white">{formatMoney(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-neutral-400">Despesas</span>
               <span className="text-lg font-black text-white">{formatMoney(totalExpense)}</span>
            </div>
            <div className="h-[1px] w-full bg-dark-border"></div>
            <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-neutral-400">Economia</span>
               <span className="text-lg font-black text-primary">{formatMoney(savings)}</span>
            </div>
         </div>
         <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData.slice(-3)}>
                  <Bar dataKey="receitas" fill="#00FF00" radius={[4,4,0,0]} barSize={10} />
                  <Bar dataKey="despesas" fill="#333333" radius={[4,4,0,0]} barSize={10} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Card 3: Alfred IA */}
      <div className="glass rounded-[2rem] p-8 flex flex-col relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
         <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><Zap className="w-5 h-5 text-primary" /></div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Alfred IA</h3>
         </div>
         <p className="text-2xl font-black text-white mb-6 leading-tight">Como posso ajudar você hoje, {userName}?</p>
         
         <div className="space-y-3 mb-6 flex-1">
            <div className="bg-dark-bg border border-dark-border p-3 rounded-xl text-xs text-neutral-400 hover:text-white hover:border-primary/50 transition-all cursor-pointer flex justify-between items-center group">
               Analisar meus gastos <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
            <div className="bg-dark-bg border border-dark-border p-3 rounded-xl text-xs text-neutral-400 hover:text-white hover:border-primary/50 transition-all cursor-pointer flex justify-between items-center group">
               Onde posso economizar? <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
         </div>

         <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-primary/90 italic">"Seus gastos com mercado aumentaram 15% este mês comparado ao mês anterior."</p>
         </div>
      </div>
    </div>
  );

  const renderBusinessRow1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="glass rounded-[2rem] p-8 flex flex-col justify-center">
         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6"><TrendingUp className="w-6 h-6 text-white" /></div>
         <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-2">Faturamento Bruto</p>
         <p className="text-3xl font-black text-white">{formatMoney(totalIncome)}</p>
      </div>
      <div className="glass rounded-[2rem] p-8 flex flex-col justify-center">
         <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6"><TrendingDown className="w-6 h-6 text-red-500" /></div>
         <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-2">Despesas Operacionais</p>
         <p className="text-3xl font-black text-white">{formatMoney(totalExpense)}</p>
      </div>
      <div className="glass rounded-[2rem] p-8 flex flex-col justify-center">
         <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6"><Wallet className="w-6 h-6 text-primary" /></div>
         <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-2">Lucro Líquido</p>
         <p className="text-3xl font-black text-primary">{formatMoney(balance)}</p>
      </div>
      <div className="glass rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden">
         <div className="absolute right-0 bottom-0 p-4 opacity-5"><Activity className="w-32 h-32 text-white" /></div>
         <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-2">Margem de Lucro</p>
         <p className="text-5xl font-black text-white mb-2">{profitMargin.toFixed(1)}%</p>
         <div className="w-full bg-dark-bg h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${Math.max(0, Math.min(100, profitMargin))}%` }}></div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Contextual */}
      <div className="mb-10 flex justify-between items-end">
         <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
               {isBusiness ? 'Inteligência Corporativa' : 'Visão Geral'}
            </h1>
            <p className="text-neutral-400 font-medium text-sm md:text-base">
               {isBusiness ? 'DRE Inteligente e Fluxo de Caixa Empresarial.' : 'Acompanhe seu patrimônio em tempo real.'}
            </p>
         </div>
      </div>

      {/* Linha 1 */}
      {isBusiness ? renderBusinessRow1() : renderPersonalRow1()}

      {/* Linha 2: Gráficos e Transações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 md:p-10 flex flex-col">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-base font-bold text-white uppercase tracking-widest">Fluxo de Caixa</h3>
               <div className="flex gap-2">
                  {['7D', '30D', '3M', '6M', '1A'].map(filter => (
                     <button key={filter} className="px-4 py-2 text-[10px] font-bold text-neutral-400 uppercase bg-dark-bg rounded-full border border-dark-border hover:text-white transition-colors">{filter}</button>
                  ))}
               </div>
            </div>
            <div className="flex-1 min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#00FF00" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#333333" stopOpacity={0.5}/>
                           <stop offset="95%" stopColor="#333333" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#141414', border: '1px solid #2A2A2A', borderRadius: '1rem', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="receitas" stroke="#00FF00" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                     <Area type="monotone" dataKey="despesas" stroke="#333333" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="glass rounded-[2.5rem] p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-base font-bold text-white uppercase tracking-widest">Movimentações</h3>
               <NavLink to="/transactions" className="text-xs font-bold text-primary hover:underline">Ver todas</NavLink>
            </div>
            <div className="flex-1 flex flex-col gap-4">
               {recentTx.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm font-medium">Nenhum registro.</div>
               ) : (
                  recentTx.map(t => (
                     <div key={t.id} className="flex justify-between items-center p-4 bg-dark-bg rounded-2xl border border-dark-border group hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'INCOME' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-white'}`}>
                              {t.type === 'INCOME' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                           </div>
                           <div>
                              <p className="font-bold text-white text-sm">{t.description}</p>
                              <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium mt-1">
                                 {t.type === 'INCOME' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                                 {t.type === 'INCOME' ? 'Painel Web' : 'WhatsApp'}
                              </div>
                           </div>
                        </div>
                        <div className={`font-black text-sm ${t.type === 'INCOME' ? 'text-primary' : 'text-white'}`}>
                           {t.type === 'INCOME' ? '+' : '-'}{userCurrency} {Math.abs(Number(t.amount)).toLocaleString(userLocale)}
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
      </div>

      {/* Linha 3: Ferramentas Exclusivas */}
      {!isBusiness && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Metas */}
         <div className="glass rounded-[2rem] p-8 group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><Target className="w-6 h-6 text-white" /></div>
               <NavLink to="/goals"><ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" /></NavLink>
            </div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Metas de Vida</h4>
            {goals.length > 0 ? (
               <>
                  <p className="text-xl font-black text-white mb-6">{goals[0].name}</p>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-3xl font-black text-white">{(goals[0].currentValue / goals[0].targetValue * 100).toFixed(0)}%</span>
                     <span className="text-xs text-neutral-500 font-medium mb-1">{formatMoney(goals[0].currentValue)} / {formatMoney(goals[0].targetValue)}</span>
                  </div>
                  <div className="w-full bg-dark-bg h-2 rounded-full overflow-hidden">
                     <div className="bg-primary h-full" style={{ width: `${(goals[0].currentValue / goals[0].targetValue) * 100}%` }}></div>
                  </div>
                  <p className="text-[10px] font-bold text-primary mt-4 uppercase text-center">Foco e Disciplina</p>
               </>
            ) : (
               <p className="text-sm text-neutral-500 mt-4">Nenhuma meta ativa.</p>
            )}
         </div>

         {/* Supermercado */}
         <div className="glass rounded-[2rem] p-8 group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><ShoppingCart className="w-6 h-6 text-white" /></div>
               <NavLink to="/mercado"><ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" /></NavLink>
            </div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Supermercado Inteligente</h4>
            {market.length > 0 ? (
               <>
                  <p className="text-xl font-black text-white mb-6">{market[0].productName}</p>
                  <div className="bg-dark-bg p-4 rounded-2xl border border-dark-border flex justify-between items-center mb-4">
                     <div>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold">Melhor Preço</p>
                        <p className="text-lg font-black text-white">{formatMoney(market[0].bestPrice)}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] text-neutral-500 uppercase font-bold">Local</p>
                        <p className="text-sm font-bold text-white">{market[0].establishment}</p>
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-red-500 mt-4 uppercase flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3"/> +12% vs Última Compra</p>
               </>
            ) : (
               <p className="text-sm text-neutral-500 mt-4">Nenhum produto monitorado.</p>
            )}
         </div>

         {/* Garagem */}
         <div className="glass rounded-[2rem] p-8 group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><Car className="w-6 h-6 text-white" /></div>
               <NavLink to="/veiculos"><ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" /></NavLink>
            </div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Garagem Alfred</h4>
            <p className="text-xl font-black text-white mb-6">Veículo Principal</p>
            <div className="space-y-3">
               <div className="flex justify-between items-center bg-dark-bg p-3 rounded-xl border border-dark-border">
                  <span className="text-xs font-medium text-neutral-400 flex items-center gap-2"><Zap className="w-4 h-4 text-primary"/> Combustível</span>
                  <span className="text-sm font-bold text-white">{formatMoney(vehicles.filter(v => v.service.toLowerCase().includes('combustivel') || v.service.toLowerCase().includes('gasolina')).reduce((a,b)=>a+b.amount,0))}</span>
               </div>
               <div className="flex justify-between items-center bg-dark-bg p-3 rounded-xl border border-dark-border">
                  <span className="text-xs font-medium text-neutral-400 flex items-center gap-2"><Activity className="w-4 h-4 text-white"/> Manutenção</span>
                  <span className="text-sm font-bold text-white">{formatMoney(vehicles.filter(v => !v.service.toLowerCase().includes('combustivel') && !v.service.toLowerCase().includes('gasolina')).reduce((a,b)=>a+b.amount,0))}</span>
               </div>
            </div>
         </div>
      </div>
      )}

    </div>
  );
}
