const API_URL =
  "https://script.google.com/macros/s/AKfycbzBL3zWUZLpSDvR_Oomuk50_3YkfEWb_WlwhALZAO1d3BbXOvPAE64gHwZ8SiTVAyHf/exec";

const SESSION_KEY = "mtbAdminSession";

/* =====================================================
   EVENTO ATUAL
   ===================================================== */

const EVENTO_KEY = "adminEventoAtual";

let EVENTO_ATUAL =
  localStorage.getItem(EVENTO_KEY) ||
  "MTB2026";


function aplicarEventoSelecionado_() {

  const select =
    document.getElementById("eventoAtual");

  if (!select) {
    return;
  }

  select.value = EVENTO_ATUAL;
}


function nomeEventoAtual_() {

  return EVENTO_ATUAL === "TRAIL2026"
    ? "Itaitinga Trail Run"
    : "Itaitinga MTB Race";
}
/* =====================================================
   ELEMENTOS
   ===================================================== */

const login =
  document.getElementById("login");

const app =
  document.getElementById("app");

const form =
  document.getElementById("loginForm");

const error =
  document.getElementById("error");

const email =
  document.getElementById("email");

const password =
  document.getElementById("password");


/* =====================================================
   NOTIFICAÇÕES V4
   ===================================================== */

function garantirContainerNotificacao() {

  let container =
    document.getElementById("mtbNotifications");

  if (container) {
    return container;
  }

  container =
    document.createElement("div");

  container.id =
    "mtbNotifications";

  Object.assign(
    container.style,
    {
      position: "fixed",
      top: "24px",
      right: "24px",
      zIndex: "99999",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "min(390px, calc(100vw - 32px))",
      pointerEvents: "none"
    }
  );

  document.body.appendChild(container);

  return container;
}


function notificar(
  tipo,
  titulo,
  mensagem,
  tempo = 4500
) {

  const container =
    garantirContainerNotificacao();

  const notification =
    document.createElement("div");

  const sucesso =
    tipo === "success";

  const cor =
    sucesso
      ? "#a8ff00"
      : tipo === "warning"
        ? "#ffcf5c"
        : "#ff6b6b";

  const fundo =
    sucesso
      ? "#102006"
      : tipo === "warning"
        ? "#241b05"
        : "#260b0b";

  const icone =
    sucesso
      ? "✓"
      : tipo === "warning"
        ? "!"
        : "×";

  Object.assign(
    notification.style,
    {
      pointerEvents: "auto",
      background: fundo,
      border: `1px solid ${cor}`,
      borderLeft: `5px solid ${cor}`,
      color: "#f5f5f5",
      borderRadius: "10px",
      padding: "16px 18px",
      boxShadow: "0 12px 35px rgba(0,0,0,.35)",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      opacity: "0",
      transform: "translateX(30px)",
      transition: "opacity .25s ease, transform .25s ease",
      fontFamily: "inherit"
    }
  );

  notification.innerHTML = `
    <div style="
      width:28px;
      height:28px;
      min-width:28px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      background:${cor};
      color:#111;
      font-weight:900;
      font-size:17px;
    ">${icone}</div>

    <div style="flex:1;min-width:0">
      <strong style="
        display:block;
        color:${cor};
        font-size:13px;
        letter-spacing:.4px;
        margin-bottom:4px;
      ">${esc(titulo)}</strong>

      <span style="
        color:#d5d5d5;
        font-size:13px;
        line-height:1.45;
      ">${esc(mensagem)}</span>
    </div>

    <button type="button" style="
      border:0;
      background:transparent;
      color:#aaa;
      cursor:pointer;
      font-size:20px;
      line-height:20px;
      padding:0;
    ">×</button>
  `;

  const close =
    notification.querySelector("button");

  const remover = () => {

    notification.style.opacity = "0";
    notification.style.transform =
      "translateX(30px)";

    setTimeout(
      () => notification.remove(),
      250
    );
  };

  close.onclick = remover;

  container.appendChild(notification);

  requestAnimationFrame(() => {

    notification.style.opacity = "1";
    notification.style.transform =
      "translateX(0)";
  });

  if (tempo > 0) {

    setTimeout(
      remover,
      tempo
    );
  }
}


/* =====================================================
   SENHA
   ===================================================== */

document
  .getElementById("showPass")
  .onclick = () => {

    password.type =
      password.type === "password"
        ? "text"
        : "password";

    document
      .getElementById("showPass")
      .textContent =
        password.type === "password"
          ? "Mostrar"
          : "Ocultar";
  };


/* =====================================================
   SESSÃO
   ===================================================== */

const getSession = () => {

  try {

    return JSON.parse(
      sessionStorage.getItem(
        SESSION_KEY
      ) || "null"
    );

  } catch (e) {

    return null;
  }
};


const setSession = x =>
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(x)
  );


const clearSession = () =>
  sessionStorage.removeItem(
    SESSION_KEY
  );


/* =====================================================
   API
   ===================================================== */

async function apiPost(
  action,
  payload = {}
) {

  const r =
    await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body: JSON.stringify({
          action,
          ...payload
        })
      }
    );

  if (!r.ok) {

    throw Error(
      "Não foi possível comunicar com o servidor."
    );
  }

  const j =
    await r.json();

  if (!j.sucesso) {

    throw Error(
      j.mensagem ||
      "Ocorreu um erro."
    );
  }

  return j.dados;
}


async function apiGet(
  action,
  payload = {}
) {

  const q =
    new URLSearchParams({
      action,
      ...payload
    });

  const r =
    await fetch(
      `${API_URL}?${q}`
    );

  if (!r.ok) {

    throw Error(
      "Não foi possível comunicar com o servidor."
    );
  }

  const j =
    await r.json();

  if (!j.sucesso) {

    throw Error(
      j.mensagem ||
      "Ocorreu um erro."
    );
  }

  return j.dados;
}


/* =====================================================
   LOGIN / APP
   ===================================================== */

function showApp(s) {

  login.hidden = true;
  app.hidden = false;

  document
    .getElementById("userEmail")
    .textContent =
      s?.administrador?.email || "";

  aplicarEventoSelecionado_();
}

document
  .getElementById("eventoAtual")
  ?.addEventListener(
    "change",
    async e => {

      EVENTO_ATUAL =
        String(
          e.target.value ||
          "MTB2026"
        )
          .trim()
          .toUpperCase();

      localStorage.setItem(
        EVENTO_KEY,
        EVENTO_ATUAL
      );

      notificar(
        "success",
        "EVENTO ALTERADO",
        `Evento atual: ${nomeEventoAtual_()}`
      );

    }
  );

function showLogin() {

  app.hidden = true;
  login.hidden = false;
}


form.onsubmit =
  async e => {

    e.preventDefault();

    error.hidden = true;

    const b =
      form.querySelector(".primary");

    const old =
      b.innerHTML;

    b.disabled = true;
    b.innerHTML =
      "VALIDANDO...";

    try {

      const d =
        await apiPost(
          "login",
          {
            email:
              email.value.trim(),

            senha:
              password.value
          }
        );

      setSession(d);

      showApp(d);

      await carregarDashboard();
      await carregarConfiguracoes_();

    } catch (err) {

      error.textContent =
        err.message ||
        "E-mail ou senha inválidos.";

      error.hidden = false;

    } finally {

      b.disabled = false;
      b.innerHTML = old;
    }
  };


document
  .getElementById("logout")
  .onclick =
  async () => {

    const s =
      getSession();

    try {

      if (s?.token) {

        await apiPost(
          "logout",
          {
            token: s.token
          }
        );
      }

    } catch (e) {
    }

    clearSession();

    form.reset();

    showLogin();
  };


/* =====================================================
   NAVEGAÇÃO
   ===================================================== */

const titles = {

  dashboard:
    ["VISÃO GERAL", "Dashboard"],

  inscricoes:
    ["GESTÃO", "Inscrições"],

  pagamentos:
    ["FINANCEIRO", "Pagamentos"],

  conteudo:
    ["SITE", "Conteúdo"],

  configuracoes:
    ["SISTEMA", "Configurações"],

  usuarios:
    ["ADMINISTRAÇÃO", "Usuários"]
};

function go(
  page,
  filter
) {

  document
    .querySelectorAll(".page")
    .forEach(
      x => x.classList.remove("active")
    );

  document
    .getElementById(page)
    .classList.add("active");

  document
    .querySelectorAll(".nav")
    .forEach(
      x =>
        x.classList.toggle(
          "active",
          x.dataset.page === page
        )
    );

  document
    .getElementById("eyebrow")
    .textContent =
      titles[page][0];

 document
  .getElementById("title")
  .textContent =
    titles[page][1];

if (
  filter &&
  document.getElementById("filter")
) {

  document
    .getElementById("filter")
    .value = filter;
}

if (page === "inscricoes") {
  carregarInscricoes();
}

if (page === "pagamentos") {
  carregarPagamentos();
}

if (page === "conteudo") {
  carregarConteudoSite_();
}

if (page === "configuracoes") {
  carregarConfiguracoes_();
}

if (page === "usuarios") {
  carregarUsuarios();
}

}


document
  .querySelectorAll(".nav")
  .forEach(
    b =>
      b.onclick =
        () => go(b.dataset.page)
  );


document
  .querySelectorAll(".stat")
  .forEach(
    b =>
      b.onclick =
        () =>
          go(
            "inscricoes",
            b.dataset.filter
          )
  );


document
  .querySelectorAll("[data-go]")
  .forEach(
    b =>
      b.onclick =
        () =>
          go(
            b.dataset.go,
            b.dataset.filter
          )
  );

  async function carregarConfiguracaoSitePublico_() {

  try {

    const url =
      GOOGLE_SCRIPT_URL +
      "?action=publicSiteConfig";

    const response =
      await fetch(url);

    const json =
      await response.json();

    if (!json.sucesso) {
      throw new Error(
        json.mensagem ||
        "Erro ao carregar informações."
      );
    }

    const dados =
      json.dados || {};


    function preencherTexto(id, valor) {

      const el =
        document.getElementById(id);

      if (
        el &&
        valor !== undefined &&
        valor !== null &&
        valor !== ""
      ) {

        el.textContent = valor;

      }

    }


    preencherTexto(
      "siteNomeEvento",
      dados.nomeEvento
    );

    preencherTexto(
      "siteModalidade",
      dados.modalidade
    );

    preencherTexto(
      "siteCidade",
      dados.cidade
    );

    preencherTexto(
      "siteEstado",
      dados.estado
    );

    preencherTexto(
      "siteDistancia",
      dados.distancia
    );

    preencherTexto(
      "siteAltimetria",
      dados.altimetria
    );

    preencherTexto(
      "siteHorario",
      dados.horario
    );


    if (dados.dataEvento) {

      const partes =
        dados.dataEvento.split("-");

      if (partes.length === 3) {

        const dataFormatada =
          `${partes[2]}/${partes[1]}/${partes[0]}`;

        preencherTexto(
          "siteDataEvento",
          dataFormatada
        );

      }

    }


  } catch (err) {

    console.warn(
      "Erro ao carregar configurações do site:",
      err
    );

  }

}


/* =====================================================
   CARREGAR CONFIGURAÇÕES DO SITE AO ABRIR A PÁGINA
   ===================================================== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    carregarConfiguracaoSitePublico_
  );

} else {

  carregarConfiguracaoSitePublico_();

}


/* =====================================================
   DASHBOARD
   ===================================================== */

