var recursos = [
  {
    tipo: "infografia",
    etiqueta: "Infografía · 2 min",
    titulo: "Infografía: Tipos de Fisuras",
    descripcion: "Guía visual para identificar daños estructurales.",
    miniatura: "../assets/images/infografias/tipos-fisuras.jpg",
    archivo: "../assets/images/infografias/tipos-fisuras.jpg",
    alt: "Infografía que compara fisuras leves del acabado con grietas estructurales"
  },
  {
    tipo: "video",
    etiqueta: "Video · 30 s",
    titulo: "Guía de Video: Refuerzo de Muros",
    descripcion: "Técnicas básicas para mejorar la resistencia sísmica.",
    miniatura: "../assets/images/videos/poster-refuerzo-muros.jpg",
    archivo: "../assets/videos/refuerzo-muros.mp4",
    subtitulos: "../assets/videos/refuerzo-muros.vtt"
  },
  {
    tipo: "infografia",
    etiqueta: "Checklist · Infografía",
    titulo: "Infografía: Equipos de Emergencia",
    descripcion: "Lista de verificación para armar su kit de emergencia.",
    miniatura: "../assets/images/infografias/equipos-emergencia.jpg",
    archivo: "../assets/images/infografias/equipos-emergencia.jpg",
    alt: "Infografía con los elementos de una mochila de emergencia: agua, linterna, botiquín y radio"
  },
  {
    tipo: "video",
    etiqueta: "Video · 30 s",
    titulo: "Guía de Video: Plan de Evacuación",
    descripcion: "Cómo crear un plan familiar efectivo.",
    miniatura: "../assets/images/videos/poster-plan-evacuacion.jpg",
    archivo: "../assets/videos/plan-evacuacion.mp4",
    subtitulos: "../assets/videos/plan-evacuacion.vtt"
  }
];

var glosario = [
  { termino: "Aislamiento sísmico", definicion: "Sistema que reduce la vibración que llega a un edificio durante un sismo." },
  { termino: "Asentamiento", definicion: "Hundimiento del suelo bajo la vivienda. Puede causar grietas en diagonal y puertas que no cierran." },
  { termino: "Cangrejera", definicion: "Huecos en el concreto por mala compactación. Deja el fierro expuesto y debilita el elemento." },
  { termino: "Ciclo de carga", definicion: "Secuencia en la que una fuerza se aplica y se retira sobre una estructura." },
  { termino: "Cimentación", definicion: "Parte enterrada de la estructura que recibe el peso de la vivienda y lo pasa al terreno." },
  { termino: "Columna", definicion: "Elemento vertical de concreto armado que sostiene los techos y confina los muros." },
  { termino: "Ductilidad", definicion: "Capacidad de un material de deformarse sin romperse." },
  { termino: "Estribo", definicion: "Fierro doblado en forma de anillo que rodea las varillas de una columna o viga." },
  { termino: "Fisura", definicion: "Abertura muy fina, menor a 1 mm, que suele afectar solo el acabado." },
  { termino: "Grieta", definicion: "Abertura más ancha que una fisura. Puede atravesar el muro y señalar un problema estructural." },
  { termino: "Tarrajeo", definicion: "Capa de mortero que cubre el muro como acabado. Si se cae, no siempre indica daño estructural." }
];

