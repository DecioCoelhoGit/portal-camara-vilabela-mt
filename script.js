/* =========================================================
   INÍCIO BLOCO 01 — CONFIGURAÇÃO GLOBAL
========================================================= */

const STORAGE_KEYS = {
  vereadores: "camara_vereadores",
  projetos: "camara_projetos",
  sessoes: "camara_sessoes",
  documentos: "camara_documentos"
};

/* FIM BLOCO 01 */


/* =========================================================
   INÍCIO BLOCO 02 — DADOS INICIAIS
========================================================= */

const vereadoresSeed = [
  {
    id: 1,
    nome: "Nome do Vereador",
    cargo: "Presidente",
    partido: "Partido",
    foto: "imagens/vereador-placeholder.png",
    descricao: "Atuação parlamentar voltada à representação popular e transparência."
  },
  {
    id: 2,
    nome: "Nome da Vereadora",
    cargo: "Vice-Presidente",
    partido: "Partido",
    foto: "imagens/vereador-placeholder.png",
    descricao: "Participação em pautas legislativas e ações institucionais."
  }
];

const projetosSeed = [
  {
    id: 1,
    numero: "PL 001/2026",
    tipo: "Projeto de Lei",
    autor: "Poder Legislativo",
    data: "2026-02-10",
    status: "Em tramitação",
    descricao: "Dispõe sobre modernização digital e transparência legislativa."
  },
  {
    id: 2,
    numero: "IND 004/2026",
    tipo: "Indicação",
    autor: "Vereador(a)",
    data: "2026-02-14",
    status: "Encaminhada",
    descricao: "Sugere melhorias na infraestrutura urbana municipal."
  }
];

const sessoesSeed = [
  {
    id: 1,
    titulo: "1ª Sessão Ordinária de 2026",
    tipo: "Ordinária",
    data: "2026-02-05",
    status: "Ata publicada",
    descricao: "Abertura dos trabalhos legislativos e leitura do expediente."
  },
  {
    id: 2,
    titulo: "1ª Sessão Extraordinária de 2026",
    tipo: "Extraordinária",
    data: "2026-02-18",
    status: "Documentos em organização",
    descricao: "Sessão convocada para apreciação de pauta específica."
  }
];

const documentosSeed = [
  {
    id: 1,
    data: "2026-02-05",
    categoria: "Relatório",
    titulo: "Relatório Mensal de Gestão Legislativa",
    status: "Publicado",
    acesso: "PDF"
  },
  {
    id: 2,
    data: "2026-02-10",
    categoria: "Contrato",
    titulo: "Contrato Administrativo nº 001/2026",
    status: "Publicado",
    acesso: "PDF"
  }
];

/* FIM BLOCO 02 */


/* =========================================================
   INÍCIO BLOCO 03 — LOCAL STORAGE
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

function resetarBase() {
  salvarDados(STORAGE_KEYS.vereadores, vereadoresSeed);
  salvarDados(STORAGE_KEYS.projetos, projetosSeed);
  salvarDados(STORAGE_KEYS.sessoes, sessoesSeed);
  salvarDados(STORAGE_KEYS.documentos, documentosSeed);

  alert("Base demonstrativa restaurada com sucesso.");
  location.reload();
}

/* FIM BLOCO 03 */


/* =========================================================
   INÍCIO BLOCO 04 — FORMATADORES
========================================================= */

function formatarData(dataISO) {
  if (!dataISO) return "-";

  const partes = dataISO.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function classeStatus(status) {
  const texto = status.toLowerCase();

  if (
    texto.includes("aprov") ||
    texto.includes("public") ||
    texto.includes("encaminh")
  ) {
    return "aprovado";
  }

  if (
    texto.includes("rejeit") ||
    texto.includes("cancel")
  ) {
    return "rejeitado";
  }

  return "andamento";
}

/* FIM BLOCO 04 */


/* =========================================================
   INÍCIO BLOCO 05 — RENDER VEREADORES
========================================================= */

function renderVereadores(containerId = "lista-vereadores") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const vereadores = carregarDados(STORAGE_KEYS.vereadores, vereadoresSeed);

  container.innerHTML = vereadores.map(v => `
    <div class="card vereador-card">
      <img src="${v.foto}" alt="Foto de ${v.nome}">
      <h3>${v.nome}</h3>
      <p class="cargo">${v.cargo}</p>
      <p class="partido">${v.partido}</p>
      <p class="mt-20">${v.descricao}</p>
    </div>
  `).join("");
}

/* FIM BLOCO 05 */


/* =========================================================
   INÍCIO BLOCO 06 — RENDER PROJETOS
========================================================= */

function renderProjetos(containerId = "lista-projetos") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const projetos = carregarDados(STORAGE_KEYS.projetos, projetosSeed);

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
  `).join("");
}

/* FIM BLOCO 06 */


/* =========================================================
   INÍCIO BLOCO 07 — RENDER SESSÕES
========================================================= */

function renderSessoes(containerId = "lista-sessoes") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sessoes = carregarDados(STORAGE_KEYS.sessoes, sessoesSeed);

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
  `).join("");
}

/* FIM BLOCO 07 */


/* =========================================================
   INÍCIO BLOCO 08 — RENDER DOCUMENTOS
========================================================= */

function renderDocumentosTabela(containerId = "tabela-documentos") {
  const tbody = document.getElementById(containerId);
  if (!tbody) return;

  const documentos = carregarDados(STORAGE_KEYS.documentos, documentosSeed);

  tbody.innerHTML = documentos.map(d => `
    <tr>
      <td>${formatarData(d.data)}</td>
      <td>${d.categoria}</td>
      <td>${d.titulo}</td>
      <td>${d.status}</td>
      <td>${d.acesso}</td>
    </tr>
  `).join("");
}

/* FIM BLOCO 08 */


/* =========================================================
   INÍCIO BLOCO 09 — DASHBOARD
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

/* FIM BLOCO 09 */


/* =========================================================
   INÍCIO BLOCO 10 — FORMULÁRIO ADMIN DEMONSTRATIVO
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
        id: projetos.length + 1,
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
        id: sessoes.length + 1,
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
        id: documentos.length + 1,
        data,
        categoria,
        titulo,
        status,
        acesso: "PDF"
      });

      salvarDados(STORAGE_KEYS.documentos, documentos);
    }

    alert("Registro salvo no LocalStorage com sucesso.");
    form.reset();
  });
}

/* FIM BLOCO 10 */


/* =========================================================
   INÍCIO BLOCO 11 — INICIALIZAÇÃO AUTOMÁTICA
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  carregarDados(STORAGE_KEYS.vereadores, vereadoresSeed);
  carregarDados(STORAGE_KEYS.projetos, projetosSeed);
  carregarDados(STORAGE_KEYS.sessoes, sessoesSeed);
  carregarDados(STORAGE_KEYS.documentos, documentosSeed);

  renderVereadores();
  renderProjetos();
  renderSessoes();
  renderDocumentosTabela();
  renderDashboard();
  iniciarFormularioAdmin();
});

/* FIM BLOCO 11 */


/* =========================================================
   FIM DO ARQUIVO SCRIPT.JS V1
========================================================= */
