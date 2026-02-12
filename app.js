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
    const [liked, setLiked] = useState(JSON.parse(localStorage.getItem('xal_liked')) || []);
    const [playlists, setPlaylists] = useState(JSON.parse(localStorage.getItem('xal_plays')) || []);
    const [current, setCurrent] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef(new Audio());

    useEffect(() => {
        // FIX: Proteção contra erro de primary undefined (imagem image_d523f1.png)
        const activeTheme = THEMES[themeKey] || THEMES.roxo;
        document.documentElement.style.setProperty('--accent', activeTheme.primary);
        document.documentElement.style.setProperty('--bg', activeTheme.bg);
        document.documentElement.style.setProperty('--card', activeTheme.card);
        
        // Pop-up automático ao detetar nova versão
        const lastVer = localStorage.getItem('xal_v');
        if(lastVer !== APP_VERSION && user) {
            setShowUpdateModal(true);
            localStorage.setItem('xal_v', APP_VERSION);
        }
        
        const updateProgress = () => setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
        audioRef.current.addEventListener('timeupdate', updateProgress);
        
        lucide.createIcons();
        return () => audioRef.current.removeEventListener('timeupdate', updateProgress);
    }, [themeKey, tab, user]);

    const play = (s) => {
        setCurrent(s);
        audioRef.current.src = s.source;
        audioRef.current.play();
        setIsPlaying(true);
    };

    if (!user) return (
        <div className="h-screen flex flex-col items-center justify-center p-10 bg-[#0b0b0e]">
            <h1 className="text-6xl font-black italic">Xalanify</h1>
            <p className="text-red-600 font-bold text-[10px] tracking-widest mb-10 uppercase">Versão {APP_STATUS}</p>
            <input id="un" type="text" placeholder="Como te chamas?" className="w-full p-5 rounded-3xl bg-white/5 border border-white/10 mb-4 text-center text-white outline-none" />
            <button onClick={() => { const n = document.getElementById('un').value; if(n) setUser(n); localStorage.setItem('xal_user', n); }} className="w-full p-5 rounded-3xl bg-white text-black font-bold">Entrar</button>
        </div>
    );

    return (
        <div className="h-screen max-w-md mx-auto flex flex-col relative overflow-hidden">
            
            {/* TAG BETA VERMELHA NO TOPO */}
            <div className="fixed top-2 left-0 right-0 z-[100] flex justify-center pointer-events-none">
                <span className="bg-red-600 text-white text-[9px] font-black px-4 py-1 rounded-full shadow-lg">{APP_STATUS} v{APP_VERSION}</span>
            </div>

            {showUpdateModal && (
                <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
                    <div className="glass-card w-full max-w-sm rounded-[40px] p-8 border border-white/10 animate-pop">
                        <h3 className="text-2xl font-black mb-6 italic">Update {APP_VERSION}</h3>
                        <div className="space-y-4 mb-8">
                            {UPDATES_LOG[0].changes.map((c, i) => (
                                <div key={i} className="flex gap-3 text-sm opacity-60"><span>•</span>{c.text}</div>
                            ))}
                        </div>
                        <button onClick={() => setShowUpdateModal(false)} className="w-full p-5 bg-white text-black font-bold rounded-2xl">Confirmar</button>
                    </div>
                </div>
            )}

            <main className="flex-1 overflow-y-auto p-6 pt-12 pb-48">
                {tab === 'home' && <h2 className="text-4xl font-black mb-10 italic">Xalanify</h2>}
                
                {tab === 'search' && (
                    <div className="animate-pop">
                        <input onKeyDown={async (e) => { if(e.key === 'Enter') setResults(await MusicAPI.search(e.target.value)) }} className="w-full p-5 bg-white/5 rounded-2xl mb-8 border border-white/5 text-white outline-none" placeholder="Pesquisar..." />
                        <div className="space-y-6">
                            {results.length > 0 ? results.map(s => (
                                <div key={s.id} className="flex items-center gap-4" onClick={() => play(s)}>
                                    <img src={s.image} className="w-14 h-14 rounded-xl" />
                                    <div className="flex-1 truncate"><p className="text-sm font-bold truncate">{s.name}</p><p className="text-[10px] opacity-40">{s.artist}</p></div>
                                </div>
                            )) : <p className="text-center opacity-20 text-xs mt-10 italic">Nenhum resultado ou erro no servidor.</p>}
                        </div>
                    </div>
                )}

                {tab === 'settings' && (
                    <div className="animate-pop space-y-8">
                        <h2 className="text-3xl font-bold">Definições</h2>
                        <div className="flex bg-white/5 p-1 rounded-2xl gap-1">
                            {['themes', 'updates', 'about'].map(st => (
                                <button key={st} onClick={() => setSettingTab(st)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase ${settingTab === st ? 'bg-white text-black' : 'opacity-40'}`}>{st}</button>
                            ))}
                        </div>

                        {settingTab === 'themes' && (
                            <div className="grid grid-cols-4 gap-4 animate-pop">
                                {Object.keys(THEMES).map(k => (
                                    <button key={k} onClick={() => {setThemeKey(k); localStorage.setItem('xal_theme', k);}} className="w-full aspect-square rounded-2xl border-2" style={{backgroundColor: THEMES[k].primary, borderColor: themeKey === k ? 'white' : 'transparent'}}></button>
                                ))}
                            </div>
                        )}

                        {settingTab === 'updates' && (
                            <div className="space-y-4 animate-pop">
                                {UPDATES_LOG.map(log => (
                                    <div key={log.v} className="glass-card p-5 rounded-3xl border border-white/5">
                                        <p className="font-black text-xs mb-3 text-accent uppercase">Versão {log.v}</p>
                                        {log.changes.map((c, i) => (
                                            <div key={i} className="text-[10px] opacity-60 mb-1">• {c.text}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                        {settingTab === 'about' && (
                            <div className="glass-card p-8 rounded-[40px] text-center space-y-2">
                                <h3 className="text-2xl font-black italic">Xalanify Music</h3>
                                <p className="opacity-40 text-xs">By {APP_AUTHOR}</p>
                                <p className="text-[10px] text-red-600 font-bold uppercase">{APP_STATUS} ACTIVE</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <nav className="fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-around p-8 z-40">
                {['home', 'search', 'library', 'settings'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`transition-all ${tab === t ? 'text-accent scale-110' : 'opacity-30'}`}><i data-lucide={t === 'library' ? 'layers' : t} size={24}></i></button>
                ))}
            </nav>

            {/* PLAYER MINI E FULLSCREEN MANTIDOS IGUAIS */}
            {current && (
                <div className={`fixed inset-x-4 transition-all duration-500 z-50 ${isExpanded ? 'inset-0 bottom-0 bg-black p-8' : 'bottom-28 bg-white text-black rounded-3xl p-3'}`} onClick={() => setIsExpanded(true)}>
                    {isExpanded ? (
                        <div className="h-full flex flex-col" style={{background: `linear-gradient(to bottom, #1a1a24, var(--bg))`}}>
                            <button onClick={(e) => {e.stopPropagation(); setIsExpanded(false)}} className="mb-8 opacity-20"><i data-lucide="chevron-down" size={32} color="white"></i></button>
                            <img src={current.image} className="w-full aspect-square rounded-[40px] shadow-2xl mb-10" />
                            <div className="mb-10 text-white"><h2 className="text-3xl font-black truncate">{current.name}</h2><p className="text-xl opacity-40">{current.artist}</p></div>
                            <div className="h-1 bg-white/10 rounded-full mb-10 overflow-hidden"><div className="h-full bg-accent" style={{width: `${progress}%`}}></div></div>
                            <div className="flex justify-center items-center gap-12">
                                <button onClick={(e) => { e.stopPropagation(); isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className="w-24 h-24 bg-white rounded-full flex items-center justify-center"><i data-lucide={isPlaying ? "pause" : "play"} size={40} color="black" fill="black"></i></button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 truncate"><img src={current.image} className="w-10 h-10 rounded-xl" /><div><p className="text-[10px] font-black truncate">{current.name}</p><p className="text-[8px] opacity-60">{current.artist}</p></div></div>
                            <button onClick={(e) => { e.stopPropagation(); isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"><i data-lucide={isPlaying ? "pause" : "play"} size={18}></i></button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Xalanify />);