var fichas = {
  "Aislamiento sísmico": {
    sencillo: "Es una tecnología que separa el edificio del suelo con apoyos especiales. Durante un sismo el suelo se mueve, pero al edificio le llega mucha menos vibración. Se usa sobre todo en hospitales y edificios grandes.",
    opcionA: "Base fija",
    opcionB: "Con aisladores",
    explicaA: "El edificio está pegado al suelo: cuando el suelo se mueve, el edificio vibra con la misma fuerza.",
    explicaB: "Los aisladores absorben gran parte del movimiento: el edificio se mueve mucho menos.",
    svgA: '<svg viewBox="0 0 260 200"><path class="d-onda" d="M10 172 Q30 162 50 172 T90 172 T130 172 T170 172 T210 172 T250 172"/><rect class="d-suelo" x="0" y="176" width="260" height="24"/><g transform="rotate(-6 130 176)"><rect class="d-muro" x="95" y="40" width="70" height="136"/><rect class="d-ventana" x="105" y="55" width="20" height="18"/><rect class="d-ventana" x="135" y="55" width="20" height="18"/><rect class="d-ventana" x="105" y="95" width="20" height="18"/><rect class="d-ventana" x="135" y="95" width="20" height="18"/></g><path class="d-flecha" d="M70 40 L60 50 L70 60 M190 40 L200 50 L190 60"/><text class="d-texto" x="130" y="22" text-anchor="middle">Vibra junto con el suelo</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><path class="d-onda" d="M10 172 Q30 162 50 172 T90 172 T130 172 T170 172 T210 172 T250 172"/><rect class="d-suelo" x="0" y="176" width="260" height="24"/><rect class="d-aislador" x="100" y="164" width="16" height="12" rx="3"/><rect class="d-aislador" x="144" y="164" width="16" height="12" rx="3"/><rect class="d-muro" x="95" y="28" width="70" height="136"/><rect class="d-ventana" x="105" y="43" width="20" height="18"/><rect class="d-ventana" x="135" y="43" width="20" height="18"/><rect class="d-ventana" x="105" y="83" width="20" height="18"/><rect class="d-ventana" x="135" y="83" width="20" height="18"/><text class="d-texto" x="130" y="18" text-anchor="middle">Los aisladores absorben el movimiento</text></svg>',
    caso: null
  },
  "Ciclo de carga": {
    sencillo: "En un sismo el suelo no empuja una sola vez: empuja de un lado a otro muchas veces. A cada ida y vuelta se le llama ciclo. Un buen diseño resiste muchos ciclos sin dañarse; uno débil se va agrietando con cada uno.",
    opcionA: "Vuelve a su forma",
    opcionB: "Acumula daño",
    explicaA: "Un elemento bien diseñado se mueve de un lado a otro y vuelve a su posición sin dañarse.",
    explicaB: "Un elemento débil se agrieta un poco más en cada ida y vuelta, hasta que falla.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-suelo" x="40" y="170" width="180" height="20"/><path class="d-fantasma" d="M130 170 Q128 110 100 60"/><path class="d-fantasma" d="M130 170 Q132 110 160 60"/><line class="d-acero-grueso" x1="130" y1="170" x2="130" y2="55"/><path class="d-flecha" d="M95 45 Q130 25 165 45"/><polygon class="d-flecha-punta" points="160,38 170,48 158,50"/><polygon class="d-flecha-punta" points="100,38 90,48 102,50"/><text class="d-texto" x="130" y="198" text-anchor="middle">Va y viene sin dañarse</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><rect class="d-suelo" x="40" y="170" width="180" height="20"/><path class="d-fantasma" d="M130 170 Q128 110 100 60"/><path class="d-fantasma" d="M130 170 Q132 110 160 60"/><rect class="d-concreto" x="118" y="55" width="24" height="115"/><path class="d-grieta" d="M118 150 L128 156 L122 162 M142 140 L132 148 L140 156 M118 128 L126 134"/><path class="d-flecha" d="M95 45 Q130 25 165 45"/><polygon class="d-flecha-punta" points="160,38 170,48 158,50"/><polygon class="d-flecha-punta" points="100,38 90,48 102,50"/><text class="d-texto" x="130" y="198" text-anchor="middle">Cada ida y vuelta lo debilita</text></svg>',
    caso: null
  },
  "Cimentación": {
    sencillo: "Es la base enterrada de la casa, como los pies de una persona. Si la base es ancha y está sobre suelo firme, el peso se reparte y la casa no se hunde.",
    opcionA: "Zapata adecuada",
    opcionB: "Zapata insuficiente",
    explicaA: "Una zapata ancha reparte el peso de la casa sobre más suelo: la columna se mantiene firme.",
    explicaB: "Si la zapata es pequeña o el suelo es blando, el peso se concentra en un punto y la casa puede hundirse.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-suelo" x="0" y="95" width="260" height="105"/><rect class="d-concreto" x="116" y="15" width="28" height="140"/><rect class="d-concreto" x="76" y="150" width="108" height="24"/><path class="d-flecha-azul" d="M90 178 V190 M110 178 V190 M130 178 V190 M150 178 V190 M170 178 V190"/><text class="d-texto" x="200" y="112">Suelo</text><text class="d-texto" x="130" y="10" text-anchor="middle">El peso se reparte</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><path class="d-suelo" d="M0 95 H100 Q130 112 160 95 H260 V200 H0 Z"/><rect class="d-concreto" x="116" y="30" width="28" height="140"/><rect class="d-concreto" x="110" y="165" width="40" height="18"/><path class="d-flecha" d="M130 186 V198"/><polygon class="d-flecha-punta" points="124,192 136,192 130,200"/><path class="d-grieta" d="M100 98 L94 110 M160 98 L166 110"/><text class="d-texto" x="200" y="112">Suelo</text><text class="d-texto" x="130" y="22" text-anchor="middle">El peso se concentra y se hunde</text></svg>',
    caso: 4
  },
  "Columna": {
    sencillo: "Es el elemento vertical de concreto con fierro que sostiene los techos. Junto con la viga de amarre, \"abraza\" al muro de ladrillo para que no se desarme durante un sismo.",
    opcionA: "Con columnas",
    opcionB: "Sin columnas",
    explicaA: "Las columnas y la viga de amarre mantienen unido el muro durante un sismo.",
    explicaB: "Un muro de ladrillo sin columnas se agrieta y puede caerse con facilidad.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-suelo" x="20" y="175" width="220" height="15"/><rect class="d-concreto" x="40" y="25" width="24" height="150"/><rect class="d-concreto" x="196" y="25" width="24" height="150"/><rect class="d-concreto" x="40" y="15" width="180" height="20"/><rect class="d-ladrillo" x="64" y="35" width="132" height="140"/><path class="d-junta" d="M64 63 H196 M64 91 H196 M64 119 H196 M64 147 H196"/><text class="d-texto" x="130" y="10" text-anchor="middle">Viga de amarre</text><text class="d-texto" x="52" y="198" text-anchor="middle">Columna</text><text class="d-texto" x="208" y="198" text-anchor="middle">Columna</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><rect class="d-suelo" x="20" y="175" width="220" height="15"/><g transform="rotate(4 64 175)"><rect class="d-ladrillo" x="64" y="35" width="132" height="140"/><path class="d-junta" d="M64 63 H196 M64 91 H196 M64 119 H196 M64 147 H196"/></g><path class="d-grieta" d="M110 45 L122 63 L116 75 L134 91 L128 105 L148 121 L142 135 L162 151"/><rect class="d-ladrillo" x="200" y="160" width="22" height="12" transform="rotate(20 211 166)"/><text class="d-texto" x="130" y="198" text-anchor="middle">El muro se agrieta y se inclina</text></svg>',
    caso: 3
  },
  "Fisura": {
    sencillo: "Es una rajadura muy delgada, menor a 1 milímetro, que normalmente solo afecta la pintura o el tarrajeo. No suele ser grave, pero conviene medirla y vigilar si crece.",
    opcionA: "Fisura fina",
    opcionB: "Grieta ancha",
    explicaA: "Una fisura fina (menos de 1 mm) suele ser solo del acabado: mídela y vigila si crece.",
    explicaB: "Si la abertura es ancha (más de 3 mm) ya es una grieta y puede afectar la estructura: consulta a un ingeniero.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-muro" x="40" y="20" width="180" height="155"/><path class="d-fisura" d="M90 40 L104 66 L98 90 L114 118 L108 146"/><rect class="d-regla" x="125" y="84" width="70" height="14" rx="2"/><path class="d-junta" d="M135 84 V92 M145 84 V90 M155 84 V92 M165 84 V90 M175 84 V92 M185 84 V90"/><text class="d-texto" x="130" y="194" text-anchor="middle">Menos de 1 mm</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><rect class="d-muro" x="40" y="20" width="180" height="155"/><path class="d-grieta-ancha" d="M90 40 L104 66 L98 90 L114 118 L108 146"/><rect class="d-regla" x="125" y="84" width="70" height="14" rx="2"/><path class="d-junta" d="M135 84 V92 M145 84 V90 M155 84 V92 M165 84 V90 M175 84 V92 M185 84 V90"/><text class="d-texto" x="130" y="194" text-anchor="middle">Más de 3 mm</text></svg>',
    caso: 1
  },
  "Grieta": {
    sencillo: "Es una abertura más ancha que una fisura, que puede atravesar el muro. Su forma da pistas: las grietas en diagonal o en escalera suelen indicar un problema estructural.",
    opcionA: "Grieta vertical",
    opcionB: "Grieta en diagonal",
    explicaA: "Una grieta vertical puede deberse a contracción del material o a cambios de temperatura: mídela y vigila si crece.",
    explicaB: "Las grietas en diagonal, sobre todo desde las esquinas de puertas y ventanas, suelen indicar daño por sismo o asentamiento: consulta a un ingeniero.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-muro" x="40" y="20" width="180" height="155"/><rect class="d-ventana" x="100" y="55" width="60" height="45"/><path class="d-grieta" d="M190 30 L194 60 L188 90 L193 120 L189 165"/><text class="d-texto" x="130" y="194" text-anchor="middle">Recta, de arriba hacia abajo</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><rect class="d-muro" x="40" y="20" width="180" height="155"/><rect class="d-ventana" x="100" y="55" width="60" height="45"/><path class="d-grieta" d="M160 100 L172 112 L170 124 L184 136 L182 148 L200 165"/><path class="d-grieta" d="M100 55 L90 45 L92 38 L80 28"/><path class="d-grieta" d="M100 100 L88 114 L90 124 L74 140"/><text class="d-texto" x="130" y="194" text-anchor="middle">En diagonal desde las esquinas</text></svg>',
    caso: 1
  },
  "Asentamiento": {
    sencillo: "Es cuando el suelo debajo de la casa se hunde, sobre todo de un lado. La casa se \"tuerce\": aparecen grietas en diagonal y las puertas o ventanas dejan de cerrar bien.",
    opcionA: "Suelo firme",
    opcionB: "Suelo que se hunde",
    explicaA: "Con suelo firme y buena cimentación, la casa se mantiene nivelada y sin grietas.",
    explicaB: "Si un lado del suelo se hunde, la casa se inclina y aparecen grietas en diagonal cerca de puertas y ventanas.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-suelo" x="0" y="150" width="260" height="50"/><polygon class="d-techo" points="60,70 130,30 200,70"/><rect class="d-muro" x="70" y="70" width="120" height="80"/><rect class="d-hueco" x="118" y="105" width="24" height="45"/><rect class="d-ventana" x="84" y="88" width="22" height="20"/><rect class="d-ventana" x="154" y="88" width="22" height="20"/></svg>',
    svgB: '<svg viewBox="0 0 260 200"><path class="d-suelo" d="M0 150 H140 Q190 150 260 175 V200 H0 Z"/><g transform="rotate(5 70 150)"><polygon class="d-techo" points="60,70 130,30 200,70"/><rect class="d-muro" x="70" y="70" width="120" height="80"/><rect class="d-hueco" x="118" y="105" width="24" height="45"/><rect class="d-ventana" x="84" y="88" width="22" height="20"/><rect class="d-ventana" x="154" y="88" width="22" height="20"/><path class="d-grieta" d="M150 72 L158 84 L154 92 L166 104 L162 112 L176 128"/><path class="d-grieta" d="M106 108 L98 120 L102 128 L92 142"/></g><path class="d-flecha" d="M225 150 V172"/><polygon class="d-flecha-punta" points="219,166 231,166 225,176"/></svg>',
    caso: 4
  },
  "Cangrejera": {
    sencillo: "Son huecos en el concreto, parecidos a los de una esponja. Pasan cuando la mezcla no se acomoda bien al vaciar. El fierro queda al aire, se oxida y la columna pierde fuerza.",
    opcionA: "Bien vibrado",
    opcionB: "Con cangrejera",
    explicaA: "Concreto compacto: el fierro queda protegido dentro de la columna.",
    explicaB: "Concreto con huecos: el fierro queda expuesto, se oxida y la columna resiste menos.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-concreto" x="90" y="15" width="80" height="170" rx="3"/><line class="d-acero-oculto" x1="105" y1="15" x2="105" y2="185"/><line class="d-acero-oculto" x1="155" y1="15" x2="155" y2="185"/><text class="d-texto" x="130" y="198" text-anchor="middle">Superficie lisa y compacta</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><rect class="d-concreto" x="90" y="15" width="80" height="170" rx="3"/><ellipse class="d-hueco" cx="112" cy="70" rx="16" ry="11"/><ellipse class="d-hueco" cx="150" cy="110" rx="14" ry="18"/><ellipse class="d-hueco" cx="118" cy="145" rx="10" ry="8"/><ellipse class="d-hueco" cx="145" cy="45" rx="7" ry="6"/><line class="d-acero" x1="155" y1="94" x2="155" y2="126"/><line class="d-oxido" x1="155" y1="100" x2="155" y2="118"/><line class="d-acero" x1="105" y1="62" x2="105" y2="78"/><text class="d-texto" x="130" y="198" text-anchor="middle">Huecos y fierro expuesto</text></svg>',
    caso: 3
  },
  "Ductilidad": {
    sencillo: "Es la capacidad de un material de doblarse sin romperse de golpe. En un sismo, una estructura dúctil se deforma y \"avisa\", lo que da tiempo para salir.",
    opcionA: "Material dúctil",
    opcionB: "Material frágil",
    explicaA: "El fierro bien colocado se dobla poco a poco: la estructura avisa antes de fallar.",
    explicaB: "Un material frágil, como el ladrillo sin refuerzo, se rompe de golpe y sin aviso.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-suelo" x="40" y="170" width="180" height="20"/><path class="d-acero-grueso" d="M130 170 C130 120 135 85 175 45"/><path class="d-flecha" d="M200 30 Q215 45 205 60"/><polygon class="d-flecha-punta" points="198,58 210,56 204,66"/><text class="d-texto" x="130" y="198" text-anchor="middle">Se dobla sin romperse</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><rect class="d-suelo" x="40" y="170" width="180" height="20"/><rect class="d-ladrillo" x="115" y="105" width="30" height="65"/><path class="d-ladrillo" d="M122 98 L152 92 L158 30 L128 36 Z"/><path class="d-grieta" d="M112 104 L122 98 L130 106 L138 97 L148 104"/><text class="d-texto" x="130" y="198" text-anchor="middle">Se rompe de golpe</text></svg>',
    caso: 1
  },
  "Estribo": {
    sencillo: "Son los anillos de fierro que abrazan las varillas de una columna. Mantienen el fierro en su sitio; si están muy separados o mal doblados, la columna se abre en un sismo.",
    opcionA: "Bien colocados",
    opcionB: "Muy separados",
    explicaA: "Estribos cercanos entre sí y con ganchos doblados hacia adentro: la columna se mantiene firme.",
    explicaB: "Estribos muy separados y con ganchos hacia afuera: las varillas se abren y la columna falla.",
    svgA: '<svg viewBox="0 0 260 200"><line class="d-acero-grueso" x1="100" y1="10" x2="100" y2="185"/><line class="d-acero-grueso" x1="160" y1="10" x2="160" y2="185"/><g class="d-estribos"><line x1="100" y1="25" x2="160" y2="25"/><line x1="100" y1="45" x2="160" y2="45"/><line x1="100" y1="65" x2="160" y2="65"/><line x1="100" y1="85" x2="160" y2="85"/><line x1="100" y1="105" x2="160" y2="105"/><line x1="100" y1="125" x2="160" y2="125"/><line x1="100" y1="145" x2="160" y2="145"/><line x1="100" y1="165" x2="160" y2="165"/><path d="M160 25 L148 37"/><path d="M160 85 L148 97"/><path d="M160 145 L148 157"/></g><text class="d-texto" x="130" y="198" text-anchor="middle">Cerca y con ganchos a 135°</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><path class="d-acero-grueso" d="M100 10 C100 70 80 110 100 185"/><path class="d-acero-grueso" d="M160 10 C160 70 182 110 160 185"/><g class="d-estribos"><line x1="100" y1="25" x2="160" y2="25"/><line x1="100" y1="170" x2="160" y2="170"/><path d="M160 25 L178 25"/><path d="M160 170 L178 170"/></g><path class="d-grieta" d="M84 92 L74 100 M176 92 L186 100"/><text class="d-texto" x="130" y="198" text-anchor="middle">Separados: el fierro se abre</text></svg>',
    caso: 3
  },
  "Tarrajeo": {
    sencillo: "Es el enlucido de cemento que cubre el ladrillo. Si solo se raja o se cae el tarrajeo, suele ser un daño del acabado; si la grieta atraviesa el ladrillo, es más serio.",
    opcionA: "Fisura en el tarrajeo",
    opcionB: "Grieta que atraviesa",
    explicaA: "La fisura se queda en la capa de acabado: suele ser un problema estético que hay que vigilar.",
    explicaB: "La grieta cruza el tarrajeo y el ladrillo: puede ser un daño estructural y conviene consultar a un ingeniero.",
    svgA: '<svg viewBox="0 0 260 200"><rect class="d-tarrajeo" x="70" y="15" width="16" height="170"/><rect class="d-ladrillo" x="86" y="15" width="88" height="170"/><rect class="d-tarrajeo" x="174" y="15" width="16" height="170"/><path class="d-grieta" d="M70 70 L80 80 L74 92 L84 104"/><text class="d-texto" x="78" y="10" text-anchor="middle">Tarrajeo</text><text class="d-texto" x="130" y="10" text-anchor="middle">Ladrillo</text><text class="d-texto" x="130" y="198" text-anchor="middle">Solo en la capa de acabado</text></svg>',
    svgB: '<svg viewBox="0 0 260 200"><rect class="d-tarrajeo" x="70" y="15" width="16" height="170"/><rect class="d-ladrillo" x="86" y="15" width="88" height="170"/><rect class="d-tarrajeo" x="174" y="15" width="16" height="170"/><path class="d-grieta" d="M70 50 L96 66 L90 82 L124 98 L118 114 L152 128 L146 144 L190 162"/><text class="d-texto" x="78" y="10" text-anchor="middle">Tarrajeo</text><text class="d-texto" x="130" y="10" text-anchor="middle">Ladrillo</text><text class="d-texto" x="130" y="198" text-anchor="middle">Cruza todo el muro</text></svg>',
    caso: 1
  }
};

