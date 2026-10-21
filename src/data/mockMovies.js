// Curated high-definition fallback movies from TMDB for offline/demo mode
export const MOCK_GENRES = [
  { id: 28, name: 'Acción' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasía' },
  { id: 27, name: 'Terror' },
  { id: 878, name: 'Ciencia Ficción' },
  { id: 53, name: 'Suspense' }
];

export const MOCK_MOVIES = [
  {
    id: 157336,
    title: 'Interstellar',
    original_title: 'Interstellar',
    tagline: 'El fin de la Tierra no será el fin de la humanidad.',
    overview: 'Un grupo de exploradores espaciales viaja a través de un agujero de gusano cerca de Saturno en un intento desesperado por encontrar un nuevo hogar para la humanidad ante el colapso ecológico de la Tierra.',
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 36240,
    runtime: 169,
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    genre_ids: [12, 18, 878],
    director: 'Christopher Nolan',
    trailer_key: 'zSWdZVtXT7E',
    cast: [
      { id: 1, name: 'Matthew McConaughey', character: 'Cooper', profile_path: '/e9ZHRY5daJQ2VggZAcJTVOB39by.jpg' },
      { id: 2, name: 'Anne Hathaway', character: 'Dra. Amelia Brand', profile_path: '/tLEFuMn3Ppnem4ygUVmsR1kZt6a.jpg' },
      { id: 3, name: 'Jessica Chastain', character: 'Murphy Cooper (adulta)', profile_path: '/Ar2pT1n2X3K4sL5V6N7m8P9q0R1.jpg' },
      { id: 4, name: 'Michael Caine', character: 'Profesor Brand', profile_path: '/klNx3V4W9mH2J8k1r0t9U4v7.jpg' }
    ]
  },
  {
    id: 27205,
    title: 'Origen (Inception)',
    original_title: 'Inception',
    tagline: 'Tu mente es la escena del crimen.',
    overview: 'Dom Cobb es un ladrón experto en el peligroso arte de la extracción: robar valiosos secretos de las profundidades del subconsciente durante el estado de sueño. Ahora le ofrecen una oportunidad de redención con una tarea inversa: la implantación de una idea.',
    release_date: '2010-07-15',
    vote_average: 8.4,
    vote_count: 37120,
    runtime: 148,
    poster_path: '/o24WqXQ325eX9j6sPq2PZc9b1yv.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    genre_ids: [28, 878, 12],
    director: 'Christopher Nolan',
    trailer_key: 'YoHD9XEInc0',
    cast: [
      { id: 10, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
      { id: 11, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: '/dhv9N08z1v0Y9jN2V8m3.jpg' },
      { id: 12, name: 'Elliot Page', character: 'Ariadne', profile_path: '/tpWb1V9r0m8q9P1o2.jpg' },
      { id: 13, name: 'Tom Hardy', character: 'Eames', profile_path: '/d8seqDp0hM5Y9p8r.jpg' }
    ]
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    tagline: 'El mundo cambiará para siempre.',
    overview: 'La historia del físico teórico estadounidense J. Robert Oppenheimer, su papel al frente del Proyecto Manhattan y los dilemas éticos y políticos tras el desarrollo de las primeras armas nucleares.',
    release_date: '2023-07-19',
    vote_average: 8.1,
    vote_count: 10850,
    runtime: 180,
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    genre_ids: [18, 36],
    director: 'Christopher Nolan',
    trailer_key: 'bK6ldnjE3Y0',
    cast: [
      { id: 20, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: '/i8wJ5m9u8P0q7X4y6z.jpg' },
      { id: 21, name: 'Emily Blunt', character: 'Katherine Oppenheimer', profile_path: '/nPJiqxkWmEjzN407T.jpg' },
      { id: 22, name: 'Matt Damon', character: 'Leslie Groves', profile_path: '/elzaapdfDF.jpg' },
      { id: 23, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profile_path: '/5qHNjhtjMD4Ywh3ag.jpg' }
    ]
  },
  {
    id: 693134,
    title: 'Dune: Parte Dos',
    original_title: 'Dune: Part Two',
    tagline: 'Larga vida a los luchadores.',
    overview: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia. Enfrentando una elección entre el amor de su vida y el destino del universo.',
    release_date: '2024-02-27',
    vote_average: 8.2,
    vote_count: 6150,
    runtime: 166,
    poster_path: '/8b8R8l88Qje9dn9OE8PY05Nx1S8.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0x2.jpg',
    genre_ids: [878, 12],
    director: 'Denis Villeneuve',
    trailer_key: 'Way9Dexny3w',
    cast: [
      { id: 30, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: '/BE2sdjpg.jpg' },
      { id: 31, name: 'Zendaya', character: 'Chani', profile_path: '/r3A7hpjg.jpg' },
      { id: 32, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: '/6NRDujpg.jpg' },
      { id: 33, name: 'Javier Bardem', character: 'Stilgar', profile_path: '/javier.jpg' }
    ]
  },
  {
    id: 569094,
    title: 'Spider-Man: Cruzando el Multiverso',
    original_title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'No es fácil salvar a todos.',
    overview: 'Miles Morales es catapultado a través del Multiverso, donde se encuentra con un equipo de Spider-Gente encargado de proteger su existencia. Pero cuando los héroes chocan sobre cómo manejar una nueva amenaza, Miles debe redefinir lo que significa ser un héroe.',
    release_date: '2023-05-31',
    vote_average: 8.4,
    vote_count: 7300,
    runtime: 140,
    poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    genre_ids: [16, 28, 12, 878],
    director: 'Joaquim Dos Santos, Kemp Powers',
    trailer_key: 'cqGjhVJWtEg',
    cast: [
      { id: 40, name: 'Shameik Moore', character: 'Miles Morales (voz)' },
      { id: 41, name: 'Hailee Steinfeld', character: 'Gwen Stacy (voz)' },
      { id: 42, name: 'Oscar Isaac', character: 'Miguel O\'Hara (voz)' }
    ]
  },
  {
    id: 496243,
    title: 'Parásitos (Parasite)',
    original_title: 'Gisaengchung',
    tagline: 'Actúa como si pertenecieras.',
    overview: 'Tanto Gi-taek como su familia están sin trabajo. Cuando su hijo mayor, Gi-woo, empieza a dar clases particulares en casa de los adinerados Park, las dos familias forjan una relación de consecuencias imprevisibles.',
    release_date: '2019-05-30',
    vote_average: 8.5,
    vote_count: 18200,
    runtime: 132,
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: '/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    genre_ids: [35, 53, 18],
    director: 'Bong Joon-ho',
    trailer_key: '5xH0Hf_x44Q',
    cast: [
      { id: 50, name: 'Song Kang-ho', character: 'Kim Ki-taek' },
      { id: 51, name: 'Lee Sun-kyun', character: 'Park Dong-ik' },
      { id: 52, name: 'Cho Yeo-jeong', character: 'Choi Yeon-gyo' }
    ]
  },
  {
    id: 155,
    title: 'El Caballero Oscuro (The Dark Knight)',
    original_title: 'The Dark Knight',
    tagline: 'Por qué tan serio.',
    overview: 'Batman eleva la apuesta en su guerra contra el crimen. Con la ayuda del teniente Jim Gordon y el fiscal de distrito Harvey Dent, se propone desmantelar las organizaciones criminales de Gotham. Pero el caos llega personificado en El Joker.',
    release_date: '2008-07-16',
    vote_average: 8.5,
    vote_count: 33400,
    runtime: 152,
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    genre_ids: [18, 28, 80, 53],
    director: 'Christopher Nolan',
    trailer_key: 'EXeTwQWrcwY',
    cast: [
      { id: 60, name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
      { id: 61, name: 'Heath Ledger', character: 'Joker' },
      { id: 62, name: 'Aaron Eckhart', character: 'Harvey Dent' }
    ]
  },
  {
    id: 533535,
    title: 'Deadpool y Lobezno',
    original_title: 'Deadpool & Wolverine',
    tagline: 'Juntos pero no revueltos.',
    overview: 'Un apático Wade Wilson se afana en la vida civil dejando atrás sus días como Deadpool. Pero cuando su mundo natal se enfrenta a una amenaza existencial, debe vestir el traje de nuevo junto a un reticente Lobezno.',
    release_date: '2024-07-24',
    vote_average: 7.7,
    vote_count: 5800,
    runtime: 128,
    poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop_path: '/yD3f2Gj0ZfP56uN67k3P7Jb.jpg',
    genre_ids: [28, 35, 878],
    director: 'Shawn Levy',
    trailer_key: 'Idh8n5XuYIA',
    cast: [
      { id: 70, name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool' },
      { id: 71, name: 'Hugh Jackman', character: 'Logan / Wolverine' },
      { id: 72, name: 'Emma Corrin', character: 'Cassandra Nova' }
    ]
  },
  {
    id: 1022789,
    title: 'Del Revés 2 (Inside Out 2)',
    original_title: 'Inside Out 2',
    tagline: 'Haz hueco para nuevas emociones.',
    overview: 'Regresa a la mente de la recién estrenada adolescente Riley justo cuando el cuartel general está sufriendo una repentina demolición para dar paso a algo totalmente inesperado: ¡nuevas emociones como Ansiedad, Envidia y Vergüenza!',
    release_date: '2024-06-12',
    vote_average: 7.6,
    vote_count: 4900,
    runtime: 96,
    poster_path: '/mP5d3sP2j3q4K1l8.jpg',
    backdrop_path: '/stKGOmvZtiYI5x036G4s14.jpg',
    genre_ids: [16, 10751, 35, 12],
    director: 'Kelsey Mann',
    trailer_key: 'VWavstJydZU',
    cast: [
      { id: 80, name: 'Amy Poehler', character: 'Alegría (voz)' },
      { id: 81, name: 'Maya Hawke', character: 'Ansiedad (voz)' },
      { id: 82, name: 'Phyllis Smith', character: 'Tristeza (voz)' }
    ]
  },
  {
    id: 238,
    title: 'El Padrino (The Godfather)',
    original_title: 'The Godfather',
    tagline: 'Una oferta que no podrás rechazar.',
    overview: 'Retrata a la familia Corleone bajo el mando del patriarca Vito Corleone, enfocándose en la transformación de su hijo menor, Michael, de reacio miembro de la familia a implacable jefe de la mafia.',
    release_date: '1972-03-14',
    vote_average: 8.7,
    vote_count: 20400,
    runtime: 175,
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    genre_ids: [18, 80],
    director: 'Francis Ford Coppola',
    trailer_key: 'UaVTIH8mujA',
    cast: [
      { id: 90, name: 'Marlon Brando', character: 'Don Vito Corleone' },
      { id: 91, name: 'Al Pacino', character: 'Michael Corleone' },
      { id: 92, name: 'James Caan', character: 'Sonny Corleone' }
    ]
  },
  {
    id: 13,
    title: 'Forrest Gump',
    original_title: 'Forrest Gump',
    tagline: 'La vida es como una caja de bombones.',
    overview: 'Forrest Gump, un hombre con un coeficiente intelectual bajo pero un corazón enorme, vive y presencia algunos de los eventos más definitorios de la segunda mitad del siglo XX en Estados Unidos.',
    release_date: '1994-06-23',
    vote_average: 8.5,
    vote_count: 27100,
    runtime: 142,
    poster_path: '/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
    backdrop_path: '/qdIMHd4sEfJSckfVJfKQvisL02a.jpg',
    genre_ids: [35, 18, 10749],
    director: 'Robert Zemeckis',
    trailer_key: 'bLvqoHBptjg',
    cast: [
      { id: 100, name: 'Tom Hanks', character: 'Forrest Gump' },
      { id: 101, name: 'Robin Wright', character: 'Jenny Curran' },
      { id: 102, name: 'Gary Sinise', character: 'Teniente Dan Taylor' }
    ]
  },
  {
    id: 129,
    title: 'El viaje de Chihiro',
    original_title: '千と千尋の神隠し',
    tagline: 'Nunca olvides quién eres.',
    overview: 'Chihiro, una niña caprichosa de diez años, debe trabajar en una misteriosa casa de baños frecuentada por espíritus y dioses para rescatar a sus padres, transformados en cerdos por una bruja.',
    release_date: '2001-07-20',
    vote_average: 8.5,
    vote_count: 16800,
    runtime: 125,
    poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop_path: '/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg',
    genre_ids: [16, 10751, 14],
    director: 'Hayao Miyazaki',
    trailer_key: 'ByXuk9QqQkk',
    cast: [
      { id: 110, name: 'Rumi Hiiragi', character: 'Chihiro Ogino (voz)' },
      { id: 111, name: 'Miyu Irino', character: 'Haku (voz)' }
    ]
  }
];