async function carregarDashboard() {

  const s =
    getSession();

  if (!s?.token) {
    return;
  }

  try {

    const d =
      await apiGet(
        "dashboard",
        {
          token: s.token
        }
      );

    atualizarDashboard(d);

  } catch (e) {

    if (/sessão/i.test(e.message)) {

      clearSession();

      showLogin();

      error.textContent =
        e.message;

      error.hidden = false;
    }
  }
}


function atualizarDashboard(d) {

  const vals = [

    d.totalInscritos || 0,

    d.pagamentos?.pendentes || 0,

    d.pagamentos?.pagos || 0,

    d.inscricoes?.pendentes || 0,

    d.inscricoes?.confirmadas || 0,

    d.canceladas || 0
  ];

  document
    .querySelectorAll(".stat b")
    .forEach(
      (x, i) =>
        x.textContent = vals[i]
    );

  const m =
    document.querySelectorAll(".money b");

  if (m.length >= 3) {

    m[0].textContent =
      moeda(
        d.financeiro?.arrecadado
      );

    m[1].textContent =
      moeda(
        d.financeiro?.aReceber
      );

    m[2].textContent =
      moeda(
        d.financeiro?.totalPotencial
      );
  }

  const mark =
    document.querySelector(".ph mark");

  if (mark && d.financeiro) {

    mark.textContent = categoriasConfig.length
      ? `${categoriasConfig.length} categorias configuradas`
      : "Valores por categoria";
  }
}


const moeda =
  v =>
    Number(v || 0)
      .toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL"
        }
      );


/* =====================================================
   INSCRIÇÕES
   ===================================================== */

let inscricoes = [];


async function carregarInscricoes() {

  const s =
    getSession();

  if (!s?.token) {
    return;
  }

  try {

    const d =
      await apiGet(
        "inscricoes",
        {
          token: s.token
        }
      );

    inscricoes =
      d.inscricoes || [];

    render();

  } catch (e) {

    console.error(e);

    notificar(
      "error",
      "ERRO AO CARREGAR",
      e.message ||
        "Não foi possível carregar as inscrições."
    );
  }
}


function render() {

  const body =
    document.getElementById("rows");

  if (!body) {
    return;
  }

  const q =
    (
      document
        .getElementById("search")
        ?.value || ""
    )
      .toLowerCase();

  const f =
    document
      .getElementById("filter")
      ?.value ||
    "todos";

  const cat =
    document
      .getElementById("categoryFilter")
      ?.value ||
    "todas";

  const rows =
    inscricoes.filter(x => {

      const t = [
        x.numeroInscricao,
        x.nome,
        x.cpf,
        x.email,
        x.telefone,
        x.categoria
      ]
        .join(" ")
        .toLowerCase();

      if (
        q &&
        !t.includes(q)
      ) {
        return false;
      }

      if (
        cat !== "todas" &&
        String(x.categoria || "") !== cat
      ) {
        return false;
      }

      const p =
        String(
          x.pagamento || ""
        ).toLowerCase();

      const st =
        String(
          x.statusInscricao || ""
        ).toLowerCase();

      return (

        f === "todos" ||

        (
          f === "pagamento-pendente" &&
          p === "pendente"
        ) ||

        (
          f === "pago" &&
          p === "pago"
        ) ||

        (
          f === "inscricao-pendente" &&
          st === "pendente"
        ) ||

        (
          f === "confirmado" &&
          st === "confirmado"
        ) ||

        (
          f === "cancelado" &&
          (
            p === "cancelado" ||
            st === "cancelado"
          )
        )
      );
    });


  body.innerHTML =
    rows.map(x => `

      <tr>

        <td>
          <b>#${esc(x.numeroInscricao)}</b>
        </td>

        <td>
          <b>${esc(x.nome)}</b>
        </td>

        <td>${esc(x.cpf)}</td>

        <td>
          ${esc(x.categoria)}
        </td>

        <td>
          <b>${moeda(x.valor)}</b>
        </td>

        <td>
          <span class="pill ${classe(x.pagamento)}">
            ${esc(x.pagamento)}
          </span>
        </td>

        <td>
          <span class="pill ${classe(x.statusInscricao)}">
            ${esc(x.statusInscricao)}
          </span>
        </td>

        <td>${esc(x.dataInscricao || "—")}</td>

        <td>
          <button
            class="action"
            data-id="${esc(x.numeroInscricao)}"
          >
            VER DETALHES
          </button>
        </td>

      </tr>

    `).join("")
    ||
    `
      <tr>
        <td
          colspan="9"
          style="
            text-align:center;
            padding:30px
          "
        >
          Nenhuma inscrição encontrada.
        </td>
      </tr>
    `;


  body
    .querySelectorAll(".action")
    .forEach(
      b =>
        b.onclick =
          () =>
            detalhes(b.dataset.id)
    );
}


/* =====================================================
   UTILITÁRIOS FRONT-END
   ===================================================== */

const esc =
  v =>
    String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");


// Alias usado pelos modais de seleção.
// Corrige o erro que interrompia a abertura do modal de pagamento/status.
const escapeHtml_ = esc;


const classe =
  v => {

    v =
      String(v || "")
        .toLowerCase();

    return (
      v === "pago" ||
      v === "confirmado"
    )
      ? "paid"
      : v === "cancelado"
        ? "cancelled"
        : "pending";
  };


let inscricaoAtual = null;



/* =====================================================
   NOVA INSCRIÇÃO
   ===================================================== */

const registrationModal =
  document.getElementById("registrationModal");

const registrationForm =
  document.getElementById("registrationForm");

const registrationError =
  document.getElementById("registrationError");

function abrirModalCadastro() {
  if (!registrationModal) return;

  registrationForm.reset();

  const valorInput = document.getElementById("newValor");
  const categoriaSelect = document.getElementById("newCategoria");
  if (categoriaSelect && categoriasConfig.length) {
    categoriaSelect.value = categoriasConfig[0].nome;
    if (valorInput) valorInput.value = Number(categoriasConfig[0].valor).toFixed(2);
  } else if (valorInput) {
    valorInput.value = "";
  }

  if (registrationError) {
    registrationError.hidden = true;
    registrationError.textContent = "";
  }

  registrationModal.hidden = false;
  document.body.classList.add("modal-open");

  setTimeout(() => {
    document.getElementById("newNome")?.focus();
  }, 50);
}

function fecharModalCadastro() {
  if (!registrationModal) return;

  registrationModal.hidden = true;
  document.body.classList.remove("modal-open");

  if (registrationForm) {
    registrationForm.reset();
  }

  if (registrationError) {
    registrationError.hidden = true;
    registrationError.textContent = "";
  }
}

document
  .getElementById("newRegistrationBtn")
  ?.addEventListener("click", abrirModalCadastro);

document
  .getElementById("closeRegistration")
  ?.addEventListener("click", fecharModalCadastro);

document
  .getElementById("cancelRegistration")
  ?.addEventListener("click", fecharModalCadastro);

registrationModal?.addEventListener("click", e => {
  if (e.target === registrationModal) {
    fecharModalCadastro();
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && registrationModal && !registrationModal.hidden) {
    fecharModalCadastro();
  }
});

function validarCpfCadastro_(cpf) {
  const digits = String(cpf || "").replace(/\D/g, "");

  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(digits[i]) * (10 - i);
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  if (digito1 !== Number(digits[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(digits[i]) * (11 - i);
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  return digito2 === Number(digits[10]);
}

function formatarCpfCadastro_(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{3})(\d+)/, "$1.$2");
  if (digits.length <= 9) return digits.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, "$1.$2.$3-$4");
}

document
  .getElementById("newCpf")
  ?.addEventListener("input", e => {
    e.target.value = formatarCpfCadastro_(e.target.value);
  });

let categoriasConfig = [];
let lotesConfig = [];

let loteEditandoId = null;


function normalizarCategorias_(valor) {
  const arr = Array.isArray(valor) ? valor : [];
  return arr.map(x => ({
    id: String(x.id || "").trim(),
    nome: String(x.nome || "").trim(),
    idadeMaxima: x.idadeMaxima === null || x.idadeMaxima === undefined || x.idadeMaxima === ""
      ? null
      : Number(x.idadeMaxima),
    ativo: x.ativo === true || String(x.ativo || "").toUpperCase() === "SIM"
  })).filter(x => x.nome);
}

function normalizarLotes_(valor) {
  const arr = Array.isArray(valor) ? valor : [];
  return arr.map(x => ({
    id: String(x.id || "").trim(),
    nome: String(x.nome || "").trim(),
    dataInicio: String(x.dataInicio || "").trim(),
    dataFim: String(x.dataFim || "").trim(),
    valor: Number(x.valor || 0),
    ativo: x.ativo === true || String(x.ativo || "").toUpperCase() === "SIM"
  })).filter(x => x.nome);
}

function preencherSelectCategorias_(id, selecionada = "") {
  const select = document.getElementById(id);
  if (!select) return;
  const atual = selecionada || select.value;
  const disponiveis = categoriasConfig.filter(c => c.ativo);
  select.innerHTML = '<option value="">Selecione a categoria</option>' +
    disponiveis.map(c => `<option value="${esc(c.nome)}">${esc(c.nome)}</option>`).join("");
  if (disponiveis.some(c => c.nome === atual)) select.value = atual;
}

function atualizarValorPorCategoria_(categoriaId, valorId) {
  const campo = document.getElementById(valorId);
  if (!campo) return;
  const lote = obterLoteVigente_();
  campo.value = lote ? Number(lote.valor).toFixed(2) : "";
}

function obterLoteVigente_() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return lotesConfig.find(l => {
    if (!l.ativo) return false;
    const inicio = parseDataLocal_(l.dataInicio);
    const fim = parseDataLocal_(l.dataFim);
    return inicio && fim && hoje >= inicio && hoje <= fim;
  }) || null;
}

function parseDataLocal_(value) {

  const s =
    String(value || '')
      .trim();

  if (!s) {
    return null;
  }

  let dia;
  let mes;
  let ano;

  /* ---------------------------------------------
     Formato: DD/MM/YYYY
     Aceita também DD/MM/YYYY HH:mm:ss
     --------------------------------------------- */

  let match =
    s.match(
      /^(\d{2})\/(\d{2})\/(\d{4})/
    );

  if (match) {

    dia = Number(match[1]);
    mes = Number(match[2]);
    ano = Number(match[3]);

  } else {

    /* -------------------------------------------
       Formato: YYYY-MM-DD
       Aceita também YYYY-MM-DDTHH:mm:ss
       ------------------------------------------- */

    match =
      s.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

    if (!match) {
      return null;
    }

    ano = Number(match[1]);
    mes = Number(match[2]);
    dia = Number(match[3]);
  }

  const d =
    new Date(
      ano,
      mes - 1,
      dia
    );

  d.setHours(
    0,
    0,
    0,
    0
  );

  return d;
}