var resultadosGlosario = [];
var fichaActual = null;
var ultimoFocoFicha = null;

var casos = [
  {
    id: 1,
    titulo: "Reforzamiento de muro",
    lugar: "San Juan de Lurigancho",
    tipoObra: "Intervención: reforzamiento de muro",
    descripcion: "Ejemplo ilustrativo de una intervención en un muro de vivienda existente.",
    detalle: "El muro presentaba grietas en diagonal. Se añadieron columnas de confinamiento y una viga de amarre bajo supervisión de un ingeniero.",
    tags: ["Cimentación"],
    antes: "../assets/images/casos/caso1-antes.jpg",
    despues: "../assets/images/casos/caso1-despues.jpg"
  },
  {
    id: 2,
    titulo: "Ampliación de segundo piso",
    lugar: "Comas",
    tipoObra: "Tipo de obra: ampliación",
    descripcion: "Ejemplo ilustrativo de ampliación de una vivienda con un segundo piso.",
    detalle: "Antes de construir se revisó que las columnas del primer piso pudieran soportar el peso adicional.",
    tags: ["Ampliación"],
    antes: "../assets/images/casos/caso2-antes.jpg",
    despues: "../assets/images/casos/caso2-despues.jpg"
  },
  {
    id: 3,
    titulo: "Reparación de cangrejeras en columnas",
    lugar: "Carabayllo",
    tipoObra: "Intervención: reparación de concreto",
    descripcion: "Ejemplo ilustrativo de reparación de columnas con fierro expuesto.",
    detalle: "Se retiró el concreto suelto, se limpió el fierro y se rellenó con mortero de reparación.",
    tags: ["Cangrejera"],
    antes: "../assets/images/casos/caso3-antes.jpg",
    despues: "../assets/images/casos/caso3-despues.jpg"
  },
  {
    id: 4,
    titulo: "Ampliación con refuerzo de zapatas",
    lugar: "Los Olivos",
    tipoObra: "Tipo de obra: ampliación y cimentación",
    descripcion: "Ejemplo ilustrativo de una ampliación que requirió reforzar la base.",
    detalle: "Para construir el tercer piso se ampliaron las zapatas, porque el suelo era blando.",
    tags: ["Ampliación", "Cimentación"],
    antes: "../assets/images/casos/caso4-antes.jpg",
    despues: "../assets/images/casos/caso4-despues.jpg"
  }
];

