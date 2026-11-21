/* =========================================================
   recursos.js - Integrante 6
   HU-015 Infografías con Lightbox
   HU-016 Video nativo con subtítulos
   HU-017 Glosario con búsqueda en tiempo real (keyup)
   HU-025 Casos de estudio desde un array
   HU-026 Filtro por tags con .filter()
   ========================================================= */


/* ---------------------------------------------------------
   DATOS DE PRUEBA (arrays de objetos)
   --------------------------------------------------------- */

// Infografías y videos (frame: Recursos · Centro de recursos)
var recursos = [
  {
    tipo: "infografia",
    titulo: "Infografía: Tipos de Fisuras",
    descripcion: "Guía visual para identificar daños estructurales.",
    archivo: "../assets/images/infografias/tipos-fisuras.jpg",
    alt: "Infografía que compara fisuras leves del acabado con grietas estructurales"
  },
  {
    tipo: "video",
    titulo: "Guía de Video: Refuerzo de Muros",
    descripcion: "Técnicas básicas para mejorar la resistencia sísmica.",
    archivo: "../assets/videos/refuerzo-muros.mp4",
    subtitulos: "../assets/videos/refuerzo-muros.vtt"
  },
  {
    tipo: "infografia",
    titulo: "Infografía: Equipos de Emergencia",
    descripcion: "Elementos esenciales para preparar su kit de emergencia.",
    archivo: "../assets/images/infografias/equipos-emergencia.jpg",
    alt: "Infografía con los elementos de una mochila de emergencia: agua, linterna, botiquín y radio"
  },
  {
    tipo: "video",
    titulo: "Guía de Video: Plan de Evacuación",
    descripcion: "Pasos para definir rutas y puntos de encuentro seguros.",
    archivo: "../assets/videos/plan-evacuacion.mp4",
    subtitulos: "../assets/videos/plan-evacuacion.vtt"
  }
];

// Glosario (ordenado alfabéticamente)
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

// Casos de estudio (frame: Prevención · Casos de estudio)
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


/* ---------------------------------------------------------
   HU-015 y HU-016: Lista de recursos + visor (Lightbox)
   --------------------------------------------------------- */

function mostrarRecursos() {
  var contenedor = document.querySelector("#lista-recursos");
  var html = "";

  for (var i = 0; i < recursos.length; i++) {
    var r = recursos[i];
    var miniatura = "";
    var textoBoton = "";

    if (r.tipo === "infografia") {
      miniatura = '<img src="' + r.archivo + '" alt="">';   // miniatura decorativa: el título ya la describe
      textoBoton = "Ver recurso →";
    } else {
      miniatura = '<span aria-hidden="true">▶</span>';
      textoBoton = "Ver video →";
    }

    html += '<div class="card recurso">' +
              '<div class="recurso-miniatura">' + miniatura + '</div>' +
              '<div>' +
                '<h3>' + r.titulo + '</h3>' +
                '<p>' + r.descripcion + '</p>' +
                '<button type="button" class="boton-enlace" onclick="abrirVisor(' + i + ')">' + textoBoton + '</button>' +
              '</div>' +
            '</div>';
  }

  contenedor.innerHTML = html;
}

function abrirVisor(posicion) {
  var r = recursos[posicion];
  var imagen = document.querySelector("#visor-imagen");
  var video = document.querySelector("#visor-video");
  var aviso = document.querySelector("#visor-aviso");

  document.querySelector("#visor-titulo").textContent = r.titulo;

  if (r.tipo === "infografia") {
    // HU-015: se muestra la imagen grande
    imagen.src = r.archivo;
    imagen.alt = r.alt;
    imagen.classList.remove("oculto");
    video.classList.add("oculto");
    aviso.textContent = "Material educativo. No reemplaza el diseño estructural de un ingeniero.";
  } else {
    // HU-016: se carga el video con sus subtítulos
    document.querySelector("#visor-video-fuente").src = r.archivo;
    document.querySelector("#visor-subtitulos").src = r.subtitulos;
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

// Cerrar con la X
document.querySelector("#btn-cerrar-visor").addEventListener("click", cerrarVisor);

// Cerrar al hacer clic fuera de la caja (en el fondo oscuro)
document.querySelector("#visor").addEventListener("click", function (event) {
  if (event.target.id === "visor") {
    cerrarVisor();
  }
});

// Cerrar con la tecla Escape (navegación por teclado)
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    cerrarVisor();
  }
});


/* ---------------------------------------------------------
   HU-017: Glosario con búsqueda en tiempo real (keyup)
   --------------------------------------------------------- */

function mostrarGlosario(lista) {
  var contenedor = document.querySelector("#lista-glosario");
  var mensajeVacio = document.querySelector("#glosario-vacio");
  var html = "";

  for (var i = 0; i < lista.length; i++) {
    html += '<dt>' + lista[i].termino + '</dt>' +
            '<dd>' + lista[i].definicion + '</dd>';
  }

  contenedor.innerHTML = html;

  // Si no hay resultados, se muestra el mensaje
  if (lista.length === 0) {
    mensajeVacio.classList.remove("oculto");
  } else {
    mensajeVacio.classList.add("oculto");
  }
}

document.querySelector("#buscador-glosario").addEventListener("keyup", function () {
  var texto = this.value.toLowerCase();
  var resultado = [];

  for (var i = 0; i < glosario.length; i++) {
    var palabra = glosario[i].termino.toLowerCase();
    if (palabra.includes(texto)) {
      resultado.push(glosario[i]);
    }
  }

  mostrarGlosario(resultado);
});


/* ---------------------------------------------------------
   HU-025: Muro de casos de estudio (desde el array)
   HU-026: Filtro por tags con .filter()
   --------------------------------------------------------- */

function mostrarCasos(lista) {
  var grilla = document.querySelector("#grilla-casos");
  var mensajeVacio = document.querySelector("#casos-vacio");
  var html = "";

  for (var i = 0; i < lista.length; i++) {
    var caso = lista[i];
    var textoCompartir = encodeURIComponent("Mira este caso en MuroSeguro: " + caso.titulo);

    html += '<div class="card caso">' +
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

// "Ver detalles" muestra u oculta el texto extra del caso
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

    // Marcar visualmente el tag seleccionado
    for (var m = 0; m < botonesTag.length; m++) {
      botonesTag[m].classList.remove("activo");
    }
    this.classList.add("activo");

    // "Todos" limpia el filtro
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


/* ---------------------------------------------------------
   Al cargar la página se pintan las secciones
   --------------------------------------------------------- */
mostrarRecursos();
mostrarGlosario(glosario);
mostrarCasos(casos);
