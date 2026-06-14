import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { Download, ArrowRightLeft, TrendingUp, TrendingDown, Clock, Search, Filter, Plus, CheckCircle, Trash2, Edit2, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface FilteredReportProps {
  title: string;
  subtitle: string;
  typeFilter?: 'INCOME' | 'EXPENSE' | 'ALL';
  keyword?: string; // Ex: 'mercado', 'veiculo', 'divida'
  icon?: any;
}

export default function FilteredReport({ title, subtitle, typeFilter = 'ALL', keyword, icon: Icon = ArrowRightLeft }: FilteredReportProps) {
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'Hoy'|'Ayer'|'Últimos 7 días'|'Últimos 30 días'|'Últimos 3 Meses'|'Último Año'|'Tudo'>('Últimos 30 días');
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  const [userCurrency, setUserCurrency] = useState('R$');
  const [userLocale, setUserLocale] = useState('pt-BR');

  useEffect(() => {
    setUserCurrency(localStorage.getItem('userCurrency') || 'R$');
    setUserLocale(localStorage.getItem('userLocale') || 'pt-BR');
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [description, setDescription] = useState(keyword ? keyword.charAt(0).toUpperCase() + keyword.slice(1) : '');
  const [amount, setAmount] = useState('');
  const [selectedType, setSelectedType] = useState(typeFilter !== 'ALL' ? typeFilter : 'EXPENSE');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const openNewModal = () => {
      setEditId(null);
      setDescription(keyword ? keyword.charAt(0).toUpperCase() + keyword.slice(1) : '');
      setAmount('');
      setSelectedType(typeFilter !== 'ALL' ? typeFilter : 'EXPENSE');
      setDate(new Date().toISOString().split('T')[0]);
      setIsModalOpen(true);
  };

  const openEditModal = (txn: any) => {
      setEditId(txn.id);
      setDescription(txn.description);
      setAmount(Math.abs(txn.amount).toString());
      setSelectedType(txn.type);
      setDate(new Date(txn.date).toISOString().split('T')[0]);
      setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
      if(!window.confirm('Tem certeza que deseja excluir este registro?')) return;
      try {
         const token = localStorage.getItem('token');
         const res = await fetch(`https://fincontrol-saas-production.up.railway.app/api/transactions/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
         });
         if(res.ok) {
            toast.success('Registro Excluído!');
            fetchTransactions();
         }
      } catch(e) { toast.error("Falha ao Excluir"); }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const profileId = localStorage.getItem('activeProfileId');
      const res = await fetch(`https://fincontrol-saas-production.up.railway.app/api/transactions?profileId=${profileId}&_t=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllTransactions(data);
      }
    } catch (e) {
      console.error(e);
      toast("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [title]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editId 
         ? `https://fincontrol-saas-production.up.railway.app/api/transactions/${editId}`
         : 'https://fincontrol-saas-production.up.railway.app/api/transactions';
      
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          description, 
          amount: selectedType === 'EXPENSE' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)), 
          type: selectedType, 
          date: new Date(date).toISOString(),
          profileId: localStorage.getItem('activeProfileId')
        })
      });
      if(res.ok) {
        setIsModalOpen(false);
        toast.success(editId ? "Editado com Sucesso!" : "Lançamento Concluído!");
        fetchTransactions();
      } else {
        toast.error("Erro no servidor");
      }
    } catch (e) {
      toast.error("Erro na conexão");
    }
  };

  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    if (dateRange === 'Hoy') cutoffDate.setHours(0,0,0,0);
    else if (dateRange === 'Ayer') {
       cutoffDate.setDate(now.getDate() - 1);
       cutoffDate.setHours(0,0,0,0);
    }
    else if (dateRange === 'Últimos 7 días') cutoffDate.setDate(now.getDate() - 7);
    else if (dateRange === 'Últimos 30 días') cutoffDate.setDate(now.getDate() - 30);
    else if (dateRange === 'Últimos 3 Meses') cutoffDate.setMonth(now.getMonth() - 3);
    else if (dateRange === 'Último Año') cutoffDate.setFullYear(now.getFullYear() - 1);

    return allTransactions.filter(t => {
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (keyword) {
        const desc = (t.description || '').toLowerCase();
        const cat = (t.category?.name || '').toLowerCase();
        const key = keyword.toLowerCase();
        if (!desc.includes(key) && !cat.includes(key)) return false;
      }

      const tDate = new Date(t.date);
      if (dateRange === 'Tudo') return true;
      if (dateRange === 'Hoy') return tDate.toDateString() === now.toDateString();
      if (dateRange === 'Ayer') {
         const yest = new Date(); yest.setDate(yest.getDate()-1);
         return tDate.toDateString() === yest.toDateString();
      }
      return tDate >= cutoffDate;
    });
  }, [allTransactions, dateRange, typeFilter, keyword]);

  const totalGeral = filteredData.reduce((acc, t) => acc + (t.type === 'INCOME' ? Number(t.amount) : -Math.abs(Number(t.amount))), 0);
  
  const chartData = useMemo(() => {
    const grouped: any = {};
    filteredData.forEach(t => {
      const dStr = new Date(t.date).toLocaleDateString(userLocale, { day: '2-digit', month: 'short' });
      if (!grouped[dStr]) grouped[dStr] = { name: dStr, receita: 0, despesa: 0 };
      if (t.type === 'INCOME') grouped[dStr].receita += Math.abs(Number(t.amount));
      if (t.type === 'EXPENSE') grouped[dStr].despesa += Math.abs(Number(t.amount));
    });
    const result = Object.values(grouped);
    return result;
  }, [filteredData, userLocale]);

  const isIncomeMode = typeFilter === 'INCOME';
  const themeColor = isIncomeMode ? 'bg-green-50 text-green-700 border-green-200' : (typeFilter === 'EXPENSE' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-800 border-slate-200');

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2 fade-in font-sans">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-bold mt-1">Período: <span className="text-primary">{dateRange}</span></p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={openNewModal}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-sm uppercase"
          >
            <Plus className="w-5 h-5" /> Añadir
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="flex items-center gap-3 bg-white border-2 border-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-black text-sm shadow-sm transition-all hover:border-primary active:scale-95"
            >
               <Clock className="w-4 h-4 text-primary" /> {dateRange} <ChevronDown className={`w-4 h-4 transition-transform ${showDateFilter ? 'rotate-180' : ''}`} />
            </button>
          
            {showDateFilter && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-50 z-50 py-3 overflow-hidden fade-in">
                 {['Hoy', 'Ayer', 'Últimos 7 días', 'Últimos 30 días', 'Últimos 3 Meses', 'Último Año', 'Tudo'].map(range => (
                   <button 
                      key={range}
                      onClick={() => { setDateRange(range as any); setShowDateFilter(false); }} 
                      className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors ${dateRange === range ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                      {range}
                   </button>
                 ))}
             </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 fade-in font-sans">
         <div className={`col-span-1 p-10 rounded-[2.5rem] border shadow-sm flex flex-col justify-center ${themeColor}`}>
            <p className="text-sm font-black uppercase tracking-widest opacity-60 mb-2">Total Acumulado</p>
            <h2 className="text-5xl font-black tracking-tighter">
               {userCurrency} {Math.abs(totalGeral).toLocaleString(userLocale, { minimumFractionDigits: 2 })}
            </h2>
         </div>

         <div className="col-span-1 lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[250px]">
            <h3 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Fluxo Temporal: {title}</h3>
            <div className="flex-1 w-full h-full">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10}/>
                    <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} formatter={(val: any) => [`${userCurrency} ${Number(val).toLocaleString(userLocale)}`, "Valor"]} />
                    {isIncomeMode ? <Bar dataKey="receita" fill="#16a34a" radius={[10, 10, 0, 0]} maxBarSize={40} /> : <Bar dataKey="despesa" fill="#ef4444" radius={[10, 10, 0, 0]} maxBarSize={40} />}
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden fade-in px-4 py-6 font-sans">
        {loading ? (
           <div className="p-20 text-center font-black text-slate-300 text-2xl animate-pulse italic">Sincronizando Alfred...</div>
        ) : filteredData.length === 0 ? (
          <div className="p-20 text-center">
             <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <h2 className="text-2xl font-black text-slate-800 mb-2">Nada por aqui, Mestre.</h2>
             <p className="text-slate-400 font-bold max-w-sm mx-auto tracking-tight italic">Tente outro período ou adicione um novo registro agora mesmo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-6">
                  <th className="py-4 px-6">Data</th>
                  <th className="py-4 px-6">Descrição</th>
                  <th className="py-4 px-6 text-right">Valor</th>
                  <th className="py-4 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((txn) => (
                  <tr key={txn.id} className="bg-slate-50/30 hover:bg-slate-50 transition-all group rounded-2xl">
                    <td className="py-6 px-6 font-bold text-slate-400 text-xs rounded-l-2xl">{new Date(txn.date).toLocaleDateString(userLocale)}</td>
                    <td className="py-6 px-6 font-black text-slate-800">{txn.description}</td>
                    <td className={`py-6 px-6 text-right font-black text-lg ${txn.type === 'INCOME' ? 'text-green-600' : 'text-slate-800'}`}>
                      {userCurrency} {Math.abs(Number(txn.amount)).toLocaleString(userLocale, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-6 px-6 text-center rounded-r-2xl">
                       <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(txn)} className="p-3 bg-white text-slate-400 hover:text-blue-500 rounded-xl shadow-sm"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(txn.id)} className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4 fade-in font-sans">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 p-10">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">{editId ? 'Editar Registro' : 'Nuevo Lanzamiento'}</h2>
               <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><X className="text-slate-400 w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="flex gap-4 p-2 bg-slate-50 rounded-[2rem]">
                 <button type="button" onClick={() => setSelectedType('INCOME')} className={`flex-1 py-4 rounded-[1.8rem] text-xs font-black uppercase transition-all ${selectedType === 'INCOME' ? 'bg-white text-green-600 shadow-md transform scale-105' : 'text-slate-400'}`}>Receita</button>
                 <button type="button" onClick={() => setSelectedType('EXPENSE')} className={`flex-1 py-4 rounded-[1.8rem] text-xs font-black uppercase transition-all ${selectedType === 'EXPENSE' ? 'bg-white text-red-600 shadow-md transform scale-105' : 'text-slate-400'}`}>Gasto</button>
              </div>

              <input required value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all shadow-inner" placeholder="Especifique o gasto/receita" />
              <input required value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all shadow-inner" placeholder={`${userCurrency} 0.00`} />
              <input required value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-xs font-black outline-none transition-all shadow-inner" />

              <button type="submit" className="w-full bg-slate-900 text-white font-black py-6 rounded-[3rem] shadow-xl hover:bg-black transition-all active:scale-95 text-lg uppercase tracking-tight">
                {editId ? 'Salvar Mudanças 🕵️‍♂️' : 'Efetivar Lançamento 🏛️'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
