import React from 'react';
import Layout from '../components/Layout';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  CreditCard,
  MessageCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  ArrowRightLeft,
  Apple,
  User,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const COLORS = ['#0284C7', '#16A34A', '#D97706', '#EA580C', '#8B5CF6', '#F59E0B', '#10B981'];
  // Dados estáticos baseados na imagem
  const ritmoData = [
    { day: '1', esteMes: 0, mesPassado: 0 },
    { day: '5', esteMes: 500, mesPassado: 400 },
    { day: '10', esteMes: 700, mesPassado: 600 },
    { day: '15', esteMes: 1500, mesPassado: 1200 },
    { day: '20', esteMes: 3200, mesPassado: 1800 },
    { day: '25', esteMes: 3400, mesPassado: 2000 },
    { day: '31', esteMes: 3400, mesPassado: 2500 },
  ];

  const transacoes = [
    { id: 1, desc: 'Compra débito PAO DE MEL', cat: 'Supermercado', val: '-R$ 25,85', icon: CreditCard },
    { id: 2, desc: 'Pagamento de Pix QR Code ZAPIZI', cat: 'Serviços', val: '-R$ 10,00', icon: ArrowRightLeft },
    { id: 3, desc: 'Pagamento de Pix QR Code ZAPIZI', cat: 'Serviços', val: '-R$ 10,00', icon: ArrowRightLeft },
    { id: 4, desc: 'Compra débito MERCADAO ATACADISTA', cat: 'Supermercado', val: '-R$ 13,98', icon: CreditCard },
    { id: 5, desc: 'Compra débito MERCADAO ATACADISTA', cat: 'Supermercado', val: '-R$ 6,18', icon: CreditCard },
  ];

  const userName = 'Steven';
  const userCurrency = 'R$';
  const userLocale = 'pt-BR';
  const totalBalance = 800000;
  const incomes = 70000;
  const expenses = 42000;
  
  const chartData = [
    { name: 'Jan', receitas: 4000, despesas: 2400 },
    { name: 'Feb', receitas: 3000, despesas: 1398 },
    { name: 'Mar', receitas: 2000, despesas: 3800 },
    { name: 'Apr', receitas: 2780, despesas: 3908 },
    { name: 'May', receitas: 1890, despesas: 4800 },
    { name: 'Jun', receitas: 2390, despesas: 3800 },
    { name: 'Jul', receitas: 3490, despesas: 4300 },
  ];

  const expenseSummary = [
    ['Surgery', { total: 12000 }],
    ['Cardiology', { total: 8000 }],
    ['Neurology', { total: 4000 }],
    ['Medicine', { total: 3000 }],
  ];
  const totalExpenseSum = 27000;

  const filteredTransactions = [
    { id: 1, description: 'Dr. Thomas White (Cardiology)', type: 'INCOME', amount: 250.00, date: '2026-06-10T10:00:00' },
    { id: 2, description: 'Medical Supplies', type: 'EXPENSE', amount: 5000.00, date: '2026-06-05T10:00:00' },
    { id: 3, description: 'Dr. Emilia Williamson (Surgery)', type: 'INCOME', amount: 450.00, date: '2026-06-11T10:00:00' },
  ];

  return (
    <Layout>
      <div className="min-h-screen pb-20 fade-in px-4 md:px-8">
        {/* Header de Gestão Mestre */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6 md:gap-8">
           <div className="w-full">
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-md">
                    <User className="w-6 h-6" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Alfred Intelligence</span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Hello, {userName}!</h1>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Top Header - Tabs */}
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-[#111] p-1.5 rounded-full border border-white/5 overflow-x-auto">
                <button className="flex items-center gap-2 px-4 py-1.5 bg-[#0c2a1b] text-emerald-400 rounded-full text-sm font-medium border border-emerald-900/30 whitespace-nowrap">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Visão geral
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    <ArrowRightLeft className="w-4 h-4" /> Transações
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    <CreditCard className="w-4 h-4" /> Parcelamentos
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    <Apple className="w-4 h-4" /> Assinaturas
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    Categorias
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    Cartões
                </button>
            </div>
        </div>

        {/* Top Section: Greeting & Ritmo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            
            {/* Greeting Block */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-400 mb-2">Seu dinheiro pode trabalhar melhor por você.</h2>
                    <p className="text-slate-300 text-sm leading-relaxed mb-8">
                        Opa Lari, notei que seu gasto com supermercado disparou 68% esse mês!
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 min-w-[140px]">
                        <p className="text-[10px] text-slate-500 font-bold mb-1">GASTO EM JUNHO</p>
                        <p className="text-lg font-bold">R$ 2.715</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 min-w-[140px]">
                        <p className="text-[10px] text-slate-500 font-bold mb-1">VS. MÊS ANTERIOR</p>
                        <p className="text-lg font-bold text-red-500 flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" /> 54%
                        </p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 min-w-[160px]">
                        <p className="text-[10px] text-slate-500 font-bold mb-1">MAIOR GASTO</p>
                        <p className="text-sm font-bold flex items-center gap-2 mt-1">
                            <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-[10px]">💰</div> Transferência ...
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Pierre
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 13 de Jun, de 2026
                    </div>
                </div>
            </div>

            {/* Ritmo de Gastos */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Ritmo de Gastos</h3>
                        <p className="text-2xl font-bold text-white mb-1">R$ 951,23 <span className="text-sm text-slate-400 font-normal">acima</span></p>
                        <p className="text-xs text-red-500 bg-red-500/10 inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium">
                            <TrendingUp className="w-3 h-3" /> +53.9%
                        </p>
                        <span className="text-[10px] text-slate-500 ml-2">vs R$ 1.763,57 mês anterior</span>
                    </div>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver todas <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>

                <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ritmoData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#1f1f1f" strokeDasharray="3 3" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#525252', fontSize: 10}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#525252', fontSize: 10}} tickFormatter={(val) => val === 0 ? 'R$ 0' : `R$ ${val/1000}k`} width={50} />
                            <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px'}} />
                            <Line type="monotone" dataKey="mesPassado" stroke="#525252" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                            <Line type="monotone" dataKey="esteMes" stroke="#ef4444" strokeWidth={2} dot={{r: 4, fill: '#ef4444'}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400"><div className="w-3 h-0.5 bg-red-500"></div> Este mês</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400"><div className="w-3 h-0.5 bg-slate-600 border-t border-dashed border-slate-400"></div> Mês passado</div>
                </div>
            </div>
        </div>

        {/* Resumo por Categoria - Estilo Gráfico Foto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 flex-1">
            
            {/* Area Chart - Col Span 8 */}
            <div className="lg:col-span-8 hospital-card flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-gray-900">Cashflow Overview</h4>
                  <div className="flex items-center gap-3">
                     <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></div> Receitas</span>
                     <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></div> Despesas</span>
                     <select className="bg-gray-50 border border-gray-100 rounded-lg text-xs px-2 py-1 text-gray-600 outline-none">
                        <option>Month</option>
                     </select>
                  </div>
               </div>
               <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} width={60} />
                        <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="receitas" fill="#0284C7" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="despesas" fill="#38BDF8" radius={[4, 4, 0, 0]} barSize={12} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Donut Chart - Col Span 4 */}
            <div className="lg:col-span-4 hospital-card flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-gray-900">Top Categories</h4>
                  <button className="text-xs text-gray-400 hover:text-black">View all</button>
               </div>
               <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="h-[200px] w-full relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie 
                              data={expenseSummary.length > 0 ? expenseSummary.map(([name, data]) => ({ name, value: data.total })) : [{name: 'Sem Registros', value: 1}]} 
                              cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none"
                           >
                              {expenseSummary.length > 0 ? expenseSummary.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />) : <Cell fill="#F3F4F6" />}
                           </Pie>
                           <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-lg font-bold text-gray-900">{userCurrency} {totalExpenseSum.toLocaleString(userLocale, {maximumFractionDigits:0})}</span>
                     </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                     {expenseSummary.slice(0,4).map(([name], idx) => (
                        <div key={name} className="flex items-center gap-1.5">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                           <span className="text-[10px] text-gray-500 font-medium">{name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
        </div>

        {/* Transactions / Top list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 flex-1">
            <div className="lg:col-span-12 hospital-card flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                  <button className="text-xs text-gray-400 hover:text-black">View all</button>
               </div>
               <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y pr-2 space-y-1 max-h-[300px]">
                  {filteredTransactions.slice(0, 15).map((t, i) => (
                     <div key={t.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-4">
                           <span className="text-gray-400 font-bold text-xs w-4">#{i+1}</span>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
                              {t.type === 'INCOME' ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
                           </div>
                           <div className="flex flex-col">
                              <p className="font-semibold text-gray-800 text-sm leading-tight">{t.description}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{new Date(t.date).toLocaleDateString(userLocale)}</p>
                           </div>
                        </div>
                        <div className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'}`}>
                           {t.type === 'INCOME' ? '+' : '-'} {userCurrency} {Math.abs(t.amount).toLocaleString(userLocale, {minimumFractionDigits: 2})}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
        </div>

        {/* Lower Section: Categorias, Recentes, Assinaturas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Principais Categorias */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6 lg:row-span-2">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Principais Categorias</h3>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver mais <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                
                <div className="flex text-[10px] text-slate-500 mb-4 border-b border-white/5 pb-2">
                    <div className="flex-1">Categoria</div>
                    <div className="w-20 text-right">Atual</div>
                    <div className="w-32 text-center">vs Mês Anterior</div>
                    <div className="w-16 text-center">Variação</div>
                    <div className="w-20 text-right">Anterior</div>
                </div>

                <div className="space-y-6">
                    {/* Item 1 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            💰 Transferência - PIX
                        </div>
                        <div className="w-20 text-right font-bold">R$ 1.471</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full w-[80%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">↘ 10%</span></div>
                        <div className="w-20 text-right text-slate-400">R$ 1.635</div>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            🛒 Supermercado
                        </div>
                        <div className="w-20 text-right font-bold">R$ 924</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-red-500 rounded-full w-[95%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded font-bold">↗ 68%</span></div>
                        <div className="w-20 text-right text-slate-400">R$ 550</div>
                    </div>
                    {/* Item 3 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            🛍️ Compras
                        </div>
                        <div className="w-20 text-right font-bold">R$ 98</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full w-[40%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">↘ 67%</span></div>
                        <div className="w-20 text-right text-slate-400">R$ 298</div>
                    </div>
                    {/* Item 4 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            🍔 Restaurantes, bares e...
                        </div>
                        <div className="w-20 text-right font-bold">R$ 71</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full w-[50%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">↘ 42%</span></div>
                        <div className="w-20 text-right text-slate-400">R$ 123</div>
                    </div>
                    {/* Item 5 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                            ⛽ Postos de gasolina
                        </div>
                        <div className="w-20 text-right font-bold">R$ 45</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-slate-500 rounded-full w-[20%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-slate-500 bg-slate-500/10 px-1.5 py-0.5 rounded font-bold">novo</span></div>
                        <div className="w-20 text-right text-slate-400">--</div>
                    </div>
                </div>
            </div>

            {/* Transações Recentes */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transações Recentes</h3>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver todas <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mb-4">ONTEM</div>
                <div className="space-y-4">
                    {transacoes.map(t => (
                        <div key={t.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-slate-400">
                                    <t.icon className="w-4 h-4" />
                                </div>
                                <p className="text-xs font-bold truncate max-w-[200px]">{t.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">{t.cat}</span>
                                <span className="text-sm font-bold text-white w-20 text-right">{t.val}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-6">QUI, JUN 11</div>
            </div>

            {/* Assinaturas */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Assinaturas</h3>
                        <p className="text-2xl font-bold text-white">R$ 22,90 <span className="text-sm text-slate-500 font-normal">/mês • 1 ativa</span></p>
                    </div>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver todas <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                            <Apple className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Apple</p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">🗓️ Próximo: 20 Jun</p>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-white">R$ 22,90</p>
                </div>
            </div>

        </div>
      </div>
    </Layout>
  );
}
