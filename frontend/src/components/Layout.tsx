import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu,
  X,
  MessageCircle,
  Zap,
  Bot,
  Eye,
  ChevronRight,
  ChevronDown,
  Settings
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#F4F7FA] font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 flex items-center justify-between p-4 bg-white shadow-sm h-16 transition-colors duration-500">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="z-10 p-2 text-black hover:opacity-80"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-80">
           <img src="/logo-alfred-black.png" alt="Logo" className="h-8 object-contain" />
        </NavLink>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="hidden md:block">
          <div className="p-6 flex items-center justify-center mb-4">
            <NavLink to="/dashboard" className="flex items-center justify-center transition-opacity hover:opacity-80">
              <img src="/logo-alfred-black.png" alt="Alfred Logo" className="h-14 object-contain drop-shadow-sm" />
            </NavLink>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1 mt-16 md:mt-0">
            <div className="text-[11px] uppercase text-gray-400 font-bold mb-4 tracking-wider pl-3 mt-4">Menú Principal</div>
            {/* Primary Menu */}
            <NavLink to="/upgrade" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Upgrade</span>
            </NavLink>
            <NavLink to="/fale-pierre" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Fale com o Pierre</span>
            </NavLink>
            <NavLink to="/agentes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">Agentes</span>
            </NavLink>
            <NavLink to="/vision" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Vision</span>
            </NavLink>

            <div className="flex items-center gap-2 mt-4 px-3">
               <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center relative bg-white">
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  <Settings className="w-5 h-5 text-gray-500" />
               </button>
            </div>

            <div className="mt-6 mb-2">
                <button className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    <span>Whatsapp</span>
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="mb-2">
                <button className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    <span>Recentes</span>
                    <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            <div className="px-3 py-1">
                <span className="text-xs text-slate-500 font-medium">Últimos 30 dias</span>
            </div>

            <div className="px-3 py-2 text-sm text-slate-300 truncate hover:text-white cursor-pointer">
                Pix feitos para Leticia Rodrigu...
            </div>

            <div className="mt-8 px-3 py-4 text-xs text-slate-600 leading-relaxed">
                Você chegou ao fim do seu<br/>histórico
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 md:pt-0 bg-[#0c0c0c]">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-full">
          {children}
        </div>
      </main>
      
      {/* Mobile Back-drop */}
      <div 
        className={`fixed inset-0 bg-black/80 z-30 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}