function mostrarRecursos(lista) {
  var contenedor = document.querySelector("#lista-recursos");
  var mensajeVacio = document.querySelector("#recursos-vacio");
  var html = "";

  for (var i = 0; i < lista.length; i++) {
    var r = lista[i];
    var posicion = recursos.indexOf(r);

    html += '<article class="recurso">' +
              '<button type="button" class="recurso-imagen" onclick="abrirVisor(' + posicion + ')" tabindex="-1" aria-hidden="true">' +
                '<img src="' + r.miniatura + '" alt="">' +
              '</button>' +
              '<div class="recurso-cuerpo">' +
                '<div class="recurso-meta">' +
                  '<span class="recurso-tipo">' + r.etiqueta + '</span>' +
                  '<button type="button" class="btn-guardar" onclick="guardarRecurso(this)" aria-label="Guardar recurso">' +
                    '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>' +
                  '</button>' +
                '</div>' +
                '<button type="button" class="recurso-titulo" onclick="abrirVisor(' + posicion + ')">' + r.titulo + '</button>' +
                '<p class="recurso-descripcion">' + r.descripcion + '</p>' +
              '</div>' +
            '</article>';
  }

  contenedor.innerHTML = html;

  if (lista.length === 0) {
    mensajeVacio.classList.remove("oculto");
  } else {
    mensajeVacio.classList.add("oculto");
  }
}

