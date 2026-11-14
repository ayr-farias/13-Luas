// Dados do Sincronário das 13 Luas (Calendário da Paz) — José e Lloydine Argüelles.
// Nomes em PT-BR conforme uso corrente no Brasil. Os textos interpretativos são
// sínteses em linguagem própria da tradição; ver /sobre/ para fontes e ressalvas.

export type Cor = 'vermelho' | 'branco' | 'azul' | 'amarelo';

export const COR_HEX = {
  vermelho: '#e0524a',
  branco: '#ece9f7',
  azul: '#4a82e8',
  amarelo: '#f0c04a',
  verde: '#4fc38b',
} as const;

export const COR_ADJ: Record<Cor, [string, string]> = {
  vermelho: ['Vermelho', 'Vermelha'],
  branco: ['Branco', 'Branca'],
  azul: ['Azul', 'Azul'],
  amarelo: ['Amarelo', 'Amarela'],
};

// Direção e qualidade de cada cor (também as 4 semanas de cada Lua)
export const COR_INFO: Record<Cor, { direcao: string; verbo: string; semana: number }> = {
  vermelho: { direcao: 'Leste', verbo: 'Inicia', semana: 1 },
  branco: { direcao: 'Norte', verbo: 'Refina', semana: 2 },
  azul: { direcao: 'Oeste', verbo: 'Transforma', semana: 3 },
  amarelo: { direcao: 'Sul', verbo: 'Amadurece', semana: 4 },
};

export const COR_SEMANA: Cor[] = ['vermelho', 'branco', 'azul', 'amarelo'];

export interface Selo {
  n: number;
  nome: string;
  en: string;
  maya: string;
  cor: Cor;
  fem: boolean;
  acao: string;
  poder: string;
  essencia: string;
  texto: string;
}

