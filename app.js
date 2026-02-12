import { APP_VERSION, APP_AUTHOR, UPDATES_LOG, THEMES } from './constants.js';
import { MusicAPI } from './api.js';

const { useState, useEffect, useRef } = React;

function Xalanify() {
    const [user, setUser] = useState(localStorage.getItem('xal_user') || '');
    const [themeKey, setThemeKey] = useState(localStorage.getItem('xal_theme') || 'roxo');
    const [tab, setTab] = useState('home');
    const [settingTab, setSettingTab] = useState('themes');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    
    const [results, setResults] = useState([]);
    const [liked, setLiked] = useState(JSON.parse(localStorage.getItem('xal_liked')) || []);
    const [playlists, setPlaylists] = useState(JSON.parse(localStorage.getItem('xal_plays')) || []);
    
    const [current, setCurrent] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef(new Audio());

    useEffect(() => {
        // Lógica do Pop-up de Versão
        const savedVersion = localStorage.getItem('xal_app_version');
        if (savedVersion !== APP_VERSION && user) {
            setShowUpdateModal(true);
            localStorage.setItem('xal_app_version', APP_VERSION);
        }

        const t = THEMES[themeKey] || THEMES.roxo;
        document.documentElement.style.setProperty('--accent', t.primary);
        document.documentElement.style.setProperty('--bg', t.bg);
        document.documentElement.style.setProperty('--card', t.card);
        
        const updateProgress = () => setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
        audioRef.current.addEventListener('timeupdate', updateProgress);
        
        lucide.createIcons();
        return () => audioRef.current.removeEventListener('timeupdate', updateProgress);
    }, [themeKey, user, tab, settingTab, current, isExpanded]);

    const play = (s) => {
        setCurrent(s);
        audioRef.current.src = s.source;
        audioRef.current.play();
        setIsPlaying(true);
    };

    // Componente do Pop-up de Atualização
    const UpdateModal = () => (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
            <div className="glass-card w-full max-w-sm rounded-[40px] p-8 border border-white/10 animate-pop">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black">O que há de novo?</h3>
                    <span className="bg-accent/20 text-accent text-[10px] font-bold px-3 py-1 rounded-full">v{APP_VERSION}</span>
                </div>
                <div className="space-y-4 mb-8">
                    {UPDATES_LOG[0].changes.map((c, i) => (
                        <div key={i} className="flex gap-3 text-sm opacity-80">
                            <span className={c.type === 'add' ? 'text-green-400' : 'text-blue-400'}>•</span>
                            {c.text}
                        </div>
                    ))}
                </div>
                <button onClick={() => setShowUpdateModal(false)} className="w-full p-5 bg-white text-black font-bold rounded-2xl active:scale-95 transition-all">Explorar v{APP_VERSION}</button>
            </div>
        </div>
    );

    if (!user) return (
        <div className="h-screen flex flex-col items-center justify-center p-10 bg-[#0b0b0e]">
            <h1 className="text-6xl font-black mb-10 tracking-tighter italic">Xalanify</h1>
            <input id="un" type="text" placeholder="Teu nome..." className="w-full p-5 rounded-3xl bg-white/5 border border-white/10 mb-4 text-center text-white outline-none" />
            <button onClick={() => { const n = document.getElementById('un').value; if(n) setUser(n); }} className="w-full p-5 rounded-3xl bg-white text-black font-bold">Entrar</button>
        </div>
    );

    return (
        <div className="h-screen max-w-md mx-auto flex flex-col relative overflow-hidden shadow-2xl">
            {showUpdateModal && <UpdateModal />}

            <main className="flex-1 overflow-y-auto p-6 pb-48">
                {tab === 'home' && <h2 className="text-4xl font-black mb-10 italic">Xalanify</h2>}
                
                {tab === 'search' && (
                    <div className="animate-pop">
                        <input onKeyDown={async (e) => { if(e.key === 'Enter') setResults(await MusicAPI.search(e.target.value)) }} className="w-full p-5 bg-white/5 rounded-2xl mb-8 border border-white/5 text-white outline-none focus:ring-1 ring-accent" placeholder="Pesquisar artista..." />
                        <div className="space-y-6">
                            {results.map(s => (
                                <div key={s.id} className="flex items-center gap-4" onClick={() => play(s)}>
                                    <img src={s.image} className="w-14 h-14 rounded-xl shadow-lg" />
                                    <div className="flex-1 truncate"><p className="text-sm font-bold truncate">{s.name}</p><p className="text-[10px] opacity-40">{s.artist}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'settings' && (
                    <div className="animate-pop space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-1">Definições</h2>
                            <p className="text-[10px] opacity-30 font-bold uppercase tracking-widest">Controlo de Sistema</p>
                        </div>

                        <div className="flex bg-white/5 p-1 rounded-2xl gap-1">
                            {['themes', 'updates', 'about'].map(st => (
                                <button key={st} onClick={() => setSettingTab(st)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${settingTab === st ? 'bg-white text-black' : 'opacity-40'}`}>{st}</button>
                            ))}
                        </div>

                        {settingTab === 'themes' && (
                            <div className="grid grid-cols-4 gap-4 animate-pop">
                                {Object.keys(THEMES).map(k => (
                                    <button key={k} onClick={() => setThemeKey(k)} className="w-full aspect-square rounded-2xl border-2" style={{backgroundColor: THEMES[k].primary, borderColor: themeKey === k ? 'white' : 'transparent'}}></button>
                                ))}
                            </div>
                        )}

                        {settingTab === 'updates' && (
                            <div className="space-y-4 animate-pop">
                                {UPDATES_LOG.map(log => (
                                    <div key={log.v} className="glass-card p-5 rounded-3xl border border-white/5">
                                        <p className="font-black text-xs mb-3 text-accent">Versão {log.v}</p>
                                        {log.changes.map((c, i) => (
                                            <div key={i} className="flex gap-2 mb-2 text-[10px]"><span className={c.type === 'add' ? 'text-green-400' : 'text-blue-400'}>•</span><span className="opacity-60">{c.text}</span></div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                        {settingTab === 'about' && (
                            <div className="glass-card p-8 rounded-[40px] text-center space-y-4">
                                <h3 className="text-2xl font-black italic">Xalanify</h3>
                                <div className="space-y-2 text-xs">
                                    <p className="opacity-40">Criado por: <span className="text-white font-bold">{APP_AUTHOR}</span></p>
                                    <p className="opacity-40">Build: <span className="text-white font-bold">{APP_VERSION}</span></p>
                                    <p className="opacity-40">Licença: <span className="text-white font-bold">Premium X</span></p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* MINI PLAYER */}
            {current && !isExpanded && (
                <div className="fixed bottom-28 left-4 right-4 bg-white text-black p-3 rounded-[24px] flex items-center justify-between z-50 animate-pop" onClick={() => setIsExpanded(true)}>
                    <div className="flex items-center gap-3 truncate">
                        <img src={current.image} className="w-10 h-10 rounded-xl" />
                        <div className="truncate"><p className="text-[10px] font-black truncate">{current.name}</p><p className="text-[8px] opacity-60 truncate">{current.artist}</p></div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"><i data-lucide={isPlaying ? "pause" : "play"} size={18}></i></button>
                </div>
            )}

            {/* BARRA DE NAVEGAÇÃO */}
            <nav className="fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-around p-8 z-40">
                {['home', 'search', 'library', 'settings'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`opacity-30 transition-all ${tab === t ? 'opacity-100 text-accent scale-110' : ''}`}><i data-lucide={t === 'library' ? 'layers' : t} size={24}></i></button>
                ))}
            </nav>

            {/* PLAYER FULLSCREEN */}
            {isExpanded && (
                <div className="fixed inset-0 z-[100] bg-black p-8 flex flex-col animate-pop" style={{background: `linear-gradient(to bottom, #1a1a24, var(--bg))`}}>
                    <button onClick={() => setIsExpanded(false)} className="mb-8 opacity-20"><i data-lucide="chevron-down" size={32}></i></button>
                    <img src={current.image} className="w-full aspect-square rounded-[40px] shadow-2xl mb-12" />
                    <div className="mb-12"><h2 className="text-3xl font-black truncate">{current.name}</h2><p className="text-xl opacity-40 truncate">{current.artist}</p></div>
                    <div className="h-1.5 bg-white/10 rounded-full mb-12 overflow-hidden"><div className="h-full bg-accent transition-all" style={{width: `${progress}%`}}></div></div>
                    <div className="flex justify-between items-center px-4">
                        <i data-lucide="skip-back" size={40} fill="white"></i>
                        <button onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-black shadow-2xl"><i data-lucide={isPlaying ? "pause" : "play"} size={40} fill="black"></i></button>
                        <i data-lucide="skip-forward" size={40} fill="white"></i>
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Xalanify />);