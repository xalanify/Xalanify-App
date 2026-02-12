export const MusicAPI = {
    search: async (term) => {
        try {
            // Proxy ultra-rápido para contornar o CORS no Vercel/Localhost
            const proxy = "https://api.allorigins.win/get?url=";
            const target = `https://saavn.me/search/songs?query=${encodeURIComponent(term)}`;
            
            const response = await fetch(`${proxy}${encodeURIComponent(target)}`);
            const jsonWrapper = await response.json();
            const data = JSON.parse(jsonWrapper.contents);

            if (data.status === 'SUCCESS') {
                return data.data.results.map(s => ({
                    id: s.id,
                    name: s.name,
                    artist: s.primaryArtists,
                    album: s.album.name,
                    image: s.image[s.image.length - 1].link, // Alta qualidade
                    source: s.downloadUrl[s.downloadUrl.length - 1].link, // Música Completa
                    duration: s.duration,
                    type: 'HQ' 
                }));
            }
            return [];
        } catch (error) {
            console.error("Erro na busca Xalanify:", error);
            return [];
        }
    }
};