function formatarDataInput_(value) {
  const d = parseDataLocal_(value);
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatarDataCurta_(value) {
  const d = parseDataLocal_(value);
  if (!d) return "—";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

async function carregarConfiguracoes_() {
  const s = getSession();
  if (!s?.token) return;
  try {
    const [categorias, lotes] = await Promise.all([
      apiGet("adminCategorias", { token: s.token }),
      apiGet("lotes", { token: s.token })
    ]);

    categoriasConfig = normalizarCategorias_(categorias?.categorias);
    lotesConfig = normalizarLotes_(lotes?.lotes);

    preencherSelectCategorias_("newCategoria");
    preencherSelectCategorias_("editCategoria");
    atualizarValorPorCategoria_("newCategoria", "newValor");
    renderCategoriasConfig_();
    renderLotesConfig_();
    renderCategoryFilter_();
  } catch (e) {
    console.warn("Não foi possível carregar categorias/lotes", e);
    notificar("error", "ERRO NAS CONFIGURAÇÕES", e.message || "Não foi possível carregar os cadastros.");
  }
}

function renderCategoryFilter_() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  const atual = select.value || "todas";
  const categorias = categoriasConfig.filter(c => c.ativo);
  select.innerHTML = '<option value="todas">Todas as categorias</option>' + categorias.map(c => `<option value="${esc(c.nome)}">${esc(c.nome)}</option>`).join("");
  if (categorias.some(c => c.nome === atual)) select.value = atual;
}

function renderCategoriasConfig_() {

  const box =
    document.getElementById(
      "categoriesList"
    );

  const empty =
    document.getElementById(
      "categoriesEmpty"
    );

  if (!box || !empty) {
    return;
  }

  empty.hidden =
    categoriasConfig.length > 0;

  box.innerHTML =
    categoriasConfig
      .map(c => `

        <div
          class="management-row ${c.ativo ? "is-active" : "is-inactive"}"
          data-id="${esc(c.id)}"
        >

          <div class="management-main">

            <small>
              CATEGORIA
            </small>

            <b>
              ${esc(c.nome)}
            </b>

            <span>
              ${
                c.idadeMaxima
                  ? `Idade máxima: ${c.idadeMaxima} anos`
                  : "Sem idade máxima definida"
              }
            </span>

          </div>


          <span
            class="status-badge ${
              c.ativo
                ? "status-active"
                : "status-inactive"
            }"
          >
            ${
              c.ativo
                ? "ATIVA"
                : "INATIVA"
            }
          </span>


          <div class="management-actions">

            <button
              type="button"
              class="management-edit category-edit"
              data-id="${esc(c.id)}"
            >
              EDITAR
            </button>


            <button
              type="button"
              class="management-toggle category-toggle"
              data-id="${esc(c.id)}"
              data-active="${c.ativo}"
            >
              ${
                c.ativo
                  ? "DESATIVAR"
                  : "ATIVAR"
              }
            </button>


            <button
              type="button"
              class="management-delete category-delete"
              data-id="${esc(c.id)}"
            >
              EXCLUIR
            </button>

          </div>

        </div>

      `)
      .join("");
}

function renderLotesConfig_() {

  const box =
    document.getElementById(
      "lotsList"
    );

  const empty =
    document.getElementById(
      "lotsEmpty"
    );

  if (!box || !empty) {
    return;
  }

  empty.hidden =
    lotesConfig.length > 0;

  const vigente =
    obterLoteVigente_();

  box.innerHTML =
    lotesConfig
      .map(l => `

        <div
          class="management-row ${l.ativo ? "is-active" : "is-inactive"}"
          data-id="${esc(l.id)}"
        >

          <div class="management-main">

            <small>LOTE</small>

            <b>
              ${esc(l.nome)}
            </b>

            <span>
              Vigência:
              ${formatarDataCurta_(l.dataInicio)}
              →
              ${formatarDataCurta_(l.dataFim)}
            </span>

          </div>


          <div class="management-price">

            <small>VALOR</small>

            <b>
              R$
              ${Number(l.valor)
                .toFixed(2)
                .replace(".", ",")}
            </b>

          </div>


          <span
            class="status-badge ${
              l.ativo
                ? "status-active"
                : "status-inactive"
            }"
          >

            ${
              l.ativo
                ? (
                    vigente &&
                    vigente.id === l.id
                      ? "VIGENTE"
                      : "ATIVO"
                  )
                : "INATIVO"
            }

          </span>

<div class="management-actions">

  <button
    type="button"
    class="management-edit lot-edit"
    data-id="${esc(l.id)}"
  >
    EDITAR
  </button>

  <button
    type="button"
    class="management-toggle lot-toggle"
    data-id="${esc(l.id)}"
    data-active="${l.ativo}"
  >
    ${
      l.ativo
        ? "DESATIVAR"
        : "ATIVAR"
    }
  </button>

  <button
    type="button"
    class="management-delete lot-delete"
    data-id="${esc(l.id)}"
  >
    EXCLUIR
  </button>

</div>

        </div>

      `)
      .join("");
}

function abrirModal_(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = false;
}
function fecharModal_(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = true;
}

function mostrarErroConfig_(id, mensagem) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = mensagem;
  el.hidden = false;
}
function limparErroConfig_(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ""; el.hidden = true; }
}

/* =====================================================
   CONTEÚDO DO SITE
   ===================================================== */

document
  .getElementById("saveSiteConfig")
  ?.addEventListener(
    "click",
    async () => {

      const s = getSession();

      if (!s?.token) {
        showLogin();
        return;
      }


      const btn =
        document.getElementById(
          "saveSiteConfig"
        );

      const textoOriginal =
        btn.textContent;


      const dados = {

        token:
          s.token,

        nomeEvento:
          document
            .getElementById(
              "siteNomeEvento"
            )
            ?.value
            .trim() || "",

        modalidade:
          document
            .getElementById(
              "siteModalidade"
            )
            ?.value
            .trim() || "",

        dataEvento:
          document
            .getElementById(
              "siteDataEvento"
            )
            ?.value || "",

        horario:
          document
            .getElementById(
              "siteHorario"
            )
            ?.value || "",

        cidade:
          document
            .getElementById(
              "siteCidade"
            )
            ?.value
            .trim() || "",

        estado:
          document
            .getElementById(
              "siteEstado"
            )
            ?.value
            .trim()
            .toUpperCase() || "",

        distancia:
          document
            .getElementById(
              "siteDistancia"
            )
            ?.value || "",

        altimetria:
          document
            .getElementById(
              "siteAltimetria"
            )
            ?.value || ""

      };


      if (!dados.nomeEvento) {

        notificar(
          "error",
          "CAMPO OBRIGATÓRIO",
          "Informe o nome do evento."
        );

        return;
      }


      btn.disabled = true;

      btn.textContent =
        "SALVANDO...";


      try {

        await apiPost(
          "salvarSiteConfig",
          dados
        );


        notificar(
          "success",
          "INFORMAÇÕES SALVAS",
          "O conteúdo do site foi atualizado com sucesso."
        );


      } catch (err) {

        notificar(
          "error",
          "ERRO AO SALVAR",
          err.message ||
            "Não foi possível salvar as informações."
        );


      } finally {

        btn.disabled = false;

        btn.textContent =
          textoOriginal;

      }

    }
  );

  async function carregarConteudoSite_() {

  const s =
    getSession();

  if (!s?.token) {
    return;
  }


  try {

    const dados =
      await apiGet(
        "siteConfig",
        {
          token: s.token
        }
      );


    const preencher = (
      id,
      valor
    ) => {

      const campo =
        document.getElementById(id);

      if (campo) {
        campo.value =
          valor ?? "";
      }

    };


    preencher(
      "siteNomeEvento",
      dados.nomeEvento
    );

    preencher(
      "siteModalidade",
      dados.modalidade
    );

    preencher(
      "siteDataEvento",
      dados.dataEvento
    );

    preencher(
      "siteHorario",
      dados.horario
    );

    preencher(
      "siteCidade",
      dados.cidade
    );

    preencher(
      "siteEstado",
      dados.estado
    );

    preencher(
      "siteDistancia",
      dados.distancia
    );

    preencher(
      "siteAltimetria",
      dados.altimetria
    );


  } catch (err) {

    console.warn(
      "Não foi possível carregar o conteúdo do site:",
      err
    );

    notificar(
      "error",
      "ERRO AO CARREGAR",
      err.message ||
        "Não foi possível carregar as informações do site."
    );

  }

}

function abrirEdicaoLote_(id) {

  const lote =
    lotesConfig.find(
      l =>
        String(l.id) ===
        String(id)
    );

  if (!lote) {

    notificar(
      "error",
      "LOTE NÃO ENCONTRADO",
      "Não foi possível localizar o lote."
    );

    return;
  }

  loteEditandoId =
    lote.id;

  document.getElementById(
    "lotModalTitle"
  ).textContent =
    "Editar lote";

  document.getElementById(
    "lotNome"
  ).value =
    lote.nome || "";

  document.getElementById(
    "lotDataInicio"
  ).value =
    formatarDataInput_(
      lote.dataInicio
    );

  document.getElementById(
    "lotDataFim"
  ).value =
    formatarDataInput_(
      lote.dataFim
    );

  document.getElementById(
    "lotValor"
  ).value =
    Number(
      lote.valor || 0
    ).toFixed(2);

  document.getElementById(
    "saveLot"
  ).textContent =
    "SALVAR ALTERAÇÕES";

  limparErroConfig_(
    "lotError"
  );

  abrirModal_(
    "lotModal"
  );
}

document.getElementById("addLotBtn")?.addEventListener("click", () => {
  document.getElementById("lotForm")?.reset();
  limparErroConfig_("lotError");
  abrirModal_("lotModal");
  document.getElementById("lotNome")?.focus();
});
document.getElementById("closeLotModal")?.addEventListener("click", () => fecharModal_("lotModal"));
document.getElementById("cancelLot")?.addEventListener("click", () => fecharModal_("lotModal"));

document.getElementById("lotForm")?.addEventListener("submit", async e => {

  e.preventDefault();

  const s = getSession();

  if (!s?.token) {
    return showLogin();
  }

  limparErroConfig_("lotError");

  const nome =
    document.getElementById("lotNome")
      .value
      .trim();

  const dataInicio =
    document.getElementById("lotDataInicio")
      .value;

  const dataFim =
    document.getElementById("lotDataFim")
      .value;

  const valor =
    Number(
      document.getElementById("lotValor")
        .value
    );

  if (
    !nome ||
    !dataInicio ||
    !dataFim ||
    !valor ||
    valor <= 0
  ) {

    return mostrarErroConfig_(
      "lotError",
      "Preencha todos os campos do lote."
    );
  }

  if (dataInicio > dataFim) {

    return mostrarErroConfig_(
      "lotError",
      "A data inicial não pode ser maior que a data final."
    );
  }

  const btn =
    document.getElementById("saveLot");

  btn.disabled = true;


  /* =================================================
     MODO EDIÇÃO
     ================================================= */

  if (loteEditandoId) {

    btn.textContent =
      "SALVANDO...";
      
console.log(
  "EDITANDO LOTE - ID:",
  loteEditandoId
);
    try {

      await apiPost(
        "editarLote",
        {
          token: s.token,

          id:
            loteEditandoId,

          nome:
            nome,

          dataInicio:
            dataInicio,

          dataFim:
            dataFim,

          valor:
            valor
        }
      );

      loteEditandoId =
        null;

      fecharModal_(
        "lotModal"
      );

      await carregarConfiguracoes_();

      notificar(
        "success",
        "LOTE ATUALIZADO",
        "As alterações do lote foram salvas com sucesso."
      );

    } catch (err) {

      mostrarErroConfig_(
        "lotError",
        err.message
      );

    } finally {

      btn.disabled = false;

      btn.textContent =
        "CRIAR LOTE";
    }

    return;
  }


  /* =================================================
     MODO NOVO LOTE
     ================================================= */

  btn.textContent =
    "CRIANDO...";

  try {

    await apiPost(
      "criarLote",
      {
        token: s.token,
        nome,
        dataInicio,
        dataFim,
        valor
      }
    );

    fecharModal_(
      "lotModal"
    );

    await carregarConfiguracoes_();

    notificar(
      "success",
      "LOTE CRIADO",
      "O lote foi cadastrado com sucesso."
    );

  } catch (err) {

    mostrarErroConfig_(
      "lotError",
      err.message
    );

  } finally {

    btn.disabled = false;

    btn.textContent =
      "CRIAR LOTE";
  }

});