function guardarRecurso(boton) {
  boton.classList.toggle("guardado");

  if (boton.classList.contains("guardado")) {
    boton.setAttribute("aria-label", "Quitar de guardados");
  } else {
    boton.setAttribute("aria-label", "Guardar recurso");
  }
}

function abrirVisor(posicion) {
  var r = recursos[posicion];
  var imagen = document.querySelector("#visor-imagen");
  var video = document.querySelector("#visor-video");
  var aviso = document.querySelector("#visor-aviso");

  document.querySelector("#visor-titulo").textContent = r.titulo;

  if (r.tipo === "infografia") {

    imagen.src = r.archivo;
    imagen.alt = r.alt;
    imagen.classList.remove("oculto");
    video.classList.add("oculto");
    aviso.textContent = "Material educativo. No reemplaza el diseño estructural de un ingeniero.";
  } else {

    document.querySelector("#visor-video-fuente").src = r.archivo;
    document.querySelector("#visor-subtitulos").src = r.subtitulos;
    video.poster = r.miniatura;
    video.load();
    video.classList.remove("oculto");
    imagen.classList.add("oculto");
    aviso.textContent = "Video orientativo. Active los subtítulos con el botón CC del reproductor.";
  }

  document.querySelector("#visor").classList.remove("oculto");
  document.querySelector("#btn-cerrar-visor").focus();
}

