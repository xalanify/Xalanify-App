export const APP_VERSION = "0.32.0";
export const APP_AUTHOR = "Xalana";

export const UPDATES_LOG = [
    {
        v: "0.32.0",
        changes: [
            { type: 'add', text: 'Otimização para Deploy no Vercel.' },
            { type: 'add', text: 'Sistema de persistência de Pop-up de boas-vindas.' },
            { type: 'improve', text: 'Refinamento do motor de busca HQ.' }
        ]
    },
 {
        v: "0.31.0",
        changes: [
            { type: 'add', text: 'Correção Crítica: Implementado Proxy CORS para pesquisa de músicas.' },
            { type: 'add', text: 'Definições por Abas: Temas, Histórico e Conta.' },
            { type: 'improve', text: 'Estabilidade no motor de áudio HQ.' }
        ]
    },
    {
        v: "0.30.0",
        changes: [
            { type: 'add', text: 'MOTOR HÍBRIDO REAL: Substituído iTunes por JioSaavn (Músicas Completas).' },
            { type: 'add', text: 'Qualidade de áudio melhorada para 320kbps.' },
            { type: 'improve', text: 'Sistema de Proxy para evitar erros de bloqueio (CORS).' }
        ]
    },
    {
        v: "0.29.0",
        changes: [
            { type: 'add', text: 'Sistema de Playlists e Library funcional.' },
            { type: 'improve', text: 'Recuperação do painel de definições completo.' }
        ]
    },
      {
        v: "0.28.0",
        changes: [
            { type: 'add', text: 'Player Expansível com controlos completos.' },
            { type: 'add', text: 'Sistema de Library: Músicas Gostadas e Playlists funcionais.' },
            { type: 'add', text: 'Menu de Opções (três pontos) para gestão de faixas.' },
            { type: 'improve', text: 'Motor Híbrido de busca (Simulação YouTube/Spotify).' }
        ]
    },
    {
        v: "0.27.0",
        changes: [
            { type: 'add', text: 'Pop-up automático de nova versão.' },
            { type: 'improve', text: 'Correção de crash nos temas.' }
        ]
    },
     {
        v: "0.26.0",
        changes: [
            { type: 'add', text: 'Nova interface replicada do design Premium.' },
            { type: 'add', text: 'Sistema de Temas dinâmicos.' }
        ]
    }
];

export const THEMES = {
    roxo: { primary: '#a855f7', bg: '#0b0b0e', card: '#16161d' },
    amber: { primary: '#fbbf24', bg: '#0f0d0b', card: '#1a1612' },
    rose: { primary: '#ec4899', bg: '#0f0b0d', card: '#1a1215' },
    teal: { primary: '#14b8a6', bg: '#0b0f0f', card: '#121a1a' },
    blue: { primary: '#3b82f6', bg: '#0b0d1a', card: '#121526' },
    orange: { primary: '#f97316', bg: '#110c08', card: '#1c140d' },
    green: { primary: '#22c55e', bg: '#08110a', card: '#0d1c10' },
    pink: { primary: '#db2777', bg: '#11080d', card: '#1c0d15' }
};