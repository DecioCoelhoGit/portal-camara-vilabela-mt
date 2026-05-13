/* =========================================================
   SCRIPT.JS V2 — FILTROS + RESET + EXPORTAR JSON
========================================================= */

const STORAGE_KEYS = {
  vereadores: "camara_vereadores",
  projetos: "camara_projetos",
  sessoes: "camara_sessoes",
  documentos: "camara_documentos"
};

const vereadoresSeed = [
  { id: 1, nome: "Nome do Vereador", cargo: "Presidente", partido: "Partido", foto: "imagens/vereador-placeholder.png", descricao: "Atuação parlamentar voltada à representação popular e transparência." },
  { id: 2, nome: "Nome da Vereadora", cargo: "Vice-Presidente", partido: "Partido", foto: "imagens/vereador-placeholder.png", descricao: "Participação em pautas legislativas e ações institucionais." }
];

const projetosSeed = [
  { id: 1, numero: "PL 001/2026", tipo: "Projeto de Lei", autor: "Poder Legislativo", data: "2026-02-10", status: "Em tramitação", descricao: "Dispõe sobre modernização digital e transparência legislativa." },
  { id: 2, numero: "IND 004/2026", tipo: "Indicação", autor: "Vereador(a)", data: "2026-02-14", status: "Encaminhada", descricao: "Sugere melhorias na infraestrutura urbana municipal." }
];

const sessoesSeed = [
  { id: 1, titulo: "1ª Sessão Ordinária de 2026", tipo: "Ordinária", data: "2026-02-05", status: "Ata publicada", descricao: "Abertura dos trabalhos legislativos e leitura do expediente." },
  { id: 2, titulo: "1ª Sessão Extraordinária de 2026", tipo: "Extraordinária", data: "2026-02-18", status: "Documentos em organização", descricao: "Sessão convocada para apreciação de pauta específica." }
];

const documentosSeed = [
  { id: 1, data: "2026-02-05", categoria: "Relatório", titulo: "Relatório Mensal de Gestão Legislativa", status: "Publicado", acesso: "PDF" },
  { id: 2, data: "2026-02-10", categoria: "Contrato", titulo: "Contrato Administrativo nº 001/2026", status: "Publicado", acesso: "PDF" }
];

/* =========================================================
   LOCAL STORAGE
========================================================= */

function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function carregarDados(chave, seed) {
  const dados = localStorage.getItem(chave);

  if (!dados) {
    salvarDados(chave, seed);
    return seed;
  }

  return JSON.parse(dados);
}

/* =========================================================
   FORMATADORES
========================================================= */

function formatarData(dataISO) {
  if (!dataISO) return "-";
  const partes = dataISO.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function classeStatus(status) {
  const texto = String(status).toLowerCase();

  if (texto.includes("aprov") || texto.includes("public") || texto.includes("encaminh")) {
    return "aprovado";
  }

  if (texto.includes("rejeit") || texto.includes("cancel")) {
    return "rejeitado";
  }

  return "andamento";
}

function normalizar(texto) {
  return String(texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* =========================================================
   FILTRO GENÉRICO
========================================================= */

function filtrarLista(lista, termo, campos) {
  const busca = normalizar(termo);

  if (!busca) return lista;

  return lista.filter(item =>
    campos.some(campo => normalizar(item[campo]).includes(busca))
  );
}

/* =========================================================
   RENDER VEREADORES
========================================================= */

function renderVereadores(containerId = "lista-vereadores") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const termo = document.getElementById("filtro-vereadores")?.value || "";
  let vereadores = carregarDados(STORAGE_KEYS.vereadores, vereadoresSeed);

  vereadores = filtrarLista(vereadores, termo, ["nome", "cargo", "partido", "descricao"]);

  container.innerHTML = vereadores.map(v => `
    <div class="card vereador-card">
      <img src="${v.foto}" alt="Foto de ${v.nome}">
      <h3>${v.nome}</h3>
      <p class="cargo">${v.cargo}</p>
      <p class="partido">${v.partido}</p>
      <p class="mt-20">${v.descricao}</p>
    </div>
  `).join("") || `<div class="card"><p>Nenhum vereador encontrado.</p></div>`;
}

/* =========================================================
   RENDER PROJETOS
========================================================= */

function renderProjetos(containerId = "lista-projetos") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const termo = document.getElementById("filtro-projetos")?.value || "";
  let projetos = carregarDados(STORAGE_KEYS.projetos, projetosSeed);

  projetos = filtrarLista(projetos, termo, ["numero", "tipo", "autor", "status", "descricao"]);

  container.innerHTML = projetos.map(p => `
    <div class="item-legislativo">
      <h3>${p.numero}</h3>
      <div class="meta">
        Autor: ${p.autor} • Data: ${formatarData(p.data)} • Tipo: ${p.tipo}
      </div>
      <p>${p.descricao}</p>
      <div class="mt-20">
        <span class="status ${classeStatus(p.status)}">${p.status}</span>
      </div>
    </div>
  `).join("") || `<div class="card"><p>Nenhum projeto encontrado.</p></div>`;
}

/* =========================================================
   RENDER SESSÕES
========================================================= */

function renderSessoes(containerId = "lista-sessoes") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const termo = document.getElementById("filtro-sessoes")?.value || "";
  let sessoes = carregarDados(STORAGE_KEYS.sessoes, sessoesSeed);

  sessoes = filtrarLista(sessoes, termo, ["titulo", "tipo", "status", "descricao"]);

  container.innerHTML = sessoes.map(s => `
    <div class="item-legislativo">
      <h3>${s.titulo}</h3>
      <div class="meta">
        Data: ${formatarData(s.data)} • Tipo: ${s.tipo}
      </div>
      <p>${s.descricao}</p>
      <div class="mt-20">
        <span class="status ${classeStatus(s.status)}">${s.status}</span>
      </div>
    </div>
  `).join("") || `<div class="card"><p>Nenhuma sessão encontrada.</p></div>`;
}

