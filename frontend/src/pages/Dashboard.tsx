import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  ArrowUp, ArrowDown, Bell, Plus, Minus, Mic, MessageCircle, FileText, Download,
  ShoppingCart, Car, Target, TrendingUp, TrendingDown, Info, ChevronDown, Activity, 
  Settings, CheckCircle, Briefcase, FileSignature, Wallet, DollarSign, Layers, X
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Cores para o gráfico de rosca (Top Despesas)
const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#8b5cf6', '#14b8a6', '#64748b'];

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [market, setMarket] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedType, setSelectedType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);

  const openNewTransaction = (type: 'INCOME'|'EXPENSE') => {
      setDescription('');
      setAmount('');
      setSelectedType(type);
      setTxDate(new Date().toISOString().split('T')[0]);
      setIsModalOpen(true);
  };

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const activeId = localStorage.getItem('activeProfileId');
      const res = await fetch(`https://alfred-backend-8t7n.onrender.com/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          description, 
          amount: selectedType === 'EXPENSE' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)), 
          type: selectedType, 
          date: new Date(txDate).toISOString(),
          profileId: activeId
        })
      });
      if(res.ok) {
        setIsModalOpen(false);
        toast.success("Lançamento Concluído!");
        fetchData();
      } else {
        toast.error("Erro ao salvar.");
      }
    } catch (e) {
      toast.error("Erro na conexão");
    }
  };

  const handleExportCSV = () => {
     if(transactions.length === 0) {
        toast.error('Nenhum dado para exportar.');
        return;
     }
     const headers = ["Data", "Descricao", "Tipo", "Valor"];
     const csvContent = [
        headers.join(","),
        ...transactions.map(t => [
           new Date(t.date).toLocaleDateString(userLocale),
           `"${t.description}"`,
           t.type === 'INCOME' ? 'Receita' : 'Despesa',
           t.amount
        ].join(","))
     ].join("\n");
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const link = document.createElement("a");
     const url = URL.createObjectURL(blob);
     link.setAttribute("href", url);
     link.setAttribute("download", `extrato_alfred_${new Date().toISOString().split('T')[0]}.csv`);
     link.style.visibility = 'hidden';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const activeId = localStorage.getItem('activeProfileId');
      if (activeId) {
        // Optimistic Load from Cache (SWR Pattern)
        const cachedTx = sessionStorage.getItem(`tx_${activeId}`);
        const cachedGoals = sessionStorage.getItem(`goals_${activeId}`);
        const cachedVehicles = sessionStorage.getItem(`vehicles_${activeId}`);
        const cachedMarket = sessionStorage.getItem(`market_${activeId}`);
        
        if (cachedTx) setTransactions(JSON.parse(cachedTx));
        if (cachedGoals) setGoals(JSON.parse(cachedGoals));
        if (cachedVehicles) setVehicles(JSON.parse(cachedVehicles));
        if (cachedMarket) setMarket(JSON.parse(cachedMarket));
        
        if (cachedTx) setLoading(false);
        else setLoading(true);

        const headers = { Authorization: `Bearer ${token}` };
        const [txRes, goalsRes, vehiclesRes, marketRes] = await Promise.all([
           fetch(`https://alfred-backend-8t7n.onrender.com/api/transactions?profileId=${activeId}&_t=${Date.now()}`, { headers }),
           fetch(`https://alfred-backend-8t7n.onrender.com/api/goals?profileId=${activeId}`, { headers }),
           fetch(`https://alfred-backend-8t7n.onrender.com/api/vehicles?profileId=${activeId}`, { headers }),
           fetch(`https://alfred-backend-8t7n.onrender.com/api/market?profileId=${activeId}`, { headers }),
        ]);
        
        if (txRes.ok) { 
           const d = await txRes.json(); 
           const validData = Array.isArray(d) ? d : [];
           setTransactions(validData); 
           sessionStorage.setItem(`tx_${activeId}`, JSON.stringify(validData));
        }
        if (goalsRes.ok) { 
           const d = await goalsRes.json(); 
           const validData = Array.isArray(d) ? d : [];
           setGoals(validData); 
           sessionStorage.setItem(`goals_${activeId}`, JSON.stringify(validData));
        }
        if (vehiclesRes.ok) { 
           const d = await vehiclesRes.json(); 
           const validData = Array.isArray(d) ? d : [];
           setVehicles(validData); 
           sessionStorage.setItem(`vehicles_${activeId}`, JSON.stringify(validData));
        }
        if (marketRes.ok) { 
           const d = await marketRes.json(); 
           const validData = Array.isArray(d) ? d : [];
           setMarket(validData); 
           sessionStorage.setItem(`market_${activeId}`, JSON.stringify(validData));
        }
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const [profileMode, setProfileMode] = useState<'personal' | 'business'>(() => {
    return (localStorage.getItem('profileMode') as 'personal' | 'business') || 'personal';
  });

  const userName = localStorage.getItem('userName') || 'Mestre';
  const [userCurrency, setUserCurrency] = useState(localStorage.getItem('userCurrency') || 'R$');
  const userLocale = 'es-MX'; // Force Latin American Spanish formatting
  const avatarUrl = localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${userName}&background=0D8ABC&color=fff&rounded=true`;

  useEffect(() => {
    fetchData();

    const handleStorageChange = () => {
      const mode = localStorage.getItem('profileMode') as 'personal' | 'business';
      if (mode) setProfileMode(mode);
    };
    const handleCurrencyChange = () => {
      setUserCurrency(localStorage.getItem('userCurrency') || 'R$');
    };
    window.addEventListener('profileModeChanged', handleStorageChange);
    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => {
      window.removeEventListener('profileModeChanged', handleStorageChange);
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, [profileMode]);

  const toggleProfile = (mode: 'personal' | 'business') => {
     if(profileMode === mode) return;
     setProfileMode(mode);
     localStorage.setItem('profileMode', mode);
     const activeId = mode === 'business' ? localStorage.getItem('businessProfileId') : localStorage.getItem('personalProfileId');
     if (activeId) {
        localStorage.setItem('activeProfileId', activeId);
     }
     window.dispatchEvent(new Event('profileModeChanged'));
  };

  const formatMoney = (val: number) => `${userCurrency} ${Math.abs(val).toLocaleString(userLocale, { minimumFractionDigits: 2 })}`;
  const isBusiness = profileMode === 'business';

  // ---- CÁLCULOS DINÂMICOS GERAIS ----
  const now = new Date();
  
  // Transações Realizadas (passado/presente ou status PAID/REALIZED)
  const realizedTx = transactions.filter(t => {
     if (t.status) return t.status !== 'PENDING';
     return new Date(t.date) <= now;
  });

  // Transações Pendentes (Futuro ou status PENDING)
  const pendingTx = transactions.filter(t => {
     if (t.status) return t.status === 'PENDING';
     return new Date(t.date) > now;
  });

  const incomes = realizedTx.filter(t => t.type === 'INCOME');
  const expenses = realizedTx.filter(t => t.type === 'EXPENSE');
  
  const totalIncome = incomes.reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = Math.abs(expenses.reduce((acc, t) => acc + Number(t.amount), 0));
  const balance = totalIncome - totalExpense;

  // ---- CÁLCULOS ESPECÍFICOS PESSOAL ----
  const savings = balance > 0 ? balance : 0;
  const savingsGoalProgress = totalIncome > 0 ? Math.min(100, Math.round((savings / (totalIncome * 0.2)) * 100)) : 0;

  const personalChartData = useMemo(() => {
    const data: Record<string, { name: string, Receitas: number, Despesas: number }> = {};
    realizedTx.forEach(t => {
      const date = new Date(t.date);
      const day = date.toLocaleDateString(userLocale, { day: '2-digit', month: '2-digit' });
      if (!data[day]) data[day] = { name: day, Receitas: 0, Despesas: 0 };
      if (t.type === 'INCOME') data[day].Receitas += Number(t.amount);
      else data[day].Despesas += Math.abs(Number(t.amount));
    });
    return Object.values(data).sort((a:any, b:any) => a.name.localeCompare(b.name)).slice(-14);
  }, [realizedTx, userLocale]);

  // ---- CÁLCULOS ESPECÍFICOS EMPRESARIAL (DRE & CONTAS) ----
  
  // Contas a Receber/Pagar
  const billsToReceive = pendingTx.filter(t => t.type === 'INCOME');
  const billsToPay = pendingTx.filter(t => t.type === 'EXPENSE');
  
  const totalToReceive = billsToReceive.reduce((acc, t) => acc + Number(t.amount), 0);
  const totalToPay = Math.abs(billsToPay.reduce((acc, t) => acc + Number(t.amount), 0));

  // DRE Inteligente
  const dre = useMemo(() => {
     let deducoes = 0;
     let custos = 0;
     let despesasOps = 0;

     expenses.forEach(t => {
        const cat = (t.category?.name || '').toLowerCase();
        const amt = Math.abs(Number(t.amount));
        if (cat.includes('imposto') || cat.includes('taxa') || cat.includes('deducao') || cat.includes('devolu')) {
           deducoes += amt;
        } else if (cat.includes('custo') || cat.includes('fornecedor') || cat.includes('estoque') || cat.includes('insumo') || cat.includes('mercadoria') || cat.includes('frete')) {
           custos += amt;
        } else {
           despesasOps += amt;
        }
     });

     const receitaLiquida = totalIncome - deducoes;
     const lucroBruto = receitaLiquida - custos;
     const lucroLiquido = lucroBruto - despesasOps;
     const margem = totalIncome > 0 ? (lucroLiquido / totalIncome) * 100 : 0;

     return { receitaBruta: totalIncome, deducoes, receitaLiquida, custos, despesasOps, lucroBruto, lucroLiquido, margem };
  }, [expenses, totalIncome]);

  // Top Despesas (Pie Chart)
  const topExpensesData = useMemo(() => {
      const groups: Record<string, number> = {};
      expenses.forEach(t => {
         const cat = t.category?.name || 'Outros';
         groups[cat] = (groups[cat] || 0) + Math.abs(Number(t.amount));
      });
      const sorted = Object.entries(groups).sort((a,b)=>b[1]-a[1]);
      const top = sorted.slice(0, 4).map(([name, value]) => ({ name, value }));
      const others = sorted.slice(4).reduce((acc, [, val]) => acc + val, 0);
      if(others > 0) top.push({ name: 'Outros', value: others });
      return top;
  }, [expenses]);

  // Gráfico Empresarial (3 linhas: Entradas, Saídas, Saldo Acumulado)
  const businessChartData = useMemo(() => {
     const data: Record<string, { dateObj: Date, name: string, Entradas: number, Saidas: number, Saldo: number }> = {};
     realizedTx.forEach(t => {
       const d = new Date(t.date);
       const day = d.toLocaleDateString(userLocale, { day: '2-digit', month: '2-digit' });
       if (!data[day]) data[day] = { dateObj: d, name: day, Entradas: 0, Saidas: 0, Saldo: 0 };
       if (t.type === 'INCOME') data[day].Entradas += Number(t.amount);
       else data[day].Saidas += Math.abs(Number(t.amount));
     });
     const sortedList = Object.values(data).sort((a,b) => a.dateObj.getTime() - b.dateObj.getTime()).slice(-14);
     
     let accumulated = 0; // Ideally should start from previous balance, assuming 0 for sparkline scale
     sortedList.forEach(item => {
        accumulated += (item.Entradas - item.Saidas);
        item.Saldo = accumulated;
     });
     return sortedList;
  }, [realizedTx, userLocale]);


  const recentTx = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  // IA Simples Baseada em Regras
  const renderInsights = () => {
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
         insights.push({ icon: CheckCircle, text: `Tudo tranquilo por aqui. Continue registrando seus lançamentos.`, color: 'text-blue-500', bg: 'bg-blue-50' });
      }
      return insights;
  };

  // ----------------------------------------------------
  // SKELETON LOADING
  // ----------------------------------------------------
  if (loading) {
     return (
        <Layout>
           <div className="animate-pulse flex flex-col gap-8 pb-20">
              <div className="h-12 bg-gray-200 rounded-xl w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-[1.5rem]"></div>)}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded-[1.5rem]"></div>
                 <div className="h-[400px] bg-gray-200 rounded-[1.5rem]"></div>
              </div>
           </div>
        </Layout>
     );
  }

  // ====================================================
  // VIEW: PESSOAL
  // ====================================================
  const renderPersonal = () => (
     <>
        {/* LINHA 1: CARDS DE RESUMO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {/* Saldo Atual */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-[160px]">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-gray-500">Saldo Actual</span>
                    <Info className="w-3 h-3 text-gray-300" />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(balance)}</h2>
                 <p className="text-[11px] font-bold text-green-500 flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3" /> Actualizado <span className="text-gray-400 font-medium">hoy</span>
                 </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
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
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Ingresos del Mes</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(totalIncome)}</h2>
                 <p className="text-xs text-gray-400 font-medium mt-1">{incomes.length} ingresos registrados</p>
              </div>
           </div>

           {/* Despesas */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-red-400 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                 <ArrowDown className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Gastos del Mes</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(totalExpense)}</h2>
                 <p className="text-xs text-gray-400 font-medium mt-1">{expenses.length} gastos registrados</p>
              </div>
           </div>

           {/* Economia */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                 <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Ahorro del Mes</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(savings)}</h2>
              </div>
              <div className="mt-2">
                 <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mb-1">
                    <span>Meta de protección alcanzada: {savingsGoalProgress}%</span>
                 </div>
                 <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${savingsGoalProgress}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* LINHA 2: GRÁFICO E TRANSAÇÕES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-gray-900">Flujo de Caja</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 mr-4">
                       <span className="flex items-center gap-1 text-xs font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-green-500"></div> Ingresos</span>
                       <span className="flex items-center gap-1 text-xs font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-red-500"></div> Gastos</span>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                       Últimos 14 días <ChevronDown className="w-3 h-3" />
                    </button>
                 </div>
              </div>
              <div className="flex-1 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={personalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} tickFormatter={(val) => `${userCurrency} ${val/1000}k`} />
                       <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} labelStyle={{ color: '#64748b', marginBottom: '4px' }} />
                       <Area type="monotone" dataKey="Receitas" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" />
                       <Area type="monotone" dataKey="Despesas" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDes)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black text-gray-900">Últimos Movimientos</h3>
                 <NavLink to="/transactions" className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">Ver todos</NavLink>
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
                                {t.type === 'INCOME' ? '+' : '-'}{formatMoney(Math.abs(Number(t.amount)))}
                             </p>
                             <p className="text-[10px] text-gray-400 font-medium">{new Date(t.date).toLocaleDateString()}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* LINHA 3: RECURSOS PESSOAIS EXCLUSIVOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           
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
                    </div>
                 </div>
              ) : (
                 <p className="text-xs text-gray-400 font-medium">Ninguna meta configurada.</p>
              )}
           </div>

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
                       <p className="text-xs text-gray-500 font-medium mb-1">Melhor: <span className="font-black text-gray-900">{formatMoney(market[0].bestPrice)}</span></p>
                       <p className="text-[10px] text-gray-400 font-medium mb-2">Local: <span className="font-bold text-gray-600">{market[0].establishment}</span></p>
                    </div>
                 </div>
              ) : (
                 <p className="text-xs text-gray-400 font-medium">Ningún producto monitoreado.</p>
              )}
           </div>

           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-sm font-black text-gray-900">Garagem Alfred</h4>
                 <NavLink to="/veiculos" className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Detalhes</NavLink>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Car className="w-6 h-6 text-gray-400" />
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm mb-1">Vehículo Principal</p>
                    <p className="text-xs text-gray-500 font-medium mb-1">Total: <span className="font-black text-gray-900">{formatMoney(vehicles.reduce((a,b)=>a+b.amount,0))}</span></p>
                    <div className="flex gap-2 mt-2">
                       <div className="w-6 h-6 bg-gray-50 rounded border border-gray-200 flex items-center justify-center"><Activity className="w-3 h-3 text-gray-500" /></div>
                       <div className="w-6 h-6 bg-gray-50 rounded border border-gray-200 flex items-center justify-center"><Settings className="w-3 h-3 text-gray-500" /></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-sm font-black text-gray-900">Resumen de IA</h4>
                 <button className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Ver todos</button>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                 {renderInsights().slice(0,3).map((insight, idx) => {
                    const Icon = insight.icon;
                    return (
                       <div key={idx} className="flex gap-3">
                          <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${insight.bg}`}>
                             <Icon className={`w-3 h-3 ${insight.color}`} />
                          </div>
                          <p className="text-[10px] text-gray-600 font-medium leading-relaxed">{insight.text}</p>
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>
     </>
  );

  // ====================================================
  // VIEW: EMPRESARIAL
  // ====================================================
  const renderBusiness = () => (
     <>
        {/* LINHA 1: CARDS CORPORATIVOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {/* Faturamento Bruto */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                 <ArrowUp className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Facturación Bruta</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(dre.receitaBruta)}</h2>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
                 <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-green-500" fill="currentColor">
                    <path d="M0,30 L0,15 Q10,5 20,15 T40,15 T60,10 T80,20 T100,5 L100,30 Z" />
                 </svg>
              </div>
           </div>

           {/* Despesas Operacionais */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                 <ArrowDown className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Gastos Operativos</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(dre.despesasOps)}</h2>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
                 <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-red-500" fill="currentColor">
                    <path d="M0,15 L10,15 L20,25 L30,15 L40,15 L50,15 L60,10 L70,20 L80,5 L100,20 L100,30 L0,30 Z" />
                 </svg>
              </div>
           </div>

           {/* Lucro Líquido */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                 <ArrowUp className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Utilidad Neta</span>
                 <h2 className="text-2xl font-black text-gray-900">{formatMoney(dre.lucroLiquido)}</h2>
              </div>
              <p className="text-[11px] font-bold text-green-500 flex items-center gap-1 mt-1">
                 <ArrowUp className="w-3 h-3" /> Generado de operaciones
              </p>
           </div>

           {/* Margem de Lucro */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[160px] relative">
              <div className="absolute top-6 right-6 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                 <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="text-sm font-bold text-gray-500 mb-2 block">Margen de Utilidad</span>
                 <h2 className="text-2xl font-black text-gray-900">{dre.margem.toFixed(2)}%</h2>
              </div>
              <div className="mt-2">
                 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, dre.margem))}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* LINHA 2: FLUXO DE CAIXA EMPRESARIAL & CONTAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           {/* Fluxo de Caixa Empresarial */}
           <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-gray-900">Flujo de Caja Empresarial</h3>
                 <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 mr-4">
                       <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-green-500"></div> Ingresos</span>
                       <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-red-500"></div> Gastos</span>
                       <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Saldo</span>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                       Últimos 14 días <ChevronDown className="w-3 h-3" />
                    </button>
                 </div>
              </div>
              <div className="flex-1 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={businessChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} tickFormatter={(val) => `${userCurrency} ${val/1000}k`} />
                       <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                       <Line type="monotone" dataKey="Entradas" stroke="#22c55e" strokeWidth={3} dot={false} />
                       <Line type="monotone" dataKey="Saidas" stroke="#ef4444" strokeWidth={3} dot={false} />
                       <Line type="monotone" dataKey="Saldo" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Contas a Receber e Pagar */}
           <div className="flex flex-col gap-6">
              <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex-1">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-sm font-black text-gray-900">Cuentas por Cobrar</h3>
                       <p className="text-[11px] text-gray-500 font-medium">Total por cobrar (Proyectado)</p>
                    </div>
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">{billsToReceive.length} títulos</span>
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 mb-4">{formatMoney(totalToReceive)}</h2>
                 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '45%' }}></div>
                 </div>
                 <p className="text-[10px] text-gray-400 font-medium text-right">Vencimiento en próximos 7 días</p>
              </div>

              <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex-1">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-sm font-black text-gray-900">Cuentas por Pagar</h3>
                       <p className="text-[11px] text-gray-500 font-medium">Total por pagar (Pendiente)</p>
                    </div>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">{billsToPay.length} títulos</span>
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 mb-4">{formatMoney(totalToPay)}</h2>
                 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '70%' }}></div>
                 </div>
                 <p className="text-[10px] text-gray-400 font-medium text-right">Vencimiento en próximos 7 días</p>
              </div>
           </div>
        </div>

        {/* LINHA 3: DRE, TOP DESPESAS, ULTIMAS TRANSAÇÕES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
           
           {/* DRE Inteligente */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-sm font-black text-gray-900">ER Resumido</h4>
                 <NavLink to="/reports" className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Ver completo</NavLink>
              </div>
              <div className="space-y-3 flex-1 text-sm">
                 <div className="flex justify-between"><span className="text-gray-500 font-medium">Ingresos Brutos</span><span className="font-bold text-gray-900">{formatMoney(dre.receitaBruta)}</span></div>
                 <div className="flex justify-between"><span className="text-gray-400">(-) Deducciones/Impuestos</span><span className="text-red-500">-{formatMoney(dre.deducoes)}</span></div>
                 <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-gray-700 font-bold">Ingresos Netos</span><span className="font-bold text-gray-900">{formatMoney(dre.receitaLiquida)}</span></div>
                 <div className="flex justify-between"><span className="text-gray-400">(-) Costos/Productos</span><span className="text-red-500">-{formatMoney(dre.custos)}</span></div>
                 <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-gray-700 font-bold">Utilidad Bruta</span><span className="font-bold text-gray-900">{formatMoney(dre.lucroBruto)}</span></div>
                 <div className="flex justify-between"><span className="text-gray-400">(-) Gastos Ops.</span><span className="text-red-500">-{formatMoney(dre.despesasOps)}</span></div>
                 <div className="flex justify-between pt-3 mt-1 border-t-2 border-gray-100"><span className="text-gray-900 font-black">UTILIDAD NETA</span><span className="font-black text-green-600">{formatMoney(dre.lucroLiquido)}</span></div>
              </div>
           </div>

           {/* Top Despesas */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-md transition-shadow relative">
              <div className="w-full flex justify-between items-center mb-2">
                 <h4 className="text-sm font-black text-gray-900">Top Gastos</h4>
              </div>
              {topExpensesData.length > 0 ? (
                 <>
                    <div className="h-40 w-full mb-4">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie data={topExpensesData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                                {topExpensesData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                             </Pie>
                             <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                          </PieChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-2 overflow-y-auto max-h-24 pr-1">
                       {topExpensesData.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div><span className="font-medium text-gray-600 truncate max-w-[90px]">{item.name}</span></div>
                             <div className="flex items-center gap-2"><span className="text-gray-400">{((item.value/totalExpense)*100).toFixed(0)}%</span><span className="font-bold text-gray-900">{formatMoney(item.value)}</span></div>
                          </div>
                       ))}
                    </div>
                 </>
              ) : (
                 <div className="flex-1 flex items-center justify-center text-sm font-medium text-gray-400">Sem dados suficientes.</div>
              )}
           </div>

           {/* Últimas Movimentações Empresariais */}
           <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-sm font-black text-gray-900">Movimentações</h4>
                 <NavLink to="/transactions" className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Ver todas</NavLink>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                 {recentTx.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm font-medium mt-6">Nenhum registro.</div>
                 ) : (
                    recentTx.slice(0,5).map(t => (
                       <div key={t.id} className="flex justify-between items-center text-[11px]">
                          <div className="flex items-center gap-3">
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                {t.type === 'INCOME' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                             </div>
                             <div>
                                <p className="font-bold text-gray-900 truncate max-w-[100px]">{t.description}</p>
                                <p className="text-gray-500">{t.type === 'INCOME' ? 'Receita' : 'Despesa'}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className={`font-black ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                                {t.type === 'INCOME' ? '' : '-'}{formatMoney(Math.abs(Number(t.amount)))}
                             </p>
                             <p className="text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

        </div>
     </>
  );

  return (
    <Layout>
      <div className="animate-in fade-in duration-500 font-sans pb-20">
        
        {/* CABEÇALHO COMPARTILHADO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                 ¡Hola, {userName}! <span className="text-2xl">👋</span>
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Tu mayordomo financiero está organizando tus finanzas.</p>
           </div>

           <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-gray-100 shadow-sm">
              <div className="flex items-center bg-gray-50 rounded-full px-1 py-1 mr-2 border border-gray-100">
                 <button 
                    onClick={() => toggleProfile('personal')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${!isBusiness ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                 >
                    Personal
                 </button>
                 <button 
                    onClick={() => toggleProfile('business')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${isBusiness ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                 >
                    Empresa
                 </button>
              </div>

              <div className="relative">
                 <button onClick={() => {setShowNotifications(!showNotifications); setShowProfileMenu(false);}} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                 </button>
                 {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 overflow-hidden">
                       <div className="p-3 border-b border-gray-50 font-bold text-sm text-gray-800">Notificaciones</div>
                       <div className="p-3 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer">
                          <p className="font-semibold text-gray-800">Factura Vencida</p>
                          <p>Tu factura de luz vence hoy.</p>
                       </div>
                       <div className="p-3 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer border-t border-gray-50">
                          <p className="font-semibold text-gray-800">Meta Alcanzada</p>
                          <p>¡Alcanzaste tu meta de ahorro!</p>
                       </div>
                    </div>
                 )}
              </div>

              <div className="relative">
                 <img onClick={() => {setShowProfileMenu(!showProfileMenu); setShowNotifications(false);}} src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity" />
                 {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 overflow-hidden">
                       <div className="p-3 border-b border-gray-50">
                          <p className="font-bold text-sm text-gray-800">{userName}</p>
                          <p className="text-[10px] text-gray-500">Plan Premium</p>
                       </div>
                       <button onClick={() => navigate('/settings')} className="w-full text-left p-3 text-xs text-gray-600 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <Settings className="w-4 h-4"/> Configuración
                       </button>
                       <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full text-left p-3 text-xs text-red-600 font-semibold hover:bg-red-50 transition-colors border-t border-gray-50 flex items-center gap-2">
                          <LogOut className="w-4 h-4"/> Cerrar Sesión
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* RENDERIZAÇÃO CONDICIONAL */}
        {isBusiness ? renderBusiness() : renderPersonal()}

        {/* RODAPÉ COMPARTILHADO: AÇÕES RÁPIDAS */}
        <div className="pt-4 border-t border-gray-100">
           <h4 className="text-sm font-black text-gray-900 mb-4">Acciones Rápidas</h4>
           <div className="flex flex-wrap gap-3">
              <button onClick={() => openNewTransaction('INCOME')} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                 <Plus className="w-4 h-4" /> Nuevo Ingreso
              </button>
              <button onClick={() => openNewTransaction('EXPENSE')} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold border border-red-100 hover:bg-red-100 transition-colors">
                 <Minus className="w-4 h-4" /> Nuevo Gasto
              </button>
              <button onClick={() => navigate('/bot')} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors">
                 <Mic className="w-4 h-4" /> Enviar Audio
              </button>
              <button onClick={() => window.open('https://wa.me/5511999999999?text=Hola%20Alfred!', '_blank')} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm shadow-green-500/20">
                 <MessageCircle className="w-4 h-4" /> Abrir WhatsApp
              </button>
              <button onClick={() => navigate('/reports')} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-100 transition-colors">
                 <FileText className="w-4 h-4" /> Generar Reporte
              </button>
              <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-100 transition-colors">
                 <Download className="w-4 h-4" /> Exportar CSV
              </button>
           </div>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4 fade-in font-sans">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 p-10">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nuevo Lanzamiento</h2>
               <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><X className="text-slate-400 w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleCreateTx} className="space-y-6">
              <div className="flex gap-4 p-2 bg-slate-50 rounded-[2rem]">
                 <button type="button" onClick={() => setSelectedType('INCOME')} className={`flex-1 py-4 rounded-[1.8rem] text-xs font-black uppercase transition-all ${selectedType === 'INCOME' ? 'bg-white text-green-600 shadow-md transform scale-105' : 'text-slate-400'}`}>Ingreso</button>
                 <button type="button" onClick={() => setSelectedType('EXPENSE')} className={`flex-1 py-4 rounded-[1.8rem] text-xs font-black uppercase transition-all ${selectedType === 'EXPENSE' ? 'bg-white text-red-600 shadow-md transform scale-105' : 'text-slate-400'}`}>Gasto</button>
              </div>

              <input required value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-blue-500 outline-none transition-all shadow-inner" placeholder="Especifique el ingreso o gasto" />
              <input required value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-blue-500 outline-none transition-all shadow-inner" placeholder={`${userCurrency} 0.00`} />
              <input required value={txDate} onChange={(e) => setTxDate(e.target.value)} type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-xs font-black outline-none transition-all shadow-inner" />

              <button type="submit" className="w-full bg-slate-900 text-white font-black py-6 rounded-[3rem] shadow-xl hover:bg-black transition-all active:scale-95 text-lg uppercase tracking-tight">
                Registrar Lanzamiento 🏛️
              </button>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
}
