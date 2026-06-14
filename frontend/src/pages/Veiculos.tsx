import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { 
  Car, 
  Wrench, 
  History, 
  Bell, 
  Plus, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  Settings, 
  CheckCircle, 
  Fuel, 
  Cpu,
  X,
  Trash2
} from 'lucide-react';

export default function Veiculos() {
  const [activeTab, setActiveTab] = useState('manutencao');
  const [showAddModal, setShowAddModal] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [service, setService] = useState('');
  const [local, setLocal] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [userCurrency, setUserCurrency] = useState('$');
  const [userLocale, setUserLocale] = useState('es-MX');

  useEffect(() => {
    setUserCurrency(localStorage.getItem('userCurrency') || '$');
    setUserLocale(localStorage.getItem('userLocale') || 'es-MX');
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileId = localStorage.getItem('activeProfileId');
      const res = await fetch(`https://alfred-backend-8t7n.onrender.com/api/vehicles?profileId=${profileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddService = async () => {
    if (!service || !amount || !local) return toast.error("¡Complete todos los campos!");
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://alfred-backend-8t7n.onrender.com/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
            service, 
            location: local, 
            amount: Number(amount), 
            date,
            profileId: localStorage.getItem('activeProfileId')
        })
      });

      if (res.ok) {
        toast.success("¡Servicio registrado con éxito! 🛡️🏎️");
        setShowAddModal(false);
        setService('');
        setLocal('');
        setAmount('');
        fetchData();
      } else {
        toast.error("Error al guardar en el servidor.");
      }
    } catch (err) {
      toast.error("Falla de conexión con la central.");
    }
  };

  return (
    <Layout>
      <div className="mb-10 fade-in">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
             <Car className="w-8 h-8 text-white"/>
          </div>
          Garaje Alfred: Vehículos e Insumos
        </h1>
        <p className="text-slate-500 font-bold ml-16 mt-2 text-lg">
           Manten el historial real de tu vehículo. Cada registro se convierte en un gasto automático.
        </p>
      </div>

      <div className="flex gap-4 mb-8 bg-slate-100 p-2 rounded-[2rem] w-fit shadow-inner fade-in">
         <button onClick={() => setActiveTab('manutencao')} className={`px-8 py-3 rounded-[1.8rem] font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'manutencao' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}><Wrench className="w-4 h-4" /> Mantenimientos</button>
         <button onClick={() => setActiveTab('combustivel')} className={`px-8 py-3 rounded-[1.8rem] font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'combustivel' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}><Fuel className="w-4 h-4" /> Combustible</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
         <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><History className="text-blue-600" /> Historial Real</h2>
               <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white font-black px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 hover:scale-105 transition-all text-sm"><Plus className="w-4 h-4" /> Registrar Nuevo</button>
            </div>

            <div className="space-y-6">
               {history.length === 0 ? (
                 <div className="text-center py-20 text-slate-400 font-bold">No se encontraron registros en el garaje.</div>
               ) : (
                 history.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all group relative">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Settings className="w-6 h-6 text-blue-600" /></div>
                          <div>
                             <h3 className="font-black text-slate-800">{item.service}</h3>
                             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{item.local} • {new Date(item.date).toLocaleDateString(userLocale)}</p>
                          </div>
                       </div>
                       <div className="text-right flex items-center gap-4">
                          <div>
                             <div className="text-lg font-black text-slate-800 font-mono">{userCurrency} {item.amount.toLocaleString(userLocale, { minimumFractionDigits: 2 })}</div>
                             <div className="text-[10px] font-black text-green-600 uppercase flex items-center gap-1 justify-end"><CheckCircle className="w-3 h-3 fill-green-600 text-white" /> {item.status}</div>
                          </div>
                          <button 
                            onClick={async () => {
                               if(!confirm('¿Eliminar este registro?')) return;
                               try {
                                 const token = localStorage.getItem('token');
                                 await fetch(`https://alfred-backend-8t7n.onrender.com/api/vehicles/${item.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                 fetchData();
                                 toast.success('¡Registro Eliminado! 🏎️');
                               } catch(e) { toast.error('Error al eliminar'); }
                            }}
                            className="bg-white p-3 rounded-xl text-slate-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div>
               <h2 className="text-2xl font-black mb-10 flex items-center gap-3"><Bell className="text-blue-400" /> Alertas Maestro</h2>
               <div className="space-y-6">
                  <div className="bg-white/10 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                     <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-1">Estado de Salud</p>
                     <h3 className="font-bold mb-3">Motor al día (Basado en Mantenimientos)</h3>
                     <div className="w-full bg-white/10 h-2 rounded-full"><div className="bg-green-500 h-full rounded-full w-4/5"></div></div>
                  </div>
               </div>
            </div>
            <div className="p-6 bg-blue-600/20 rounded-[2rem] border border-blue-600/30 text-xs font-bold text-blue-300 italic">
               Alfred cruzará los datos de tus mantenimientos para predecir futuras fallas.
            </div>
         </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden p-10 border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Wrench className="text-blue-600" /> Registrar Servicio</h2>
                <button onClick={() => setShowAddModal(false)}><X className="text-slate-400" /></button>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">¿Qué se hizo?</label>
                    <input type="text" value={service} onChange={(e) => setService(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" placeholder="Ej: Filtro de Aire, Frenos..." />
                 </div>
                 <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Lugar / Taller</label>
                    <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" placeholder="Ej: Taller del Maestro..." />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Costo ({userCurrency})</label>
                       <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" placeholder="0,00" />
                    </div>
                    <div>
                       <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Fecha</label>
                       <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-bold outline-none" />
                    </div>
                 </div>
                 <button onClick={handleAddService} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl transition-all active:scale-95">Confirmar Registro Real 🏎️</button>
              </div>
           </div>
        </div>
      )}
    </Layout>
  );
}
