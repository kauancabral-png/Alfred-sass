import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { 
  ShoppingCart, 
  BarChart2, 
  Tag, 
  Warehouse, 
  Search, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  ShoppingBag,
  ChevronRight,
  X,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Supermercado() {
  const [activeTab, setActiveTab] = useState('comparativo');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState('R$');
  const [userLocale, setUserLocale] = useState('pt-BR');

  useEffect(() => {
    setUserCurrency(localStorage.getItem('userCurrency') || '$');
    setUserLocale(localStorage.getItem('userLocale') || 'es-MX');
  }, []);

  // Form State Simplificado
  const [productName, setProductName] = useState('');
  const [bestPrice, setBestPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [establishment, setEstablishment] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileId = localStorage.getItem('activeProfileId');
      const res = await fetch(`https://fincontrol-saas-production.up.railway.app/api/market?profileId=${profileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
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

  const handleAddProduct = async () => {
    if (!productName || !bestPrice || !establishment) return toast.error("¡Complete los datos básicos!");
    
    try {
      const token = localStorage.getItem('token');
      const profileId = localStorage.getItem('activeProfileId');
      const res = await fetch('https://fincontrol-saas-production.up.railway.app/api/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productName, bestPrice: Number(bestPrice), quantity: Number(quantity), establishment, profileId })
      });

      if (res.ok) {
        toast.success("¡Producto Guardado! 💎🛒");
        setShowAddModal(false);
        setProductName('');
        setBestPrice('');
        setQuantity('1');
        setEstablishment('');
        fetchData();
      }
    } catch (err) {
      toast.error("Falla al guardar.");
    }
  };

  return (
    <Layout>
      <div className="mb-10 fade-in px-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
                 <ShoppingCart className="w-8 h-8 text-white"/>
              </div>
              Supermercado Inteligente
           </h1>
           <p className="text-slate-500 font-bold ml-16 mt-2 text-lg italic">
              Simples. Prático. Rápido.
           </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-orange-600 text-white font-black px-8 py-5 rounded-[2.5rem] shadow-xl flex items-center gap-3 hover:scale-105 transition-all text-sm active:scale-95">
           <Plus className="w-5 h-5" /> Añadir Produto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 fade-in">
         <div className="space-y-6">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Sua Lupa</h3>
               </div>
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold outline-none" placeholder="O que você busca?" />
               </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center mb-6"><Package className="w-8 h-8 text-orange-400" /></div>
               <h3 className="text-2xl font-black mb-2">{products.length} Itens</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No seu Inventário</p>
            </div>
         </div>

         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                  {products.length === 0 ? (
                    <div className="col-span-full py-20 text-center font-black text-slate-300">Nenhum produto registrado ainda.</div>
                  ) : (
                    products.filter(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase())).map(prod => (
                      <div key={prod.id} className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 hover:border-orange-500/30 transition-all group relative">
                         <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Tag className="w-6 h-6 text-orange-500" /></div>
                            <div className="text-right">
                               <div className="text-[10px] font-black text-slate-400 uppercase">{prod.establishment}</div>
                               <div className="text-xl font-black text-slate-800">{userCurrency} {prod.bestPrice.toLocaleString(userLocale, { minimumFractionDigits: 2 })}</div>
                            </div>
                         </div>
                         <h3 className="font-black text-slate-700 mb-1">{prod.productName}</h3>
                         <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                            <span>Cant: {prod.quantity || 1}</span>
                            <span className="text-green-600 font-bold">Un: {userCurrency} {(prod.bestPrice / (prod.quantity || 1)).toLocaleString(userLocale, { minimumFractionDigits: 2 })}</span>
                         </div>
                         {/* AÇÕES DE ELITE */}
                         <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={async () => {
                                if(!confirm('¿Deseas eliminar este item?')) return;
                                try {
                                  const token = localStorage.getItem('token');
                                  const profileId = localStorage.getItem('activeProfileId');
                                  await fetch(`https://fincontrol-saas-production.up.railway.app/api/market/${prod.id}?profileId=${profileId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                  fetchData();
                                  toast.success('¡Eliminado! ⚔️');
                                } catch(e) { toast.error('Falla al eliminar'); }
                              }}
                              className="p-2 bg-white border border-slate-100 text-slate-300 hover:text-red-500 rounded-xl"
                            >
                               <X className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
         </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
           <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-md overflow-hidden p-12 border border-slate-100">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Novo Item</h2>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"><X className="text-slate-400 w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                 <div>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all" placeholder="Nome do Produto (Cerveja, Arroz...)" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" value={bestPrice} onChange={(e) => setBestPrice(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all" placeholder={`Preço Total (${userCurrency})`} />
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all" placeholder="Quant" />
                 </div>
                 
                 <div>
                    <input type="text" value={establishment} onChange={(e) => setEstablishment(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-black focus:border-orange-500 outline-none transition-all" placeholder="Onde comprou? (Extra, Assaí...)" />
                 </div>

                 <button onClick={handleAddProduct} className="w-full bg-slate-900 text-white font-black py-6 rounded-[3rem] shadow-xl hover:bg-black transition-all transform active:scale-95 text-lg">Salvar no Alfred 🕵️‍♂️</button>
              </div>
           </div>
        </div>
      )}
    </Layout>
  );
}