export const SELOS: Selo[] = [
  { n: 1, nome: 'Dragão', en: 'Dragon', maya: 'Imix', cor: 'vermelho', fem: false, acao: 'Nutre', poder: 'Nascimento', essencia: 'Ser', texto: 'A matriz primordial: o ovo cósmico, o cuidado materno e a força que dá origem e sustenta a vida.' },
  { n: 2, nome: 'Vento', en: 'Wind', maya: 'Ik', cor: 'branco', fem: false, acao: 'Comunica', poder: 'Espírito', essencia: 'Respiração', texto: 'O sopro divino que se faz palavra: comunicação, inspiração e o espírito que atravessa todas as coisas.' },
  { n: 3, nome: 'Noite', en: 'Night', maya: "Ak'bal", cor: 'azul', fem: true, acao: 'Sonha', poder: 'Abundância', essencia: 'Intuição', texto: 'A casa dos sonhos e da abundância interior: intuição, mistério e os tesouros do inconsciente.' },
  { n: 4, nome: 'Semente', en: 'Seed', maya: "K'an", cor: 'amarelo', fem: true, acao: 'Direciona', poder: 'Florescimento', essencia: 'Consciência', texto: 'O potencial que floresce: a consciência que mira um alvo e planta a intenção para que ela cresça.' },
  { n: 5, nome: 'Serpente', en: 'Serpent', maya: 'Chikchan', cor: 'vermelho', fem: true, acao: 'Sobrevive', poder: 'Força vital', essencia: 'Instinto', texto: 'A força vital e o instinto: a energia que sobe pela coluna e a sabedoria do corpo.' },
  { n: 6, nome: 'Enlaçador de Mundos', en: 'Worldbridger', maya: 'Kimi', cor: 'branco', fem: false, acao: 'Iguala', poder: 'Morte', essencia: 'Oportunidade', texto: 'Quem faz a ponte entre mundos: a morte como transformação, a igualdade e a oportunidade que une.' },
  { n: 7, nome: 'Mão', en: 'Hand', maya: "Manik'", cor: 'azul', fem: true, acao: 'Conhece', poder: 'Realização', essencia: 'Cura', texto: 'A cura e a realização: as mãos que sabem, tocam e concluem; o conhecimento posto em prática.' },
  { n: 8, nome: 'Estrela', en: 'Star', maya: 'Lamat', cor: 'amarelo', fem: true, acao: 'Embeleza', poder: 'Elegância', essencia: 'Arte', texto: 'A beleza e a arte: a elegância que harmoniza e a perfeição de tudo o que é feito com amor.' },
  { n: 9, nome: 'Lua', en: 'Moon', maya: 'Muluk', cor: 'vermelho', fem: true, acao: 'Purifica', poder: 'Água universal', essencia: 'Fluxo', texto: 'A água universal e a purificação: o fluxo que limpa, equilibra as emoções e devolve fluidez à vida.' },
  { n: 10, nome: 'Cachorro', en: 'Dog', maya: 'Ok', cor: 'branco', fem: false, acao: 'Ama', poder: 'Coração', essencia: 'Lealdade', texto: 'O coração e a lealdade: o amor incondicional, a fidelidade e o companheirismo que guiam.' },
  { n: 11, nome: 'Macaco', en: 'Monkey', maya: "Chuwen", cor: 'azul', fem: false, acao: 'Brinca', poder: 'Magia', essencia: 'Ilusão', texto: 'O jogo e a magia: o riso que desfaz ilusões, a criança interior e a leveza que transforma.' },
  { n: 12, nome: 'Humano', en: 'Human', maya: "Eb'", cor: 'amarelo', fem: false, acao: 'Influencia', poder: 'Sabedoria', essencia: 'Livre-arbítrio', texto: 'A sabedoria e o livre-arbítrio: o ser que escolhe, influencia e reflete a imagem do divino.' },
  { n: 13, nome: 'Caminhante do Céu', en: 'Skywalker', maya: "B'en", cor: 'vermelho', fem: false, acao: 'Explora', poder: 'Vigília', essencia: 'Espaço', texto: 'O explorador do espaço: a vigília que cruza fronteiras entre céu e terra, dimensões e mundos.' },
  { n: 14, nome: 'Mago', en: 'Wizard', maya: 'Ix', cor: 'branco', fem: false, acao: 'Enfeitiça', poder: 'Receptividade', essencia: 'Atemporalidade', texto: 'A receptividade atemporal: o encantamento, a magia sem esforço e o acesso ao tempo fora do tempo.' },
  { n: 15, nome: 'Águia', en: 'Eagle', maya: 'Men', cor: 'azul', fem: true, acao: 'Cria', poder: 'Mente', essencia: 'Visão', texto: 'A visão e a mente criadora: enxergar do alto, planejar e criar mundos a partir do pensamento claro.' },
  { n: 16, nome: 'Guerreiro', en: 'Warrior', maya: "Kib'", cor: 'amarelo', fem: false, acao: 'Questiona', poder: 'Inteligência', essencia: 'Destemor', texto: 'A inteligência destemida: quem questiona, enfrenta o medo e defende a verdade com precisão.' },
  { n: 17, nome: 'Terra', en: 'Earth', maya: "Kaban", cor: 'vermelho', fem: true, acao: 'Evolui', poder: 'Navegação', essencia: 'Sincronicidade', texto: 'A navegação e a sincronicidade: evoluir em harmonia com os ciclos do planeta e os sinais do caminho.' },
  { n: 18, nome: 'Espelho', en: 'Mirror', maya: "Etz'nab'", cor: 'branco', fem: false, acao: 'Reflete', poder: 'Infinitude', essencia: 'Ordem', texto: 'O reflexo que ordena: a infinitude, a ausência de ilusão e a verdade vista sem véus.' },
  { n: 19, nome: 'Tormenta', en: 'Storm', maya: 'Kawak', cor: 'azul', fem: true, acao: 'Catalisa', poder: 'Autogeração', essencia: 'Energia', texto: 'A energia que se autogera: a tempestade que catalisa a transformação e limpa o que já não serve.' },
  { n: 20, nome: 'Sol', en: 'Sun', maya: 'Ajaw', cor: 'amarelo', fem: false, acao: 'Ilumina', poder: 'Fogo universal', essencia: 'Vida', texto: 'O fogo universal e a vida: a luz que ilumina a todos, a completude e a consciência cósmica.' },
];

export interface Tom {
  n: number;
  m: string; // adjetivo masculino
  f: string; // adjetivo feminino
  en: string;
  acao: string;
  poder: string;
  essencia: string;
  gerundio: string;
  pergunta: string;
  texto: string;
}

