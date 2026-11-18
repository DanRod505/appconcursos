const portugueseLessons = [
  {
    id: 'essencial',
    title: 'O essencial da concordância',
    description: 'Encontre o sujeito e faça o verbo concordar.',
    icon: 'book',
    questions: [
      {
        prompt: 'Em qual frase o verbo concorda com o sujeito?',
        options: ['O resultado das provas saíram ontem.', 'Os resultados da seleção saiu ontem.', 'O resultado das provas saiu ontem.', 'Os resultados da seleção saía ontem.'],
        answer: 2,
        explanation: 'O núcleo do sujeito é “resultado”, no singular. A expressão “das provas” complementa o substantivo e não altera a concordância.'
      },
      {
        prompt: 'Complete a frase: “Na próxima semana, ___ as inscrições.”',
        options: ['termina', 'terminam', 'terminou', 'terminava'],
        answer: 1,
        explanation: '“As inscrições” é o sujeito, embora apareça depois do verbo. Seu núcleo está no plural, por isso usamos “terminam”.'
      },
      {
        prompt: 'Qual palavra determina a concordância de “chegaram” em “Chegaram ontem os documentos do candidato”?',
        options: ['Ontem', 'Candidato', 'Chegaram', 'Documentos'],
        answer: 3,
        explanation: '“Documentos” é o núcleo do sujeito “os documentos do candidato”. O verbo concorda com esse núcleo no plural.'
      }
    ]
  },
  {
    id: 'impessoais',
    title: 'Verbos impessoais',
    description: 'Diferencie os usos de haver, fazer e existir.',
    icon: 'pen',
    questions: [
      {
        prompt: 'Complete a frase: “Na última seleção, ___ muitos recursos contra o gabarito.”',
        options: ['houve', 'houveram', 'haviam', 'existiu'],
        answer: 0,
        explanation: '“Haver” com sentido de existir ou ocorrer é impessoal e fica na terceira pessoa do singular. Com “existir”, a forma seria “existiram”.'
      },
      {
        prompt: 'Qual frase está de acordo com a norma-padrão?',
        options: ['Fazem dois meses que estudo.', 'Devem fazer dois meses que estudo.', 'Faz dois meses que estudo.', 'Faziam dois meses que estudo.'],
        answer: 2,
        explanation: 'O verbo “fazer”, quando indica tempo decorrido, é impessoal. A forma fica no singular, inclusive numa locução como “deve fazer”.'
      },
      {
        prompt: 'Complete a frase: “Ainda ___ vagas para o turno da manhã.”',
        options: ['existe', 'existem', 'hão', 'houveram'],
        answer: 1,
        explanation: 'O verbo “existir” concorda com o sujeito “vagas”. Com “haver” no mesmo sentido, a forma seria “há vagas”.'
      }
    ]
  },
  {
    id: 'pratica',
    title: 'Prática de prova',
    description: 'Aplique as regras em questões mistas.',
    icon: 'flag',
    questions: [
      {
        prompt: 'Assinale a frase em que a concordância está correta.',
        options: ['Haviam inscrições pendentes.', 'Devem haver novas convocações.', 'Fazem três dias que saiu o edital.', 'Devem existir novas convocações.'],
        answer: 3,
        explanation: '“Existir” tem sujeito, aqui “novas convocações”. Na locução, o auxiliar concorda com ele. Com “haver” no sentido de existir, seria “deve haver”.'
      },
      {
        prompt: 'Complete a frase: “___ ao setor de atendimento os pedidos de recurso.”',
        options: ['Chegou', 'Chegaram', 'Chegava', 'Vai chegar'],
        answer: 1,
        explanation: 'O sujeito é “os pedidos de recurso”. Mesmo depois do verbo, seu núcleo plural pede a forma “chegaram”.'
      },
      {
        prompt: 'Em qual frase o verbo “fazer” deve ficar no plural?',
        options: ['Faz duas semanas que a prova ocorreu.', 'Deve fazer dois anos desde o último concurso.', 'Os candidatos fazem a prova pela manhã.', 'Já faz cinco dias desde a publicação.'],
        answer: 2,
        explanation: 'Em “os candidatos fazem a prova”, “fazer” indica uma ação com sujeito no plural. Nas demais frases, indica tempo decorrido.'
      }
    ]
  }
];

