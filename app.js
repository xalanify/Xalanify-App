import { APP_VERSION, APP_STATUS, APP_AUTHOR, UPDATES_LOG, THEMES } from './constants.js';
import { MusicAPI } from './api.js';

const { useState, useEffect, useRef } = React;

function Xalanify() {
    const [user, setUser] = useState(localStorage.getItem('xal_user') || '');
    const [themeKey, setThemeKey] = useState(localStorage.getItem('xal_theme') || 'roxo');
    const [tab, setTab] = useState('home');
    const [settingTab, setSettingTab] = useState('themes');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [results, setResults] = useState([]);
    const [current, setCurrent] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef(new Audio());

    useEffect(() => {
        const activeTheme = THEMES[themeKey] || THEMES.roxo;
        document.documentElement.style.setProperty('--accent', activeTheme.primary);
        document.documentElement.style.setProperty('--bg', activeTheme.bg);
        document.documentElement.style.setProperty('--card', activeTheme.card);
        
        if(localStorage.getItem('xal_v') !== APP_VERSION && user) {
            setShowUpdateModal(true);
            localStorage.setItem('xal_v', APP_VERSION);
        }
        
        const up = () => audioRef.current.duration && setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        audioRef.current.addEventListener('timeupdate', up);
        lucide.createIcons();
        return () => audioRef.current.removeEventListener('timeupdate', up);
    }, [themeKey, tab, user, current]);

    const play = (s) => {
        setCurrent(s);
        audioRef.current.src = s.source;
        audioRef.current.play();
        setIsPlaying(true);
    };

    if (!user) return (
        <div className="h-screen flex flex-col items-center justify-center p-10 bg-black">
            <h1 className="text-6xl font-black italic mb-2">Xalanify</h1>
            <p className="text-red-600 text-[10px] font-bold mb-10 tracking-widest uppercase">{APP_STATUS}</p>
            <input id="un" type="text" placeholder="Teu nome..." className="w-full p-5 rounded-3xl bg-white/5 border border-white/10 mb-4 text-center text-white outline-none" />
            <button onClick={() => { const n = document.getElementById('un').value; if(n) setUser(n); localStorage.setItem('xal_user', n); }} className="w-full p-5 rounded-3xl bg-white text-black font-bold">Entrar</button>
        </div>
    );

    return (
        <div className="h-screen max-w-md mx-auto flex flex-col relative overflow-hidden bg-black text-white">
            <div className="absolute top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase italic shadow-lg">{APP_STATUS} v{APP_VERSION}</span>
            </div>

            {showUpdateModal && (
                <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8">
                    <div className="glass-card w-full max-w-sm rounded-[40px] p-8 border border-white/10 animate-pop">
                        <h3 className="text-2xl font-black italic mb-6">Xalanify {APP_VERSION}</h3>
                        <div className="space-y-4 mb-10">
                            {UPDATES_LOG[0].changes.map((c, i) => (
                                <div key={i} className="flex gap-3 text-sm opacity-60"><span>•</span>{c.text}</div>
                            ))}
                        </div>
                        <button onClick={() => setShowUpdateModal(false)} className="w-full p-5 bg-white text-black font-bold rounded-2xl uppercase text-xs">Entendido</button>
                    </div>
                </div>
            )}

            <main className="flex-1 overflow-y-auto p-6 pt-16 pb-48">
                {tab === 'home' && <h2 className="text-4xl font-black mb-10 italic">Explorar</h2>}
                
                {tab === 'search' && (
                    <div className="animate-pop">
                        <input onKeyDown={async (e) => { if(e.key === 'Enter') setResults(await MusicAPI.search(e.target.value)) }} className="w-full p-6 bg-white/5 rounded-[30px] border border-white/5 text-white outline-none mb-10" placeholder="Artistas, músicas..." />
                        <div className="space-y-6">
                            {results.map(s => (
                                <div key={s.id} className="flex items-center gap-4" onClick={() => play(s)}>
                                    <img src={s.image} className="w-16 h-16 rounded-2xl" />
                                    <div className="flex-1 truncate"><p className="text-sm font-black truncate">{s.name}</p><p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">{s.artist}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'settings' && (
                    <div className="animate-pop space-y-10">
                        <h2 className="text-3xl font-black italic">Ajustes</h2>
                        
                        {/* NOVO SISTEMA DE DROPDOWN PARA TEMAS */}
                        <div className="glass-card p-6 rounded-[30px] border border-white/5 space-y-4">
                            <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Tema da Interface</label>
                            <div className="relative">
                                <select 
                                    value={themeKey} 
                                    onChange={(e) => {setThemeKey(e.target.value); localStorage.setItem('xal_theme', e.target.value);}}
                                    className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl appearance-none outline-none font-bold text-sm text-accent"
                                >
                                    {Object.keys(THEMES).map(k => (
                                        <option key={k} value={k} className="bg-[#111] text-white">{THEMES[k].name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                    <i data-lucide="chevron-down" size={16}></i>
                                </div>
                            </div>
                        </div>

                        <div className="flex bg-white/5 p-1 rounded-2xl gap-1">
                            {['updates', 'about'].map(st => (
                                <button key={st} onClick={() => setSettingTab(st)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase ${settingTab === st ? 'bg-white text-black' : 'opacity-30'}`}>{st}</button>
                            ))}
                        </div>

                        {settingTab === 'updates' && (
                            <div className="space-y-4">
                                {UPDATES_LOG.map(log => (
                                    <div key={log.v} className="glass-card p-5 rounded-3xl border border-white/5 opacity-60">
                                        <p className="font-black text-[10px] text-accent mb-2 tracking-widest uppercase">Versão {log.v}</p>
                                        {log.changes.map((c, i) => (
                                            <div key={i} className="text-[10px] mb-1">• {c.text}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* PLAYER MINI */}
            {current && !isExpanded && (
                <div className="fixed bottom-28 left-4 right-4 bg-white text-black p-4 rounded-[30px] flex items-center justify-between z-50 shadow-2xl animate-pop" onClick={() => setIsExpanded(true)}>
                    <div className="flex items-center gap-3 truncate">
                        <img src={current.image} className="w-10 h-10 rounded-xl" />
                        <div className="truncate"><p className="text-[10px] font-black truncate">{current.name}</p><p className="text-[8px] opacity-60 font-bold uppercase">{current.artist}</p></div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"><i data-lucide={isPlaying ? "pause" : "play"} size={18}></i></button>
                </div>
            )}

            <nav className="fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-around p-8 z-40">
                {['home', 'search', 'library', 'settings'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`transition-all ${tab === t ? 'text-accent scale-110' : 'opacity-20'}`}><i data-lucide={t === 'library' ? 'layers' : t} size={24}></i></button>
                ))}
            </nav>

            {/* PLAYER FULLSCREEN MANTIDO CONFORME PEDIDO */}
            {isExpanded && (
                <div className="fixed inset-0 z-[100] bg-black p-8 flex flex-col animate-pop" style={{background: `linear-gradient(to bottom, #111, var(--bg))`}}>
                    <button onClick={() => setIsExpanded(false)} className="mb-8 opacity-20"><i data-lucide="chevron-down" size={32}></i></button>
                    <img src={current.image} className="w-full aspect-square rounded-[50px] shadow-2xl mb-12" />
                    <div className="mb-12"><h2 className="text-3xl font-black truncate">{current.name}</h2><p className="text-xl opacity-40 font-bold uppercase tracking-tighter">{current.artist}</p></div>
                    <div className="h-1.5 bg-white/10 rounded-full mb-12 overflow-hidden"><div className="h-full bg-accent transition-all" style={{width: `${progress}%`}}></div></div>
                    <div className="flex justify-center items-center gap-12">
                        <button onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-black active:scale-90 transition-all"><i data-lucide={isPlaying ? "pause" : "play"} size={40} fill="black"></i></button>
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Xalanify />);