function cerrarVisor() {
  document.querySelector("#visor-video").pause();
  document.querySelector("#visor").classList.add("oculto");
}

document.querySelector("#btn-cerrar-visor").addEventListener("click", cerrarVisor);

document.querySelector("#visor").addEventListener("click", function (event) {
  if (event.target.id === "visor") {
    cerrarVisor();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    cerrarVisor();
    cerrarFicha();
  }
});

function mostrarGlosario(lista) {
  var contenedor = document.querySelector("#lista-glosario");
  var mensajeVacio = document.querySelector("#glosario-vacio");
  var html = "";

  resultadosGlosario = lista;

  for (var i = 0; i < lista.length; i++) {
    var termino = lista[i].termino;

    if (fichas[termino]) {
      html += '<dt><button type="button" class="termino-btn" onclick="abrirFicha(\'' + termino + '\', this)">' +
                termino + '<span class="termino-ver">Ver ficha visual →</span>' +
              '</button></dt>';
    } else {
      html += '<dt>' + termino + '</dt>';
    }

    html += '<dd>' + lista[i].definicion + '</dd>';
  }

  contenedor.innerHTML = html;

  if (lista.length === 0) {
    mensajeVacio.classList.remove("oculto");
  } else {
    mensajeVacio.classList.add("oculto");
  }
}

