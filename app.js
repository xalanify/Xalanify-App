import { THEMES, APP_VERSION } from './constants.js';
import { MusicAPI } from './api.js';

const { useState, useEffect, useRef } = React;

function Xalanify() {
    const [themeKey, setThemeKey] = useState(localStorage.getItem('xal_theme') || 'roxo');
    const [tab, setTab] = useState('home');
    const [results, setResults] = useState([]);
    const [current, setCurrent] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const theme = THEMES[themeKey] || THEMES.roxo;
        // Aplica as cores sem erro de 'undefined'
        document.documentElement.style.setProperty('--accent', theme.primary);
        document.documentElement.style.setProperty('--bg', theme.bg);
        document.documentElement.style.setProperty('--card', theme.card);
        lucide.createIcons();
    }, [themeKey, tab]);

    const play = async (s) => {
        const res = await fetch(s.streamLink);
        const data = await res.json();
        const stream = data.audioStreams.find(st => st.format === 'M4A').url;
        setCurrent(s);
        audioRef.current.src = stream;
        audioRef.current.play();
        setIsPlaying(true);
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <main className="flex-1 p-6 overflow-y-auto">
                {tab === 'search' && (
                    <div>
                        <input onKeyDown={async (e) => { if(e.key === 'Enter') setResults(await MusicAPI.search(e.target.value)) }} 
                               className="w-full p-4 bg-white/5 rounded-2xl mb-8" placeholder="Pesquisar..." />
                        <div className="space-y-4">
                            {results.map(s => (
                                <div key={s.id} onClick={() => play(s)} className="flex items-center gap-4">
                                    <img src={s.image} className="w-12 h-12 rounded-lg object-cover" />
                                    <p className="text-sm font-bold truncate">{s.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'settings' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold italic">Ajustes</h2>
                        {/* Dropdown elegante em vez dos quadrados gigantes */}
                        <div className="bg-white/5 p-4 rounded-2xl">
                            <label className="text-[10px] uppercase opacity-40 mb-2 block">Tema</label>
                            <select value={themeKey} 
                                    onChange={(e) => {setThemeKey(e.target.value); localStorage.setItem('xal_theme', e.target.value);}}
                                    className="w-full bg-transparent font-bold outline-none text-accent">
                                {Object.keys(THEMES).map(k => (
                                    <option key={k} value={k} className="bg-black">{THEMES[k].name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </main>

            <nav className="p-8 border-t border-white/5 flex justify-around">
                {['home', 'search', 'settings'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={tab === t ? 'text-accent' : 'opacity-20'}>
                        <i data-lucide={t === 'settings' ? 'settings' : t}></i>
                    </button>
                ))}
            </nav>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Xalanify />);