export const TONS: Tom[] = [
  { n: 1, m: 'Magnético', f: 'Magnética', en: 'Magnetic', acao: 'Unificar', poder: 'Propósito', essencia: 'Atrair', gerundio: 'Atraindo', pergunta: 'Qual é o meu propósito?', texto: 'O início de toda onda: unifica a intenção e atrai o que serve ao propósito.' },
  { n: 2, m: 'Lunar', f: 'Lunar', en: 'Lunar', acao: 'Polarizar', poder: 'Desafio', essencia: 'Estabilizar', gerundio: 'Estabilizando', pergunta: 'Qual é o meu desafio?', texto: 'Reconhece a dualidade: polariza, enfrenta o desafio e busca estabilidade.' },
  { n: 3, m: 'Elétrico', f: 'Elétrica', en: 'Electric', acao: 'Ativar', poder: 'Serviço', essencia: 'Vincular', gerundio: 'Vinculando', pergunta: 'Como posso servir melhor?', texto: 'Ativa a energia em movimento: coloca o propósito a serviço e cria vínculos.' },
  { n: 4, m: 'Autoexistente', f: 'Autoexistente', en: 'Self-Existing', acao: 'Definir', poder: 'Forma', essencia: 'Medir', gerundio: 'Medindo', pergunta: 'Que forma terá o meu serviço?', texto: 'Dá forma e medida: define a estrutura que sustenta o que foi ativado.' },
  { n: 5, m: 'Harmônico', f: 'Harmônica', en: 'Overtone', acao: 'Empoderar', poder: 'Radiância', essencia: 'Comandar', gerundio: 'Comandando', pergunta: 'Como posso empoderar o meu serviço?', texto: 'Empodera e irradia: reúne os recursos e assume o comando do próprio centro.' },
  { n: 6, m: 'Rítmico', f: 'Rítmica', en: 'Rhythmic', acao: 'Organizar', poder: 'Igualdade', essencia: 'Equilibrar', gerundio: 'Equilibrando', pergunta: 'Como posso estender a igualdade a todos?', texto: 'Organiza e equilibra: o centro da onda, onde a igualdade se manifesta.' },
  { n: 7, m: 'Ressonante', f: 'Ressonante', en: 'Resonant', acao: 'Canalizar', poder: 'Sintonia', essencia: 'Inspirar', gerundio: 'Inspirando', pergunta: 'Como posso sintonizar o meu serviço?', texto: 'Canaliza e inspira: sintoniza-se com o todo e deixa a inspiração fluir.' },
  { n: 8, m: 'Galáctico', f: 'Galáctica', en: 'Galactic', acao: 'Harmonizar', poder: 'Integridade', essencia: 'Modelar', gerundio: 'Modelando', pergunta: 'Vivo o que ensino?', texto: 'Harmoniza e modela: vive a integridade, tornando-se exemplo do que ensina.' },
  { n: 9, m: 'Solar', f: 'Solar', en: 'Solar', acao: 'Pulsar', poder: 'Intenção', essencia: 'Realizar', gerundio: 'Realizando', pergunta: 'Como posso expandir a minha felicidade?', texto: 'Pulsa com intenção: dirige a energia ao objetivo e o realiza.' },
  { n: 10, m: 'Planetário', f: 'Planetária', en: 'Planetary', acao: 'Aperfeiçoar', poder: 'Manifestação', essencia: 'Produzir', gerundio: 'Produzindo', pergunta: 'Como posso aperfeiçoar o que faço?', texto: 'Aperfeiçoa e manifesta: transforma a visão em produto e em realidade tangível.' },
  { n: 11, m: 'Espectral', f: 'Espectral', en: 'Spectral', acao: 'Dissolver', poder: 'Liberação', essencia: 'Libertar', gerundio: 'Libertando', pergunta: 'Como posso libertar o meu serviço?', texto: 'Dissolve o que é rígido: libera, desprende e abre espaço ao novo.' },
  { n: 12, m: 'Cristal', f: 'Cristal', en: 'Crystal', acao: 'Dedicar', poder: 'Cooperação', essencia: 'Universalizar', gerundio: 'Universalizando', pergunta: 'Como posso me dedicar a tudo o que vive?', texto: 'Dedica e coopera: une esforços e universaliza o aprendizado da onda.' },
  { n: 13, m: 'Cósmico', f: 'Cósmica', en: 'Cosmic', acao: 'Perdurar', poder: 'Presença', essencia: 'Transcender', gerundio: 'Transcendendo', pergunta: 'Como posso expandir a minha alegria e o meu amor?', texto: 'Perdura e transcende: completa a onda, entrega a presença e abre o ciclo seguinte.' },
];

