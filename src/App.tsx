import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Brain, 
  Network, 
  History, 
  Bolt, 
  Shield, 
  Radar, 
  Diamond, 
  ChevronRight, 
  Info,
  User,
  Search,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SentimentData, LogEntry } from './types';

// --- COMPONENTS ---

const Header = () => (
  <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#000f21]/80 backdrop-blur-xl border-b border-white/5">
    <div className="h-14 w-full px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00e479] animate-pulse"></div>
          <span className="font-bold text-base tracking-tight text-[#f1ffef] uppercase font-['Space_Grotesk']">
            AXON // SENTIMENT
          </span>
        </div>
        <div className="h-4 w-px bg-white/10"></div>
        <nav className="hidden md:flex items-center gap-1">
          <a href="#" className="px-3 py-1 bg-white/5 text-white font-semibold rounded-lg text-xs">Intelligence Terminal</a>
          <a href="#" className="px-3 py-1 text-xs text-white/60 hover:text-white transition-colors">Agent Deliberation</a>
          <a href="#" className="px-3 py-1 text-xs text-white/60 hover:text-white transition-colors">Vector Dynamics</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-white/5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e479]"></span>
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">SYNAPSE: 12ms</span>
          <span className="text-[9px] text-white/20">|</span>
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">SIGMA: 99.4%</span>
        </div>
        <button 
          onClick={() => setShowBacktest(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-[#00daf3] transition-all text-xs uppercase font-mono"
        >
          <Terminal size={14} className="text-[#00daf3]" />
          <span>Backtest</span>
          <kbd className="hidden lg:inline-block px-1 bg-white/10 text-white/40 rounded text-[9px] ml-1">CMD+B</kbd>
        </button>
        <div className="h-4 w-px bg-white/10"></div>
        <div className="w-8 h-8 rounded-full bg-[#f1ffef] flex items-center justify-center">
          <User size={18} className="text-[#003919]" />
        </div>
      </div>
    </div>
  </header>
);

const SentimentDial = ({ value }: { value: number }) => {
  const dashArray = 251.32;
  const dashOffset = dashArray - (dashArray * value) / 100;
  
  return (
    <div className="relative w-full max-w-[420px] aspect-[2/1] flex items-end justify-center">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 200 110">
        <defs>
          <linearGradient id="sentimentGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#ffb3b2" />
            <stop offset="28%" stopColor="#849585" />
            <stop offset="60%" stopColor="#00daf3" />
            <stop offset="100%" stopColor="#00e479" />
          </linearGradient>
        </defs>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#102034" strokeLinecap="round" strokeWidth="14" />
        <motion.path 
          initial={{ strokeDashoffset: dashArray }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d="M 20 100 A 80 80 0 0 1 180 100" 
          fill="none" 
          stroke="url(#sentimentGradient)" 
          strokeDasharray={dashArray} 
          strokeLinecap="round" 
          strokeWidth="14" 
        />
        
        <motion.g 
          style={{ originX: '100px', originY: '100px' }}
          animate={{ rotate: -90 + (value * 1.8) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <line x1="100" y1="100" x2="100" y2="18" stroke="#f1ffef" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="18" r="4" fill="#00ff88" />
          <circle cx="100" cy="100" r="7" fill="#f1ffef" />
          <circle cx="100" cy="100" r="3" fill="#031427" />
        </motion.g>

        <text x="14" y="108" fill="#ffb3b2" fontSize="6" fontWeight="600" className="font-mono">0</text>
        <text x="96" y="18" fill="#849585" fontSize="6" fontWeight="600" className="font-mono">50</text>
        <text x="178" y="108" fill="#00e479" fontSize="6" fontWeight="600" className="font-mono">100</text>
      </svg>
      
      <div className="absolute bottom-0 flex flex-col items-center text-center translate-y-2">
        <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold font-mono">Índice Cuántico</span>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl text-white font-bold tracking-tight font-['Space_Grotesk']">{value}</span>
          <span className="text-xs text-white/40 font-mono">/100</span>
        </div>
      </div>
    </div>
  );
};

const AgentCard = ({ result }: { result: any }) => {
  const Icon = result.id === 'fomo' ? Bolt : result.id === 'cautious' ? Shield : result.id === 'contrarian' ? Radar : Diamond;
  
  return (
    <motion.div 
      layout
      className="group bg-[#000f21] hover:bg-[#0b1c30] p-4 rounded-xl border border-white/5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: result.color }}></div>
      <div>
        <div className="flex items-center justify-between mb-4 pl-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center" style={{ color: result.color }}>
              <Icon size={18} />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block leading-tight font-mono">{result.name}</span>
              <span className="text-[9px] text-white/40 uppercase font-mono">{result.role}</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color }}></span>
        </div>

        <div className="my-4 pl-1">
          <div className="flex items-center justify-between mb-1">
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-bold uppercase tracking-wider font-mono" style={{ color: result.color }}>
              {result.stance}
            </span>
            <span className="text-[10px] font-semibold font-mono" style={{ color: result.color }}>{result.conviction}% Convicción</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.conviction}%` }}
              className="h-full rounded-full" 
              style={{ backgroundColor: result.color }}
            />
          </div>
        </div>

        <div className="bg-white/5 p-3 rounded-lg text-xs text-white/60 mb-4 pl-3 border-l border-white/10">
          <p className="italic leading-snug">"{result.reasoning}"</p>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
        <span>Emoción: {result.emotion}</span>
        <span className="flex items-center group-hover:text-white transition-colors">
          DETALLES <ChevronRight size={12} className="ml-0.5" />
        </span>
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [ticker, setTicker] = useState('NVDA');
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBacktest, setShowBacktest] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (agent: string, message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent,
      message,
      type
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const simulate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    addLog('System', `Iniciando ingesta de narrativas para ${ticker}...`, 'info');
    
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      });
      const result = await res.json();
      
      if (result.error) throw new Error(result.error);
      
      setData(result);
      addLog('Consensus Engine', `Simulación completada. Índice de sentimiento: ${result.sentimentIndex}.`, 'consensus');
      
      result.simulations.forEach((s: any) => {
        addLog(s.name, s.reasoning, 'info');
      });
      
    } catch (err: any) {
      addLog('System', `Error en simulación: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    simulate();
  }, []);

  return (
    <div className="min-h-screen bg-[#031427] text-white font-['Inter'] selection:bg-[#00ff88]/30">
      <Header />
      
      <main className="pt-20 pb-10 px-4 md:px-6 max-w-[1600px] mx-auto space-y-4">
        
        {/* TOP BAR: TICKER & STREAM */}
        <div className="bg-[#000f21] p-4 rounded-xl border border-white/5 shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <form onSubmit={simulate} className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-[#00daf3] transition-colors"
                placeholder="Buscar ticker... ej. BTC, SOL"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-mono uppercase bg-white/5 px-1.5 py-0.5 rounded">
                ENTER
              </div>
            </form>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['NVDA', 'BTC', 'ETH', 'SOL', 'TSLA'].map(t => (
                <button 
                  key={t}
                  onClick={() => { setTicker(t); simulate(); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-colors shrink-0 ${ticker === t ? 'bg-[#00e479]/20 text-[#00e479] border border-[#00e479]/30' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-transparent'}`}
                >
                  <span className="font-bold">{t}</span>
                  <span className="text-[10px] opacity-60">SENTIMENT</span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => simulate()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#00daf3] hover:bg-[#00daf3]/80 disabled:opacity-50 text-[#001f24] rounded-lg text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              <Activity size={14} className={loading ? "animate-spin" : ""} />
              {loading ? "Simulando..." : "Sincronizar Enjambre"}
            </button>
          </div>

          <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-lg text-xs font-mono text-white/40 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e479] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e479]"></span>
              </span>
              <span className="text-[#00e479] font-bold">SWARM ACTIVE</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="truncate flex-1 text-white/60">
              <span className="text-[#00daf3] font-bold">INGEST_STREAM &gt;&gt;</span> "Narrativa de mercado analizada mediante SLM distribuido. Detectando polaridades psicológicas..."
            </div>
          </div>
        </div>

        {/* CORE ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* MAIN DIAL */}
          <div className="lg:col-span-8 bg-[#000f21] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[450px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent"></div>
            
            <div className="w-full flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Brain className="text-[#00e479]" size={24} />
                <div>
                  <h2 className="text-sm font-bold text-white uppercase font-['Space_Grotesk'] tracking-widest">Métricas de Clima Emocional Colectivo</h2>
                  <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Vector Psicodinámico Ponderado • {ticker}</p>
                </div>
              </div>
              <div className="px-2 py-1 bg-white/5 border border-[#00e479]/20 rounded text-[9px] text-[#00e479] font-mono">
                VOLATILIDAD PSÍQUICA: 8.4σ
              </div>
            </div>

            {data && <SentimentDial value={data.sentimentIndex} />}

            <div className="w-full mt-10 text-center space-y-4">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
                <span className="text-xl font-bold tracking-widest text-[#00ff88] font-['Space_Grotesk']">
                  {data?.sentimentIndex && data.sentimentIndex > 60 ? 'FOMO BUY' : data?.sentimentIndex && data.sentimentIndex < 40 ? 'PANIC SELL' : 'HOLD / NEUTRAL'}
                </span>
                <span className="text-[10px] text-[#00daf3] bg-[#00daf3]/10 px-2 py-0.5 rounded font-bold uppercase font-mono">
                  {data?.sentimentIndex && data.sentimentIndex > 60 ? 'Codicia Aguda' : data?.sentimentIndex && data.sentimentIndex < 40 ? 'Miedo Extremo' : 'Estabilidad'}
                </span>
              </div>
              
              <div className="text-xs text-white/60 font-mono">
                Agregado Colectivo: 
                <span className="text-[#00ff88] font-bold ml-2">{data?.stats.long}% Long</span> / 
                <span className="text-white/40 mx-2">|</span>
                <span className="text-[#00daf3] font-bold">{data?.stats.hold}% Hold</span> / 
                <span className="text-white/40 mx-2">|</span>
                <span className="text-[#ffb3b2] font-bold">{data?.stats.panic}% Panic</span>
              </div>
            </div>

            <div className="w-full mt-8 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-end mb-2">
                <div className="text-[10px] text-white/40 uppercase font-mono font-bold">Cohesión de Enjambre</div>
                <div className="text-xs font-mono font-bold text-[#00ff88]">82%</div>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  className="h-full bg-[#00ff88] rounded-full" 
                />
              </div>
            </div>
          </div>

          {/* SIDE METRICS */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex-1 bg-[#000f21] p-5 rounded-xl border border-white/5 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest font-mono">Flujo de Liquidez vs Discurso</span>
                <span className="text-[9px] text-[#00daf3] bg-[#00daf3]/10 px-2 py-0.5 rounded font-bold uppercase font-mono">DIVERGENCIA BULL</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Agresividad Compradora', val: 88, color: '#00e479' },
                  { label: 'Sentimiento en Noticias', val: 64, color: '#00daf3' },
                  { label: 'Resistencia Minorista', val: 12, color: '#ffb3b2' }
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-mono mb-1.5">
                      <span className="text-white/40 uppercase">{m.label}</span>
                      <span className="font-bold" style={{ color: m.color }}>{m.val}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.val}%` }}
                        className="h-full rounded-full" 
                        style={{ backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-[#0b1c30] rounded-lg border border-white/5 text-[10px] text-white/60 leading-relaxed flex gap-3">
                <Info size={14} className="text-[#00daf3] shrink-0" />
                <p>Detección de "Short Squeeze" latente sobre posiciones minoristas apalancadas en zona de soporte clave.</p>
              </div>
            </div>

            <div className="bg-[#000f21] p-5 rounded-xl border border-white/5 shadow-2xl border-t-2 border-t-[#00daf3]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest font-mono">Hedge Engine Signal</span>
                <span className="text-[9px] text-[#00e479] bg-[#00e479]/10 px-2 py-0.5 rounded font-bold uppercase font-mono">EJECUCIÓN ÓPTIMA</span>
              </div>
              <div className="mb-6">
                <div className="text-2xl font-bold text-white font-['Space_Grotesk']">DELTA POSITIVO (+0.64)</div>
                <p className="text-[10px] text-white/40 mt-1 uppercase font-mono">Asignación recomendada por enjambre: 70% Spot Largo / 30% Put OTM</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded border border-white/5">
                  <span className="text-[8px] text-white/20 uppercase font-mono block">RIESGO RUINA</span>
                  <span className="text-xs font-bold text-white">0.04%</span>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/5">
                  <span className="text-[8px] text-white/20 uppercase font-mono block">ALPHA ESPERADO</span>
                  <span className="text-xs font-bold text-[#00e479]">+14.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AGENTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Network className="text-[#00daf3]" size={20} />
              <h3 className="text-sm font-bold text-white uppercase font-['Space_Grotesk'] tracking-widest">Mesa Redonda: Deliberación de Arquetipos</h3>
            </div>
            <span className="text-[9px] text-white/20 uppercase font-mono tracking-widest">Click en tarjeta para inspeccionar tokens internos</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode='popLayout'>
              {data?.simulations.map((s, i) => (
                <AgentCard key={s.id} result={s} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* LOG FEED */}
        <div className="bg-[#000f21] rounded-xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00daf3]"></span>
              <span className="text-[10px] font-bold text-white uppercase font-mono tracking-widest">Log de Tensión Interna & Transmisión Telegráfica</span>
            </div>
            <div className="flex items-center gap-4 text-[9px] text-white/20 font-mono">
              <span>BUFFER: 256 LINEAS</span>
              <span className="px-1.5 py-0.5 bg-[#00e479]/10 text-[#00e479] rounded uppercase font-bold">EN VIVO</span>
            </div>
          </div>
          <div 
            ref={logContainerRef}
            className="p-4 h-48 overflow-y-auto font-mono text-[11px] space-y-1.5 scrollbar-thin scrollbar-thumb-white/10"
          >
            {logs.length === 0 && <div className="text-white/20 italic">Esperando inicialización de enjambre...</div>}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-1 duration-300">
                <span className="text-white/20 shrink-0">[{log.timestamp}]</span>
                <span className="font-bold shrink-0" style={{ color: log.type === 'consensus' ? '#00e479' : log.type === 'error' ? '#ff334b' : '#00daf3' }}>
                  &lt;{log.agent}&gt;
                </span>
                <span className={log.type === 'consensus' ? 'text-[#00e479]' : 'text-white/80'}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* BACKTEST MODAL */}
      <AnimatePresence>
        {showBacktest && (
          <div className="fixed inset-0 z-[100] bg-[#031427]/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#000f21] max-w-lg w-full p-6 rounded-xl border border-white/10 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-[#00daf3]">
                  <History size={20} />
                  <span className="text-sm font-bold uppercase font-['Space_Grotesk'] tracking-widest">Motor de Simulación Retrospectiva</span>
                </div>
                <button 
                  onClick={() => setShowBacktest(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs text-white/60 leading-relaxed font-['Inter']">
                <p>Configure el marco temporal histórico para evaluar el rendimiento del enjambre frente a caídas imprevistas:</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Flash Crash May 2021', 'SVB Depeg Mar 2023', 'Black Monday Aug 2024'].map(event => (
                    <button key={event} className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-[10px] text-white/80 border border-white/5 transition-colors">
                      {event}
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex justify-between items-end mb-2 font-mono">
                    <span className="text-[9px] text-white/20 uppercase font-bold">Precisión de Predicción en Shocks</span>
                    <span className="text-[#00e479] font-bold">89.4%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00e479]" style={{ width: '89.4%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  onClick={() => setShowBacktest(false)}
                  className="px-4 py-2 bg-[#f1ffef] hover:bg-[#00ff88] text-[#003919] text-[10px] font-bold rounded uppercase transition-all"
                >
                  Ejecutar Replay Swarm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full bg-[#000f21]/60 backdrop-blur-md border-t border-white/5 mt-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[9px] text-white/20 uppercase font-mono">QUANT RISK NODE 04</span>
            <span className="text-[9px] text-white/40 font-mono">Obsidian Frame v4.18 // Zero-Waste Canvas</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[9px] text-[#00e479] font-mono font-bold uppercase tracking-widest animate-pulse">STREAM STATUS: NOMINAL</span>
            <span className="text-[9px] text-white/20 font-mono">© 2026 AXON INTELLIGENCE LABS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