export const subjects = [
  {
    id: 'portugues',
    name: 'Português',
    topic: 'Concordância verbal',
    icon: 'book',
    lessons: portugueseLessons
  },
  {
    id: 'raciocinio-logico',
    name: 'Raciocínio Lógico',
    topic: 'Sequências numéricas',
    icon: 'logic',
    lessons: [
      {
        id: 'sequencias',
        title: 'Encontre o padrão',
        description: 'Descubra a regra e identifique o próximo termo.',
        icon: 'logic',
        questions: [
          {
            prompt: 'Qual é o próximo termo da sequência 4, 7, 10, 13, …?',
            options: ['15', '16', '17', '19'],
            answer: 1,
            explanation: 'Cada termo é 3 unidades maior que o anterior. Somando 3 a 13, chegamos a 16.'
          },
          {
            prompt: 'Qual número completa a sequência 2, 6, 18, 54, …?',
            options: ['72', '108', '162', '216'],
            answer: 2,
            explanation: 'Cada termo é o triplo do anterior. O próximo é 54 × 3 = 162.'
          },
          {
            prompt: 'As diferenças entre os termos crescem de 1 em 1. Qual é o próximo termo de 2, 4, 7, 11, …?',
            options: ['14', '15', '16', '17'],
            answer: 2,
            explanation: 'As diferenças são +2, +3 e +4. A próxima é +5, então 11 + 5 = 16.'
          }
        ]
      },
      {
        id: 'alternancia',
        title: 'Padrões alternados',
        description: 'Identifique regras que se alternam na mesma sequência.',
        icon: 'pen',
        questions: [
          {
            prompt: 'Qual número vem depois em 3, 8, 4, 9, 5, 10, …?',
            options: ['6', '8', '11', '15'],
            answer: 0,
            explanation: 'A sequência alterna +5 e −4. Depois de somar 5 a 5 e chegar a 10, subtraímos 4 para chegar a 6.'
          },
          {
            prompt: 'Qual é o próximo termo de 1, 10, 2, 20, 3, 30, …?',
            options: ['4', '10', '31', '40'],
            answer: 0,
            explanation: 'As posições ímpares trazem 1, 2, 3, … e as pares trazem 10, 20, 30, …. O próximo termo ocupa uma posição ímpar, portanto é 4.'
          }
        ]
      },
      {
        id: 'sequencias-prova',
        title: 'Prática de prova',
        description: 'Combine padrões em questões de revisão.',
        icon: 'flag',
        questions: [
          {
            prompt: 'Qual alternativa completa a sequência 2, 5, 10, 17, 26, …?',
            options: ['31', '35', '36', '37'],
            answer: 3,
            explanation: 'As diferenças são 3, 5, 7 e 9. A próxima é 11, então 26 + 11 = 37.'
          },
          {
            prompt: 'Em 2, 4, 3, 9, 4, 16, …, cada par tem um número seguido de seu quadrado. Quais são os próximos dois termos?',
            options: ['5 e 20', '5 e 25', '6 e 24', '6 e 36'],
            answer: 1,
            explanation: 'Os primeiros termos dos pares são 2, 3 e 4. O próximo é 5, seguido de seu quadrado, 25.'
          }
        ]
      }
    ]
  }
];

export const icons = {
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
  route: '<circle cx="6" cy="18" r="2"/><path d="M8 18h6a4 4 0 0 0 0-8h-4a3 3 0 0 1 0-6h5"/><path d="m13 2 2 2-2 2"/>',
  refresh: '<path d="M20 8a8 8 0 0 0-14-2L3 9m0-5v5h5m-4 7a8 8 0 0 0 14 2l3-3m0 5v-5h-5"/>',
  chart: '<path d="M4 19h16M7 15v-4m5 4V5m5 10V8"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  box: '<rect x="4" y="4" width="16" height="16" rx="5"/><rect x="8" y="8" width="8" height="8" rx="2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  volume: '<path d="m11 5-5 4H3v6h3l5 4V5Zm4 4a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12"/>',
  muted: '<path d="m11 5-5 4H3v6h3l5 4V5Zm5 5 5 5m0-5-5 5"/>',
  logic: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/><path d="M14 7h4a2 2 0 0 1 2 2v2M7 14v4a2 2 0 0 0 2 2h2"/>',
  moon: '<path d="M20.9 13.3A9 9 0 0 1 10.7 3.1 9 9 0 1 0 20.9 13.3Z"/>',
  book: '<path d="M12 6c-2-2-5-2-9-2v14c4 0 7 0 9 2 2-2 5-2 9-2V4c-4 0-7 0-9 2Zm0 0v14"/>',
  play: '<path d="m9 5 11 7-11 7V5Z" fill="currentColor" stroke="none"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H5m6 6-6-6 6-6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  pen: '<path d="m13 6 5 5M4 20l5-1L20 8a2 2 0 0 0-4-4L5 15l-1 5Z"/>',
  flag: '<path d="M5 21V4m0 1c6-5 8 5 15 0v10c-7 5-9-5-15 0"/>',
  spark: '<path d="M12 2c0 7 3 10 10 10-7 0-10 3-10 10 0-7-3-10-10-10 7 0 10-3 10-10Z"/>',
  bulb: '<path d="M9 18h6m-5 4h4m-5-7a6 6 0 1 1 6 0v1H9v-1Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
