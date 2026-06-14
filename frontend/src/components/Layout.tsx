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
  Search,
  Moon,
  Bell,
  ShoppingCart,
  Car
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
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || localStorage.getItem('userEmail')?.split('@')[0] || 'Mestre');
    
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

  const toggleProfileMode = (mode: 'personal' | 'business') => {
    if (profileMode === mode) return;
    setProfileMode(mode);
    localStorage.setItem('profileMode', mode);
    
    const activeId = mode === 'business' ? businessProfileId : personalProfileId;
    if (activeId) {
       localStorage.setItem('activeProfileId', activeId);
    }
    window.dispatchEvent(new Event('profileModeChanged'));
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Movimentações', path: '/transactions', icon: ArrowRightLeft },
    { label: 'Relatórios', path: '/reports', icon: PieChart },
    { label: 'Metas', path: '/goals', icon: Target },
    { label: 'Supermercado', path: '/mercado', icon: ShoppingCart },
    { label: 'Garagem', path: '/veiculos', icon: Car },
    { label: 'Configurações', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-dark-bg text-white font-sans selection:bg-primary selection:text-black">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 glass px-6 lg:px-12 py-4 flex items-center justify-between border-b border-dark-border">
        {/* Left: Logo & Menus */}
        <div className="flex items-center gap-8">
          <NavLink to="/dashboard" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <img src="/logo-alfred-white.png" alt="Alfred Logo" className="h-8 object-contain" />
          </NavLink>
          
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/transactions' && location.pathname.includes('/receitas'));
              return (
                <NavLink 
                  key={item.label} 
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white/10 text-primary' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-neutral-400">
             <button className="hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
             <button className="hover:text-white transition-colors"><Moon className="w-5 h-5" /></button>
             <button className="hover:text-white transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
             </button>
          </div>

          <div className="h-8 w-[1px] bg-dark-border hidden md:block"></div>

          {/* Profile Switcher & Info */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-sm font-bold tracking-tight">Olá, {userName} 👋</span>
               <span className="text-[10px] text-neutral-500 font-medium">Seu mordomo financeiro a postos.</span>
            </div>

            {/* Selector de Perfil Animado */}
            <div className="bg-[#1A1A1A] p-1 rounded-full flex items-center border border-dark-border relative">
               <div 
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-dark-bg rounded-full shadow-md transition-transform duration-300 ease-in-out border border-white/5"
                  style={{ transform: profileMode === 'business' ? 'translateX(100%)' : 'translateX(0)' }}
               />
               <button 
                  onClick={() => toggleProfileMode('personal')}
                  className={`relative z-10 px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1 ${profileMode === 'personal' ? 'text-white' : 'text-neutral-500'}`}
               >
                  🧍 <span className="hidden sm:inline">Pessoal</span>
               </button>
               <button 
                  onClick={() => toggleProfileMode('business')}
                  className={`relative z-10 px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1 ${profileMode === 'business' ? 'text-primary' : 'text-neutral-500'}`}
               >
                  🏢 <span className="hidden sm:inline">Empresa</span>
               </button>
            </div>

            <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-dark-border flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all">
               <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-neutral-400 hover:text-white">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[73px] left-0 right-0 glass border-b border-dark-border z-40 p-4 animate-in slide-in-from-top-2">
           <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <NavLink 
                  key={item.label} 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white/10 text-primary' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" /> {item.label}
                </NavLink>
              ))}
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 relative">
        {children}
      </main>
    </div>
  );
}
