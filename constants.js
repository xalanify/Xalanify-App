export const APP_VERSION = "0.36.0";
export const APP_STATUS = "BETA";
export const APP_AUTHOR = "Xalana";

export const UPDATES_LOG = [
    {
        v: "0.36.0",
        changes: [
            { type: 'improve', text: 'Interface: Seletor de temas agora é um Dropdown minimalista' },
            { type: 'add', text: 'Estabilização do Motor Híbrido de áudio.' },
            { type: 'fix', text: 'Remoção de elementos visuais pesados nas Definições.' }
        ]
    },
    { v: "0.35.0", changes: [{ type: 'add', text: 'Motor Dual-Engine: Metadados Saavn + Áudio YouTube.' }] },
     { v: "0.34.0", changes: [{ type: 'add', text: 'Tag BETA Visual e tratamento de erros JSON.' }] },
    { v: "0.33.0", changes: [{ type: 'add', text: 'Otimização para Vercel e correção de bugs de interface.' }] },
    { v: "0.32.0", changes: [{ type: 'add', text: 'Sistema de Pop-up de boas-vindas automático.' }] },
    { v: "0.31.0", changes: [{ type: 'add', text: 'Definições por Abas e Proxy CORS.' }] },
    { v: "0.30.0", changes: [{ type: 'add', text: 'Músicas completas HQ e Progresso real.' }] },
    { v: "0.29.0", changes: [{ type: 'add', text: 'Playlists e Library funcional.' }] }
];

export const THEMES = {
    roxo: { name: 'Roxo Deep', primary: '#a855f7', bg: '#0b0b0e', card: '#16161d' },
    amber: { name: 'Âmbar Gold', primary: '#fbbf24', bg: '#0f0d0b', card: '#1a1612' },
    rose: { name: 'Rosa Velvet', primary: '#ec4899', bg: '#0f0b0d', card: '#1a1215' },
    teal: { name: 'Teal Modern', primary: '#14b8a6', bg: '#0b0f0f', card: '#121a1a' },
    blue: { name: 'Azul Eletro', primary: '#3b82f6', bg: '#0b0d1a', card: '#121526' },
    orange: { name: 'Laranja Neon', primary: '#f97316', bg: '#110c08', card: '#1c140d' },
    green: { name: 'Verde Bio', primary: '#22c55e', bg: '#08110a', card: '#0d1c10' },
    pink: { name: 'Pink Cyber', primary: '#db2777', bg: '#11080d', card: '#1c0d15' }
};
