export const MusicAPI = {
    search: async (term) => {
        try {
            const proxy = "https://api.allorigins.win/get?url=";
            const target = `https://saavn.me/search/songs?query=${encodeURIComponent(term)}`;
            
            const res = await fetch(`${proxy}${encodeURIComponent(target)}`);
            const json = await res.json();
            
            if (!json.contents || json.contents.trim().startsWith('<!')) return [];

            const data = JSON.parse(json.contents);
            if (data.status === 'SUCCESS') {
                return data.data.results.map(s => ({
                    id: s.id,
                    name: s.name,
                    artist: s.primaryArtists,
                    image: s.image[s.image.length - 1].link,
                    source: `https://yt-stream-api.vercel.app/api/stream?query=${encodeURIComponent(s.name + ' ' + s.primaryArtists)}`,
                }));
            }
            return [];
        } catch (e) { return []; }
    }
};
