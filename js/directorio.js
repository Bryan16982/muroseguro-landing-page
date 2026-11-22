// Catálogo de ingenieros colegiados de prueba
const ingenieros = [
  {
    nombre: "Ing. Carlos Paredes Quispe",
    cip: "148920",
    especialidad: "Estructuras y sismorresistencia",
    departamento: "La Libertad",
    distrito: "Alto Trujillo",
    telefono: "51987111222",
    foto: "CarlosParedes.jpg"
  },
  {
    nombre: "Ing. Elena Mendoza Vargas",
    cip: "162345",
    especialidad: "Patología y refuerzo estructural",
    departamento: "La Libertad",
    distrito: "Alto Trujillo",
    telefono: "51987111223",
    foto: "ElenaMendoza.jpg"
  },
  {
    nombre: "Ing. Roberto Salazar Huamán",
    cip: "175410",
    especialidad: "Albañilería confinada",
    departamento: "La Libertad",
    distrito: "Trujillo",
    telefono: "51987111224",
    foto: "RobertoSalazar.jpg"
  },
  {
    nombre: "Ing. Patricia Chávez León",
    cip: "183902",
    especialidad: "Viviendas autoconstruidas",
    departamento: "La Libertad",
    distrito: "El Porvenir",
    telefono: "51987111225",
    foto: "PatriciaChávez.jpg"
  },
  {
    nombre: "Ing. Miguel Torres Ríos",
    cip: "190441",
    especialidad: "Concreto armado",
    departamento: "Lima",
    distrito: "San Juan de Lurigancho",
    telefono: "51987111226",
    foto: "MiguelTorres.jpg"
  },
  {
    nombre: "Ing. Lucía Castro Díaz",
    cip: "194882",
    especialidad: "Vulnerabilidad sísmica",
    departamento: "Lima",
    distrito: "Villa El Salvador",
    telefono: "51987111227",
    foto: "LucíaCastro.jpg"
  },
  {
    nombre: "Ing. Jorge Navarro Rojas",
    cip: "201155",
    especialidad: "Muros y losas",
    departamento: "Lima",
    distrito: "Comas",
    telefono: "51987111228",
    foto: ""
  },
  {
    nombre: "Ing. Valeria Montes Cruz",
    cip: "208774",
    especialidad: "Geotecnia y cimentaciones",
    departamento: "Lima",
    distrito: "San Martín de Porres",
    telefono: "51987111229",
    foto: ""
  }
];

const distritosPorDepartamento = {
  "La Libertad": ["Alto Trujillo", "Trujillo", "El Porvenir", "Huanchaco"],
  "Lima": ["San Juan de Lurigancho", "Villa El Salvador", "Comas", "San Martín de Porres", "Puente Piedra"]
};

const preguntasFaq = [
  {
    pregunta: "¿Qué es MuroSeguro?",
    respuesta: "Es una herramienta web de orientación visual preliminar para ayudar a propietarios a identificar señales en su vivienda. No reemplaza el cálculo ni la evaluación de un ingeniero civil colegiado."
  },
  {
    pregunta: "¿MuroSeguro reemplaza el cálculo o evaluación de un ingeniero?",
    respuesta: "No. Una revisión visual orienta de manera inicial, pero el diagnóstico estructural y el cálculo de cargas requieren la inspección presencial de un ingeniero civil colegiado."
  },
  {
    pregunta: "¿Qué pasa si contacto a un ingeniero del directorio?",
    respuesta: "MuroSeguro solo conecta a las partes mediante contacto directo y no se responsabiliza por acuerdos económicos externos realizados fuera de la plataforma."
  },
  {
    pregunta: "¿Cómo verifico que un profesional esté colegiado?",
    respuesta: "Cada tarjeta muestra el número CIP del ingeniero para que puedas revisar su colegiatura y habilitación antes de coordinar una visita."
  }
];

const limitePorPagina = 6;
let paginaActual = 1;
let ampliarCercanos = false;

const selectDepartamento = document.getElementById("filtro-departamento");
const selectDistrito = document.getElementById("filtro-distrito");
const btnLimpiar = document.getElementById("btn-limpiar");
const contadorResultados = document.getElementById("contador-resultados");
const panelCercanos = document.getElementById("panel-cercanos");
const textoCercanos = document.getElementById("texto-cercanos");
const btnCercanos = document.getElementById("btn-cercanos");
const gridIngenieros = document.getElementById("grid-ingenieros");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const infoPagina = document.getElementById("info-pagina");
const contenedorFaq = document.getElementById("contenedor-faq");

const avatarSvg =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" rx="30" fill="#E3E6E8"/><circle cx="30" cy="23" r="10" fill="#1E1B4B"/><path d="M13 52c2-9 9-14 17-14s15 5 17 14" fill="#1E1B4B"/></svg>'
  );

// Selectores encadenados de departamento y distrito (HU-019)
selectDepartamento.addEventListener("change", function () {
  const depto = selectDepartamento.value;
  selectDistrito.innerHTML = '<option value="">Todos los distritos</option>';
  ampliarCercanos = false;
  paginaActual = 1;

  if (depto === "") {
    selectDistrito.disabled = true;
  } else {
    selectDistrito.disabled = false;
    const listaDistritos = distritosPorDepartamento[depto] || [];
    for (let i = 0; i < listaDistritos.length; i++) {
      const opcion = document.createElement("option");
      opcion.value = listaDistritos[i];
      opcion.textContent = listaDistritos[i];
      selectDistrito.appendChild(opcion);
    }
  }

  renderizarTodo();
});