document.getElementById("addCategoryBtn")?.addEventListener("click", () => {
  document.getElementById("categoryForm")?.reset();
  limparErroConfig_("categoryError");
  abrirModal_("categoryModal");
  document.getElementById("categoryNome")?.focus();
});
document.getElementById("closeCategoryModal")?.addEventListener("click", () => fecharModal_("categoryModal"));
document.getElementById("cancelCategory")?.addEventListener("click", () => fecharModal_("categoryModal"));

document.getElementById("categoryForm")?.addEventListener("submit", async e => {

  e.preventDefault();

  const s = getSession();

  if (!s?.token) {
    return showLogin();
  }

  limparErroConfig_("categoryError");

  const nome =
    document
      .getElementById("categoryNome")
      .value
      .trim();

  const idadeMaxima =
    document
      .getElementById("categoryIdadeMaxima")
      .value;

  if (!nome) {

    return mostrarErroConfig_(
      "categoryError",
      "Informe o nome da categoria."
    );
  }


  /* =================================================
     VERIFICA SE É EDIÇÃO
     ================================================= */

  const categoriaEditandoId =
    window.categoriaEditandoId;


  /* =================================================
     VERIFICA CATEGORIA DUPLICADA
     ================================================= */

  const duplicada =
    categoriasConfig.some(c => {

      if (
        categoriaEditandoId &&
        String(c.id) ===
        String(categoriaEditandoId)
      ) {
        return false;
      }

      return (
        String(c.nome || "")
          .trim()
          .toLowerCase() ===
        nome.toLowerCase()
      );

    });


  if (duplicada) {

    return mostrarErroConfig_(
      "categoryError",
      "Já existe uma categoria com este nome."
    );
  }


  const btn =
    document.getElementById(
      "saveCategory"
    );

  btn.disabled = true;

  btn.textContent =
    categoriaEditandoId
      ? "SALVANDO..."
      : "CRIANDO...";


  try {

    /* =================================================
       EDITAR
       ================================================= */

    if (categoriaEditandoId) {

      await apiPost(
        "editarCategoria",
        {
          token:
            s.token,

          id:
            categoriaEditandoId,

          nome:
            nome,

          idadeMaxima:
            idadeMaxima
        }
      );


      fecharModal_(
        "categoryModal"
      );

      window.categoriaEditandoId =
        null;

      await carregarConfiguracoes_();

      notificar(
        "success",
        "CATEGORIA ATUALIZADA",
        "A categoria foi alterada com sucesso."
      );

    }


    /* =================================================
       CRIAR
       ================================================= */

    else {

      await apiPost(
        "criarCategoria",
        {
          token:
            s.token,

          nome:
            nome,

          idadeMaxima:
            idadeMaxima
        }
      );


      fecharModal_(
        "categoryModal"
      );

      await carregarConfiguracoes_();

      notificar(
        "success",
        "CATEGORIA CRIADA",
        "A categoria foi cadastrada com sucesso."
      );

    }

  } catch (err) {

    mostrarErroConfig_(
      "categoryError",
      err.message
    );

  } finally {

    btn.disabled = false;

    btn.textContent =
      categoriaEditandoId
        ? "SALVAR ALTERAÇÕES"
        : "CRIAR CATEGORIA";
  }

});

async function alterarStatusCadastro_(tipo, id, ativo) {
  const s = getSession();
  if (!s?.token) return showLogin();
  try {
    if (tipo === "categoria") {
      await apiPost("alterarStatusCategoria", { token: s.token, id, ativo });
    } else {
      await apiPost("alterarStatusLote", { token: s.token, id, ativo });
    }
    await carregarConfiguracoes_();
    notificar("success", "STATUS ATUALIZADO", `${tipo === "categoria" ? "Categoria" : "Lote"} ${ativo ? "ativado" : "desativado"} com sucesso.`);
  } catch (err) {
    notificar("error", "ERRO AO ALTERAR STATUS", err.message);
  }
}
/* =====================================================
   ABRIR EDIÇÃO DE CATEGORIA
   ===================================================== */

function abrirEdicaoCategoria_(id) {

  const categoria =
    categoriasConfig.find(
      c =>
        String(c.id) ===
        String(id)
    );

  if (!categoria) {

    notificar(
      "error",
      "CATEGORIA NÃO ENCONTRADA",
      "Não foi possível localizar a categoria."
    );

    return;
  }

  /* Guarda o ID que está sendo editado */

  window.categoriaEditandoId =
    categoria.id;


  /* Preenche os campos */

  const nome =
    document.getElementById(
      "categoryNome"
    );

  const idade =
    document.getElementById(
      "categoryIdadeMaxima"
    );

  if (nome) {

    nome.value =
      categoria.nome || "";

  }

  if (idade) {

    idade.value =
      categoria.idadeMaxima ?? "";

  }


  /* Altera o título */

  const titulo =
    document.getElementById(
      "categoryModalTitle"
    );

  if (titulo) {

    titulo.textContent =
      "Editar categoria";

  }


  /* Altera o botão */

  const salvar =
    document.getElementById(
      "saveCategory"
    );

  if (salvar) {

    salvar.textContent =
      "SALVAR ALTERAÇÕES";

  }


  /* Limpa mensagem anterior */

  const erro =
    document.getElementById(
      "categoryError"
    );

  if (erro) {

    erro.hidden =
      true;

    erro.textContent =
      "";

  }


  /* Abre o mesmo modal */

  abrirModal_(
    "categoryModal"
  );
}

/* =====================================================
   ABRIR EXCLUSÃO DE CATEGORIA
   ===================================================== */

function abrirExclusaoCategoria_(id) {

  const categoria =
    categoriasConfig.find(
      c =>
        String(c.id) ===
        String(id)
    );

  if (!categoria) {

    notificar(
      "error",
      "CATEGORIA NÃO ENCONTRADA",
      "Não foi possível localizar a categoria."
    );

    return;
  }


  window.categoriaExcluindoId =
    categoria.id;


  const mensagem =
    document.getElementById(
      "deleteCategoryMessage"
    );

  if (mensagem) {

    mensagem.innerHTML =
      `Você está prestes a excluir a categoria <strong>${esc(categoria.nome)}</strong>.<br>` +
      `<strong>Esta ação não poderá ser desfeita.</strong>`;

  }


  abrirModal_(
    "deleteCategoryModal"
  );
}
/* =====================================================
   FECHAR MODAL DE EXCLUSÃO DE CATEGORIA
   ===================================================== */

document
  .getElementById("closeDeleteCategoryModal")
  ?.addEventListener("click", () => {

    fecharModal_(
      "deleteCategoryModal"
    );

    window.categoriaExcluindoId =
      null;
  });


document
  .getElementById("cancelDeleteCategory")
  ?.addEventListener("click", () => {

    fecharModal_(
      "deleteCategoryModal"
    );

    window.categoriaExcluindoId =
      null;
  });

document.getElementById("categoriesList")?.addEventListener("click", e => {

  /* =============================================
     EDITAR CATEGORIA
     ============================================= */

  const btnEditar =
    e.target.closest(
      ".category-edit"
    );

  if (btnEditar) {

    abrirEdicaoCategoria_(
      btnEditar.dataset.id
    );

    return;
  }


  /* =============================================
     EXCLUIR CATEGORIA
     ============================================= */

  const btnExcluir =
    e.target.closest(
      ".category-delete"
    );

  if (btnExcluir) {

    abrirExclusaoCategoria_(
      btnExcluir.dataset.id
    );

    return;
  }


  /* =============================================
     ATIVAR / DESATIVAR CATEGORIA
     ============================================= */

  const btn =
    e.target.closest(
      ".category-toggle"
    );

  if (!btn) {
    return;
  }

  alterarStatusCadastro_(
    "categoria",
    btn.dataset.id,
    btn.dataset.active !== "true"
  );

});
document.getElementById("lotsList")?.addEventListener("click", e => {
  const btn = e.target.closest(".lot-toggle");
  if (!btn) return;
  alterarStatusCadastro_("lote", btn.dataset.id, btn.dataset.active !== "true");
});

/* =====================================================
   CONFIRMAR EXCLUSÃO DE CATEGORIA
   ===================================================== */

document
  .getElementById("confirmDeleteCategory")
  ?.addEventListener("click", async () => {

    const id =
      window.categoriaExcluindoId;

    if (!id) {

      notificar(
        "error",
        "CATEGORIA NÃO INFORMADA",
        "Não foi possível identificar a categoria."
      );

      return;
    }

    const s =
      getSession();

    if (!s?.token) {

      fecharModal_(
        "deleteCategoryModal"
      );

      return showLogin();
    }


    const btn =
      document.getElementById(
        "confirmDeleteCategory"
      );

    btn.disabled = true;

    btn.textContent =
      "EXCLUINDO...";


    try {

      await apiPost(
        "excluirCategoria",
        {
          token:
            s.token,

          id:
            id
        }
      );


      fecharModal_(
        "deleteCategoryModal"
      );

      window.categoriaExcluindoId =
        null;


      await carregarConfiguracoes_();


      notificar(
        "success",
        "CATEGORIA EXCLUÍDA",
        "A categoria foi excluída com sucesso."
      );


    } catch (err) {

      console.error(
        err
      );

      notificar(
        "error",
        "ERRO AO EXCLUIR CATEGORIA",
        err.message ||
        "Não foi possível excluir a categoria."
      );

    } finally {

      btn.disabled = false;

      btn.textContent =
        "EXCLUIR CATEGORIA";
    }

  });


document.getElementById("lotsList")?.addEventListener("click", async e => {

  /* =============================================
     EDITAR LOTE
     ============================================= */

  const btnEditar =
    e.target.closest(
      ".lot-edit"
    );

  if (btnEditar) {

    abrirEdicaoLote_(
      btnEditar.dataset.id
    );

    return;
  }


  /* =============================================
     EXCLUIR LOTE
     ============================================= */

  const btnExcluir =
    e.target.closest(
      ".lot-delete"
    );

  if (!btnExcluir) {
    return;
  }

  const loteId =
    btnExcluir.dataset.id;

  const lote =
    lotesConfig.find(
      l =>
        String(l.id) ===
        String(loteId)
    );

  const mensagem =
    document.getElementById(
      "deleteLotMessage"
    );

  if (mensagem) {

    mensagem.innerHTML =
      lote
        ? `Você está prestes a excluir o lote <strong>${esc(lote.nome)}</strong>.<br><strong>Esta ação não poderá ser desfeita.</strong>`
        : "Esta ação não poderá ser desfeita.";
  }

  window.loteExclusaoId =
    loteId;

  abrirModal_(
    "deleteLotModal"
  );

  return;
});

