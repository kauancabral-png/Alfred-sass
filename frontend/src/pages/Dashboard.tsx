import React from 'react';
import Layout from '../components/Layout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  CreditCard,
  MessageCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  ArrowRightLeft,
  Apple
} from 'lucide-react';

export default function Dashboard() {
  // Dados estáticos baseados na imagem
  const ritmoData = [
    { day: '1', esteMes: 0, mesPassado: 0 },
    { day: '5', esteMes: 500, mesPassado: 400 },
    { day: '10', esteMes: 700, mesPassado: 600 },
    { day: '15', esteMes: 1500, mesPassado: 1200 },
    { day: '20', esteMes: 3200, mesPassado: 1800 },
    { day: '25', esteMes: 3400, mesPassado: 2000 },
    { day: '31', esteMes: 3400, mesPassado: 2500 },
  ];

  const transacoes = [
    { id: 1, desc: 'Compra débito PAO DE MEL', cat: 'Supermercado', val: '-R$ 25,85', icon: CreditCard },
    { id: 2, desc: 'Pagamento de Pix QR Code ZAPIZI', cat: 'Serviços', val: '-R$ 10,00', icon: ArrowRightLeft },
    { id: 3, desc: 'Pagamento de Pix QR Code ZAPIZI', cat: 'Serviços', val: '-R$ 10,00', icon: ArrowRightLeft },
    { id: 4, desc: 'Compra débito MERCADAO ATACADISTA', cat: 'Supermercado', val: '-R$ 13,98', icon: CreditCard },
    { id: 5, desc: 'Compra débito MERCADAO ATACADISTA', cat: 'Supermercado', val: '-R$ 6,18', icon: CreditCard },
  ];

  return (
    <Layout>
      <div className="font-sans text-white pb-20">
        
        {/* Top Header - Tabs */}
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-[#111] p-1.5 rounded-full border border-white/5 overflow-x-auto">
                <button className="flex items-center gap-2 px-4 py-1.5 bg-[#0c2a1b] text-emerald-400 rounded-full text-sm font-medium border border-emerald-900/30 whitespace-nowrap">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Visão geral
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    <ArrowRightLeft className="w-4 h-4" /> Transações
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    <CreditCard className="w-4 h-4" /> Parcelamentos
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    <Apple className="w-4 h-4" /> Assinaturas
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    Categorias
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                    Cartões
                </button>
            </div>
        </div>

        {/* Top Section: Greeting & Ritmo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            
            {/* Greeting Block */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-400 mb-2">Seu dinheiro pode trabalhar melhor por você.</h2>
                    <p className="text-slate-300 text-sm leading-relaxed mb-8">
                        Opa Lari, notei que seu gasto com supermercado disparou 68% esse mês!
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 min-w-[140px]">
                        <p className="text-[10px] text-slate-500 font-bold mb-1">GASTO EM JUNHO</p>
                        <p className="text-lg font-bold">R$ 2.715</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 min-w-[140px]">
                        <p className="text-[10px] text-slate-500 font-bold mb-1">VS. MÊS ANTERIOR</p>
                        <p className="text-lg font-bold text-red-500 flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" /> 54%
                        </p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 min-w-[160px]">
                        <p className="text-[10px] text-slate-500 font-bold mb-1">MAIOR GASTO</p>
                        <p className="text-sm font-bold flex items-center gap-2 mt-1">
                            <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-[10px]">💰</div> Transferência ...
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Pierre
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 13 de Jun, de 2026
                    </div>
                </div>
            </div>

            {/* Ritmo de Gastos */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Ritmo de Gastos</h3>
                        <p className="text-2xl font-bold text-white mb-1">R$ 951,23 <span className="text-sm text-slate-400 font-normal">acima</span></p>
                        <p className="text-xs text-red-500 bg-red-500/10 inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium">
                            <TrendingUp className="w-3 h-3" /> +53.9%
                        </p>
                        <span className="text-[10px] text-slate-500 ml-2">vs R$ 1.763,57 mês anterior</span>
                    </div>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver todas <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>

                <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ritmoData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#1f1f1f" strokeDasharray="3 3" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#525252', fontSize: 10}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#525252', fontSize: 10}} tickFormatter={(val) => val === 0 ? 'R$ 0' : `R$ ${val/1000}k`} width={50} />
                            <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px'}} />
                            <Line type="monotone" dataKey="mesPassado" stroke="#525252" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                            <Line type="monotone" dataKey="esteMes" stroke="#ef4444" strokeWidth={2} dot={{r: 4, fill: '#ef4444'}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400"><div className="w-3 h-0.5 bg-red-500"></div> Este mês</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400"><div className="w-3 h-0.5 bg-slate-600 border-t border-dashed border-slate-400"></div> Mês passado</div>
                </div>
            </div>
        </div>

        {/* Middle Section: Contas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6 flex items-stretch">
                <div className="flex-1 pr-6 border-r border-white/5">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Contas Correntes</h3>
                            <p className="text-2xl font-bold text-white">R$ 15,62 <span className="text-sm text-slate-500 font-normal">saldo total</span></p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-orange-500 text-white flex items-center justify-center font-black text-xs">Itaú</div>
                                <div>
                                    <p className="text-sm font-medium">Itaú</p>
                                    <p className="text-[10px] text-slate-500">Conta corrente</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium">R$ 15,62</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[#1a1a1a] border border-white/10 text-white flex items-center justify-center text-xs">M</div>
                                <div>
                                    <p className="text-sm font-medium">Carteira Pierre</p>
                                    <p className="text-[10px] text-slate-500">Poupança</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium">R$ 0,00</p>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-6">2 contas</p>
                </div>
                <div className="w-[40%] pl-6 flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer group">
                    <CreditCard className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs">Nenhum cartão conectado</p>
                </div>
            </div>
            
            {/* Mapa de Calor Dummy */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Mapa de Calor</h3>
                        <p className="text-2xl font-bold text-white mb-1">R$ 2.714,80</p>
                        <p className="text-[10px] text-slate-500">Média diária: R$ 226,23</p>
                    </div>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver mais <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                
                <div className="mt-6">
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-center text-[10px] font-medium text-slate-500 mb-1">
                        <div className="text-center">D</div> <div className="h-6 rounded bg-[#2a1315] flex items-center justify-center text-red-900">7</div>
                        <div className="text-center">S</div> <div className="h-6 rounded bg-[#4a1515] flex items-center justify-center text-red-500">1</div> <div className="h-6 rounded bg-[#4a1515] flex items-center justify-center text-red-500">8</div>
                        <div className="text-center">T</div> <div className="h-6 rounded bg-[#7a1515] flex items-center justify-center text-red-300">2</div> <div className="h-6 rounded bg-[#5a1515] flex items-center justify-center text-red-400">9</div>
                        <div className="text-center">Q</div> <div className="h-6 rounded bg-[#8a1515] flex items-center justify-center text-red-200">3</div> <div className="h-6 rounded bg-[#6a1515] flex items-center justify-center text-red-300">10</div>
                        <div className="text-center">Q</div> <div className="h-6 rounded bg-[#9a1515] flex items-center justify-center text-red-100">4</div> <div className="h-6 rounded bg-[#ef4444] border border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] flex items-center justify-center text-white font-bold">11</div>
                        <div className="text-center">S</div> <div className="h-6 rounded bg-[#8a1515] flex items-center justify-center text-red-200">5</div> <div className="h-6 rounded bg-[#7a1515] flex items-center justify-center text-red-300">12</div>
                        <div className="text-center">S</div> <div className="h-6 rounded bg-[#6a1515] flex items-center justify-center text-red-300">6</div> <div className="h-6 rounded bg-[#2a1315] flex items-center justify-center text-red-900">13</div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">Menos <div className="w-2 h-2 rounded-full bg-[#2a1315]"></div><div className="w-2 h-2 rounded-full bg-[#5a1515]"></div><div className="w-2 h-2 rounded-full bg-[#8a1515]"></div><div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> Mais</div>
                    <div className="text-[10px] text-slate-500">Maior gasto <span className="text-red-500 font-bold ml-2">R$ 1.167,09 dia 11</span></div>
                </div>
            </div>
        </div>

        {/* Lower Section: Categorias, Recentes, Assinaturas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Principais Categorias */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6 lg:row-span-2">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Principais Categorias</h3>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver mais <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                
                <div className="flex text-[10px] text-slate-500 mb-4 border-b border-white/5 pb-2">
                    <div className="flex-1">Categoria</div>
                    <div className="w-20 text-right">Atual</div>
                    <div className="w-32 text-center">vs Mês Anterior</div>
                    <div className="w-16 text-center">Variação</div>
                    <div className="w-20 text-right">Anterior</div>
                </div>

                <div className="space-y-6">
                    {/* Item 1 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            💰 Transferência - PIX
                        </div>
                        <div className="w-20 text-right font-bold">R$ 1.471</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full w-[80%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">↘ 10%</span></div>
                        <div className="w-20 text-right text-slate-400">R$ 1.635</div>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            🛒 Supermercado
                        </div>
                        <div className="w-20 text-right font-bold">R$ 924</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-red-500 rounded-full w-[95%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded font-bold">↗ 68%</span></div>
                        <div className="w-20 text-right text-slate-400">R$ 550</div>
                    </div>
                    {/* Item 3 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            🛍️ Compras
                        </div>
                        <div className="w-20 text-right font-bold">R$ 98</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full w-[40%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">↘ 67%</span></div>
                        <div className="w-20 text-right text-slate-400">R$ 298</div>
                    </div>
                    {/* Item 4 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            🍔 Restaurantes, bares e...
                        </div>
                        <div className="w-20 text-right font-bold">R$ 71</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full w-[50%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">↘ 42%</span></div>
                        <div className="w-20 text-right text-slate-400">R$ 123</div>
                    </div>
                    {/* Item 5 */}
                    <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                            ⛽ Postos de gasolina
                        </div>
                        <div className="w-20 text-right font-bold">R$ 45</div>
                        <div className="w-32 px-4">
                            <div className="h-1 bg-[#1a1a1a] rounded-full relative"><div className="absolute top-0 left-0 h-full bg-slate-500 rounded-full w-[20%]"></div></div>
                        </div>
                        <div className="w-16 text-center"><span className="text-[10px] text-slate-500 bg-slate-500/10 px-1.5 py-0.5 rounded font-bold">novo</span></div>
                        <div className="w-20 text-right text-slate-400">--</div>
                    </div>
                </div>
            </div>

            {/* Transações Recentes */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transações Recentes</h3>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver todas <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mb-4">ONTEM</div>
                <div className="space-y-4">
                    {transacoes.map(t => (
                        <div key={t.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-slate-400">
                                    <t.icon className="w-4 h-4" />
                                </div>
                                <p className="text-xs font-bold truncate max-w-[200px]">{t.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">{t.cat}</span>
                                <span className="text-sm font-bold text-white w-20 text-right">{t.val}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-6">QUI, JUN 11</div>
            </div>

            {/* Assinaturas */}
            <div className="bg-[#111] rounded-[1.5rem] border border-white/5 p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Assinaturas</h3>
                        <p className="text-2xl font-bold text-white">R$ 22,90 <span className="text-sm text-slate-500 font-normal">/mês • 1 ativa</span></p>
                    </div>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        ver todas <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                            <Apple className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Apple</p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">🗓️ Próximo: 20 Jun</p>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-white">R$ 22,90</p>
                </div>
            </div>

        </div>
      </div>
    </Layout>
  );
}
