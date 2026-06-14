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
  ChevronDown
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0c0c0c] text-white font-sans overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 flex items-center justify-center p-4 bg-[#0a0a0a] border-b border-white/5 h-16">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="absolute left-4 z-10 p-2 text-white hover:opacity-80"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-80">
           <img src="/logo-alfred-white.png" alt="Logo" className="h-8 object-contain" />
        </NavLink>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="hidden md:flex p-6 items-center justify-between">
            <NavLink to="/dashboard" className="flex items-center hover:opacity-80">
               <img src="/logo-alfred-white.png" alt="Logo" className="h-6 object-contain opacity-80" />
            </NavLink>
            <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center hover:bg-white/5">
                <Menu className="w-4 h-4 text-slate-400" />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1 mt-16 md:mt-0">
            {/* Primary Menu */}
            <NavLink to="/upgrade" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Upgrade</span>
            </NavLink>
            <NavLink to="/fale-pierre" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Fale com o Pierre</span>
            </NavLink>
            <NavLink to="/agentes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">Agentes</span>
            </NavLink>
            <NavLink to="/vision" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Vision</span>
            </NavLink>

            <div className="mt-6 mb-2">
                <button className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors">
                    <span>Whatsapp</span>
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="mb-2">
                <button className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors">
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