document
  .getElementById("confirmDeleteLot")
  ?.addEventListener(
    "click",
    async () => {

      const loteId =
        window.loteExclusaoId;

      if (!loteId) {
        return;
      }

      const btn =
        document.getElementById(
          "confirmDeleteLot"
        );

      const erro =
        document.getElementById(
          "deleteLotError"
        );

      try {

        const s =
          getSession();

        if (!s?.token) {

          throw new Error(
            "Sessão não encontrada."
          );
        }

        btn.disabled = true;
        btn.textContent =
          "EXCLUINDO...";

        if (erro) {
          erro.hidden = true;
        }

        await apiPost(
          "excluirLote",
          {
            token:
              s.token,

            id:
              loteId
          }
        );

        fecharModal_(
          "deleteLotModal"
        );

        window.loteExclusaoId =
          null;

        renderLotesConfig_();

        notificar(
          "success",
          "LOTE EXCLUÍDO",
          "O lote foi excluído com sucesso."
        );

      } catch (err) {

        console.error(err);

        if (erro) {

          erro.textContent =
            err.message ||
            "Erro ao excluir o lote.";

          erro.hidden = false;

        } else {

          notificar(
            "error",
            "ERRO AO EXCLUIR",
            err.message ||
            "Erro ao excluir o lote."
          );
        }

      } finally {

        btn.disabled = false;
        btn.textContent =
          "EXCLUIR LOTE";
      }

    }
  );

  document
  .getElementById("cancelDeleteLot")
  ?.addEventListener(
    "click",
    () => {

      window.loteExclusaoId =
        null;

      fecharModal_(
        "deleteLotModal"
      );

    }
  );

  document
  .getElementById("closeDeleteLotModal")
  ?.addEventListener(
    "click",
    () => {

      window.loteExclusaoId =
        null;

      fecharModal_(
        "deleteLotModal"
      );

    }
  );

document.getElementById("newCategoria")?.addEventListener("change", () => atualizarValorPorCategoria_("newCategoria", "newValor"));
document.getElementById("editCategoria")?.addEventListener("change", () => atualizarValorPorCategoria_("editCategoria", "editValor"));

registrationForm?.addEventListener("submit", async e => {
  e.preventDefault();

  const s = getSession();

  if (!s?.token) {
    showLogin();
    return;
  }

  const saveBtn = document.getElementById("saveRegistration");

  const payload = {
    token: s.token,
    nome: document.getElementById("newNome").value.trim(),
    cpf: document.getElementById("newCpf").value.trim(),
    email: document.getElementById("newEmail").value.trim(),
    telefone: document.getElementById("newTelefone").value.trim(),
    categoria: document.getElementById("newCategoria").value,
    valor: document.getElementById("newValor").value,
    observacao: document.getElementById("newObservacao").value.trim()
  };

  if (!payload.nome || !payload.cpf || !payload.email || !payload.categoria) {
    registrationError.textContent = "Preencha os campos obrigatórios.";
    registrationError.hidden = false;
    return;
  }

  if (!validarCpfCadastro_(payload.cpf)) {
    registrationError.textContent = "CPF inválido. Informe um CPF válido com 11 dígitos.";
    registrationError.hidden = false;
    document.getElementById("newCpf")?.focus();
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "CADASTRANDO...";
  registrationError.hidden = true;

  try {
    const criada = await apiPost("cadastrarInscricao", payload);

    fecharModalCadastro();

    notificar(
      "success",
      "INSCRIÇÃO CADASTRADA",
      `Inscrição #${String(criada.numeroInscricao).padStart(3, "0")} criada com sucesso.`
    );

    await carregarInscricoes();
    await carregarDashboard();

  } catch (err) {
    registrationError.textContent =
      err.message || "Não foi possível cadastrar a inscrição.";
    registrationError.hidden = false;

    notificar(
      "error",
      "ERRO AO CADASTRAR",
      err.message || "Não foi possível cadastrar a inscrição."
    );
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "CADASTRAR INSCRIÇÃO";
  }
});


/* =====================================================
   MODAL DE DETALHES
   ===================================================== */

const detailModal =
  document.getElementById("detailModal");

const detailLoading =
  document.getElementById("detailLoading");

const detailContent =
  document.getElementById("detailContent");

const fileUpload =
  document.getElementById("fileUpload");


function abrirModalDetalhes() {

  detailModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );
}


function fecharModalDetalhes() {

  detailModal.hidden = true;

  document.body.classList.remove(
    "modal-open"
  );

  if (fileUpload) {
    fileUpload.value = "";
  }
}


document
  .getElementById("closeDetail")
  .onclick =
    fecharModalDetalhes;


detailModal.addEventListener(
  "click",
  e => {

    if (e.target === detailModal) {
      fecharModalDetalhes();
    }
  }
);


document.addEventListener(
  "keydown",
  e => {

    if (
      e.key === "Escape" &&
      !detailModal.hidden
    ) {
      fecharModalDetalhes();
    }
  }
);


/* =====================================================
   ABRIR DETALHES
   ===================================================== */

async function detalhes(id) {

  const s =
    getSession();

  if (!s?.token) {
    return;
  }

  abrirModalDetalhes();

  detailLoading.hidden = false;

  detailContent.hidden = true;

  document
    .getElementById("detailTitle")
    .textContent =
      "#" +
      String(id).padStart(3, "0");

  try {

    const x =
      await apiGet(
        "inscricao",
        {
          token: s.token,
          id
        }
      );

    inscricaoAtual = x;

    preencherDetalhes(x);

    detailLoading.hidden = true;

    detailContent.hidden = false;

  } catch (e) {

    detailLoading.textContent =
      e.message ||
      "Não foi possível carregar a inscrição.";
  }
}


function valor(
  x,
  ...keys
) {

  for (const k of keys) {

    if (
      x?.[k] !== undefined &&
      x?.[k] !== null &&
      String(x[k]).trim() !== ""
    ) {
      return x[k];
    }
  }

  return "—";
}
function formatarDataNascimento_(data) {

  if (!data) {
    return "—";
  }

  const texto =
    String(data).trim();

  // Data ISO: 1993-12-17T02:00:00.000Z
  if (
    /^\d{4}-\d{2}-\d{2}T/.test(texto)
  ) {

    const partes =
      texto.substring(0, 10).split("-");

    return (
      partes[2] +
      "/" +
      partes[1] +
      "/" +
      partes[0]
    );
  }

  // Data simples: 1993-12-17
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(texto)
  ) {

    const partes =
      texto.split("-");

    return (
      partes[2] +
      "/" +
      partes[1] +
      "/" +
      partes[0]
    );
  }

  // Já está em DD/MM/AAAA
  if (
    /^\d{2}\/\d{2}\/\d{4}$/.test(texto)
  ) {
    return texto;
  }

  return texto;
}
function preencherDetalhes(x) {

  const n =
    valor(
      x,
      "numeroInscricao",
      "numero"
    );

  document
    .getElementById("detailTitle")
    .textContent =
      "#" +
      String(n).padStart(3, "0");

  document
    .getElementById("dNome")
    .textContent =
      valor(x, "nome", "atleta");

  document
    .getElementById("dCpf")
    .textContent =
      valor(x, "cpf");

  document
    .getElementById("dCategoria")
    .textContent =
      valor(x, "categoria");

 const nascimento =
  valor(
    x,
    "dataNascimento",
    "nascimento"
  );

document
  .getElementById("dNascimento")
  .textContent =
    nascimento !== "—"
      ? nascimento.substring(0, 10).split("-").reverse().join("/")
      : "—";

  document
    .getElementById("dCidade")
    .textContent =
      valor(x, "cidade");

  document
    .getElementById("dEmail")
    .textContent =
      valor(x, "email");

  document
    .getElementById("dTelefone")
    .textContent =
      valor(
        x,
        "telefone",
        "whatsapp"
      );

  document
    .getElementById("dEmergencia")
    .textContent =
      valor(
        x,
        "contatoEmergencia",
        "emergencia"
      );

  const pag =
    valor(x, "pagamento") ||
    "Pendente";

  const stat =
    valor(
      x,
      "statusInscricao",
      "status"
    ) ||
    "Pendente";

  const p =
    document.getElementById(
      "dPagamento"
    );

  const st =
    document.getElementById(
      "dStatus"
    );

  p.textContent = pag;
  p.className =
    "pill " +
    classe(pag);

  st.textContent = stat;
  st.className =
    "pill " +
    classe(stat);

  const setDetail = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value == null || String(value).trim() === "" ? "—" : String(value);
  };

  setDetail("dValor", moeda(Number(x.valor || 0)));
  setDetail("dDataInscricao", valor(x, "dataInscricao"));
  setDetail("dOrderNsu", valor(x, "orderNsu", "order_nsu"));
  setDetail("dFormaPagamento", valor(x, "formaPagamento", "forma_pagamento"));
  setDetail("dTransactionNsu", valor(x, "transactionNsu", "transaction_nsu"));
  setDetail("dDataPagamento", valor(x, "dataPagamento", "data_pagamento"));
  setDetail("dObservacao", valor(x, "observacao"));

  const checkoutUrl = valor(x, "checkoutUrl", "checkout_url");
  const checkoutEl = document.getElementById("dCheckoutUrl");
  if (checkoutEl) {
    checkoutEl.innerHTML = checkoutUrl !== "—"
      ? `<a href="${esc(checkoutUrl)}" target="_blank" rel="noopener noreferrer">ABRIR CHECKOUT</a>`
      : "—";
  }

  const receiptUrl = valor(x, "comprovanteUrl", "receiptUrl", "receipt_url");
  const receiptEl = document.getElementById("dComprovante");
  if (receiptEl) {
    receiptEl.innerHTML = receiptUrl !== "—"
      ? `<a href="${esc(receiptUrl)}" target="_blank" rel="noopener noreferrer" class="action">🧾 VER COMPROVANTE</a>`
      : "—";
  }

  const validateBtn =
    document.getElementById("validateAction");

  if (validateBtn) {
    const pago =
      String(pag).trim().toLowerCase() === "pago";

    const confirmado =
      String(stat).trim().toLowerCase() === "confirmado";

    const arquivos =
      Array.isArray(x.arquivos)
        ? x.arquivos
        : (Array.isArray(x.documentos) ? x.documentos : []);

    const temComprovante = arquivos.length > 0;

    validateBtn.disabled =
      confirmado || !pago || !temComprovante;

    validateBtn.textContent =
      confirmado
        ? "INSCRIÇÃO VALIDADA ✓"
        : "VALIDAR INSCRIÇÃO";

    validateBtn.title =
      confirmado
        ? "Esta inscrição já está confirmada."
        : !pago
          ? "A inscrição só pode ser validada quando o pagamento estiver como Pago."
          : !temComprovante
            ? "Anexe pelo menos um comprovante antes de validar a inscrição."
            : "Pagamento e comprovante identificados. Clique para confirmar a inscrição.";
  }

  // ALTERAR STATUS só fica disponível para inscrições já
  // Confirmadas ou Canceladas. Inscrições Pendentes seguem
  // o fluxo de pagamento + comprovante + validação.
  const statusBtn = document.getElementById("statusAction");
  if (statusBtn) {
    const statusNormalizado = String(stat).trim().toLowerCase();
    const podeAlterarStatus =
      statusNormalizado === "confirmado" ||
      statusNormalizado === "cancelado";

    statusBtn.disabled = !podeAlterarStatus;
    statusBtn.title = podeAlterarStatus
      ? "Alterar o status entre Confirmado e Cancelado."
      : "O status só pode ser alterado depois que a inscrição for Confirmada ou Cancelada.";
  }

  renderFiles(
    x.arquivos ||
    x.documentos ||
    []
  );
}