/* =========================================================
   RENDER DOCUMENTOS
========================================================= */

function renderDocumentosTabela(containerId = "tabela-documentos") {
  const tbody = document.getElementById(containerId);
  if (!tbody) return;

  const termo = document.getElementById("filtro-documentos")?.value || "";
  let documentos = carregarDados(STORAGE_KEYS.documentos, documentosSeed);

  documentos = filtrarLista(documentos, termo, ["categoria", "titulo", "status", "acesso"]);

  tbody.innerHTML = documentos.map(d => `
    <tr>
      <td>${formatarData(d.data)}</td>
      <td>${d.categoria}</td>
      <td>${d.titulo}</td>
      <td>${d.status}</td>
      <td>${d.acesso}</td>
    </tr>
  `).join("") || `
    <tr>
      <td colspan="5">Nenhum documento encontrado.</td>
    </tr>
  `;
}

/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {
  const vereadores = carregarDados(STORAGE_KEYS.vereadores, vereadoresSeed);
  const projetos = carregarDados(STORAGE_KEYS.projetos, projetosSeed);
  const sessoes = carregarDados(STORAGE_KEYS.sessoes, sessoesSeed);
  const documentos = carregarDados(STORAGE_KEYS.documentos, documentosSeed);

  atualizarTexto("kpi-vereadores", vereadores.length);
  atualizarTexto("kpi-projetos", projetos.length);
  atualizarTexto("kpi-sessoes", sessoes.length);
  atualizarTexto("kpi-documentos", documentos.length);
}

function atualizarTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

/* =========================================================
   FORMULÁRIO ADMIN
========================================================= */

function iniciarFormularioAdmin() {
  const form = document.getElementById("form-admin");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const data = document.getElementById("data").value;
    const status = document.getElementById("status").value;
    const descricao = document.getElementById("descricao").value;

    if (!titulo || !data || !descricao) {
      alert("Preencha título, data e descrição.");
      return;
    }

    if (tipo === "Projeto Legislativo") {
      const projetos = carregarDados(STORAGE_KEYS.projetos, projetosSeed);

      projetos.push({
        id: Date.now(),
        numero: titulo,
        tipo: categoria || "Projeto Legislativo",
        autor: "Admin",
        data,
        status,
        descricao
      });

      salvarDados(STORAGE_KEYS.projetos, projetos);
    }

    if (tipo === "Sessão") {
      const sessoes = carregarDados(STORAGE_KEYS.sessoes, sessoesSeed);

      sessoes.push({
        id: Date.now(),
        titulo,
        tipo: categoria || "Sessão",
        data,
        status,
        descricao
      });

      salvarDados(STORAGE_KEYS.sessoes, sessoes);
    }

    if (tipo === "Documento de Transparência" || tipo === "Ato Oficial") {
      const documentos = carregarDados(STORAGE_KEYS.documentos, documentosSeed);

      documentos.push({
        id: Date.now(),
        data,
        categoria: categoria || tipo,
        titulo,
        status,
        acesso: "PDF"
      });

      salvarDados(STORAGE_KEYS.documentos, documentos);
    }

    alert("Registro salvo com sucesso no LocalStorage.");
    form.reset();
    renderTudo();
  });
}

/* =========================================================
   RESET DA BASE
========================================================= */

