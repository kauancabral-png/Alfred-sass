import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { 
  CreditCard,
  MessageCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  ArrowRightLeft,
  Apple,
  User,
  ArrowUpRight,
  Target,
  Info,
  FileText,
  ShoppingCart,
  Car
} from 'lucide-react';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileMode, setProfileMode] = useState<'personal' | 'business'>(() => {
    return (localStorage.getItem('profileMode') as 'personal' | 'business') || 'personal';
  });

  const [personalProfileId, setPersonalProfileId] = useState<string | null>(null);
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilesAndTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://alfred-backend-8t7n.onrender.com/api/auth/me?cache=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const profiles = data.profiles || [];
          const personal = profiles.find((p: any) => p.type === 'PERSONAL');
          const business = profiles.find((p: any) => p.type === 'BUSINESS');
          
          if (personal) setPersonalProfileId(personal.id);
          if (business) setBusinessProfileId(business.id);
          
          const activeId = profileMode === 'business' ? business?.id : personal?.id;
          
          if (activeId) {
             const txRes = await fetch(`https://alfred-backend-8t7n.onrender.com/api/transactions?profileId=${activeId}&_t=${new Date().getTime()}`, {
               headers: { Authorization: `Bearer ${token}` }
             });
             if (txRes.ok) {
               setTransactions(await txRes.json());
             }
          }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchProfilesAndTransactions();

    const handleStorageChange = () => {
      const mode = localStorage.getItem('profileMode') as 'personal' | 'business';
      if (mode) setProfileMode(mode);
    };
    window.addEventListener('profileModeChanged', handleStorageChange);
    return () => window.removeEventListener('profileModeChanged', handleStorageChange);
  }, [profileMode]);

  // Profile data
  const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail')?.split('@')[0] || 'Mestre';
  const isBusiness = profileMode === 'business';

  // Theming variables
  const bgCard = isBusiness ? 'bg-[#111111]' : 'bg-white';
  const bgSubCard = isBusiness ? 'bg-[#1a1a1a]' : 'bg-gray-50';
  const textTitle = isBusiness ? 'text-white' : 'text-gray-900';
  const textSub = isBusiness ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isBusiness ? 'border-white/5' : 'border-gray-100';

  // Dynamic calculations
  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount), 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
  }, [transactions]);

  const totalBalance = totalIncome - totalExpense;

  const chartData = useMemo(() => {
    const data: Record<string, { name: string, receitas: number, despesas: number }> = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      if (!data[month]) data[month] = { name: month, receitas: 0, despesas: 0 };
      if (t.type === 'INCOME') data[month].receitas += Number(t.amount);
      else data[month].despesas += Number(t.amount);
    });
    // Convert to array and reverse to get chronological order (assuming latest transactions first)
    return Object.values(data).reverse();
  }, [transactions]);

  const expenseSummary = useMemo(() => {
    const categoryTotals: Record<string, { total: number }> = {};
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = t.categoryId?.name || 'Geral';
      if (!categoryTotals[cat]) categoryTotals[cat] = { total: 0 };
      categoryTotals[cat].total += Number(t.amount);
    });
    return Object.entries(categoryTotals).sort((a, b) => b[1].total - a[1].total);
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 15);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const COLORS = ['#0284C7', '#16A34A', '#D97706', '#EA580C', '#8B5CF6', '#F59E0B', '#10B981'];

  return (
    <Layout>
      <div className="min-h-screen pb-20 fade-in px-4 md:px-8">
        {/* Header de Gestão Mestre */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6 md:gap-8 overflow-hidden">
           <div className="w-full min-w-0">
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 shrink-0 bg-black text-white rounded-2xl flex items-center justify-center shadow-md border border-white/10">
                    <User className="w-6 h-6" />
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isBusiness ? 'text-[#00FF00]' : 'text-gray-400'} truncate`}>
                      {isBusiness ? 'Painel Empresarial' : 'Painel Pessoal'}
                    </span>
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textTitle} tracking-tight truncate`}>Olá, {userName}!</h1>
                 </div>
              </div>
           </div>
        </div>

        {/* Cards Principais - Hospitally Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className={`${bgCard} rounded-[1.5rem] border ${borderClass} shadow-sm p-6 group hover:-translate-y-1 transition-all flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm"><CreditCard className="w-6 h-6"/></div>
                   <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">+0%</span>
                </div>
                <div>
                   <h2 className={`text-3xl font-bold ${textTitle} mb-1`}>{formatCurrency(totalBalance)}</h2>
                   <h4 className={`text-sm font-medium ${textSub}`}>Saldo Atual</h4>
                </div>
            </div>

            <div className={`${bgCard} rounded-[1.5rem] border ${borderClass} shadow-sm p-6 group hover:-translate-y-1 transition-all flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm"><TrendingUp className="w-6 h-6"/></div>
                   <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">+0%</span>
                </div>
                <div>
                   <h2 className={`text-3xl font-bold ${textTitle} mb-1`}>{formatCurrency(totalIncome)}</h2>
                   <h4 className={`text-sm font-medium ${textSub}`}>Receitas (Mês)</h4>
                </div>
            </div>

            <div className={`${bgCard} rounded-[1.5rem] border ${borderClass} shadow-sm p-6 group hover:-translate-y-1 transition-all flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-sm"><TrendingDown className="w-6 h-6"/></div>
                   <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">-0%</span>
                </div>
                <div>
                   <h2 className={`text-3xl font-bold ${textTitle} mb-1`}>{formatCurrency(totalExpense)}</h2>
                   <h4 className={`text-sm font-medium ${textSub}`}>Despesas (Mês)</h4>
                </div>
            </div>

            <div className={`${bgCard} rounded-[1.5rem] border ${borderClass} shadow-sm p-6 group hover:-translate-y-1 transition-all flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm"><Target className="w-6 h-6"/></div>
                   <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">-0%</span>
                </div>
                <div>
                   <h2 className={`text-3xl font-bold ${textTitle} mb-1`}>{formatCurrency(totalExpense / 30)}</h2>
                   <h4 className={`text-sm font-medium ${textSub}`}>Média Diária</h4>
                </div>
            </div>
        </div>

        {/* Gráfico de Despesas e Categorias - Donut Style (Hospitally) */}
        <div className={`${bgCard} rounded-[1.5rem] border ${borderClass} shadow-sm p-6 mb-8 md:mb-12`}>
           <div className="flex justify-between items-center mb-6">
              <h3 className={`text-base font-bold ${textTitle}`}>Top Despesas</h3>
           </div>
           
           <div className="flex flex-col items-center justify-center w-full">
              {/* Chart */}
              <div className="w-full h-[250px] md:h-[300px] mb-6">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={expenseSummary.map(([name, data]) => ({ name, value: data.total }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={75}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                       >
                          {expenseSummary.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{borderRadius: '1rem', background: isBusiness ? '#1a1a1a' : '#fff', border: `1px solid ${isBusiness ? '#333' : '#E5E7EB'}`, color: isBusiness ? '#fff' : '#111827', fontWeight: 600}} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>

              {/* Legend List (Horizontal) */}
              <div className="w-full flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
                 {expenseSummary.length > 0 ? expenseSummary.map(([name, data], idx) => {
                    const percentage = totalExpense > 0 ? ((data.total / totalExpense) * 100).toFixed(1) : '0.0';
                    return (
                       <div key={name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                          <span className={`text-sm font-medium ${textSub}`}>{name} <span className="font-semibold text-gray-400 ml-1">({percentage}%)</span></span>
                       </div>
                    );
                 }) : (
                    <div className="text-center py-4 w-full text-gray-500">
                       <Info className="w-6 h-6 mx-auto mb-2 opacity-50" />
                       <p className="text-xs font-medium">Sem registros de gastos</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Gráficos Detalhados e Transações Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Area Chart - Col Span 8 */}
            <div className={`lg:col-span-8 ${bgCard} rounded-[1.5rem] border ${borderClass} shadow-sm p-6 flex flex-col`}>
               <div className="flex justify-between items-center mb-8">
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${textTitle}`}>Fluxo de Caixa</h4>
               </div>
               <div className="h-[300px] md:h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                           <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isBusiness ? "#333" : "#F3F4F6"} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} width={60} tickFormatter={(val) => `R$ ${val/1000}k`} />
                        <Tooltip 
                            contentStyle={{backgroundColor: isBusiness ? '#1a1a1a' : '#fff', borderRadius: '1rem', border: `1px solid ${isBusiness ? '#333' : '#E5E7EB'}`, color: isBusiness ? '#fff' : '#111827'}} 
                        />
                        <Area type="monotone" dataKey="receitas" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#greenGradient)" activeDot={{r: 6, fill: '#10B981', strokeWidth: 0}} />
                        <Area type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={2.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#redGradient)" activeDot={{r: 6, fill: '#EF4444', strokeWidth: 0}} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Transações Recentes - Col Span 4 */}
            <div className={`lg:col-span-4 ${bgCard} rounded-[1.5rem] border ${borderClass} shadow-sm p-6 flex flex-col`}>
               <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${textTitle}`}>Transações</h3>
               </div>
               <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[350px]">
                  {recentTransactions.map(t => (
                     <div key={t.id} className={`flex justify-between items-center p-3 rounded-xl border ${borderClass} ${bgSubCard}`}>
                        <div className="flex items-center gap-3 min-w-0">
                           <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5">
                              {t.type === 'INCOME' ? <TrendingUp className="w-4 h-4 text-emerald-500"/> : <TrendingDown className="w-4 h-4 text-red-500"/>}
                           </div>
                           <div className="min-w-0">
                              <p className={`font-bold text-xs truncate ${textTitle}`}>{t.description}</p>
                              <p className={`text-[10px] ${textSub} truncate`}>{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                           </div>
                        </div>
                        <div className={`font-bold text-sm shrink-0 pl-2 ${t.type === 'INCOME' ? 'text-emerald-500' : textTitle}`}>
                           {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(Number(t.amount))}
                        </div>
                     </div>
                  ))}
                  {recentTransactions.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-center">Sem Registros</p>
                     </div>
                  )}
               </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