/* =====================================================
   LISTA DE ARQUIVOS
   ===================================================== */

function renderFiles(files) {

  const list =
    document.getElementById("fileList");

  if (
    !Array.isArray(files) ||
    !files.length
  ) {

    list.innerHTML =
      `
        <div class="empty-files">
          Nenhum arquivo vinculado.
        </div>
      `;

    return;
  }


  list.innerHTML =
    files.map(f => {

      const nome =
        esc(
          f.nome ||
          f.name ||
          "Arquivo"
        );

      // Sempre monta o download direto pelo ID do arquivo.
      // Assim, mesmo que o backend tenha uma URL antiga salva,
      // o botão nunca abre o visualizador do Google Drive.
      const fileId =
        f.fileId ||
        f.id ||
        "";

      const url =
        fileId
          ? `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`
          : (f.url || "");


      const tipo =
        String(
          f.tipo ||
          f.mimeType ||
          ""
        )
          .split("/")
          .pop()
          .toUpperCase();


      return `

        <div class="file-item">

          <div class="file-meta">

            <div class="file-icon">
              ${esc(tipo || "DOC")}
            </div>

            <div>

              <b title="${nome}">
                ${nome}
              </b>

              <small>
                Comprovante da inscrição
              </small>

            </div>

          </div>


          ${
            url

              ? `

                <a
                  class="file-open file-download"
                  href="${esc(url)}"
                  download
                >
                  BAIXAR COMPROVANTE ↓
                </a>

              `

              : `

                <span class="file-open">
                  SEM LINK
                </span>

              `
          }

        </div>

      `;

    }).join("");
}

/* =====================================================
   CONVERTER ARQUIVO PARA BASE64
   ===================================================== */

function bytesToBase64(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload =
        () =>
          resolve(
            String(reader.result)
              .split(",")[1]
          );

      reader.onerror = reject;

      reader.readAsDataURL(file);
    }
  );
}


/* =====================================================
   UPLOAD DE ARQUIVO - V4
   ===================================================== */

fileUpload?.addEventListener(
  "change",
  async () => {

    const file =
      fileUpload.files?.[0];

    const s =
      getSession();

    if (
      !file ||
      !s?.token ||
      !inscricaoAtual
    ) {
      return;
    }


    /* -------------------------------
       VALIDAÇÃO DE TAMANHO
       ------------------------------- */

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      notificar(
        "warning",
        "ARQUIVO MUITO GRANDE",
        "Envie um arquivo de até 5 MB."
      );

      fileUpload.value = "";

      return;
    }


    /* -------------------------------
       VALIDAÇÃO DE FORMATO
       ------------------------------- */

    const allowed = [

      "application/pdf",

      "image/jpeg",

      "image/png",

      "image/webp"

    ];

    if (
      file.type &&
      !allowed.includes(file.type)
    ) {

      notificar(
        "warning",
        "FORMATO NÃO PERMITIDO",
        "Use PDF, JPG, PNG ou WEBP."
      );

      fileUpload.value = "";

      return;
    }


    const btn =
      document.querySelector(
        ".upload-btn"
      );

    const old =
      btn.textContent;


    btn.textContent =
      "ENVIANDO...";

    btn.style.pointerEvents =
      "none";


    try {

      const base64 =
        await bytesToBase64(file);

      const id =
        valor(
          inscricaoAtual,
          "numeroInscricao",
          "numero"
        );


      await apiPost(
        "uploadArquivo",
        {

          token: s.token,

          id: id,

          nome: file.name,

          mimeType:
            file.type ||
            "application/octet-stream",

          arquivoBase64:
            base64
        }
      );

      // Regra de negócio: comprovante anexado = pagamento Pago.
      // Fazemos a chamada também no frontend para manter o comportamento
      // correto mesmo se o Web App publicado ainda estiver com a versão
      // anterior do endpoint de upload. O backend atualizado continua
      // validando que existe comprovante antes de aceitar Pago.
      await apiPost(
        "alterarPagamento",
        {
          token: s.token,
          id: id,
          pagamento: "Pago"
        }
      );


      /* -----------------------------
         ATUALIZA DETALHES
         ----------------------------- */

      const refreshed =
        await apiGet(
          "inscricao",
          {
            token: s.token,
            id
          }
        );

      inscricaoAtual =
        refreshed;

      preencherDetalhes(
        refreshed
      );


      const numero =
        "#" +
        String(id).padStart(3, "0");

      const atleta =
        valor(
          refreshed,
          "nome",
          "atleta"
        );


      /* -----------------------------
         NOTIFICAÇÃO BONITA
         ----------------------------- */

      notificar(
        "success",
        "ARQUIVO ENVIADO ✓",
        `Comprovante salvo com sucesso na inscrição ${numero} de ${atleta}.`
      );


    } catch (e) {

      console.error(e);

      notificar(
        "error",
        "ERRO NO ENVIO",
        e.message ||
        "Não foi possível enviar o arquivo. Tente novamente."
      );

    } finally {

      btn.textContent = old;

      btn.style.pointerEvents = "";

      fileUpload.value = "";
    }
  }
);


/* =====================================================
   AÇÕES DO MODAL
   ===================================================== */

// ALTERAR PAGAMENTO no modal de detalhes.
// Usa onclick direto e uma função global para evitar perda do handler
// em recarregamentos/versões antigas do DOM.
async function abrirAlteracaoPagamento() {
  try {
    if (!inscricaoAtual) {
      notificar('warning', 'INSCRIÇÃO NÃO CARREGADA', 'Abra os detalhes da inscrição novamente.');
      return;
    }

    const id = valor(inscricaoAtual, 'numeroInscricao', 'numero');
    if (!id) {
      notificar('error', 'INSCRIÇÃO INVÁLIDA', 'Não foi possível identificar o número da inscrição.');
      return;
    }

    const atual = String(inscricaoAtual.pagamento || 'Pendente');

  abrirSeletorStatus_(
    'Alterar pagamento',
    atual,
    ['Pendente', 'Cancelado'],
    async novoPagamento => {
      const s = getSession();
      if (!s?.token) {
        showLogin();
        throw new Error('Sessão expirada.');
      }

      await apiPost('alterarPagamento', {
        token: s.token,
        id,
        pagamento: novoPagamento
      });

      const refreshed = await apiGet('inscricao', { token: s.token, id });
      inscricaoAtual = refreshed;
      preencherDetalhes(refreshed);

      notificar(
        'success',
        'PAGAMENTO ATUALIZADO',
        `Pagamento da inscrição #${String(id).padStart(3, '0')} alterado para ${novoPagamento}.`
      );

      await carregarInscricoes();
      atualizarCardsPagamentos(inscricoes);
      renderPagamentos();
      await carregarDashboard();
    }
  );
  } catch (e) {
    console.error('Erro ao abrir alteração de pagamento:', e);
    notificar('error', 'ERRO AO ABRIR PAGAMENTO', e.message || 'Não foi possível abrir a alteração de pagamento.');
  }
}

window.abrirAlteracaoPagamento = abrirAlteracaoPagamento;

// Fallback de eventos para os botões do modal.
// O botão ALTERAR PAGAMENTO também possui onclick inline no HTML para
// garantir funcionamento mesmo quando o conteúdo do modal for recriado.
document.addEventListener('click', async (event) => {
  const target = event.target;
  const paymentButton = target && target.closest ? target.closest('#paymentAction') : null;
  const statusButton = target && target.closest ? target.closest('#statusAction') : null;

  if (paymentButton) {
    event.preventDefault();
    event.stopPropagation();
    // O onclick inline já chama a função; não executamos novamente.
    return;
  }

  if (statusButton) {
    event.preventDefault();
    event.stopPropagation();
    await abrirAlteracaoStatusDetalhes();
  }
});

async function abrirAlteracaoStatusDetalhes() {
  if (!inscricaoAtual) {
    notificar('warning', 'INSCRIÇÃO NÃO CARREGADA', 'Abra os detalhes da inscrição novamente.');
    return;
  }

  const atual = String(inscricaoAtual.statusInscricao || inscricaoAtual.status || 'Pendente');
  const normalizado = atual.trim().toLowerCase();

  if (normalizado !== 'confirmado' && normalizado !== 'cancelado') {
    notificar('warning', 'STATUS NÃO DISPONÍVEL', 'O status só pode ser alterado quando a inscrição estiver Confirmada ou Cancelada.');
    return;
  }

  const id = valor(inscricaoAtual, 'numeroInscricao', 'numero');
  abrirSeletorStatus_('Alterar status', atual, ['Confirmado', 'Cancelado'], async novoStatus => {
    const s = getSession();
    if (!s?.token) {
      showLogin();
      throw new Error('Sessão expirada.');
    }

    const atualizado = await apiPost('alterarStatus', {
      token: s.token,
      id,
      status: novoStatus
    });

    // O backend pode retornar apenas o resultado da alteração;
    // por isso recarregamos a inscrição para manter todos os dados corretos.
    const refreshed = await apiGet('inscricao', { token: s.token, id });
    inscricaoAtual = refreshed;
    preencherDetalhes(refreshed);

    notificar('success', 'STATUS ATUALIZADO', `Inscrição #${String(id).padStart(3, '0')} alterada para ${novoStatus}.`);
    await carregarInscricoes();
    await carregarDashboard();
  });
}

window.abrirAlteracaoStatusDetalhes = abrirAlteracaoStatusDetalhes;

function abrirEdicao() {

  if (!inscricaoAtual) return;

  document.getElementById("editNome").value =
    valor(inscricaoAtual, "nome", "atleta") === "—"
      ? ""
      : valor(inscricaoAtual, "nome", "atleta");

  document.getElementById("editCpf").value =
    valor(inscricaoAtual, "cpf") === "—"
      ? ""
      : valor(inscricaoAtual, "cpf");

  document.getElementById("editEmail").value =
    valor(inscricaoAtual, "email") === "—"
      ? ""
      : valor(inscricaoAtual, "email");

  document.getElementById("editTelefone").value =
    valor(inscricaoAtual, "telefone", "whatsapp") === "—"
      ? ""
      : valor(inscricaoAtual, "telefone", "whatsapp");

  const categoria = valor(inscricaoAtual, "categoria");
  preencherSelectCategorias_("editCategoria", categoria === "—" ? "" : categoria);
  const categoriaAtual = document.getElementById("editCategoria").value;
  const categoriaConfig = categoriasConfig.find(c => c.nome === categoriaAtual);
  const valorInscricao = categoriaConfig ? Number(categoriaConfig.valor) : Number(inscricaoAtual.valor || 0);
  document.getElementById("editValor").value =
    Number.isFinite(valorInscricao) ? valorInscricao.toFixed(2) : "0.00";

  document.getElementById("editObservacao").value =
    inscricaoAtual.observacao || "";

  document.getElementById("editPanel").hidden = false;
  document.getElementById("editAction").disabled = true;

  document.getElementById("editPanel").scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}


