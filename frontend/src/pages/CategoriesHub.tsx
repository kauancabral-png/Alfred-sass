import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { 
  Layers, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ShoppingCart, 
  Car, 
  AlertTriangle, 
  ArrowRight, 
  Home, 
  Coffee, 
  Activity, 
  Plus, 
  DollarSign, 
  X,
  LayoutDashboard
} from 'lucide-react';

export default function CategoriesHub() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    { id: 'receitas', title: 'Ingresos', desc: 'Ingresos e Lucros', icon: ArrowUpCircle, color: 'text-green-600', bg: 'bg-green-100', link: '/receitas', type: 'INCOME' },
    { id: 'despesas', title: 'Gastos', desc: 'Egresos Gerais', icon: ArrowDownCircle, color: 'text-red-600', bg: 'bg-red-100', link: '/despesas', type: 'EXPENSE' },
    { id: 'mercado', title: 'Supermercado', desc: 'Alimentação e Casa', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-100', link: '/mercado', type: 'EXPENSE' },
    { id: 'veiculos', title: 'Vehículos', desc: 'Combustível, IPVA e Oficinas', icon: Car, color: 'text-blue-600', bg: 'bg-blue-100', link: '/veiculos', type: 'EXPENSE' },
    { id: 'moradia', title: 'Vivienda y Casa', desc: 'Aluguel, Luz, Água', icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-100', link: '/moradia', type: 'EXPENSE' },
    { id: 'lazer', title: 'Ocio y Viajes', desc: 'Restaurantes e Festas', icon: Coffee, color: 'text-pink-600', bg: 'bg-pink-100', link: '/lazer', type: 'EXPENSE' },
    { id: 'saude', title: 'Salud y Cuidado', desc: 'Médico, Academia, Farmácia', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-100', link: '/saude', type: 'EXPENSE' },
    { id: 'dividas', title: 'Deudas & Cartões', desc: 'Pendências Financeiras', icon: AlertTriangle, color: 'text-purple-600', bg: 'bg-purple-100', link: '/dividas', type: 'EXPENSE' },
  ];

  const handleQuickAdd = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return toast.error("¡Informa un valor válido!");
    }
    if (!description.trim()) {
      return toast.error("¡Informa una descripción!");
    }
    
    try {
      const token = localStorage.getItem('token');
      // 🔥 AUTO-DISCOVERY DE API
      let envUrl = ((import.meta as any).env.VITE_API_URL || '').replace(/\/$/, '');
      if (!envUrl) {
          envUrl = window.location.origin.includes('up.railway.app') ? window.location.origin + '/api' : 'https://fincontrol-saas-production.up.railway.app/api';
      }

      const currentProfileId = localStorage.getItem('activeProfileId') || undefined;

      const res = await fetch(`${envUrl}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          description,
          amount: selectedCat.type === 'EXPENSE' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
          type: selectedCat.type,
          categoryName: selectedCat.title,
          date: new Date().toISOString(),
          profileId: currentProfileId
        })
      });

      if (res.ok) {
        toast.success(`✅ Lanzado en ${selectedCat.title}!`);
        setShowModal(false);
        setAmount('');
        setDescription('');
        setSelectedCat(null);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Error al guardar. Intenta nuevamente.");
      }
    } catch (err) {
      toast.error("Sin conexión con el servidor.");
    }
  };

  return (
    <Layout>
      <div className="mb-10 fade-in font-sans">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
             <Layers className="w-10 h-10 text-white"/>
          </div>
          Central de Categorías
        </h1>
        <p className="text-slate-500 font-bold ml-20 mt-2 text-lg italic">
          Gestión táctica de cada sector de tu vida y negocio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in font-sans">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div 
              key={idx}
              className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col items-center text-center"
            >
              <div 
                 onClick={() => navigate(cat.link)}
                 className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner cursor-pointer hover:scale-110 transition-transform ${cat.bg}`}
              >
                <Icon className={`w-8 h-8 ${cat.color}`} />
              </div>
              
              <h2 className="text-xl font-black text-slate-800 mb-1">{cat.title}</h2>
              <p className="text-slate-400 font-bold text-xs mb-6 px-4">{cat.desc}</p>
              
              <div className="flex w-full gap-2 mt-auto">
                 <button 
                   onClick={() => navigate(cat.link)}
                   className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase transition-colors"
                 >
                   Filtros
                 </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedCat(cat);
                      setShowModal(true);
                    }}
                    className="flex-1 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-md"
                  >
                    <Plus className="w-3 h-3" /> Añadir
                  </button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && selectedCat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 font-sans">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden p-10 border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${selectedCat.bg}`}>
                       <selectedCat.icon className={`w-6 h-6 ${selectedCat.color}`} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-slate-800">Nuevo Lanzamiento</h2>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedCat.title}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowModal(false)} className="bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                 </button>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quanto? (Valor)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                       <input 
                         type="number" 
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-xl font-black focus:border-primary outline-none transition-all" 
                         placeholder="0,00"
                         autoFocus
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">O que foi? (Descrição)</label>
                    <input 
                      type="text" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                      placeholder="Ex: Almoço, Manutenção, Venda..."
                    />
                 </div>

                 <button 
                   onClick={handleQuickAdd}
                   className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[2rem] shadow-xl transition-all shadow-slate-300 transform active:scale-95 uppercase tracking-tight"
                 >
                   Efectuar Ahora ➔
                 </button>
              </div>
           </div>
        </div>
      )}
      
      <div className="mt-12 bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 flex flex-col md:flex-row items-center justify-between shadow-sm fade-in font-sans">
         <div>
            <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter">Sincronización Alfred 🕵️‍♂️</h3>
            <p className="text-slate-500 font-bold max-w-xl italic">
               Todo lo que lanzas aquí es interpretado por tu Mayordomo en WhatsApp. Una gestión unificada para quienes no tienen tiempo que perder.
            </p>
         </div>
         <button onClick={() => navigate('/transactions')} className="mt-6 md:mt-0 bg-slate-900 hover:bg-black text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all flex items-center gap-2 uppercase text-xs tracking-widest">
           <LayoutDashboard className="w-5 h-5" /> Todos los Filtros
         </button>
      </div>
    </Layout>
  );
}
