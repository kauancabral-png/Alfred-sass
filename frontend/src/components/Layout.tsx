import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Target, 
  PieChart, 
  Settings, 
  LogOut,
  Menu,
  X,
  MessageCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingCart,
  Car,
  AlertTriangle,
  Layers,
  User
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileMode, setProfileMode] = useState<'personal' | 'business'>(() => {
    return (localStorage.getItem('profileMode') as 'personal' | 'business') || 'personal';
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [personalProfileId, setPersonalProfileId] = useState<string | null>(null);
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`https://alfred-backend-8t7n.onrender.com/api/auth/me?cache=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const profiles = data.profiles || [];
          const personal = profiles.find((p: any) => p.type === 'PERSONAL');
          const business = profiles.find((p: any) => p.type === 'BUSINESS');
          
          if (personal) setPersonalProfileId(personal.id);
          if (business) setBusinessProfileId(business.id);
          
          // Ensure activeProfileId is initially set
          const savedMode = localStorage.getItem('profileMode') || 'personal';
          const activeId = savedMode === 'business' ? business?.id : personal?.id;
          if (activeId) {
             localStorage.setItem('activeProfileId', activeId);
          }
        }
      } catch (e) { console.error(e); }
    };
    fetchProfiles();

    const handleStorageChange = () => {
      const mode = localStorage.getItem('profileMode') as 'personal' | 'business';
      if (mode) setProfileMode(mode);
    };
    window.addEventListener('profileModeChanged', handleStorageChange);
    return () => window.removeEventListener('profileModeChanged', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileMode');
    localStorage.removeItem('activeProfileId');
    navigate('/login');
  };

  const toggleProfileMode = () => {
    const newMode = profileMode === 'personal' ? 'business' : 'personal';
    setProfileMode(newMode);
    localStorage.setItem('profileMode', newMode);
    
    // Globally sync activeProfileId so all pages know what to fetch
    const activeId = newMode === 'business' ? businessProfileId : personalProfileId;
    if (activeId) {
       localStorage.setItem('activeProfileId', activeId);
    }
    
    window.dispatchEvent(new Event('profileModeChanged'));
  };

  const personalMenu = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/dashboard' },
    { icon: ArrowRightLeft, label: 'Transações', path: '/transactions' },
    { icon: ArrowUpCircle, label: 'Receitas', path: '/receitas' },
    { icon: ArrowDownCircle, label: 'Despesas', path: '/despesas' },
    { icon: Layers, label: 'Categorias', path: '/categorias' },
    { icon: ShoppingCart, label: 'Mercado', path: '/mercado' },
    { icon: Car, label: 'Veículos', path: '/veiculos' },
    { icon: AlertTriangle, label: 'Dívidas', path: '/dividas' },
    { icon: Target, label: 'Metas', path: '/goals' },
    { icon: PieChart, label: 'Relatórios', path: '/reports' },
    { icon: MessageCircle, label: 'Alfred AI', path: '/bot' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  const businessMenu = [
    { icon: LayoutDashboard, label: 'Painel de Negócios', path: '/dashboard' },
    { icon: ArrowRightLeft, label: 'Fluxo de Caixa', path: '/transactions?category=flujo' },
    { icon: PieChart, label: 'DRE / Resultados', path: '/reports?view=er' },
    { icon: AlertTriangle, label: 'Contas a Pagar/Receber', path: '/dividas' },
    { icon: User, label: 'Folha de Pagamento', path: '/transactions?category=payroll' },
    { icon: ShoppingCart, label: 'Insumos e Estoque', path: '/mercado' },
    { icon: Car, label: 'Logística e Frota', path: '/veiculos' },
    { icon: Target, label: 'Metas (KPIs)', path: '/goals' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  const menuItems = profileMode === 'personal' ? personalMenu : businessMenu;
  const isBusiness = profileMode === 'business';
  
  const bgLayout = isBusiness ? 'bg-[#0A0A0A]' : 'bg-[#F4F7FA]';
  const bgSidebar = 'bg-[#111111]';
  const borderClass = 'border-white/5';
  const textClass = 'text-white';
  const textMuted = 'text-gray-400';
  const logoSrc = '/logo-alfred-white.png';

  return (
    <div className={`flex h-[100dvh] overflow-hidden ${bgLayout} font-sans`}>
      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 w-full z-50 flex items-center justify-center p-4 ${bgSidebar} border-b ${borderClass} h-16 shadow-sm`}>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="absolute left-4 z-10 p-2 text-white hover:opacity-80"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity z-0 flex items-center justify-center">
           <img src={logoSrc} alt="Alfred Logo" className="h-10 object-contain" />
        </NavLink>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 ${bgSidebar} border-r ${borderClass} transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="hidden md:block">
          <div className={`p-6 flex items-center justify-center border-b ${borderClass} mb-2`}>
            <NavLink to="/dashboard" className="flex items-center justify-center transition-opacity hover:opacity-80">
              <img src={logoSrc} alt="Alfred Logo" className="h-14 object-contain drop-shadow-sm" />
            </NavLink>
          </div>
          <div className="px-4 mb-2 mt-2">
            <div className="bg-[#1a1a1a] p-1 rounded-xl flex items-center">
              <button 
                onClick={() => profileMode !== 'personal' && toggleProfileMode()}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${profileMode === 'personal' ? 'bg-[#2a2a2a] text-white shadow-sm' : `${textMuted} hover:${textClass}`}`}
              >
                Pessoal
              </button>
              <button 
                onClick={() => profileMode !== 'business' && toggleProfileMode()}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${profileMode === 'business' ? 'bg-[#2a2a2a] text-white shadow-sm' : `${textMuted} hover:${textClass}`}`}
              >
                Empresarial
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1 mt-16 md:mt-0">
            <div className="md:hidden bg-[#1a1a1a] p-1 rounded-xl flex items-center mb-4 mt-2">
              <button 
                onClick={() => profileMode !== 'personal' && toggleProfileMode()}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${profileMode === 'personal' ? 'bg-[#2a2a2a] text-white shadow-sm' : `${textMuted} hover:${textClass}`}`}
              >
                Pessoal
              </button>
              <button 
                onClick={() => profileMode !== 'business' && toggleProfileMode()}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${profileMode === 'business' ? 'bg-[#2a2a2a] text-white shadow-sm' : `${textMuted} hover:${textClass}`}`}
              >
                Empresarial
              </button>
            </div>
            <div className={`text-[11px] uppercase text-gray-500 font-bold mb-4 tracking-wider pl-3 mt-2`}>Menú Principal</div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink 
                  key={item.label} 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-full transition-all duration-200 ${
                    isActive 
                      ? (isBusiness ? 'bg-[#00FF00]/10 text-[#00FF00] font-semibold' : 'bg-[#2a2a2a] text-white font-semibold shadow-sm')
                      : `${textMuted} hover:bg-[#1a1a1a] hover:${textClass}`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (isBusiness ? 'text-[#00FF00]' : 'text-white') : ''}`} />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              );
            })}
        </div>

        <div className={`p-4 border-t ${borderClass} mt-auto`}>
          <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-3 w-full rounded-full ${textMuted} hover:bg-red-500/10 hover:text-red-400 transition-colors`}>
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto overflow-x-hidden pt-16 md:pt-0 ${bgLayout}`}>
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-full">
          {children}
        </div>
      </main>
      
      {/* Mobile Back-drop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}