document
  .getElementById("editAction")
  .onclick = abrirEdicao;


document
  .getElementById("cancelEditAction")
  .onclick = () => {
    document.getElementById("editPanel").hidden = true;
    document.getElementById("editAction").disabled = false;
  };


document
  .getElementById("saveEditAction")
  .onclick = async () => {

    if (!inscricaoAtual) return;

    const s = getSession();
    if (!s?.token) {
      showLogin();
      return;
    }

    const btn = document.getElementById("saveEditAction");
    const old = btn.textContent;
    btn.disabled = true;
    btn.textContent = "SALVANDO...";

    try {

      const id = valor(
        inscricaoAtual,
        "numeroInscricao",
        "numero"
      );

      const atualizado = await apiPost(
        "editarInscricao",
        {
          token: s.token,
          id,
          nome: document.getElementById("editNome").value.trim(),
          cpf: document.getElementById("editCpf").value.trim(),
          email: document.getElementById("editEmail").value.trim(),
          telefone: document.getElementById("editTelefone").value.trim(),
          categoria: document.getElementById("editCategoria").value,
          valor: document.getElementById("editValor").value,
          observacao: document.getElementById("editObservacao").value.trim()
        }
      );

      inscricaoAtual = atualizado;
      preencherDetalhes(atualizado);

      document.getElementById("editPanel").hidden = true;
      document.getElementById("editAction").disabled = false;

      notificar(
        "success",
        "INSCRIÇÃO ATUALIZADA",
        "Os dados da inscrição foram salvos com sucesso."
      );

      await carregarInscricoes();
      await carregarDashboard();

    } catch (e) {

      notificar(
        "error",
        "ERRO AO SALVAR",
        e.message || "Não foi possível salvar as alterações."
      );

    } finally {
      btn.disabled = false;
      btn.textContent = old;
    }
  };


/* =====================================================
   VALIDAR INSCRIÇÃO
   ===================================================== */

document
  .getElementById("validateAction")
  .onclick = async () => {

    if (!inscricaoAtual) return;

    const s = getSession();
    if (!s?.token) {
      showLogin();
      return;
    }

    const pagamento = String(
      inscricaoAtual.pagamento || ""
    ).trim().toLowerCase();

    if (pagamento !== "pago") {
      notificar(
        "warning",
        "PAGAMENTO PENDENTE",
        "A inscrição só pode ser validada quando o pagamento estiver como Pago."
      );
      return;
    }

    const arquivos =
      Array.isArray(inscricaoAtual.arquivos)
        ? inscricaoAtual.arquivos
        : (Array.isArray(inscricaoAtual.documentos) ? inscricaoAtual.documentos : []);

    if (!arquivos.length) {
      notificar(
        "warning",
        "COMPROVANTE NECESSÁRIO",
        "Anexe pelo menos um comprovante antes de validar a inscrição."
      );
      return;
    }

    const btn = document.getElementById("validateAction");
    const old = btn.textContent;
    btn.disabled = true;
    btn.textContent = "VALIDANDO...";

    try {

      const id = valor(
        inscricaoAtual,
        "numeroInscricao",
        "numero"
      );

      const resultado = await apiPost(
        "validarInscricao",
        {
          token: s.token,
          id
        }
      );

      inscricaoAtual = resultado;
      preencherDetalhes(resultado);

      notificar(
        "success",
        "INSCRIÇÃO VALIDADA ✓",
        `A inscrição #${String(id).padStart(3, "0")} foi confirmada porque o pagamento está como Pago.`
      );

      await carregarInscricoes();
      await carregarDashboard();

    } catch (e) {

      notificar(
        "error",
        "ERRO NA VALIDAÇÃO",
        e.message || "Não foi possível validar a inscrição."
      );

    } finally {
      btn.disabled = false;
      btn.textContent = old;
    }
  };


/* =====================================================
   ENVIO DE COMPROVANTE PELO MODAL DE PAGAMENTOS
   ===================================================== */

async function enviarComprovantePeloPagamento_(file, id, overlay) {
  const s = getSession();
  if (!s?.token) {
    showLogin();
    throw new Error('Sessão expirada.');
  }

  if (!file) throw new Error('Arquivo não informado.');
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Arquivo muito grande. Envie um arquivo de até 5 MB.');
  }

  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (file.type && !allowed.includes(file.type)) {
    throw new Error('Formato não permitido. Use PDF, JPG, PNG ou WEBP.');
  }

  const uploadBtn = overlay?.querySelector('.payment-upload-comprovante');
  const oldText = uploadBtn?.textContent || '+ INSERIR COMPROVANTE';
  if (uploadBtn) {
    uploadBtn.textContent = 'ENVIANDO...';
    uploadBtn.style.pointerEvents = 'none';
  }

  try {
    const base64 = await bytesToBase64(file);
    await apiPost('uploadArquivo', {
      token: s.token,
      id,
      nome: file.name,
      mimeType: file.type || 'application/octet-stream',
      arquivoBase64: base64
    });

    // Regra: comprovante enviado => pagamento Pago.
    // Fazemos a atualização também pelo endpoint de pagamento para
    // garantir o comportamento mesmo quando o Web App ainda estiver
    // usando uma versão anterior do backend. O backend novo valida
    // novamente que existe comprovante antes de aceitar Pago.
    await apiPost('alterarPagamento', {
      token: s.token,
      id,
      pagamento: 'Pago'
    });

    const refreshed = await apiGet('inscricao', { token: s.token, id });
    inscricaoAtual = refreshed;
    preencherDetalhes(refreshed);

    notificar('success', 'PAGAMENTO CONFIRMADO', 'Comprovante enviado. O pagamento foi alterado automaticamente para Pago.');

    await carregarInscricoes();
    if (typeof atualizarCardsPagamentos === 'function') atualizarCardsPagamentos(inscricoes);
    if (typeof renderPagamentos === 'function') renderPagamentos();
    await carregarDashboard();

    overlay?.remove();
    document.body.classList.remove('modal-open');
  } finally {
    if (uploadBtn) {
      uploadBtn.textContent = oldText;
      uploadBtn.style.pointerEvents = '';
    }
  }
}

/* =====================================================
   SELETOR DE STATUS
   ===================================================== */

function abrirSeletorStatus_(titulo, atual, opcoes, onConfirmar) {
  const antigo = document.getElementById("statusChoiceModal");
  if (antigo) antigo.remove();

  const overlay = document.createElement("div");
  overlay.id = "statusChoiceModal";
  overlay.className = "choice-backdrop";
  const isPagamento = /pagamento/i.test(titulo);
  const idAtual = inscricaoAtual ? valor(inscricaoAtual, "numeroInscricao", "numero") : "";

  overlay.innerHTML = `
    <div class="choice-modal" role="dialog" aria-modal="true">
      <div class="choice-head">
        <div>
          <span>ALTERAÇÃO</span>
          <h3>${escapeHtml_(titulo)}</h3>
        </div>
        <button type="button" class="choice-close" aria-label="Fechar">×</button>
      </div>
      <div class="choice-body">
        <small>STATUS ATUAL</small>
        <strong class="choice-current">${escapeHtml_(atual)}</strong>
        <div class="choice-options">
          ${opcoes.map(op => `
            <button type="button" class="choice-option ${String(op).toLowerCase() === String(atual).toLowerCase() ? 'selected' : ''}" data-value="${escapeHtml_(op)}">
              <i class="choice-dot"></i>
              <strong>${escapeHtml_(op)}</strong>
              ${String(op).toLowerCase() === String(atual).toLowerCase() ? '<em>ATUAL</em>' : ''}
            </button>
          `).join('')}
        </div>

        ${isPagamento ? `
          <div class="payment-proof-box">
            <div>
              <small>COMPROVANTE</small>
              <p>Anexe o comprovante para registrar o pagamento. Ao enviar por aqui, o pagamento será marcado automaticamente como <b>Pago</b>.</p>
            </div>
            <label class="payment-upload-comprovante" role="button">
              + INSERIR COMPROVANTE
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" hidden>
            </label>
          </div>
        ` : ''}
      </div>
      <div class="choice-actions">
        <button type="button" class="modal-secondary choice-cancel">CANCELAR</button>
        <button type="button" class="modal-primary choice-confirm">CONFIRMAR</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  let selecionado = atual;
  const confirmBtn = overlay.querySelector('.choice-confirm');
  const uploadLabel = overlay.querySelector('.payment-upload-comprovante');
  const uploadInput = uploadLabel?.querySelector('input');

  overlay.querySelectorAll('.choice-option').forEach(btn => {
    btn.onclick = () => {
      selecionado = btn.dataset.value;
      overlay.querySelectorAll('.choice-option').forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected');
    };
  });

  overlay.querySelector('.choice-close').onclick = () => overlay.remove();
  overlay.querySelector('.choice-cancel').onclick = () => overlay.remove();

  uploadLabel?.addEventListener('click', e => {
    if (e.target === uploadInput) return;
    uploadInput.click();
  });

  uploadInput?.addEventListener('change', async () => {
    const file = uploadInput.files?.[0];
    if (!file) return;
    try {
      await enviarComprovantePeloPagamento_(file, idAtual, overlay);
    } catch (e) {
      notificar('error', 'ERRO NO COMPROVANTE', e.message || 'Não foi possível enviar o comprovante.');
      uploadInput.value = '';
    }
  });

  confirmBtn.onclick = async () => {
    if (!selecionado) return;

    // Nunca permite marcar como Pago sem comprovante.
    if (isPagamento && String(selecionado).toLowerCase() === 'pago') {
      const arquivos = Array.isArray(inscricaoAtual?.arquivos)
        ? inscricaoAtual.arquivos
        : (Array.isArray(inscricaoAtual?.documentos) ? inscricaoAtual.documentos : []);
      if (!arquivos.length) {
        notificar('warning', 'COMPROVANTE NECESSÁRIO', 'Para marcar o pagamento como Pago, anexe um comprovante primeiro.');
        return;
      }
    }

    confirmBtn.disabled = true;
    confirmBtn.textContent = "SALVANDO...";
    try {
      await onConfirmar(selecionado);
      overlay.remove();
    } catch (e) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "CONFIRMAR";
    }
  };
}


/* =====================================================
   PAGAMENTOS
   ===================================================== */

function atualizarCardsPagamentos(lista) {
  const pendentes = lista.filter(x => String(x.pagamento || "Pendente").toLowerCase() === "pendente");
  const pagos = lista.filter(x => String(x.pagamento || "Pendente").toLowerCase() === "pago");
  const valor = lista.length && Number(lista.find(x => Number(x.valor || 0) > 0)?.valor || 0) || 0;

  const total = arr => arr.reduce((s, x) => s + Number(x.valor || 0), 0);

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  set("paymentPendingCount", pendentes.length);
  set("paymentPendingValue", moeda(total(pendentes)));
  set("paymentPaidCount", pagos.length);
  set("paymentPaidValue", moeda(total(pagos)));
  set("paymentUnitValue", moeda(valor));
}

function renderPagamentos() {
  const body = document.getElementById("paymentRows");
  if (!body) return;

  const q = (document.getElementById("paymentSearch")?.value || "").toLowerCase().trim();
  const filtro = document.getElementById("paymentFilter")?.value || "todos";

  const rows = inscricoes.filter(x => {
    const texto = [x.numeroInscricao, x.nome, x.cpf, x.categoria].join(" ").toLowerCase();
    const pagamento = String(x.pagamento || "Pendente").toLowerCase();
    return (!q || texto.includes(q)) && (filtro === "todos" || pagamento === filtro);
  });

  body.innerHTML = rows.map(x => {
    const id = esc(x.numeroInscricao);
    const pagamento = String(x.pagamento || "Pendente");
    return `
      <tr>
        <td><b>#${id}</b></td>
        <td><b>${esc(x.nome)}</b><br><small>${esc(x.cpf)}</small></td>
        <td>${esc(x.categoria)}</td>
        <td><b>${moeda(x.valor)}</b></td>
        <td><span class="pill ${classe(pagamento)}">${esc(pagamento)}</span></td>
        <td>${esc(x.formaPagamento || "—")}</td>
        <td>${esc(x.dataPagamento || "—")}</td>
        <td>${(x.receiptUrl || x.comprovanteUrl) ? `<a href="${esc(x.receiptUrl || x.comprovanteUrl)}" target="_blank" rel="noopener noreferrer" class="action">🧾 VER</a>` : "—"}</td>
        <td class="payment-actions">
          <button class="action payment-details" data-id="${id}">DETALHES</button>
          <button class="action payment-change" data-id="${id}">ALTERAR</button>
        </td>
      </tr>`;
  }).join("") || `
    <tr><td colspan="9" style="text-align:center;padding:30px">Nenhum pagamento encontrado.</td></tr>`;

  body.querySelectorAll(".payment-details").forEach(b => {
    b.onclick = () => detalhes(b.dataset.id);
  });

  body.querySelectorAll(".payment-change").forEach(b => {
    b.onclick = () => alterarPagamentoDireto(b.dataset.id);
  });
}

async function alterarPagamentoDireto(id) {
  const item = inscricoes.find(x => String(x.numeroInscricao) === String(id));
  if (!item) return;

  const atual = String(item.pagamento || "Pendente");

  abrirSeletorStatus_(
    "Alterar pagamento",
    atual,
    ["Pendente", "Cancelado"],
    async novoPagamento => {
      const s = getSession();
      if (!s?.token) {
        showLogin();
        throw new Error("Sessão expirada.");
      }

      try {
        await apiPost("alterarPagamento", {
          token: s.token,
          id,
          pagamento: novoPagamento
        });

        notificar(
          "success",
          "PAGAMENTO ATUALIZADO",
          `Pagamento da inscrição #${String(id).padStart(3, "0")} alterado para ${novoPagamento}.`
        );

        await carregarInscricoes();
        atualizarCardsPagamentos(inscricoes);
        renderPagamentos();
        await carregarDashboard();
      } catch (e) {
        notificar("error", "ERRO NO PAGAMENTO", e.message || "Não foi possível alterar o pagamento.");
        throw e;
      }
    }
  );
}