document.querySelector("#buscador-glosario").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    return;
  }

  var texto = this.value.toLowerCase();
  var terminosEncontrados = [];
  var recursosEncontrados = [];

  for (var i = 0; i < glosario.length; i++) {
    if (glosario[i].termino.toLowerCase().includes(texto)) {
      terminosEncontrados.push(glosario[i]);
    }
  }

  for (var j = 0; j < recursos.length; j++) {
    if (recursos[j].titulo.toLowerCase().includes(texto)) {
      recursosEncontrados.push(recursos[j]);
    }
  }

  mostrarGlosario(terminosEncontrados);
  mostrarRecursos(recursosEncontrados);
});

document.querySelector("#buscador-glosario").addEventListener("keydown", function (event) {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();

  for (var i = 0; i < resultadosGlosario.length; i++) {
    if (fichas[resultadosGlosario[i].termino]) {
      abrirFicha(resultadosGlosario[i].termino, this);
      return;
    }
  }
});

function buscarDefinicion(termino) {
  for (var i = 0; i < glosario.length; i++) {
    if (glosario[i].termino === termino) {
      return glosario[i].definicion;
    }
  }
  return "";
}

function buscarCaso(id) {
  for (var i = 0; i < casos.length; i++) {
    if (casos[i].id === id) {
      return casos[i];
    }
  }
  return null;
}

function abrirFicha(termino, origen) {
  var ficha = fichas[termino];
  var caso = buscarCaso(ficha.caso);

  fichaActual = ficha;
  ultimoFocoFicha = origen;

  document.querySelector("#ficha-titulo").textContent = termino;
  document.querySelector("#ficha-sencillo").textContent = ficha.sencillo;
  document.querySelector("#ficha-definicion").textContent = buscarDefinicion(termino);
  document.querySelector("#ficha-opcion-a").textContent = ficha.opcionA;
  document.querySelector("#ficha-opcion-b").textContent = ficha.opcionB;

  cambiarDiagrama("a");

  if (!caso) {
    document.querySelector("#ficha-caso-bloque").classList.add("oculto");
    document.querySelector("#ficha-caso").innerHTML = "";
  } else {
    document.querySelector("#ficha-caso-bloque").classList.remove("oculto");
    document.querySelector("#ficha-caso").innerHTML =
    '<div class="ficha-caso-tarjeta">' +
      '<img src="' + caso.antes + '" alt="Vivienda en ' + caso.lugar + ' antes de la intervención">' +
      '<div>' +
        '<p class="ficha-caso-titulo">' + caso.titulo + '</p>' +
        '<p class="ficha-caso-lugar">' + caso.lugar + ' · ' + caso.tipoObra + '</p>' +
        '<button type="button" class="boton-enlace" onclick="irACaso(' + caso.id + ')">Ver caso en la galería →</button>' +
      '</div>' +
    '</div>';
  }

  document.querySelector("#ficha").classList.remove("oculto");
  document.querySelector("#btn-cerrar-ficha").focus();
}

function cambiarDiagrama(opcion) {
  var botonA = document.querySelector("#ficha-opcion-a");
  var botonB = document.querySelector("#ficha-opcion-b");
  var dibujo = document.querySelector("#ficha-svg");
  var explica = document.querySelector("#ficha-explica");

  if (opcion === "a") {
    dibujo.innerHTML = fichaActual.svgA;
    explica.textContent = fichaActual.explicaA;
    botonA.classList.add("activo");
    botonB.classList.remove("activo");
    botonA.setAttribute("aria-pressed", "true");
    botonB.setAttribute("aria-pressed", "false");
  } else {
    dibujo.innerHTML = fichaActual.svgB;
    explica.textContent = fichaActual.explicaB;
    botonB.classList.add("activo");
    botonA.classList.remove("activo");
    botonB.setAttribute("aria-pressed", "true");
    botonA.setAttribute("aria-pressed", "false");
  }

  dibujo.setAttribute("aria-label", explica.textContent);
}