function resetarBase() {
  const confirmar = confirm("Deseja restaurar a base demonstrativa inicial? Os dados salvos no navegador serão substituídos.");

  if (!confirmar) return;

  salvarDados(STORAGE_KEYS.vereadores, vereadoresSeed);
  salvarDados(STORAGE_KEYS.projetos, projetosSeed);
  salvarDados(STORAGE_KEYS.sessoes, sessoesSeed);
  salvarDados(STORAGE_KEYS.documentos, documentosSeed);

  alert("Base restaurada com sucesso.");
  location.reload();
}

/* =========================================================
   EXPORTAR JSON
========================================================= */

function exportarJSON() {
  const pacote = {
    vereadores: carregarDados(STORAGE_KEYS.vereadores, vereadoresSeed),
    projetos: carregarDados(STORAGE_KEYS.projetos, projetosSeed),
    sessoes: carregarDados(STORAGE_KEYS.sessoes, sessoesSeed),
    documentos: carregarDados(STORAGE_KEYS.documentos, documentosSeed),
    exportado_em: new Date().toISOString(),
    projeto: "portal-camara-vilabela-mt"
  };

  const blob = new Blob([JSON.stringify(pacote, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "backup-portal-camara-vilabela-mt.json";
  link.click();

  URL.revokeObjectURL(url);
}

/* =========================================================
   FILTROS — EVENTOS
========================================================= */

function iniciarFiltros() {
  const filtros = [
    { id: "filtro-vereadores", render: renderVereadores },
    { id: "filtro-projetos", render: renderProjetos },
    { id: "filtro-sessoes", render: renderSessoes },
    { id: "filtro-documentos", render: renderDocumentosTabela }
  ];

  filtros.forEach(item => {
    const campo = document.getElementById(item.id);
    if (campo) campo.addEventListener("input", item.render);
  });
}

/* =========================================================
   RENDER GERAL
========================================================= */

function renderTudo() {
  renderVereadores();
  renderProjetos();
  renderSessoes();
  renderDocumentosTabela();
  renderDashboard();
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  carregarDados(STORAGE_KEYS.vereadores, vereadoresSeed);
  carregarDados(STORAGE_KEYS.projetos, projetosSeed);
  carregarDados(STORAGE_KEYS.sessoes, sessoesSeed);
  carregarDados(STORAGE_KEYS.documentos, documentosSeed);

  renderTudo();
  iniciarFormularioAdmin();
  iniciarFiltros();
});

/* =========================================================
   FIM DO SCRIPT.JS V2
========================================================= */
/* =========================================================
   V6 DASHBOARD OLAP REAL — GOVTECH
========================================================= */

function calcularOLAP() {
  const vereadores = carregarDados(STORAGE_KEYS.vereadores, vereadoresSeed);
  const projetos = carregarDados(STORAGE_KEYS.projetos, projetosSeed);
  const sessoes = carregarDados(STORAGE_KEYS.sessoes, sessoesSeed);
  const documentos = carregarDados(STORAGE_KEYS.documentos, documentosSeed);

  const projetosEmTramitacao = projetos.filter(p =>
    String(p.status).toLowerCase().includes("tramitação")
  ).length;

  const projetosPublicados = projetos.filter(p =>
    String(p.status).toLowerCase().includes("public")
  ).length;

  const sessoesPublicadas = sessoes.filter(s =>
    String(s.status).toLowerCase().includes("public")
  ).length;

  const documentosPublicados = documentos.filter(d =>
    String(d.status).toLowerCase().includes("public")
  ).length;

  return {
    vereadores: vereadores.length,
    projetos: projetos.length,
    sessoes: sessoes.length,
    documentos: documentos.length,
    projetosEmTramitacao,
    projetosPublicados,
    sessoesPublicadas,
    documentosPublicados,
    taxaPublicacao:
      documentos.length > 0
        ? Math.round((documentosPublicados / documentos.length) * 100)
        : 0
  };
}

function renderOLAP() {
  const olap = calcularOLAP();

  atualizarTexto("olap-vereadores", olap.vereadores);
  atualizarTexto("olap-projetos", olap.projetos);
  atualizarTexto("olap-sessoes", olap.sessoes);
  atualizarTexto("olap-documentos", olap.documentos);
  atualizarTexto("olap-tramitacao", olap.projetosEmTramitacao);
  atualizarTexto("olap-publicados", olap.projetosPublicados);
  atualizarTexto("olap-sessoes-publicadas", olap.sessoesPublicadas);
  atualizarTexto("olap-transparencia", olap.taxaPublicacao + "%");
}

/* Integra OLAP ao carregamento geral */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(renderOLAP, 300);
});
0

