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
  }
});

function mostrarGlosario(lista) {
  var contenedor = document.querySelector("#lista-glosario");
  var mensajeVacio = document.querySelector("#glosario-vacio");
  var html = "";

  for (var i = 0; i < lista.length; i++) {
    html += '<dt>' + lista[i].termino + '</dt>' +
            '<dd>' + lista[i].definicion + '</dd>';
  }

  contenedor.innerHTML = html;

  if (lista.length === 0) {
    mensajeVacio.classList.remove("oculto");
  } else {
    mensajeVacio.classList.add("oculto");
  }
}

document.querySelector("#buscador-glosario").addEventListener("keyup", function () {
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

function mostrarUsuario() {
  var nombre = "Invitado";
  var iniciales = "?";
  var correo = null;
  var perfil = null;

  try {
    correo = localStorage.getItem("ms_usuario_activo");
    if (correo) {
      perfil = JSON.parse(localStorage.getItem("ms_perfil_" + correo));
    }
  } catch (e) {
    perfil = null;
  }

  if (perfil && perfil.nombres) {
    var primerNombre = perfil.nombres.trim().split(" ")[0];
    var primerApellido = perfil.apellidos ? perfil.apellidos.trim().split(" ")[0] : "";
    nombre = (primerNombre + " " + primerApellido).trim();
    iniciales = primerNombre.charAt(0) + primerApellido.charAt(0);
  } else if (correo) {
    nombre = correo.split("@")[0];
    iniciales = nombre.substring(0, 2);
  }

  document.querySelector("#nombre-usuario").textContent = nombre;
  document.querySelector("#avatar-usuario").textContent = iniciales.toUpperCase();
}

document.querySelector("#btn-salir").addEventListener("click", function () {
  try {
    localStorage.removeItem("ms_usuario_activo");
    sessionStorage.removeItem("ms_sesion");
  } catch (e) {
  }
});

mostrarUsuario();
mostrarRecursos(recursos);
mostrarGlosario(glosario);
mostrarCasos(casos);
