export const MusicAPI = {
    search: async (term) => {
        try {
            // Usamos a Piped API para evitar erros de JSON e CORS
            const res = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(term)}&filter=music_songs`);
            const data = await res.json();
            if (data && data.items) {
                return data.items.map(item => ({
                    id: item.url.split('v=')[1],
                    name: item.title,
                    artist: item.uploaderName,
                    image: item.thumbnail,
                    streamLink: `https://pipedapi.kavin.rocks/streams/${item.url.split('v=')[1]}`
                }));
            }
            return [];
        } catch (e) { return []; }
    }
};