selectDistrito.addEventListener("change", function () {
  ampliarCercanos = false;
  paginaActual = 1;
  renderizarTodo();
});

btnCercanos.addEventListener("click", function () {
  ampliarCercanos = true;
  paginaActual = 1;
  renderizarTodo();
});

btnLimpiar.addEventListener("click", function () {
  selectDepartamento.value = "";
  selectDistrito.innerHTML = '<option value="">Todos los distritos</option>';
  selectDistrito.disabled = true;
  ampliarCercanos = false;
  paginaActual = 1;
  renderizarTodo();
});

function obtenerFiltrados() {
  const depto = selectDepartamento.value;
  const dist = selectDistrito.value;
  const filtrados = [];

  for (let i = 0; i < ingenieros.length; i++) {
    const ing = ingenieros[i];
    let ok = true;

    if (depto !== "" && ing.departamento !== depto) {
      ok = false;
    }
    if (!ampliarCercanos && dist !== "" && ing.distrito !== dist) {
      ok = false;
    }
    if (ok) {
      filtrados.push(ing);
    }
  }

  return filtrados;
}

function renderizarTodo() {
  const lista = obtenerFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(lista.length / limitePorPagina));

  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }

  const inicio = (paginaActual - 1) * limitePorPagina;
  const visibles = lista.slice(inicio, inicio + limitePorPagina);

  contadorResultados.textContent = lista.length + " profesional(es)";

  if (lista.length === 0 && selectDistrito.value !== "" && !ampliarCercanos) {
    textoCercanos.textContent =
      "No hay ingenieros registrados en " + selectDistrito.value + ", " + selectDepartamento.value + ".";
    panelCercanos.style.display = "flex";
  } else {
    panelCercanos.style.display = "none";
  }

  gridIngenieros.innerHTML = "";
  const mensajeBase = "Hola, encontré su perfil en MuroSeguro y deseo una evaluación estructural";

  for (let i = 0; i < visibles.length; i++) {
    const ing = visibles[i];
    const rutaFoto = ing.foto
      ? "../assets/images/ingenieros/" + encodeURI(ing.foto)
      : avatarSvg;
    const urlWhatsapp =
      "https://wa.me/" + ing.telefono + "?text=" + encodeURIComponent(mensajeBase);

    const card = document.createElement("article");
    card.className = "ing-card";
    card.innerHTML =
      "<div>" +
        '<div class="ing-top">' +
          '<img src="' + rutaFoto + '" alt="Foto de ' + ing.nombre + '" class="ing-foto">' +
          "<div>" +
            '<h3 class="ing-nombre">' + ing.nombre + "</h3>" +
            '<span class="ing-cip">CIP ' + ing.cip + "</span>" +
          "</div>" +
        "</div>" +
        '<p class="ing-meta"><strong>Especialidad:</strong> ' + ing.especialidad + "</p>" +
        '<p class="ing-meta"><strong>Ubicación:</strong> ' + ing.distrito + ", " + ing.departamento + "</p>" +
      "</div>" +
      '<a href="' + urlWhatsapp + '" target="_blank" rel="noopener noreferrer" class="btn-primary">Contactar por WhatsApp</a>';

    const imgElemento = card.querySelector(".ing-foto");
    if (imgElemento) {
      imgElemento.addEventListener("error", function () {
        imgElemento.src = avatarSvg;
      });
    }

    gridIngenieros.appendChild(card);
  }

  infoPagina.textContent = "Página " + paginaActual + " de " + totalPaginas;
  btnAnterior.disabled = paginaActual <= 1;
  btnSiguiente.disabled = paginaActual >= totalPaginas;
}

btnAnterior.addEventListener("click", function () {
  if (paginaActual > 1) {
    paginaActual--;
    renderizarTodo();
  }
});

btnSiguiente.addEventListener("click", function () {
  const totalPaginas = Math.max(1, Math.ceil(obtenerFiltrados().length / limitePorPagina));
  if (paginaActual < totalPaginas) {
    paginaActual++;
    renderizarTodo();
  }
});

// Acordeón FAQ con cierre automático de otras preguntas (HU-023)
function renderizarFaq() {
  contenedorFaq.innerHTML = "";

  for (let i = 0; i < preguntasFaq.length; i++) {
    const item = document.createElement("div");
    item.className = "faq-card-item";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "faq-trigger";
    boton.innerHTML =
      "<span>" + preguntasFaq[i].pregunta + '</span><span class="faq-sign">+</span>';

    const panel = document.createElement("div");
    panel.className = "faq-panel";
    panel.textContent = preguntasFaq[i].respuesta;

    boton.addEventListener("click", function () {
      const yaAbierto = item.classList.contains("open");
      const items = document.querySelectorAll(".faq-card-item");

      for (let j = 0; j < items.length; j++) {
        items[j].classList.remove("open");
        const signo = items[j].querySelector(".faq-sign");
        if (signo) {
          signo.textContent = "+";
        }
      }

      if (!yaAbierto) {
        item.classList.add("open");
        boton.querySelector(".faq-sign").textContent = "−";
      }
    });

    item.appendChild(boton);
    item.appendChild(panel);
    contenedorFaq.appendChild(item);
  }
}

renderizarTodo();
renderizarFaq();
