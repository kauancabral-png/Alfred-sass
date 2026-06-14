import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

const COLORS = ['#10b981', '#ef4444'];

export default function Reports() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || searchParams.get('view');
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState('R$');
  const [userLocale, setUserLocale] = useState('pt-BR');

  const getTitle = () => {
    switch(tab) {
      case 'diario': return 'Fluxo de Caixa Diário';
      case 'resultados': return 'Demonstrativo de Resultados (DRE)';
      case 'er': return 'Demonstrativo de Resultados (DRE)';
      case 'analisis': return 'Análisis de Planificación Financeiro';
      case 'planeacion': return 'Análisis de Planificación Estratégico';
      case 'marketing': return 'Otimização de Marketing & Ads';
      case 'taxes': return 'Relatório de Impostos e IVA';
      default: return 'Relatório de Operações';
    }
  };

  useEffect(() => {
    setUserCurrency(localStorage.getItem('userCurrency') || '$');
    setUserLocale(localStorage.getItem('userLocale') || 'es-MX');

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileId = localStorage.getItem('activeProfileId');
        const res = await fetch(`https://fincontrol-saas-production.up.railway.app/api/transactions?profileId=${profileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const incomes = transactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + Number(b.amount), 0);
  const expenses = Math.abs(transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + Number(b.amount), 0));

  const data = [
    { name: 'Ingresos', value: incomes > 0 ? incomes : 0.1 },
    { name: 'Gastos', value: expenses > 0 ? expenses : 0.1 }
  ];

  const exportCSV = () => {
    if (transactions.length === 0) return toast('Sem transações para exportar!');
    const header = "Data,Descricao,Tipo,Valor\n";
    const body = transactions.map(t => `${new Date(t.date).toLocaleDateString(userLocale)},${t.description},${t.type === 'INCOME' ? 'Receita' : 'Gasto'},${userCurrency} ${Math.abs(t.amount)}`).join("\n");
    const uri = encodeURI("data:text/csv;charset=utf-8," + header + body);
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", `Relatorio_Alfred_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">{getTitle()}</h1>
          <p className="text-slate-500 font-bold mt-1 italic">Análise estratégica baseada no perfil ativo.</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-primary text-white font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all"
        >
          <Download className="w-5 h-5" /> Exportar Dados
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between text-center min-h-[400px]">
         {loading ? (
             <p className="text-slate-500 w-full animate-pulse">Analizando Inteligencia de Datos...</p>
         ) : transactions.length === 0 ? (
             <div className="w-full flex flex-col items-center">
                 <h2 className="text-xl font-bold text-slate-700 mb-2">Sin datos suficientes aún</h2>
                 <p className="text-slate-500 max-w-md">Continúa registrando gastos para generar el gráfico.</p>
             </div>
         ) : (
             <>
               <div className="flex-1 w-full h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                       {data.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip formatter={(val: any) => [`${userCurrency} ${Number(val).toLocaleString(userLocale, {minimumFractionDigits: 2})}`, "Valor"]} />
                     <Legend />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="flex-1 space-y-4">
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-left">
                     <p className="text-green-700 font-bold mb-1">Total Movido hacia Arriba (Ingresos)</p>
                     <p className="text-2xl text-green-600 font-extrabold">+ {userCurrency} {incomes.toLocaleString(userLocale, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-left">
                     <p className="text-red-700 font-bold mb-1">Total Drenado de Caja (Gastos)</p>
                     <p className="text-2xl text-red-600 font-extrabold">- {userCurrency} {expenses.toLocaleString(userLocale, {minimumFractionDigits: 2})}</p>
                  </div>
               </div>
             </>
         )}
      </div>
    </Layout>
  );
}
