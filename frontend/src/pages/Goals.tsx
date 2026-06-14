import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { Target, PlusCircle, CheckCircle, Trash2, Edit2, Plus, X } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [userCurrency, setUserCurrency] = useState('R$');
  const [userLocale, setUserLocale] = useState('pt-BR');

  const [name, setName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => {
    setUserCurrency(localStorage.getItem('userCurrency') || '$');
    setUserLocale(localStorage.getItem('userLocale') || 'es-MX');
    fetchGoals(); 
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const profileId = localStorage.getItem('activeProfileId');
      const res = await fetch(`https://alfred-backend-8t7n.onrender.com/api/goals?profileId=${profileId}&_t=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      toast.error('Error al buscar metas');
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
      setEditingId(null);
      setName(''); setTargetValue(''); setCurrentValue('');
      setIsModalOpen(true);
  };

  const openEditModal = (goal: any) => {
      setEditingId(goal.id);
      setName(goal.name);
      setTargetValue(String(goal.targetValue));
      setCurrentValue(String(goal.currentValue || 0));
      setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetValue) return;
    
    try {
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId 
            ? `https://alfred-backend-8t7n.onrender.com/api/goals/${editingId}`
            : 'https://alfred-backend-8t7n.onrender.com/api/goals';

        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ 
                name, 
                targetValue: Number(targetValue), 
                currentValue: Number(currentValue) || 0,
                profileId: localStorage.getItem('activeProfileId')
            })
        });

        if (res.ok) {
            toast.success(editingId ? "Meta atualizada com sucesso! 🎯" : "Nova Meta Fixada! 🚀");
            fetchGoals();
            setIsModalOpen(false);
        } else {
            toast.error("Erro ao salvar meta no banco central.");
        }
    } catch (err) {
        toast.error("Erro de conexão");
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Tem certeza que deseja apagar esta meta?")) return;
    try {
        const res = await fetch(`https://alfred-backend-8t7n.onrender.com/api/goals/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            toast.success("¡Meta eliminada!");
            fetchGoals();
            toast.success("Meta eliminada!");
            fetchGoals();
        }
    } catch (err) { toast.error("Erro ao eliminar meta."); }
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 fade-in px-2">
        <div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-pink-500 rounded-2xl shadow-lg shadow-pink-500/20">
                 <Target className="w-8 h-8 text-white"/>
              </div>
              Metas de Vida
           </h1>
           <p className="text-slate-500 font-bold ml-16 mt-2 text-lg italic">
              Transforme seus sonhos em números reais.
           </p>
        </div>
        <button 
            onClick={openNewModal}
            className="group relative flex items-center gap-3 bg-slate-900 text-white font-black px-10 py-5 rounded-[2.5rem] shadow-xl hover:bg-black transition-all active:scale-95 overflow-hidden"
        >
            <div className="absolute inset-0 w-1/3 h-full bg-white/10 -skew-x-[20deg] group-hover:translate-x-[300%] transition-transform duration-700"></div>
            <Plus className="w-5 h-5" /> Añadir Meta
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {goals.length === 0 ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center bg-white rounded-[4rem] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                    <Target className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-700">Nenhuma meta ativa ainda.</h3>
                <p className="text-slate-400 font-bold">Defina seu primeiro grande objetivo acima.</p>
            </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => {
               const percentage = goal.targetValue > 0 ? Math.min(100, (goal.currentValue / goal.targetValue) * 100) : 0;
               return (
              <div key={goal.id} className="border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4 flex gap-3">
                   <button onClick={() => openEditModal(goal)} className="text-slate-300 hover:text-blue-500 transition-colors"><Edit2 className="w-4 h-4"/></button>
                   <button onClick={() => handleDelete(goal.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                   <Target className="w-5 h-5"/>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{goal.name}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">Atual: {userCurrency} {goal.currentValue?.toLocaleString(userLocale) || '0'} / Alvo: {userCurrency} {goal.targetValue.toLocaleString(userLocale)}</p>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                   <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-right">{percentage.toFixed(0)}% concluído</p>
              </div>
            )})}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
            <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-md overflow-hidden p-12 border border-slate-100 relative">
               <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">{editingId ? 'Editar Meta' : 'Novo Objetivo'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"><X className="text-slate-400 w-5 h-5" /></button>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-2">Nome da Meta</label>
                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-pink-500 outline-none transition-all" placeholder="Ex: Viagem, Comprar Carro..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-2">Alvo ({userCurrency})</label>
                       <input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-sm font-black focus:border-pink-500 outline-none transition-all" placeholder="0.00" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-2">Já tenho ({userCurrency})</label>
                       <input type="number" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-sm font-black focus:border-pink-500 outline-none transition-all" placeholder="0.00" />
                    </div>
                  </div>

                  <button onClick={handleSave} className="w-full bg-slate-900 text-white font-black py-6 rounded-[3rem] shadow-xl hover:bg-black transition-all transform active:scale-95 text-lg">Fixar no Horizonte 🌅</button>
               </div>
            </div>
        </div>
      )}
    </Layout>
  );
}