function cerrarFicha() {
  var ficha = document.querySelector("#ficha");

  if (ficha.classList.contains("oculto")) {
    return;
  }

  ficha.classList.add("oculto");

  if (ultimoFocoFicha) {
    ultimoFocoFicha.focus();
  }
}

function irACaso(id) {
  document.querySelector("#ficha").classList.add("oculto");

  for (var m = 0; m < botonesTag.length; m++) {
    botonesTag[m].classList.remove("activo");
    if (botonesTag[m].getAttribute("data-tag") === "Todos") {
      botonesTag[m].classList.add("activo");
    }
  }

  mostrarCasos(casos);

  var tarjeta = document.querySelector("#caso-" + id);
  tarjeta.scrollIntoView({ block: "center" });
  tarjeta.classList.add("caso-resaltado");
  tarjeta.setAttribute("tabindex", "-1");
  tarjeta.focus({ preventScroll: true });

  setTimeout(function () {
    tarjeta.classList.remove("caso-resaltado");
  }, 2500);
}

document.querySelector("#ficha-opcion-a").addEventListener("click", function () {
  cambiarDiagrama("a");
});

document.querySelector("#ficha-opcion-b").addEventListener("click", function () {
  cambiarDiagrama("b");
});

document.querySelector("#btn-cerrar-ficha").addEventListener("click", cerrarFicha);

document.querySelector("#ficha").addEventListener("click", function (event) {
  if (event.target.id === "ficha") {
    cerrarFicha();
  }
});

document.querySelector("#btn-nuevo-tema").addEventListener("click", function () {
  document.querySelector("#foro-mensaje").textContent = "El foro comunitario estará disponible pronto.";
});

function mostrarCasos(lista) {
  var grilla = document.querySelector("#grilla-casos");
  var mensajeVacio = document.querySelector("#casos-vacio");
  var html = "";

  for (var i = 0; i < lista.length; i++) {
    var caso = lista[i];
    var textoCompartir = encodeURIComponent("Mira este caso en MuroSeguro: " + caso.titulo);

    html += '<div class="card caso" id="caso-' + caso.id + '">' +
              '<h3 class="h3">' + caso.titulo + '</h3>' +
              '<div class="caso-fotos">' +
                '<figure class="caso-foto">' +
                  '<img src="' + caso.antes + '" alt="Vivienda en ' + caso.lugar + ' antes de la intervención">' +
                  '<figcaption>ANTES</figcaption>' +
                '</figure>' +
                '<figure class="caso-foto">' +
                  '<img src="' + caso.despues + '" alt="Vivienda en ' + caso.lugar + ' después de la intervención">' +
                  '<figcaption>DESPUÉS</figcaption>' +
                '</figure>' +
              '</div>' +
              '<p class="caso-lugar">' + caso.lugar + '</p>' +
              '<p class="caso-tipo">' + caso.tipoObra + '</p>' +
              '<p class="body-text">' + caso.descripcion + '</p>' +
              '<p class="caso-detalle oculto" id="detalle-' + caso.id + '">' + caso.detalle + '</p>' +
              '<button type="button" class="btn-secondary" onclick="verDetalles(' + caso.id + ', this)">Ver detalles</button>' +
              '<a class="caso-compartir" href="https://wa.me/?text=' + textoCompartir + '" target="_blank">Compartir</a>' +
              '<p class="aviso">Esta experiencia no lo exime de contratar a su propio ingeniero.</p>' +
            '</div>';
  }

  grilla.innerHTML = html;

  if (lista.length === 0) {
    mensajeVacio.classList.remove("oculto");
  } else {
    mensajeVacio.classList.add("oculto");
  }
}

function verDetalles(id, boton) {
  var detalle = document.querySelector("#detalle-" + id);
  detalle.classList.toggle("oculto");

  if (detalle.classList.contains("oculto")) {
    boton.textContent = "Ver detalles";
  } else {
    boton.textContent = "Ocultar detalles";
  }
}

var botonesTag = document.querySelectorAll(".tag");

for (var k = 0; k < botonesTag.length; k++) {
  botonesTag[k].addEventListener("click", function () {
    var tagElegido = this.getAttribute("data-tag");

    for (var m = 0; m < botonesTag.length; m++) {
      botonesTag[m].classList.remove("activo");
    }
    this.classList.add("activo");

    if (tagElegido === "Todos") {
      mostrarCasos(casos);
    } else {
      var filtrados = casos.filter(function (caso) {
        return caso.tags.includes(tagElegido);
      });
      mostrarCasos(filtrados);
    }
  });
}

mostrarRecursos(recursos);
mostrarGlosario(glosario);
mostrarCasos(casos);
