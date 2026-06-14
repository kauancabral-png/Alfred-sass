import toast from 'react-hot-toast';
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Settings, 
  Lock, 
  Info,
  ChevronDown,
  LayoutDashboard,
  Filter,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  MessageCircle,
  Download,
  Share2,
  Calendar,
  Clock,
  User,
  Building,
  Wallet,
  CreditCard,
  ArrowRightLeft,
  FileText,
  Target,
  BarChart2,
  PieChart as PieChartIcon,
  Layers,
  ShoppingCart,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Car,
  Briefcase
} from 'lucide-react';

const safeGet = (key: string) => { try { return localStorage.getItem(key); } catch (e) { return null; } };
const safeSet = (key: string, val: string) => { try { localStorage.setItem(key, val); } catch (e) { } };

export default function Dashboard() {
  const [profileMode, setProfileMode] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [userCurrency, setUserCurrency] = useState('$');
  const [userLocale, setUserLocale] = useState('es-MX');
  const [userName, setUserName] = useState('');
  const [dateRange, setDateRange] = useState('Tudo');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [apiUrl, setApiUrl] = useState('https://alfred-backend-8t7n.onrender.com/api');

  const [personalProfileId, setPersonalProfileId] = useState<string | null>(null);
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(safeGet('userName') || 'Mestre');
    setUserCurrency(safeGet('userCurrency') || '$');
    setUserLocale(safeGet('userLocale') || 'es-MX');
    
    // Auto-detección de URL para evitar errores de Hardcode
    if (window.location.origin.includes('onrender.com')) {
        // Se estamos no domínio da Render, apontamos para ele
        setApiUrl(window.location.origin + '/api');
    }
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = safeGet('token');
        if (!token) { navigate('/login'); return; }
        const res = await fetch(`${apiUrl}/auth/me?cache=${Date.now()}`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.status === 403) { setIsBlocked(true); setLoading(false); return; }
        if (res.ok) {
           const data = await res.json();
           const profiles = data.profiles || [];
           const personal = profiles.find((p: any) => p.type === 'PERSONAL');
           const business = profiles.find((p: any) => p.type === 'BUSINESS');
           
           if (personal) setPersonalProfileId(personal.id);
           if (business) setBusinessProfileId(business.id);
           
           const savedMode = safeGet('profileMode') || 'PERSONAL';
           setProfileMode(savedMode as any);
           const activeId = savedMode === 'PERSONAL' ? personal?.id : business?.id;
           setCurrentProfileId(activeId || profiles[0]?.id || null);
        }
      } catch (e) { console.error(e); }
    };
    fetchProfiles();
  }, [apiUrl]);

  // ✅ NOVO: SINCRONIZADOR DE PERFIL ATIVO 🕵️‍♂️🎩
  useEffect(() => {
    const activeId = profileMode === 'PERSONAL' ? personalProfileId : businessProfileId;
    if (activeId) {
        setCurrentProfileId(activeId);
        safeSet('activeProfileId', activeId);
        toast.success(`Modo ${profileMode === 'PERSONAL' ? 'Personal' : 'Empresarial'} Ativado`, {
            style: { borderRadius: '2rem', background: '#000', color: '#fff', fontWeight: 'bold' }
        });
    }
  }, [profileMode, personalProfileId, businessProfileId]);

  const fetchTransactions = async () => {
    if (!currentProfileId) {
        console.warn("⚠️ [DASHBOARD]: currentProfileId é NULL. Aguardando perfis...");
        return;
    }
    try {
      const token = safeGet('token');
      // Adicionamos cb para matar cache em qualquer nível (Vercel/Browser/Cloudflare)
      const res = await fetch(`${apiUrl}/transactions?profileId=${currentProfileId}&limit=1000&cb=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 403) { setIsBlocked(true); return; }
        if (res.ok) {
          const data = await res.json();
          console.log(`📡 [SYNC]: ${data.length} transações recebidas de ${apiUrl}`);
          setTransactions(data);
          applyFilter(data, dateRange);
        }
      } catch (e) { 
          console.error("🔥 [FETCH FATAL]: Verifique a conexão com o servidor Railway", e);
      } finally { setLoading(false); }
    };
  
    const fetchCategories = async () => {
      try {
        const token = safeGet('token');
        const res = await fetch(`${apiUrl}/categories?profileId=${currentProfileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setCategories(await res.json());
      } catch (e) { console.error(e); }
    };
  
    const updateTransaction = async (id: string, data: any) => {
        try {
            const token = safeGet('token');
            const res = await fetch(`${apiUrl}/transactions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                toast.success('Transação Atualizada!');
                setEditingTxId(null);
                fetchTransactions();
            }
        } catch (e) { toast.error('Erro ao atualizar'); }
    };

  const applyFilter = (data: any[], range: string) => {
    const now = new Date();
    // Normalização para comparar apenas datas (ignora horas)
    const todayStr = now.toLocaleDateString(); 
    
    let filtered = [...data];
    if (range === 'Hoy') {
      filtered = data.filter(t => {
          const tDate = new Date(t.date);
          // Se a transação for de Hoy ou de "Amanhã" no UTC (que é hoje no Brasil), inclui.
          return tDate.toLocaleDateString() === todayStr || Math.abs(tDate.getTime() - now.getTime()) < 24 * 60 * 60 * 1000;
      });
    } else if (range === 'Últimos 7 días') {
      const week = new Date(); week.setDate(now.getDate() - 7);
      filtered = data.filter(t => new Date(t.date) >= week);
    } else if (range === 'Últimos 30 días') {
      const month = new Date(); month.setDate(now.getDate() - 30);
      filtered = data.filter(t => new Date(t.date) >= month);
    } else {
        // MODO "TUDO" - MOSTRAR TUDO SEM FILTROS DE DATA 🕵️‍♂️🎩
        filtered = [...data];
    }
    
    setFilteredTransactions(filtered);
    setDateRange(range);
    setShowDateFilter(false);
  };

  useEffect(() => {
    if (currentProfileId) {
        fetchTransactions();
        fetchCategories();
        const timer = setInterval(fetchTransactions, 10000); // 🔁 REFRESH FAST 10s
        return () => clearInterval(timer);
    }
  }, [currentProfileId, dateRange]);

  const incomes = useMemo(() => filteredTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0), [filteredTransactions]);
  const expenses = useMemo(() => filteredTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Math.abs(t.amount), 0), [filteredTransactions]);
  const totalBalance = useMemo(() => incomes - expenses, [incomes, expenses]);

  // CATEGORIA SUMMARY 📊
  const categorySummary = useMemo(() => {
     const cats: Record<string, { total: number, count: number, type: string }> = {};
     filteredTransactions.forEach(t => {
        const name = t.category?.name || 'Geral';
        if (!cats[name]) cats[name] = { total: 0, count: 0, type: t.type };
        cats[name].total += Math.abs(t.amount);
        cats[name].count++;
     });
     return Object.entries(cats).sort((a,b) => b[1].total - a[1].total);
  }, [filteredTransactions]);

  const expenseSummary = useMemo(() => {
     const cats: Record<string, { total: number, count: number }> = {};
     filteredTransactions.filter(t => t.type === 'EXPENSE').forEach(t => {
        const name = t.category?.name || 'Outros';
        if (!cats[name]) cats[name] = { total: 0, count: 0 };
        cats[name].total += Math.abs(t.amount);
        cats[name].count++;
     });
     return Object.entries(cats).sort((a,b) => b[1].total - a[1].total);
  }, [filteredTransactions]);

  const totalExpenseSum = useMemo(() => expenseSummary.reduce((acc, curr) => acc + curr[1].total, 0), [expenseSummary]);

  const COLORS = ['#e8318e', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#ef4444', '#6366f1'];

  if (!loading && isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-10">
           <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{background: 'var(--danger-bg)', color: 'var(--danger)'}}><Lock className="w-12 h-12" /></div>
           <h2 className="text-4xl font-black mb-4">Assinatura Inativa</h2>
           <p className="font-bold mb-8 italic" style={{color: 'var(--text-muted)'}}>Pague ou regularize seu plano para voltar a usar o Alfred.</p>
           <button onClick={() => window.location.href='/#planos'} className="btn-primary">Ativar Agora</button>
      </div>
    );
  }

  const chartData = useMemo(() => {
     const map = new Map<string, { name: string, receitas: number, despesas: number }>();
     const sorted = [...filteredTransactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
     sorted.forEach(t => {
        const d = new Date(t.date);
        const name = d.toLocaleDateString(userLocale, { day: '2-digit', month: 'short' });
        if (!map.has(name)) map.set(name, { name, receitas: 0, despesas: 0 });
        const item = map.get(name)!;
        if (t.type === 'INCOME') item.receitas += Math.abs(t.amount);
        else item.despesas += Math.abs(t.amount);
     });
     return Array.from(map.values());
  }, [filteredTransactions, userLocale]);

  return (
    <Layout>
      <div className="min-h-screen pb-20 fade-in">
        {/* Header de Gestão Mestre */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6 md:gap-8">
           <div className="w-full flex items-center gap-4">
              <button className="btn-ghost flex items-center justify-center" style={{padding: '8px', borderRadius: '50%', width: '36px', height: '36px'}}><ArrowRightLeft className="w-4 h-4" /></button>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter" style={{color: 'var(--text-primary)'}}>Hello, {userName}</h1>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
             <div className="bg-white px-2 py-2 rounded-[2rem] shadow-sm border-2 border-emerald-500/20 flex items-center hover:border-emerald-500 transition-all group">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><CheckCircle className="w-5 h-5" /></div>
                <span className="text-[10px] font-black text-emerald-600 px-3 uppercase tracking-tighter">Saúde: Excelente</span>
             </div>
             <div className="bg-white px-2 py-2 rounded-[2rem] shadow-sm border-2 border-primary/20 flex items-center hover:border-primary transition-all">
                <span className="text-[10px] font-black text-primary px-3 uppercase tracking-tighter">Moneda:</span>
                <select 
                   onChange={(e) => {
                      const [curr, loc] = e.target.value.split('|');
                      setUserCurrency(curr); setUserLocale(loc);
                      safeSet('userCurrency', curr); safeSet('userLocale', loc);
                   }}
                   value={`${userCurrency}|${userLocale}`}
                   className="bg-transparent text-xs font-black uppercase text-slate-800 outline-none cursor-pointer pr-4"
                >
                   <option value="$|es-MX">$ (Pesos Mexicanos)</option>
                   <option value="R$|pt-BR">R$ (Real BRL)</option>
                   <option value="$|en-US">$ (Dólar USD)</option>
                   <option value="€|es-ES">€ (Euro EUR)</option>
                </select>
             </div>
             <div className="flex gap-2 items-center bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 self-stretch sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
               <button onClick={() => { setProfileMode('PERSONAL'); safeSet('profileMode', 'PERSONAL'); }} className={`flex-1 sm:flex-none text-center flex justify-center items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-[2rem] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${profileMode === 'PERSONAL' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}>Personal</button>
               <button onClick={() => { setProfileMode('BUSINESS'); safeSet('profileMode', 'BUSINESS'); }} className={`flex-1 sm:flex-none text-center flex justify-center items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-[2rem] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${profileMode === 'BUSINESS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Empresa</button>
             </div>
           </div>
        </div>

        {/* Cards Principais - Estilo Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="card-featured card group hover:-translate-y-2 transition-all">
                <h4 className="card-title">Total Balance</h4>
                <div className="flex items-center gap-4 mb-6">
                    <span className="badge badge-neutral">EUR</span>
                    <span className="badge badge-neutral active" style={{background: 'var(--bg-card-2)', color: 'var(--text-primary)'}}>USD</span>
                </div>
                <h2 className="card-value-large mb-4">
                    <span className="currency-symbol">{userCurrency}</span>
                    {totalBalance.toLocaleString(userLocale, { minimumFractionDigits: 2 })}
                </h2>
                
                <div className="balance-pills">
                    <div className="balance-pill">
                       <div className="pill-value">{userCurrency} {(totalBalance * 0.2).toLocaleString(userLocale, {maximumFractionDigits:0})}</div>
                       <div className="pill-label">Visa</div>
                    </div>
                    <div className="pill-connector"></div>
                    <div className="balance-pill active">
                       <div className="pill-value">{userCurrency} {(totalBalance * 0.5).toLocaleString(userLocale, {maximumFractionDigits:0})}</div>
                       <div className="pill-label">Mastercard</div>
                    </div>
                    <div className="pill-connector"></div>
                    <div className="balance-pill">
                       <div className="pill-value">{userCurrency} {(totalBalance * 0.3).toLocaleString(userLocale, {maximumFractionDigits:0})}</div>
                       <div className="pill-label">Savings</div>
                    </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                    <button className="action-btn">Receive Money</button>
                    <button className="action-btn">Send Money</button>
                </div>
            </div>

            <div className="kpi-card group hover:-translate-y-2 transition-all flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                   <div className="kpi-icon"><TrendingUp className="w-5 h-5"/></div>
                   <span className="kpi-variation positive">+4.48%</span>
                </div>
                <div>
                   <h4 className="kpi-label">Entradas</h4>
                   <h2 className="kpi-value mt-2">{userCurrency} {Math.abs(incomes).toLocaleString(userLocale, { minimumFractionDigits: 2 })}</h2>
                </div>
            </div>

            <div className="kpi-card group hover:-translate-y-2 transition-all flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                   <div className="kpi-icon" style={{background: 'var(--danger-bg)', color: 'var(--danger)'}}><TrendingDown className="w-5 h-5"/></div>
                   <span className="kpi-variation negative">-3.12%</span>
                </div>
                <div>
                   <h4 className="kpi-label">Saídas</h4>
                   <h2 className="kpi-value mt-2">{userCurrency} {expenses.toLocaleString(userLocale, { minimumFractionDigits: 2 })}</h2>
                </div>
            </div>

            <div className="kpi-card group hover:-translate-y-2 transition-all flex flex-col justify-between relative overflow-hidden" style={{background: 'var(--gradient-primary)'}}>
                <div className="flex justify-between items-start mb-6">
                   <div className="kpi-icon" style={{background: 'rgba(0,0,0,0.1)', color: 'var(--primary-text)'}}><Target className="w-5 h-5"/></div>
                   <span className="kpi-variation" style={{background: 'rgba(0,0,0,0.1)', color: 'var(--primary-text)'}}>+8.50%</span>
                </div>
                <div>
                   <h4 className="kpi-label" style={{color: 'rgba(0,0,0,0.6)'}}>Média Diária</h4>
                   <h2 className="kpi-value mt-2" style={{color: 'var(--primary-text)'}}>{userCurrency} {(expenses / 30).toLocaleString(userLocale, { minimumFractionDigits: 2 })}</h2>
                </div>
            </div>
        </div>

        {/* Botões de Ações Rápidas (Pedido do Mestre) 🚀 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <button onClick={() => navigate('/mercado')} className="card flex items-center gap-6 hover:-translate-y-1 transition-all group">
              <div className="kpi-icon group-hover:scale-110 transition-transform"><ShoppingCart className="w-6 h-6" /></div>
              <div className="text-left">
                 <h4 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>Supermercado</h4>
                 <p className="kpi-label mt-1">Ver gastos de compras</p>
              </div>
           </button>
           <button onClick={() => navigate('/veiculos')} className="card flex items-center gap-6 hover:-translate-y-1 transition-all group">
              <div className="kpi-icon group-hover:scale-110 transition-transform"><Car className="w-6 h-6" /></div>
              <div className="text-left">
                 <h4 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>Vehículos</h4>
                 <p className="kpi-label mt-1">Gastos con combustible</p>
              </div>
           </button>
           <button onClick={() => navigate('/dividas')} className="card flex items-center gap-6 hover:-translate-y-1 transition-all group">
              <div className="kpi-icon group-hover:scale-110 transition-transform"><AlertTriangle className="w-6 h-6" /></div>
              <div className="text-left">
                 <h4 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>Minhas Deudas</h4>
                 <p className="kpi-label mt-1">Cuentas y Préstamos</p>
              </div>
           </button>
        </div>
        {/* Resumo por Categoria - Estilo Gráfico Foto */}
        <div className="card mb-12 flex-1">
           <div className="mb-10">
              <h3 className="card-title" style={{fontSize: '16px'}}>Despesas por Categoria</h3>
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              {/* Donut Chart */}
              <div className="w-full md:w-1/2 h-[250px] md:h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                          data={expenseSummary.length > 0 ? expenseSummary.map(([name, data]) => ({ name, value: data.total })) : [{name: 'Sem Registros', value: 1}]} 
                          cx="50%" cy="50%" innerRadius={80} outerRadius={115} paddingAngle={4} dataKey="value" stroke="none"
                       >
                          {expenseSummary.length > 0 ? expenseSummary.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />) : <Cell fill="var(--bg-card-2)" />}
                       </Pie>
                       <Tooltip contentStyle={{borderRadius: 'var(--radius)', background: 'var(--bg-card-2)', border: '1px solid var(--border-card)', color: 'var(--text-primary)'}} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-8">
                 {expenseSummary.length > 0 ? expenseSummary.map(([name, data], idx) => {
                    const percentage = totalExpenseSum > 0 ? ((data.total / totalExpenseSum) * 100).toFixed(1) : '0.0';
                    return (
                       <div key={name} className="flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                             <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                             <span className="text-lg font-medium" style={{color: 'var(--text-primary)'}}>{name}</span>
                          </div>
                          <div className="text-right">
                             <p className="text-lg md:text-xl font-bold leading-tight mb-1" style={{color: 'var(--text-primary)'}}>{userCurrency} {data.total.toLocaleString(userLocale, { minimumFractionDigits: 2 })}</p>
                             <span className="text-sm font-medium" style={{color: 'var(--text-muted)'}}>{percentage}%</span>
                          </div>
                       </div>
                    );
                 }) : (
                    <div className="text-center py-10 w-full" style={{color: 'var(--text-muted)'}}>
                       <Info className="w-10 h-10 mx-auto mb-2 opacity-50" />
                       <p className="text-xs font-bold uppercase tracking-widest">Sem registros de gastos</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Gráficos Detalhados e Transações Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 flex-1">
            
            {/* Area Chart - Col Span 8 */}
            <div className="lg:col-span-8 card flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="card-title" style={{fontSize: '16px', marginBottom: 0}}>Flujo de Caja Mensual</h4>
                  <div className="tab-group">
                     <button className="tab-group-btn active">Income</button>
                     <button className="tab-group-btn">Expense</button>
                     <button className="tab-group-btn">Saving</button>
                  </div>
               </div>
               <div className="h-[350px] md:h-[400px] w-full chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                           <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" className="chart-grid-line" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} width={60} />
                        <Tooltip 
                            contentStyle={{backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-pill)', border: 'none', color: 'var(--primary-text)', boxShadow: 'var(--shadow-glow-sm)'}} 
                            itemStyle={{color: 'var(--primary-text)', fontWeight: 800}}
                            labelStyle={{color: 'var(--primary-text)', fontWeight: 700, marginBottom: '4px'}}
                            cursor={{stroke: 'var(--border-active)', strokeWidth: 1, strokeDasharray: '5 5'}} 
                        />
                        <Area type="monotone" dataKey="receitas" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#greenGradient)" activeDot={{r: 6, fill: 'var(--primary)', stroke: 'var(--bg-card)', strokeWidth: 3, filter: 'drop-shadow(0 0 6px rgba(198, 241, 53, 0.6))'}} />
                        <Area type="monotone" dataKey="despesas" stroke="var(--danger)" strokeWidth={2.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#redGradient)" activeDot={{r: 6, fill: 'var(--danger)', stroke: 'var(--bg-card)', strokeWidth: 3}} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Transações Recentes - Col Span 4 */}
            <div className="lg:col-span-4 card flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="card-title" style={{fontSize: '16px', marginBottom: 0}}>Transactions</h3>
                  <button className="header-icon-btn flex justify-center items-center" style={{width: '28px', height: '28px'}}><ArrowUpRight className="w-4 h-4"/></button>
               </div>
               <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y pr-2 space-y-2 max-h-[400px]">
                  {filteredTransactions.slice(0, 15).map(t => (
                     <div key={t.id} className="flex justify-between items-center group hover:bg-[rgba(255,255,255,0.02)] p-3 rounded-xl transition-all border-b border-[rgba(255,255,255,0.04)] last:border-0">
                        <div className="flex items-center gap-4">
                           <div className="transaction-avatar">
                              {t.type === 'INCOME' ? <TrendingUp className="w-4 h-4 text-primary"/> : <TrendingDown className="w-4 h-4 text-danger"/>}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[13px] leading-tight truncate" style={{color: 'var(--text-primary)'}}>{t.description}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] mb-1" style={{color: 'var(--text-muted)'}}>{new Date(t.date).toLocaleDateString(userLocale)}</p>
                           <div className={`font-semibold text-[13px] whitespace-nowrap ${t.type === 'INCOME' ? 'value-positive' : 'value-negative'}`}>
                              {t.type === 'INCOME' ? '+' : '-'} {userCurrency} {Math.abs(t.amount).toLocaleString(userLocale, {minimumFractionDigits: 2})}
                           </div>
                        </div>
                     </div>
                  ))}
                  {filteredTransactions.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-10" style={{color: 'var(--text-muted)'}}>
                        <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-bold uppercase tracking-widest text-center">Sin Registros</p>
                     </div>
                  )}
               </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