export interface Lua {
  n: number;
  totem: string;
  totemEn: string;
  de: string; // "do" | "da"
  texto: string;
}

export const LUAS: Lua[] = [
  { n: 1, totem: 'Morcego', totemEn: 'Bat', de: 'do', texto: 'Ver no escuro e guiar-se pelo eco: o morcego renasce a cada noite. Lua do propósito que unifica e atrai.' },
  { n: 2, totem: 'Escorpião', totemEn: 'Scorpion', de: 'do', texto: 'A picada que ensina: polaridade, aprofundamento e a transmutação do desafio em força estável.' },
  { n: 3, totem: 'Cervo', totemEn: 'Deer', de: 'do', texto: 'Delicadeza e atenção: o cervo serve com graça e cria vínculos silenciosos.' },
  { n: 4, totem: 'Coruja', totemEn: 'Owl', de: 'da', texto: 'A visão noturna e a sabedoria que mede: a forma que o serviço assume.' },
  { n: 5, totem: 'Pavão', totemEn: 'Peacock', de: 'do', texto: 'A radiância exibida sem medo: empoderar-se e comandar a própria beleza.' },
  { n: 6, totem: 'Lagarto', totemEn: 'Lizard', de: 'do', texto: 'O equilíbrio ao sol: organização, calma e igualdade entre todos os seres.' },
  { n: 7, totem: 'Macaco', totemEn: 'Monkey', de: 'do', texto: 'A sintonia brincalhona: inspiração, canalização e leveza para afinar o serviço.' },
  { n: 8, totem: 'Gavião', totemEn: 'Hawk', de: 'do', texto: 'A visão que sustenta a integridade: modelar pelo exemplo aquilo que se ensina.' },
  { n: 9, totem: 'Jaguar', totemEn: 'Jaguar', de: 'do', texto: 'A intenção silenciosa e a caçada precisa: pulsar com o propósito até realizá-lo.' },
  { n: 10, totem: 'Cachorro', totemEn: 'Dog', de: 'do', texto: 'Lealdade que concretiza: aperfeiçoar o que se faz e manifestar com fidelidade.' },
  { n: 11, totem: 'Serpente', totemEn: 'Serpent', de: 'da', texto: 'A muda da pele: dissolver o velho, libertar-se e renovar-se.' },
  { n: 12, totem: 'Coelho', totemEn: 'Rabbit', de: 'do', texto: 'Cooperação e fertilidade: dedicar-se a tudo o que vive, universalizando o serviço.' },
  { n: 13, totem: 'Tartaruga', totemEn: 'Turtle', de: 'da', texto: 'O tempo longo e a presença: perdurar, transcender e completar o ciclo anual.' },
];

export interface Plasma {
  n: number; // 1..7
  nome: string;
  cor: Cor;
  chakra: string;
  chakraSans: string;
  verbo: string;
  verso: string;
}

// Ordem Dali → Silio. Chakras na ordem descendente coroa→raiz: Dali, Gama, Alfa, Silio, Limi, Kali, Seli.
export const PLASMAS: Plasma[] = [
  { n: 1, nome: 'Dali', cor: 'amarelo', chakra: 'Coroa', chakraSans: 'Sahasrara', verbo: 'Apontar', verso: 'Filho de Dali acende o calor.' },
  { n: 2, nome: 'Seli', cor: 'vermelho', chakra: 'Raiz', chakraSans: 'Muladhara', verbo: 'Iluminar', verso: 'Filho de Seli ilumina o fluir.' },
  { n: 3, nome: 'Gama', cor: 'branco', chakra: 'Terceiro olho', chakraSans: 'Ajna', verbo: 'Pacificar', verso: 'Filho de Gama alcança a paz.' },
  { n: 4, nome: 'Kali', cor: 'azul', chakra: 'Sacro', chakraSans: 'Svadhisthana', verbo: 'Catalisar', verso: 'Filho de Kali catalisa luz-calor.' },
  { n: 5, nome: 'Alfa', cor: 'amarelo', chakra: 'Garganta', chakraSans: 'Vishuddha', verbo: 'Liberar', verso: 'Filho de Alfa libera a esfera.' },
  { n: 6, nome: 'Limi', cor: 'vermelho', chakra: 'Plexo solar', chakraSans: 'Manipura', verbo: 'Purificar', verso: 'Filho de Limi purifica os medos.' },
  { n: 7, nome: 'Silio', cor: 'branco', chakra: 'Coração', chakraSans: 'Anahata', verbo: 'Descarregar', verso: 'Filho de Silio liberta a Terra, à maneira siriana.' },
];

