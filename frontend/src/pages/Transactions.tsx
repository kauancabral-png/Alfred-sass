import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { ArrowRightLeft, Plus, CheckCircle, Trash2, X, Edit2 } from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [userCurrency, setUserCurrency] = useState('R$');
  const [userLocale, setUserLocale] = useState('pt-BR');
  const [categories, setCategories] = useState<any[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    setUserCurrency(localStorage.getItem('userCurrency') || '$');
    setUserLocale(localStorage.getItem('userLocale') || 'es-MX');
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const profileId = localStorage.getItem('activeProfileId');
      const res = await fetch(`https://alfred-backend-8t7n.onrender.com/api/transactions?profileId=${profileId}&_t=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileId = localStorage.getItem('activeProfileId');
      const res = await fetch(`https://alfred-backend-8t7n.onrender.com/api/categories?profileId=${profileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCategories(await res.json());
    } catch (e) {}
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const openNew = () => {
    setEditId(null);
    setDescription(categoryFilter ? `[${categoryFilter.toUpperCase()}] ` : '');
    setAmount('');
    setType('EXPENSE');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEdit = (txn: any) => {
    setEditId(txn.id);
    setDescription(txn.description);
    setAmount(Math.abs(txn.amount).toString());
    setType(txn.type);
    setCategoryId(txn.categoryId || '');
    setDate(new Date(txn.date).toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apagar este lançamento?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://alfred-backend-8t7n.onrender.com/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Removido com sucesso!");
      fetchTransactions();
    } catch (e) {
      toast.error("Erro ao remover");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) {
      return toast.error("Preencha todos os campos corretamente.");
    }
    try {
      const token = localStorage.getItem('token');
      const url = editId
        ? `https://alfred-backend-8t7n.onrender.com/api/transactions/${editId}`
        : 'https://alfred-backend-8t7n.onrender.com/api/transactions';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          description,
          amount: type === 'EXPENSE' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
          type,
          date: new Date(date).toISOString(),
          profileId: localStorage.getItem('activeProfileId'),
          categoryId: categoryId || null
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        toast.success(editId ? "Editado com sucesso!" : "Lançamento salvo!");
        fetchTransactions();
      } else {
        toast.error("Erro no servidor");
      }
    } catch (e) {
      toast.error("Erro na conexão");
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const profileId = localStorage.getItem('activeProfileId');
      const res = await fetch('https://alfred-backend-8t7n.onrender.com/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCatName, type: 'EXPENSE', profileId })
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(prev => [...prev, data]);
        setCategoryId(data.id);
        setShowNewCategory(false);
        setNewCatName('');
        toast.success("Categoria criada!");
      }
    } catch (e) { toast.error("Erro ao criar categoria"); }
  };

  const filteredTransactions = useMemo(() => {
    if (!categoryFilter) return transactions;
    return transactions.filter(t => 
      t.description.toLowerCase().includes(categoryFilter.toLowerCase()) ||
      (t.category?.name && t.category.name.toLowerCase().includes(categoryFilter.toLowerCase()))
    );
  }, [transactions, categoryFilter]);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            {categoryFilter ? `Gestão: ${categoryFilter.toUpperCase()}` : 'Registro de Caixa'}
          </h1>
          <p className="text-slate-500 font-bold mt-1 italic">
            {categoryFilter ? `Filtrado por: ${categoryFilter}` : 'Todas as suas movimentações em um só lugar.'}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary hover:bg-primary text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> + Nuevo Lanzamiento
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden fade-in min-h-[500px]">
        {loading ? (
          <div className="p-20 text-center font-black text-slate-300 animate-pulse text-2xl">Carregando...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-8">
              <ArrowRightLeft className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-black text-slate-700 mb-2">Nenhum lançamento encontrado.</h2>
            <p className="text-slate-400 font-bold max-w-sm">Tente mudar o filtro ou adicione um novo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4 md:p-8">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="py-6 px-4">Data</th>
                  <th className="py-6 px-4">Descrição</th>
                  <th className="py-6 px-4">Categoria</th>
                  <th className="py-6 px-4 text-right">Valor</th>
                  <th className="py-6 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="py-6 px-4 text-slate-400 font-bold text-xs">
                      {new Date(txn.date).toLocaleDateString(userLocale)}
                    </td>
                    <td className="py-6 px-4 font-black text-slate-800 text-base">{txn.description}</td>
                    <td className="py-6 px-4">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm shadow-slate-200/50">
                        {txn.category?.name || 'Sem Categoria'}
                      </span>
                    </td>
                    <td className={`py-6 px-4 text-right font-black text-lg ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                      {txn.type === 'INCOME' ? '+' : '-'} {userCurrency} {Math.abs(Number(txn.amount)).toLocaleString(userLocale, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(txn)}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-500 rounded-xl shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(txn.id)}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-red-500 rounded-xl shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-md border border-slate-100 p-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800">{editId ? 'Editar' : 'Nuevo Lanzamiento'}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {editId ? 'Altere os dados abaixo' : 'Informe os dados abaixo'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="text-slate-400 w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-3 bg-slate-50 p-2 rounded-[2rem] shadow-inner">
                <button
                  type="button"
                  onClick={() => setType('INCOME')}
                  className={`flex-1 py-4 rounded-[1.8rem] text-xs font-black uppercase transition-all ${type === 'INCOME' ? 'bg-white text-green-600 shadow-md scale-105' : 'text-slate-400'}`}
                >
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setType('EXPENSE')}
                  className={`flex-1 py-4 rounded-[1.8rem] text-xs font-black uppercase transition-all ${type === 'EXPENSE' ? 'bg-white text-red-600 shadow-md scale-105' : 'text-slate-400'}`}
                >
                  Gasto
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-2">Descrição</label>
                <input
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all"
                  placeholder="Salário, Aluguel, Vendas..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-2">Valor ({userCurrency})</label>
                  <input
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-2">Data</label>
                  <input
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-[11px] font-black outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase">Categoria</label>
                  <button type="button" onClick={() => setShowNewCategory(!showNewCategory)} className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter">
                    {showNewCategory ? 'Cancelar' : '+ Nova'}
                  </button>
                </div>
                
                {showNewCategory ? (
                  <div className="flex gap-2 animate-in slide-in-from-top-2">
                    <input
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      type="text"
                      className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black focus:border-orange-500 outline-none transition-all"
                      placeholder="Ex: Alimentação, Aluguel..."
                    />
                    <button type="button" onClick={handleAddCategory} className="bg-primary text-white font-black px-4 rounded-2xl text-[10px] uppercase">Salvar</button>
                  </div>
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all appearance-none"
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-slate-900 text-white font-black py-6 rounded-[3rem] shadow-xl hover:bg-black transition-all active:scale-95 text-lg flex justify-center items-center gap-2"
              >
                {editId ? 'Salvar Edição' : 'Confirmar Lançamento'} <CheckCircle className="w-6 h-6 text-primary" />
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
