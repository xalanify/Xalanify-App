export const MusicAPI = {
    search: async (term) => {
        try {
            const proxy = "https://api.allorigins.win/get?url=";
            const target = `https://saavn.me/search/songs?query=${encodeURIComponent(term)}`;
            
            const response = await fetch(`${proxy}${encodeURIComponent(target)}`);
            const data = await response.json();
            
            // PROTEÇÃO: Verifica se o conteúdo é JSON válido antes de tentar ler
            if (data.contents && data.contents.trim().startsWith('{')) {
                const result = JSON.parse(data.contents);
                if (result.status === 'SUCCESS') {
                    return result.data.results.map(s => ({
                        id: s.id,
                        name: s.name,
                        artist: s.primaryArtists,
                        image: s.image[s.image.length - 1].link,
                        source: s.downloadUrl[s.downloadUrl.length - 1].link,
                        type: 'HQ'
                    }));
                }
            }
            return [];
        } catch (e) {
            console.error("Erro na busca Xalanify:", e);
            return [];
        }
    }
};
