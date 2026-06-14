import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Target, 
  PieChart, 
  Settings, 
  LogOut,
  Menu,
  MessageCircle,
  Briefcase,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingCart,
  Car,
  User,
  AlertTriangle,
  Layers,
  Plus,
  CreditCard,
  TrendingUp,
  FileText,
  BarChart2,
  Lock
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const profileMode = localStorage.getItem('profileMode') || 'PERSONAL';

  useEffect(() => {
    const checkAccess = async () => {
       const token = localStorage.getItem('token');
       if (!token) { setLoading(false); return; }
       try {
          // Auto-detección de URL para evitar errores de Hardcode 🎩
          let apiUrl = 'https://alfred-backend-8t7n.onrender.com/api';
          if (window.location.origin.includes('onrender.com')) {
              apiUrl = window.location.origin + '/api';
          }
          const res = await fetch(`${apiUrl}/auth/me`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.status === 403) setIsBlocked(true);
       } catch (e) {
          console.error("Erro ao verificar acesso global", e);
       } finally {
          setLoading(false);
       }
    };
    checkAccess();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const personalMenu = [
    { icon: LayoutDashboard, label: 'Visión Estratégica', path: '/dashboard' },
    { icon: ArrowRightLeft, label: 'Transacciones', path: '/transactions' },
    { icon: ArrowUpCircle, label: 'Mis Ingresos', path: '/receitas' },
    { icon: ArrowDownCircle, label: 'Mis Gastos', path: '/despesas' },
    { icon: Layers, label: 'Categorías', path: '/categorias' },
    { icon: ShoppingCart, label: 'Supermercado', path: '/mercado' },
    { icon: Car, label: 'Vehículos', path: '/veiculos' },
    { icon: AlertTriangle, label: 'Mis Deudas', path: '/dividas' },
    { icon: Target, label: 'Mis Metas', path: '/goals' },
    { icon: PieChart, label: 'Gráficos', path: '/reports' },
    { icon: MessageCircle, label: 'Robot Alfred', path: '/bot' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  const businessMenu = [
    { icon: LayoutDashboard, label: 'Panel de Negocios', path: '/dashboard' },
    { icon: CreditCard, label: 'Gestión de Cuentas y Bancos', path: '/transactions?category=bancos' },
    { icon: ArrowRightLeft, label: 'Flujo de Caja Real', path: '/transactions?category=flujo' },
    { icon: TrendingUp, label: 'Estado de Resultados (ER)', path: '/reports?view=er' },
    { icon: AlertTriangle, label: 'Cuentas por Pagar y Cobrar', path: '/dividas' },
    { icon: User, label: 'Nómina (RRHH)', path: '/transactions?category=payroll' },
    { icon: ShoppingCart, label: 'Insumos e Inventario', path: '/mercado' },
    { icon: Car, label: 'Logística y Flota', path: '/veiculos' },
    { icon: BarChart2, label: 'Análisis de Planificación', path: '/reports?view=planeacion' },
    { icon: Target, label: 'Metas Financieras (KPIs)', path: '/goals' },
  ];

  const menuItems = profileMode === 'BUSINESS' ? businessMenu : personalMenu;
  const themeClass = profileMode === 'BUSINESS' ? 'bg-slate-900 border-blue-500/20' : 'bg-primary border-primary-light/30';
  const activeClass = profileMode === 'BUSINESS' ? 'bg-blue-600 text-white' : 'bg-white text-primary';

  if (!loading && isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-6 text-center font-sans">
           <div className="w-32 h-32 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-xl"><Lock className="w-16 h-16" /></div>
           <h2 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">Área Vip Bloqueada</h2>
           <p className="text-slate-500 font-bold mb-10 text-xl max-w-lg mx-auto italic">Tu mayordomo detectó que tu plan no está activo. Regulariza ahora para retomar el control.</p>
           <button onClick={() => window.location.href='/#planos'} className="bg-slate-900 text-white font-black px-12 py-6 rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl uppercase tracking-widest font-sans">Activar Acceso</button>
      </div>
    );
  }

  return (
    <div className="app-wrapper flex h-[100dvh] overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 w-full z-50 flex items-center justify-between p-4 shadow-md h-16 transition-colors duration-500 header`}>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="absolute left-4 z-10 p-2 -ml-2 text-white">
          <Menu className="w-8 h-8" />
        </button>
        <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity z-0 flex items-center justify-center">
           <img src="/logo-alfred-white.png" alt="Alfred Logo" className="h-10 md:h-12 object-contain" />
        </NavLink>
        <div className="flex items-center gap-2">
           <button className="header-icon-btn flex items-center justify-center relative">
              <span className="absolute top-0 right-0 notification-badge flex items-center justify-center">3</span>
              <Settings className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 sidebar transition-all duration-500 ease-in-out flex flex-col`}
      >
        <div className="hidden md:block">
          <div className="p-6 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-center">
            <NavLink to="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <span className="sidebar-logo-icon">F</span>
              <span className="sidebar-logo text-white">Finpath</span>
            </NavLink>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 mt-16 md:mt-0">
          <div className="text-xs uppercase text-muted font-semibold mb-4 tracking-wider pl-3">Menú Principal</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const fullPath = item.path;
            const currentFull = location.pathname + location.search;
            const isActive = currentFull === fullPath || (location.pathname === fullPath && !location.search && fullPath.includes('tab=cuentas'));

            return (
              <NavLink 
                key={item.label} 
                to={item.path}
                className={() => 
                  `nav-item flex items-center ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5 nav-icon" />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <div className="sidebar-footer flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="user-avatar">S</div>
             <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Steven</span>
                <span className="text-xs text-muted">Pro Plan</span>
             </div>
          </div>
          <button onClick={handleLogout} className="text-muted hover:text-danger transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 fade-in main-content relative">
        <div className="hidden md:flex header items-center justify-between px-8 absolute top-0 w-full z-10">
           <div className="flex items-center gap-6">
              <span className="text-white font-bold tracking-tight">Dashboard</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="theme-toggle">
                 <span className="theme-toggle-btn active flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-current"></span> Light</span>
                 <span className="theme-toggle-btn flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-current"></span> Dark</span>
              </div>
              <button className="header-icon-btn relative flex items-center justify-center">
                 <span className="absolute top-0 right-0 notification-badge flex items-center justify-center">1</span>
                 <Settings className="w-4 h-4" />
              </button>
           </div>
        </div>
        <div className="p-4 md:p-8 max-w-7xl mx-auto md:mt-[60px]">
          {children}
        </div>
      </main>
      
      {/* Mobile Back-drop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-overlay z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Bottom Navigation para Mobile */}
      <div className="bottom-nav">
         <NavLink to="/dashboard" className={({isActive}) => `bottom-nav-item ${isActive ? 'active' : ''}`}><LayoutDashboard className="nav-icon" /><span>Home</span></NavLink>
         <NavLink to="/transactions" className={({isActive}) => `bottom-nav-item ${isActive ? 'active' : ''}`}><ArrowRightLeft className="nav-icon" /><span>Moves</span></NavLink>
         <NavLink to="/reports" className={({isActive}) => `bottom-nav-item ${isActive ? 'active' : ''}`}><PieChart className="nav-icon" /><span>Stats</span></NavLink>
         <NavLink to="/bot" className={({isActive}) => `bottom-nav-item ${isActive ? 'active' : ''}`}><MessageCircle className="nav-icon" /><span>AI</span></NavLink>
      </div>
    </div>
  );
}
