import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import LandingPage from './pages/LandingPage';
import ThankYouPage from './pages/ThankYou';
import Bot from './pages/Bot';
import SettingsPage from './pages/Settings';
import FilteredReport from './pages/FilteredReport';
import CategoriesHub from './pages/CategoriesHub';
import Veiculos from './pages/Veiculos';
import Mercado from './pages/Mercado';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import AdminPanel from './pages/AdminPanel';
import { ArrowUpCircle, ArrowDownCircle, ShoppingCart, Car, AlertTriangle, Layers, Home, Coffee, Activity } from 'lucide-react';

// Rota protegida (Guarda-Costas)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/obrigado" element={<ThankYouPage />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos" element={<TermsOfUse />} />
          <Route path="/alfred-super-admin" element={<AdminPanel />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/bot" element={<ProtectedRoute><Bot /></ProtectedRoute>} />
          
          <Route path="/receitas" element={<ProtectedRoute><FilteredReport title="Suas Receitas" subtitle="Acompanhe todas as entradas de capital." typeFilter="INCOME" icon={ArrowUpCircle} /></ProtectedRoute>} />
          <Route path="/despesas" element={<ProtectedRoute><FilteredReport title="Suas Despesas" subtitle="Todas as saídas do cofre principal." typeFilter="EXPENSE" icon={ArrowDownCircle} /></ProtectedRoute>} />
          
          <Route path="/mercado" element={<ProtectedRoute><Mercado /></ProtectedRoute>} />
          <Route path="/veiculos" element={<ProtectedRoute><Veiculos /></ProtectedRoute>} />
          
          <Route path="/moradia" element={<ProtectedRoute><FilteredReport title="Moradia & Casa" subtitle="Gastos de Aluguel, Condomínio, Contas de Consumo." typeFilter="EXPENSE" keyword="moradia" icon={Home} /></ProtectedRoute>} />
          <Route path="/lazer" element={<ProtectedRoute><FilteredReport title="Lazer & Diversão" subtitle="Restaurantes, Festas, Viagens e Hobbies." typeFilter="EXPENSE" keyword="lazer" icon={Coffee} /></ProtectedRoute>} />
          <Route path="/saude" element={<ProtectedRoute><FilteredReport title="Saúde & Bem-Estar" subtitle="Médico, Farmácia, Academia e Seguros." typeFilter="EXPENSE" keyword="saude" icon={Activity} /></ProtectedRoute>} />
          <Route path="/dividas" element={<ProtectedRoute><FilteredReport title="Dívidas e Empréstimos" subtitle="Listagem de dívidas e cartões de crédito." typeFilter="EXPENSE" keyword="divida" icon={AlertTriangle} /></ProtectedRoute>} />
          <Route path="/categorias" element={<ProtectedRoute><CategoriesHub /></ProtectedRoute>} />
          
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
