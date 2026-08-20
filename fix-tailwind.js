import fs from 'fs';

let config = fs.readFileSync('tailwind.config.js', 'utf8');

// Updating the color palette to match FLECHA BSB
// Navy: #041f4a
// Cyan/Teal (Seta e BSB): #00b0c7
// Light Blue (Aletas da seta): #006eb8

config = config.replace(
  /colors: \{[\s\S]*?elite: \{[\s\S]*?gold: '.*?',[\s\S]*?navy: '.*?',[\s\S]*?sand: '.*?',[\s\S]*?paper: '.*?',[\s\S]*?white: '.*?',[\s\S]*?\}[\s\S]*?\}/,
  `colors: {
        elite: {
          gold: '#00b0c7',       /* Cyan da Flecha BSB para CTA, Botões e Destaques (Substituiu o Gold) */
          navy: '#041f4a',       /* Azul Marinho Escuro da Fonte BSB */
          sand: '#006eb8',       /* Azul Claro intermediário da flecha */
          paper: '#F0F4F8',      /* Fundo branco-azulado claro */
          white: '#FFFFFF',      /* Branco puro para modais */
        }
      }`
);

fs.writeFileSync('tailwind.config.js', config);