async function carregarPagamentos() {
  const s = getSession();
  if (!s?.token) {
    showLogin();
    return;
  }

  const body = document.getElementById("paymentRows");
  if (body) {
    body.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:30px">Carregando pagamentos...</td></tr>';
  }

  try {
    const d = await apiGet("inscricoes", { token: s.token });
    inscricoes = d.inscricoes || [];
    atualizarCardsPagamentos(inscricoes);
    renderPagamentos();
  } catch (e) {
    if (/sessão/i.test(e.message || "")) {
      clearSession();
      showLogin();
      return;
    }
    notificar("error", "ERRO AO CARREGAR", e.message || "Não foi possível carregar os pagamentos.");
  }
}

document.getElementById("paymentSearch")?.addEventListener("input", renderPagamentos);
document.getElementById("paymentFilter")?.addEventListener("change", renderPagamentos);

/* =====================================================
   FILTROS
   ===================================================== */

document
  .getElementById("search")
  .oninput =
    render;


document
  .getElementById("filter")
  .onchange =
    render;


document
  .getElementById("categoryFilter")
  .onchange =
    render;


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

(async () => {

  const s =
    getSession();

  if (s?.token) {

    showApp(s);

    await carregarDashboard();
    await carregarConfiguracoes_();

  } else {

    showLogin();
  }

})();

/* =====================================================
   USUÁRIOS ADMINISTRATIVOS
   ===================================================== */

let usuariosAdmin = [];
let usuarioSenhaAtual = null;

const userModal = document.getElementById("userModal");
const passwordModal = document.getElementById("passwordModal");
const userForm = document.getElementById("userForm");
const passwordForm = document.getElementById("passwordForm");

function escUser(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function carregarUsuarios() {
  const s = getSession();
  if (!s?.token) {
    showLogin();
    return;
  }

  const body = document.getElementById("usersRows");
  if (body) {
    body.innerHTML = '<tr><td colspan="5" class="table-empty">Carregando usuários...</td></tr>';
  }

  try {
    const d = await apiGet("usuarios", { token: s.token });
    usuariosAdmin = d.usuarios || [];
    renderUsuarios();
  } catch (e) {
    if (/sessão/i.test(e.message || "")) {
      clearSession();
      showLogin();
      return;
    }
    notificar("error", "ERRO AO CARREGAR", e.message || "Não foi possível carregar os usuários.");
  }
}

function renderUsuarios() {
  const body = document.getElementById("usersRows");
  if (!body) return;

  if (!usuariosAdmin.length) {
    body.innerHTML = '<tr><td colspan="5" class="table-empty">Nenhum usuário cadastrado.</td></tr>';
    return;
  }

  body.innerHTML = usuariosAdmin.map(u => {
    const ativo = String(u.ativo || "").toUpperCase() === "SIM";
    return `
      <tr>
        <td><strong>${escUser(u.nome)}</strong></td>
        <td>${escUser(u.email)}</td>
        <td><span class="user-status ${ativo ? "active" : "inactive"}">${ativo ? "ATIVO" : "INATIVO"}</span></td>
        <td>${escUser(u.criadoEm || "")}</td>
        <td class="user-row-actions">
          <button type="button" class="table-action" data-password-user="${escUser(u.id)}">ALTERAR SENHA</button>
        </td>
      </tr>
    `;
  }).join("");

  body.querySelectorAll("[data-password-user]").forEach(btn => {
    btn.addEventListener("click", () => abrirModalSenha(btn.dataset.passwordUser));
  });
}

function abrirModalUsuario() {
  if (!userModal || !userForm) return;
  userForm.reset();
  document.getElementById("userError").hidden = true;
  document.getElementById("userModalEyebrow").textContent = "NOVO USUÁRIO";
  document.getElementById("userModalTitle").textContent = "Cadastrar administrador";
  document.getElementById("saveUser").textContent = "CRIAR USUÁRIO";
  userModal.hidden = false;
  document.body.classList.add("modal-open");
  setTimeout(() => document.getElementById("userNome")?.focus(), 50);
}

function fecharModalUsuario() {
  if (!userModal) return;
  userModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function abrirModalSenha(id) {
  const u = usuariosAdmin.find(x => String(x.id) === String(id));
  if (!u || !passwordModal) return;

  usuarioSenhaAtual = u;
  passwordForm.reset();

  document.getElementById("passwordUserName").textContent = u.nome || "—";
  document.getElementById("passwordUserEmail").textContent = u.email || "—";
  document.getElementById("passwordError").hidden = true;

  passwordModal.hidden = false;
  document.body.classList.add("modal-open");
  setTimeout(() => document.getElementById("newUserPassword")?.focus(), 50);
}

function fecharModalSenha() {
  if (!passwordModal) return;
  passwordModal.hidden = true;
  usuarioSenhaAtual = null;
  document.body.classList.remove("modal-open");
}

document.getElementById("newUserBtn")?.addEventListener("click", abrirModalUsuario);
document.getElementById("closeUserModal")?.addEventListener("click", fecharModalUsuario);
document.getElementById("cancelUser")?.addEventListener("click", fecharModalUsuario);
document.getElementById("closePasswordModal")?.addEventListener("click", fecharModalSenha);
document.getElementById("cancelPassword")?.addEventListener("click", fecharModalSenha);

userModal?.addEventListener("click", e => {
  if (e.target === userModal) fecharModalUsuario();
});
passwordModal?.addEventListener("click", e => {
  if (e.target === passwordModal) fecharModalSenha();
});

userForm?.addEventListener("submit", async e => {
  e.preventDefault();

  const s = getSession();
  if (!s?.token) {
    showLogin();
    return;
  }

  const senha = document.getElementById("userSenha").value;
  const confirm = document.getElementById("userSenhaConfirm").value;
  const err = document.getElementById("userError");

  if (senha.length < 6) {
    err.textContent = "A senha deve ter pelo menos 6 caracteres.";
    err.hidden = false;
    return;
  }

  if (senha !== confirm) {
    err.textContent = "As senhas não conferem.";
    err.hidden = false;
    return;
  }

  const btn = document.getElementById("saveUser");
  const old = btn.textContent;
  btn.disabled = true;
  btn.textContent = "SALVANDO...";

  try {
    await apiPost("criarUsuario", {
      token: s.token,
      nome: document.getElementById("userNome").value.trim(),
      email: document.getElementById("userEmailInput").value.trim(),
      senha
    });

    fecharModalUsuario();
    await carregarUsuarios();

    notificar(
      "success",
      "USUÁRIO CRIADO",
      "O novo administrador já pode acessar o painel."
    );
  } catch (e) {
    err.textContent = e.message || "Não foi possível criar o usuário.";
    err.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = old;
  }
});

passwordForm?.addEventListener("submit", async e => {
  e.preventDefault();

  const s = getSession();
  if (!s?.token) {
    showLogin();
    return;
  }

  if (!usuarioSenhaAtual) return;

  const senha = document.getElementById("newUserPassword").value;
  const confirm = document.getElementById("newUserPasswordConfirm").value;
  const err = document.getElementById("passwordError");

  if (senha.length < 6) {
    err.textContent = "A senha deve ter pelo menos 6 caracteres.";
    err.hidden = false;
    return;
  }

  if (senha !== confirm) {
    err.textContent = "As senhas não conferem.";
    err.hidden = false;
    return;
  }

  const btn = document.getElementById("savePassword");
  const old = btn.textContent;
  btn.disabled = true;
  btn.textContent = "ALTERANDO...";

  try {
    await apiPost("alterarSenhaUsuario", {
      token: s.token,
      id: usuarioSenhaAtual.id,
      senha
    });

    fecharModalSenha();

    notificar(
      "success",
      "SENHA ALTERADA",
      "A nova senha foi salva com sucesso."
    );
  } catch (e) {
    err.textContent = e.message || "Não foi possível alterar a senha.";
    err.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = old;
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (userModal && !userModal.hidden) fecharModalUsuario();
    if (passwordModal && !passwordModal.hidden) fecharModalSenha();
  }
});