export interface Castelo {
  n: number;
  nome: string;
  cor: Cor | 'verde';
  direcao: string;
  tema: string;
  primeiroKin: number;
  ultimoKin: number;
  texto: string;
}

export const CASTELOS: Castelo[] = [
  { n: 1, nome: 'Castelo Vermelho do Leste do Giro', cor: 'vermelho', direcao: 'Leste', tema: 'Nascimento', primeiroKin: 1, ultimoKin: 52, texto: 'Inicia o ciclo de 260 dias: o giro da consciência que desperta e semeia a vida.' },
  { n: 2, nome: 'Castelo Branco do Norte da Travessia', cor: 'branco', direcao: 'Norte', tema: 'Morte', primeiroKin: 53, ultimoKin: 104, texto: 'Refina: atravessa o limiar, depura e transforma o que nasceu.' },
  { n: 3, nome: 'Castelo Azul do Oeste da Queima', cor: 'azul', direcao: 'Oeste', tema: 'Magia', primeiroKin: 105, ultimoKin: 156, texto: 'Transforma: a queima alquímica que converte a experiência em magia.' },
  { n: 4, nome: 'Castelo Amarelo do Sul da Dádiva', cor: 'amarelo', direcao: 'Sul', tema: 'Inteligência', primeiroKin: 157, ultimoKin: 208, texto: 'Amadurece: colhe e doa os frutos, a inteligência posta a serviço.' },
  { n: 5, nome: 'Castelo Verde do Centro do Encanto', cor: 'verde', direcao: 'Centro', tema: 'Vida', primeiroKin: 209, ultimoKin: 260, texto: 'Encanta: integra os quatro castelos e consagra o ciclo na vida plena.' },
];

export const FAMILIAS = [
  { n: 1, nome: 'Polar', texto: 'Famílias terrestres: a família Polar ancora o eixo do planeta e a polaridade.' },
  { n: 2, nome: 'Cardinal', texto: 'A família Cardinal marca as direções e o comando dos ciclos.' },
  { n: 3, nome: 'Núcleo', texto: 'A família do Núcleo (Central) sustenta o centro e a estrutura interna.' },
  { n: 4, nome: 'Sinal', texto: 'A família do Sinal emite e recebe os códigos que organizam o campo.' },
  { n: 5, nome: 'Portal', texto: 'A família Portal abre passagens e transições entre estados.' },
];

export const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
export const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

// ——— helpers de nomes ———
export const corAdj = (cor: Cor, fem: boolean) => COR_ADJ[cor][fem ? 1 : 0];
export const tomAdj = (tom: Tom, fem: boolean) => (fem ? tom.f : tom.m);
export const kinNome = (selo: Selo, tom: Tom) => `${selo.nome} ${tomAdj(tom, selo.fem)} ${corAdj(selo.cor, selo.fem)}`;
export const luaNome = (lua: Lua) => `Lua ${TONS[lua.n - 1].f} ${lua.de} ${lua.totem}`;

export const DIA_FORA_DO_TEMPO = {
  nome: 'Dia Fora do Tempo',
  data: '25 de julho',
  texto: 'O 365º dia do Anel Solar não pertence a nenhuma Lua nem a nenhuma semana. É o Dia da Paz através da Cultura: um dia de perdão, renovação e celebração antes do Ano Novo, em 26 de julho.',
};

export const ANO_NOVO = {
  nome: 'Ano Novo Sincronário',
  data: '26 de julho',
  texto: 'Primeiro dia da 1ª Lua Magnética: o início do Anel Solar, associado ao nascer heliacal de Sírius.',
};

export const HUNAB_KU = {
  nome: 'Hunab Ku 21 — Dia 0.0',
  texto: 'Em anos bissextos, 29 de fevereiro não conta como dia do Sincronário: é o Dia 0.0, sem Kin, sem Lua e sem dia da semana. Ocorre entre os dias 22 e 23 da 8ª Lua Galáctica, e a contagem de Kins segue de 28 de fevereiro para 1º de março.',
};
