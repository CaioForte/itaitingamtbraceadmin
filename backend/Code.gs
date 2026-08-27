/*******************************************************
 * ITAITINGA MTB RACE
 * PAINEL ADMINISTRATIVO - V5.7
 *
 * Projeto: mtbitaitingaraceadmin
 *
 * V5.9.5 - Pagamento por comprovante
 * - Login administrativo
 * - Sessão via CacheService
 * - Dashboard
 * - Inscrições
 * - Alteração de pagamento
 * - Alteração de status
 * - Configurações
 * - Upload para Google Drive
 * - Nome: CPF - Nome.extensão
 * - Pasta: INSCRICAO-001, INSCRICAO-002...
 * - Arquivos privados no Drive
 * - Visualização do arquivo pelo Web App
 *******************************************************/


/* =====================================================
   CONFIGURAÇÕES
   ===================================================== */

const CONFIG = {
  SHEETS: {
    ADMINS: 'Admins',
    INSCRICOES: 'Inscrições',
    CONFIG: 'Configurações'
  },

  VALOR_INSCRICAO_PADRAO: 80,

  // 6 horas
  SESSAO_DURACAO: 21600,

  CACHE_PREFIXO: 'MTB_ADMIN_SESSION_'
};


/* =====================================================
   GOOGLE DRIVE
   ===================================================== */

/*
 * ID EXATO DA PASTA RAIZ DO GOOGLE DRIVE
 */
const DRIVE_ROOT_FOLDER_ID =
  '1kNz8ytaoiq3pny_Spok7p4-ZCp6DMWDg';


/* =====================================================
   CONFIGURAÇÃO INICIAL
   ===================================================== */

function configurarSistema() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      'Não foi possível acessar a planilha vinculada ao projeto.'
    );
  }

  criarAbaAdmins_(ss);
  criarAbaInscricoes_(ss);
  criarAbaConfiguracoes_(ss);

  criarAdminTeste_(ss);
  criarInscricaoTeste_(ss);

  SpreadsheetApp.flush();

  return {
    sucesso: true,
    mensagem: 'Sistema configurado com sucesso.'
  };
}


/* =====================================================
   ABA ADMINS
   ===================================================== */

function criarAbaAdmins_(ss) {

  let sheet =
    ss.getSheetByName(
      CONFIG.SHEETS.ADMINS
    );

  if (!sheet) {
    sheet =
      ss.insertSheet(
        CONFIG.SHEETS.ADMINS
      );
  }

  garantirCabecalho_(
    sheet,
    [
      'ID',
      'Nome',
      'Email',
      'SenhaHash',
      'Ativo',
      'CriadoEm'
    ]
  );
}


/* =====================================================
   ABA INSCRIÇÕES
   ===================================================== */

function criarAbaInscricoes_(ss) {

  let sheet =
    ss.getSheetByName(
      CONFIG.SHEETS.INSCRICOES
    );

  if (!sheet) {
    sheet =
      ss.insertSheet(
        CONFIG.SHEETS.INSCRICOES
      );
  }

  garantirCabecalho_(
    sheet,
    [
      'NumeroInscricao',
      'Nome',
      'CPF',
      'Email',
      'Telefone',
      'Categoria',
      'Pagamento',
      'StatusInscricao',
      'Valor',
      'DataInscricao',
      'Observacao'
    ]
  );
}


/* =====================================================
   ABA CONFIGURAÇÕES
   ===================================================== */

function criarAbaConfiguracoes_(ss) {

  let sheet =
    ss.getSheetByName(
      CONFIG.SHEETS.CONFIG
    );

  if (!sheet) {
    sheet =
      ss.insertSheet(
        CONFIG.SHEETS.CONFIG
      );
  }

  garantirCabecalho_(
    sheet,
    [
      'Configuracao',
      'Valor'
    ]
  );

  const dados =
    sheet
      .getDataRange()
      .getValues();

  const existentes = {};

  for (
    let i = 1;
    i < dados.length;
    i++
  ) {

    if (dados[i][0]) {
      existentes[
        String(dados[i][0])
      ] =
        dados[i][1];
    }
  }

  const configuracoes = [
    [
      'ValorInscricao',
      existentes['ValorInscricao'] !== undefined
        ? existentes['ValorInscricao']
        : CONFIG.VALOR_INSCRICAO_PADRAO
    ],
    [
      'Evento',
      existentes['Evento'] !== undefined
        ? existentes['Evento']
        : 'Itaitinga MTB Race'
    ],
    [
      'Ano',
      existentes['Ano'] !== undefined
        ? existentes['Ano']
        : '2026'
    ],
    [
      'Categorias',
      existentes['Categorias'] !== undefined
        ? existentes['Categorias']
        : JSON.stringify([
            { nome: 'Elite Masculino', valor: 80 },
            { nome: 'Elite Feminino', valor: 80 },
            { nome: 'Sport Masculino', valor: 80 },
            { nome: 'Sport Feminino', valor: 80 }
          ])
    ]
  ];

  if (sheet.getLastRow() <= 1) {

    sheet
      .getRange(
        2,
        1,
        configuracoes.length,
        2
      )
      .setValues(
        configuracoes
      );

  } else {

    const novas = [];

    configuracoes.forEach(
      function(item) {

        if (
          existentes[item[0]] === undefined
        ) {
          novas.push(item);
        }
      }
    );

    if (novas.length) {

      sheet
        .getRange(
          sheet.getLastRow() + 1,
          1,
          novas.length,
          2
        )
        .setValues(
          novas
        );
    }
  }
}


/* =====================================================
   ADMIN DE TESTE
   ===================================================== */

function criarAdminTeste_(ss) {

  const sheet =
    ss.getSheetByName(
      CONFIG.SHEETS.ADMINS
    );

  const dados =
    sheet
      .getDataRange()
      .getValues();

  const emailTeste =
    'admin@mtbitaitingarace.com';

  for (
    let i = 1;
    i < dados.length;
    i++
  ) {

    const email =
      String(
        dados[i][2] || ''
      )
        .trim()
        .toLowerCase();

    if (email === emailTeste) {
      return;
    }
  }

  sheet.appendRow([
    gerarId_(),
    'Administrador',
    emailTeste,
    hashSenha_('123456'),
    'SIM',
    new Date()
  ]);
}


/* =====================================================
   INSCRIÇÃO DE TESTE
   ===================================================== */

function criarInscricaoTeste_(ss) {

  const sheet =
    ss.getSheetByName(
      CONFIG.SHEETS.INSCRICOES
    );

  const dados =
    sheet
      .getDataRange()
      .getValues();

  if (dados.length > 1) {
    return;
  }

  sheet.appendRow([
    1,
    'Atleta Teste',
    '11111111111',
    'atleta@teste.com',
    '85999999999',
    'Elite Masculino',
    'Pago',
    'Confirmado',
    CONFIG.VALOR_INSCRICAO_PADRAO,
    new Date(),
    ''
  ]);
}


/* =====================================================
   WEB APP - GET
   ===================================================== */

function doGet(e) {

  try {

    const params =
      e && e.parameter
        ? e.parameter
        : {};

    const action =
      String(
        params.action || 'status'
      );


    /*
     * Visualização privada do arquivo.
     */

    if (
      action === 'arquivo'
    ) {

      return visualizarArquivoDrive_(
        params.token,
        params.fileId,
        params.inscricaoId
      );
    }


    switch (action) {

      case 'status':

        return resposta_(
          true,
          {
            sistema:
              'Itaitinga MTB Race Admin',

            versao:
              '5.0',

            status:
              'online'
          }
        );


      case 'dashboard':

        return resposta_(
          true,
          obterDashboard_(
            params.token
          )
        );


      case 'inscricoes':

        return resposta_(
          true,
          listarInscricoes_(
            params.token
          )
        );


      case 'inscricao':

        return resposta_(
          true,
          consultarInscricao_(
            params.token,
            params.id
          )
        );


      case 'usuarios':

        return resposta_(
          true,
          listarUsuarios_(
            params.token
          )
        );


      case 'configuracoes':

        return resposta_(
          true,
          obterConfiguracoes_(
            params.token
          )
        );


      default:

        return resposta_(
          false,
          null,
          'Ação não encontrada.'
        );
    }

  } catch (erro) {

    return resposta_(
      false,
      null,
      erro.message
    );
  }
}


/* =====================================================
   WEB APP - POST
   ===================================================== */

function doPost(e) {

  try {

    const body =
      obterBody_(e);

    const action =
      String(
        body.action || ''
      );


    switch (action) {

      case 'login':

        return resposta_(
          true,
          fazerLogin_(
            body.email,
            body.senha
          )
        );


      case 'logout':

        return resposta_(
          true,
          fazerLogout_(
            body.token
          )
        );


      case 'usuarios':

        return resposta_(
          true,
          listarUsuarios_(
            body.token
          )
        );


      case 'criarUsuario':

        return resposta_(
          true,
          criarUsuario_(
            body.token,
            body.nome,
            body.email,
            body.senha
          )
        );


      case 'alterarSenhaUsuario':

        return resposta_(
          true,
          alterarSenhaUsuario_(
            body.token,
            body.id,
            body.senha
          )
        );


      case 'dashboard':

        return resposta_(
          true,
          obterDashboard_(
            body.token
          )
        );


      case 'inscricoes':

        return resposta_(
          true,
          listarInscricoes_(
            body.token
          )
        );


      case 'inscricao':

        return resposta_(
          true,
          consultarInscricao_(
            body.token,
            body.id
          )
        );


      case 'cadastrarInscricao':

        return resposta_(
          true,
          cadastrarInscricao_(body)
        );


      case 'alterarStatus':

        return resposta_(
          true,
          alterarStatusInscricao_(
            body.token,
            body.id,
            body.status
          )
        );


      case 'alterarPagamento':

        return resposta_(
          true,
          alterarPagamento_(
            body.token,
            body.id,
            body.pagamento
          )
        );


      case 'editarInscricao':

        return resposta_(
          true,
          editarInscricao_(body)
        );


      case 'validarInscricao':

        return resposta_(
          true,
          validarInscricao_(
            body.token,
            body.id
          )
        );


      case 'configuracoes':

        return resposta_(
          true,
          obterConfiguracoes_(
            body.token
          )
        );


      case 'alterarConfiguracao':

        return resposta_(
          true,
          alterarConfiguracao_(
            body.token,
            body.chave,
            body.valor
          )
        );


      case 'uploadArquivo':

        return resposta_(
          true,
          uploadArquivo_(body)
        );


      default:

        return resposta_(
          false,
          null,
          'Ação POST não encontrada.'
        );
    }

  } catch (erro) {

    return resposta_(
      false,
      null,
      erro.message
    );
  }
}


/* =====================================================
   LOGIN
   ===================================================== */

function fazerLogin_(
  email,
  senha
) {

  if (!email || !senha) {
    throw new Error(
      'Informe o e-mail e a senha.'
    );
  }

  email =
    String(email)
      .trim()
      .toLowerCase();

  senha =
    String(senha);


  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      'Não foi possível acessar a planilha.'
    );
  }


  const sheet =
    ss.getSheetByName(
      CONFIG.SHEETS.ADMINS
    );


  if (!sheet) {
    throw new Error(
      'A aba Admins não existe.'
    );
  }


  const dados =
    sheet
      .getDataRange()
      .getValues();


  for (
    let i = 1;
    i < dados.length;
    i++
  ) {

    const linha =
      dados[i];


    const id =
      linha[0];

    const nome =
      linha[1];

    const emailPlanilha =
      String(
        linha[2] || ''
      )
        .trim()
        .toLowerCase();

    const senhaHash =
      String(
        linha[3] || ''
      )
        .trim();

    const ativo =
      String(
        linha[4] || ''
      )
        .trim()
        .toUpperCase();


    if (
      emailPlanilha !==
      email
    ) {
      continue;
    }


    if (
      ativo !== 'SIM'
    ) {
      throw new Error(
        'Este administrador está inativo.'
      );
    }


    const hashInformado =
      hashSenha_(
        senha
      );


    if (
      hashInformado !==
      senhaHash
    ) {
      throw new Error(
        'E-mail ou senha inválidos.'
      );
    }


    const token =
      gerarToken_();


    const sessao = {
      id: id,
      nome: nome,
      email: email,
      criadoEm:
        new Date().getTime()
    };


    CacheService
      .getScriptCache()
      .put(
        CONFIG.CACHE_PREFIXO +
          token,
        JSON.stringify(
          sessao
        ),
        CONFIG.SESSAO_DURACAO
      );


    return {
      login: true,

      token: token,

      administrador: {
        id: id,
        nome: nome,
        email: email
      },

      expiracaoSegundos:
        CONFIG.SESSAO_DURACAO
    };
  }


  throw new Error(
    'E-mail ou senha inválidos.'
  );
}



/* =====================================================
   USUÁRIOS ADMINISTRATIVOS
   ===================================================== */

function listarUsuarios_(token) {

  validarSessao_(token);

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        CONFIG.SHEETS.ADMINS
      );

  if (!sheet) {
    throw new Error(
      'A aba Admins não existe.'
    );
  }

  const dados =
    sheet
      .getDataRange()
      .getValues();

  const usuarios = [];

  for (let i = 1; i < dados.length; i++) {

    if (!dados[i][0]) continue;

    usuarios.push({
      id: dados[i][0],
      nome: dados[i][1] || '',
      email: dados[i][2] || '',
      ativo: dados[i][4] || 'SIM',
      criadoEm: formatarData_(dados[i][5])
    });
  }

  return {
    usuarios: usuarios
  };
}


function criarUsuario_(
  token,
  nome,
  email,
  senha
) {

  const sessao =
    validarSessao_(token);

  nome =
    String(nome || '').trim();

  email =
    String(email || '')
      .trim()
      .toLowerCase();

  senha =
    String(senha || '');

  if (!nome) {
    throw new Error(
      'Informe o nome do usuário.'
    );
  }

  if (!email) {
    throw new Error(
      'Informe o e-mail do usuário.'
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(
      'Informe um e-mail válido.'
    );
  }

  if (senha.length < 6) {
    throw new Error(
      'A senha deve ter pelo menos 6 caracteres.'
    );
  }

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        CONFIG.SHEETS.ADMINS
      );

  if (!sheet) {
    throw new Error(
      'A aba Admins não existe.'
    );
  }

  const dados =
    sheet
      .getDataRange()
      .getValues();

  for (let i = 1; i < dados.length; i++) {

    const emailExistente =
      String(dados[i][2] || '')
        .trim()
        .toLowerCase();

    if (emailExistente === email) {
      throw new Error(
        'Já existe um usuário com este e-mail.'
      );
    }
  }

  const id =
    gerarId_();

  sheet.appendRow([
    id,
    nome,
    email,
    hashSenha_(senha),
    'SIM',
    new Date()
  ]);

  return {
    criado: true,
    id: id,
    nome: nome,
    email: email,
    criadoPor: sessao.email
  };
}


function alterarSenhaUsuario_(
  token,
  id,
  senha
) {

  const sessao =
    validarSessao_(token);

  id =
    String(id || '').trim();

  senha =
    String(senha || '');

  if (!id) {
    throw new Error(
      'Usuário não informado.'
    );
  }

  if (senha.length < 6) {
    throw new Error(
      'A senha deve ter pelo menos 6 caracteres.'
    );
  }

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        CONFIG.SHEETS.ADMINS
      );

  if (!sheet) {
    throw new Error(
      'A aba Admins não existe.'
    );
  }

  const dados =
    sheet
      .getDataRange()
      .getValues();

  for (let i = 1; i < dados.length; i++) {

    if (
      String(dados[i][0]) === id
    ) {

      sheet
        .getRange(
          i + 1,
          4
        )
        .setValue(
          hashSenha_(senha)
        );

      return {
        atualizado: true,
        id: id,
        alteradoPor: sessao.email
      };
    }
  }

  throw new Error(
    'Usuário não encontrado.'
  );
}


/* =====================================================
   LOGOUT
   ===================================================== */

function fazerLogout_(
  token
) {

  if (token) {

    CacheService
      .getScriptCache()
      .remove(
        CONFIG.CACHE_PREFIXO +
          token
      );
  }

  return {
    logout: true
  };
}


/* =====================================================
   VALIDAR SESSÃO
   ===================================================== */

function validarSessao_(
  token
) {

  if (!token) {
    throw new Error(
      'Sessão não informada.'
    );
  }


  const cache =
    CacheService
      .getScriptCache()
      .get(
        CONFIG.CACHE_PREFIXO +
          token
      );


  if (!cache) {
    throw new Error(
      'Sessão expirada. Faça login novamente.'
    );
  }


  try {

    return JSON.parse(
      cache
    );

  } catch (erro) {

    throw new Error(
      'Sessão inválida.'
    );
  }
}


/* =====================================================
   DASHBOARD
   ===================================================== */

function obterDashboard_(
  token
) {

  validarSessao_(
    token
  );


  const inscricoes =
    obterTodasInscricoes_();


  let total = 0;
  let pagamentoPendente = 0;
  let pagamentoPago = 0;
  let inscricaoPendente = 0;
  let confirmados = 0;
  let cancelados = 0;
  let arrecadado = 0;
  let aReceber = 0;


  inscricoes.forEach(
    function(item) {

      total++;


      const pagamento =
        normalizarStatus_(
          item.pagamento
        );


      const status =
        normalizarStatus_(
          item.statusInscricao
        );


      if (
        pagamento ===
        'pendente'
      ) {

        pagamentoPendente++;

        aReceber +=
          Number(
            item.valor || 0
          );
      }


      if (
        pagamento ===
        'pago'
      ) {

        pagamentoPago++;

        arrecadado +=
          Number(
            item.valor || 0
          );
      }


      if (
        status ===
        'pendente'
      ) {

        inscricaoPendente++;
      }


      if (
        status ===
        'confirmado'
      ) {

        confirmados++;
      }


      if (
        status ===
        'cancelado'
      ) {

        cancelados++;
      }

    }
  );


  const valorInscricao =
    Number(
      obterConfiguracao_(
        'ValorInscricao'
      )
    ) ||
    CONFIG.VALOR_INSCRICAO_PADRAO;


  return {

    totalInscritos:
      total,

    pagamentos: {

      pendentes:
        pagamentoPendente,

      pagos:
        pagamentoPago
    },

    inscricoes: {

      pendentes:
        inscricaoPendente,

      confirmadas:
        confirmados
    },

    canceladas:
      cancelados,

    financeiro: {

      valorInscricao:
        valorInscricao,

      arrecadado:
        arrecadado,

      aReceber:
        aReceber,

      totalPotencial:
        total *
        valorInscricao
    }
  };
}


/* =====================================================
   LISTAR INSCRIÇÕES
   ===================================================== */

function listarInscricoes_(
  token
) {

  validarSessao_(
    token
  );

  return {
    inscricoes:
      obterTodasInscricoes_()
  };
}


/* =====================================================
   CONSULTAR INSCRIÇÃO
   ===================================================== */

function consultarInscricao_(
  token,
  id
) {

  validarSessao_(
    token
  );


  if (!id) {
    throw new Error(
      'Informe o número da inscrição.'
    );
  }


  const encontrada =
    obterInscricaoPorId_(
      id
    );


  if (!encontrada) {
    throw new Error(
      'Inscrição não encontrada.'
    );
  }


  /*
   * IMPORTANTE:
   * o token é passado para que cada botão
   * ABRIR receba uma URL autenticada.
   */

  encontrada.arquivos =
    listarArquivosDrive_(
      id,
      token
    );


  return encontrada;
}



/* =====================================================
   CADASTRAR INSCRIÇÃO
   ===================================================== */

function validarCPF_(cpf) {
  const digits = String(cpf || '').replace(/\D/g, '');

  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(digits.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  if (digito1 !== Number(digits.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(digits.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  return digito2 === Number(digits.charAt(10));
}


function cadastrarInscricao_(body) {

  if (!body || !body.token) {
    throw new Error('Sessão não informada.');
  }

  const sessao = validarSessao_(body.token);

  const nome = String(body.nome || '').trim();
  const cpf = String(body.cpf || '').trim();
  const email = String(body.email || '').trim();
  const telefone = String(body.telefone || '').trim();
  const categoria = String(body.categoria || '').trim();
  const pagamento = 'Pendente';
  const status = 'Pendente';
  const observacao = String(body.observacao || '').trim();

  if (!nome) throw new Error('Informe o nome do atleta.');
  if (!cpf) throw new Error('Informe o CPF do atleta.');

  const cpfNumeros = cpf.replace(/\D/g, '');

  if (!validarCPF_(cpfNumeros)) {
    throw new Error('CPF inválido. Informe um CPF válido com 11 dígitos.');
  }

  if (!email) throw new Error('Informe o e-mail do atleta.');
  if (!categoria) throw new Error('Informe a categoria.');

  const permitidosPagamento = [
    'Pendente',
    'Pago',
    'Cancelado'
  ];

  const permitidosStatus = [
    'Pendente',
    'Confirmado',
    'Cancelado'
  ];

  if (permitidosPagamento.indexOf(pagamento) === -1) {
    throw new Error('Status de pagamento inválido.');
  }

  if (permitidosStatus.indexOf(status) === -1) {
    throw new Error('Status da inscrição inválido.');
  }

  let categorias = [];
  try {
    categorias = JSON.parse(String(obterConfiguracao_('Categorias') || '[]'));
  } catch (_) {
    categorias = [];
  }
  const categoriaConfig = categorias.find(x => String(x.nome || '').trim() === categoria);
  if (!categoriaConfig) {
    throw new Error('A categoria selecionada não está cadastrada nas Configurações.');
  }

  const valor = Number(categoriaConfig.valor);

  if (!isFinite(valor) || valor < 0) {
    throw new Error('Valor da inscrição inválido.');
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error('Não foi possível acessar a planilha.');
  }

  const sheet = ss.getSheetByName(
    CONFIG.SHEETS.INSCRICOES
  );

  if (!sheet) {
    throw new Error('A aba Inscrições não existe.');
  }

  const dados = sheet.getDataRange().getValues();

  const cpfNovo = cpfNumeros;

  for (let i = 1; i < dados.length; i++) {

    const cpfExistente = String(
      dados[i][2] || ''
    ).replace(/\D/g, '');

    if (
      cpfNovo &&
      cpfExistente &&
      cpfNovo === cpfExistente
    ) {
      throw new Error(
        'Já existe uma inscrição cadastrada para este CPF.'
      );
    }
  }

  let maiorNumero = 0;

  for (let i = 1; i < dados.length; i++) {

    const numero = Number(dados[i][0]);

    if (isFinite(numero) && numero > maiorNumero) {
      maiorNumero = numero;
    }
  }

  const numeroInscricao =
    maiorNumero + 1;

  const agora = new Date();

  sheet.appendRow([
    numeroInscricao,
    nome,
    cpf,
    email,
    telefone,
    categoria,
    pagamento,
    status,
    valor,
    agora,
    observacao
  ]);

  SpreadsheetApp.flush();

  return {
    criado: true,
    numeroInscricao: numeroInscricao,
    nome: nome,
    cpf: cpf,
    email: email,
    telefone: telefone,
    categoria: categoria,
    pagamento: pagamento,
    statusInscricao: status,
    valor: valor,
    dataInscricao: formatarData_(agora),
    observacao: observacao,
    cadastradoPor: sessao.email
  };
}


/* =====================================================
   ALTERAR STATUS
   ===================================================== */

function alterarStatusInscricao_(
  token,
  id,
  novoStatus
) {

  const sessao =
    validarSessao_(
      token
    );


  if (!id) {
    throw new Error(
      'Informe o número da inscrição.'
    );
  }


  if (!novoStatus) {
    throw new Error(
      'Informe o novo status.'
    );
  }


  const permitidos = [
    'Confirmado',
    'Cancelado'
  ];


  if (
    permitidos.indexOf(
      String(novoStatus)
    ) === -1
  ) {

    throw new Error(
      'Status de inscrição inválido.'
    );
  }


  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        CONFIG.SHEETS.INSCRICOES
      );


  const dados =
    sheet
      .getDataRange()
      .getValues();


  for (
    let i = 1;
    i < dados.length;
    i++
  ) {

    if (
      String(dados[i][0]) ===
      String(id)
    ) {

      const statusAtual = normalizarStatus_(dados[i][7]);

      if (statusAtual !== 'confirmado' && statusAtual !== 'cancelado') {
        throw new Error(
          'O status só pode ser alterado quando a inscrição estiver Confirmada ou Cancelada.'
        );
      }

      sheet
        .getRange(
          i + 1,
          8
        )
        .setValue(
          novoStatus
        );


      return {

        atualizado: true,

        numeroInscricao:
          id,

        statusInscricao:
          novoStatus,

        alteradoPor:
          sessao.email
      };
    }
  }


  throw new Error(
    'Inscrição não encontrada.'
  );
}


/* =====================================================
   ALTERAR PAGAMENTO
   ===================================================== */

function alterarPagamento_(
  token,
  id,
  novoPagamento
) {

  const sessao =
    validarSessao_(
      token
    );


  if (!id) {
    throw new Error(
      'Informe o número da inscrição.'
    );
  }


  if (!novoPagamento) {
    throw new Error(
      'Informe o status do pagamento.'
    );
  }


  const permitidos = [
    'Pendente',
    'Pago',
    'Cancelado'
  ];


  if (
    permitidos.indexOf(
      String(novoPagamento)
    ) === -1
  ) {

    throw new Error(
      'Status de pagamento inválido.'
    );
  }

  // Regra de negócio: pagamento só pode ficar como Pago
  // quando existir pelo menos um comprovante anexado.
  if (String(novoPagamento).toLowerCase() === 'pago') {
    const comprovantes = listarArquivosDrive_(id, token);
    if (!Array.isArray(comprovantes) || comprovantes.length === 0) {
      throw new Error(
        'Não é possível marcar o pagamento como Pago sem um comprovante anexado.'
      );
    }
  }


  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        CONFIG.SHEETS.INSCRICOES
      );


  const dados =
    sheet
      .getDataRange()
      .getValues();


  for (
    let i = 1;
    i < dados.length;
    i++
  ) {

    if (
      String(dados[i][0]) ===
      String(id)
    ) {

      sheet
        .getRange(
          i + 1,
          7
        )
        .setValue(
          novoPagamento
        );


      return {

        atualizado: true,

        numeroInscricao:
          id,

        pagamento:
          novoPagamento,

        alteradoPor:
          sessao.email
      };
    }
  }


  throw new Error(
    'Inscrição não encontrada.'
  );
}


/* =====================================================
   EDITAR INSCRIÇÃO
   ===================================================== */

function editarInscricao_(body) {

  if (!body || !body.token) {
    throw new Error('Sessão não informada.');
  }

  const sessao = validarSessao_(body.token);
  const id = String(body.id || '').trim();

  if (!id) {
    throw new Error('Informe o número da inscrição.');
  }

  const nome = String(body.nome || '').trim();
  const cpf = String(body.cpf || '').trim();
  const email = String(body.email || '').trim();
  const telefone = String(body.telefone || '').trim();
  const categoria = String(body.categoria || '').trim();
  const observacao = String(body.observacao || '').trim();

  if (!nome) throw new Error('Informe o nome do atleta.');
  if (!cpf) throw new Error('Informe o CPF do atleta.');

  const cpfNumeros = cpf.replace(/\D/g, '');

  if (!validarCPF_(cpfNumeros)) {
    throw new Error('CPF inválido. Informe um CPF válido com 11 dígitos.');
  }

  if (!email) throw new Error('Informe o e-mail do atleta.');
  if (!categoria) throw new Error('Informe a categoria.');

  let categorias = [];
  try {
    categorias = JSON.parse(String(obterConfiguracao_('Categorias') || '[]'));
  } catch (_) {
    categorias = [];
  }
  const categoriaConfig = categorias.find(x => String(x.nome || '').trim() === categoria);
  if (!categoriaConfig) {
    throw new Error('A categoria selecionada não está cadastrada nas Configurações.');
  }
  const valor = Number(categoriaConfig.valor);
  if (!isFinite(valor) || valor < 0) {
    throw new Error('Valor da categoria inválido.');
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(CONFIG.SHEETS.INSCRICOES);

  if (!sheet) throw new Error('A aba Inscrições não existe.');

  const dados = sheet.getDataRange().getValues();

  for (let i = 1; i < dados.length; i++) {

    if (String(dados[i][0]) !== id) continue;

    sheet.getRange(i + 1, 2, 1, 10).setValues([[
      nome,
      cpf,
      email,
      telefone,
      categoria,
      dados[i][6],
      dados[i][7],
      valor,
      dados[i][9],
      observacao
    ]]);

    SpreadsheetApp.flush();
    return obterInscricaoPorId_(id);
  }

  throw new Error('Inscrição não encontrada.');
}


/* =====================================================
   VALIDAR INSCRIÇÃO
   ===================================================== */

function validarInscricao_(token, id) {

  const sessao = validarSessao_(token);

  if (!id) throw new Error('Informe o número da inscrição.');

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(CONFIG.SHEETS.INSCRICOES);

  if (!sheet) throw new Error('A aba Inscrições não existe.');

  const dados = sheet.getDataRange().getValues();

  for (let i = 1; i < dados.length; i++) {

    if (String(dados[i][0]) !== String(id)) continue;

    const pagamento = normalizarStatus_(dados[i][6]);

    if (pagamento !== 'pago') {
      throw new Error(
        'Não é possível validar esta inscrição porque o pagamento ainda não está como Pago.'
      );
    }

    // A inscrição só pode ser confirmada se existir pelo menos
    // um comprovante/arquivo anexado à pasta da inscrição no Drive.
    const comprovantes = listarArquivosDrive_(id, token);

    if (!Array.isArray(comprovantes) || comprovantes.length === 0) {
      throw new Error(
        'Não é possível validar esta inscrição porque nenhum comprovante foi anexado.'
      );
    }

    sheet.getRange(i + 1, 8).setValue('Confirmado');
    SpreadsheetApp.flush();

    const atualizada = obterInscricaoPorId_(id);
    atualizada.validada = true;
    atualizada.validadaPor = sessao.email;
    return atualizada;
  }

  throw new Error('Inscrição não encontrada.');
}


/* =====================================================
   GOOGLE DRIVE - UPLOAD
   ===================================================== */

function uploadArquivo_(
  body
) {

  if (
    !body ||
    !body.token
  ) {

    throw new Error(
      'Sessão não informada.'
    );
  }


  validarSessao_(
    body.token
  );


  const id =
    String(
      body.id || ''
    ).trim();


  const nomeOriginal =
    String(
      body.nome || 'arquivo'
    ).trim();


  const mimeType =
    String(
      body.mimeType ||
      'application/octet-stream'
    ).trim();


  const base64 =
    String(
      body.arquivoBase64 || ''
    ).trim();


  if (!id) {
    throw new Error(
      'Número da inscrição não informado.'
    );
  }


  if (!base64) {
    throw new Error(
      'Arquivo não informado.'
    );
  }


  if (
    base64.length >
    7 * 1024 * 1024
  ) {

    throw new Error(
      'Arquivo muito grande. O limite é de 5 MB.'
    );
  }


  const inscricao =
    obterInscricaoPorId_(
      id
    );


  if (!inscricao) {
    throw new Error(
      'Inscrição não encontrada.'
    );
  }


  try {

    const root =
      DriveApp.getFolderById(
        DRIVE_ROOT_FOLDER_ID
      );


    const folderName =
      'INSCRICAO-' +
      String(id)
        .padStart(
          3,
          '0'
        );


    const folders =
      root.getFoldersByName(
        folderName
      );


    const folder =
      folders.hasNext()
        ? folders.next()
        : root.createFolder(
            folderName
          );


    const extensao =
      obterExtensao_(
        nomeOriginal,
        mimeType
      );


    const cpf =
      String(
        inscricao.cpf || ''
      )
        .replace(
          /\D/g,
          ''
        );


    const nomeAtleta =
      sanitizarNomeArquivo_(
        inscricao.nome ||
        'Atleta'
      );


    const nomeFinal =
      cpf +
      ' - ' +
      nomeAtleta +
      extensao;


    const bytes =
      Utilities.base64Decode(
        base64
      );


    const blob =
      Utilities.newBlob(
        bytes,
        mimeType,
        nomeFinal
      );


    /*
     * O arquivo continua PRIVADO.
     *
     * Não usar setSharing().
     */

    const file =
      folder.createFile(
        blob
      );

    /*
     * O comprovante precisa abrir sem pedir login
     * na conta Google do administrador.
     *
     * Acesso: qualquer pessoa com o link pode visualizar.
     */
    file.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW
    );

    const fileId =
      file.getId();

    // Regra de negócio: ao concluir o upload de um comprovante,
    // o pagamento da inscrição passa automaticamente para Pago.
    const sheetPagamento = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.INSCRICOES);

    if (!sheetPagamento) {
      throw new Error('A aba Inscrições não existe.');
    }

    const dadosPagamento = sheetPagamento.getDataRange().getValues();
    let pagamentoAtualizado = false;

    for (let i = 1; i < dadosPagamento.length; i++) {
      if (String(dadosPagamento[i][0]).trim() === String(id).trim()) {
        // Coluna G = Pagamento
        sheetPagamento.getRange(i + 1, 7).setValue('Pago');
        pagamentoAtualizado = true;
        break;
      }
    }

    if (!pagamentoAtualizado) {
      throw new Error('Comprovante enviado, mas a inscrição não foi localizada para atualizar o pagamento.');
    }

    SpreadsheetApp.flush();

    const url =
      'https://drive.google.com/uc?export=download&id=' +
      encodeURIComponent(fileId);


    return {

      sucesso: true,

      mensagem:
        'Arquivo enviado com sucesso.',

      dados: {

        id:
          id,

        nome:
          file.getName(),

        fileId:
          fileId,

        url:
          url,

        mimeType:
          file.getMimeType(),

        tamanho:
          file.getSize(),

        pagamento:
          'Pago'
      }
    };


  } catch (err) {

    throw new Error(
      'Erro ao salvar no Google Drive: ' +
      err.message
    );
  }
}


/* =====================================================
   GOOGLE DRIVE - LISTAR
   ===================================================== */

function listarArquivosDrive_(
  id,
  token
) {

  if (
    !DRIVE_ROOT_FOLDER_ID
  ) {
    return [];
  }


  try {

    const root =
      DriveApp.getFolderById(
        DRIVE_ROOT_FOLDER_ID
      );


    const folderName =
      'INSCRICAO-' +
      String(id)
        .padStart(
          3,
          '0'
        );


    const folders =
      root.getFoldersByName(
        folderName
      );


    if (!folders.hasNext()) {
      return [];
    }


    const folder =
      folders.next();


    const files =
      folder.getFiles();


    const result = [];


    while (
      files.hasNext()
    ) {

      const file =
        files.next();


      const fileId =
        file.getId();

      /*
       * Também corrige arquivos enviados antes desta versão.
       * Assim, o comprovante antigo deixa de exigir login.
       */
      try {
        file.setSharing(
          DriveApp.Access.ANYONE_WITH_LINK,
          DriveApp.Permission.VIEW
        );
      } catch (sharingError) {
        console.log(
          'Não foi possível ajustar compartilhamento do arquivo ' +
          fileId +
          ': ' +
          sharingError.message
        );
      }

      const url =
        'https://drive.google.com/uc?export=download&id=' +
        encodeURIComponent(fileId);


      result.push({

        id:
          fileId,

        nome:
          file.getName(),

        url:
          url,

        mimeType:
          file.getMimeType(),

        tamanho:
          file.getSize()
      });
    }


    return result;


  } catch (err) {

    console.log(
      'Erro ao listar arquivos: ' +
      err.message
    );


    return [];
  }
}


/* =====================================================
   GERAR URL PRIVADA
   ===================================================== */

function gerarUrlArquivo_(
  token,
  fileId,
  inscricaoId
) {

  const base =
    ScriptApp
      .getService()
      .getUrl();


  if (!base) {
    throw new Error(
      'URL do Web App não disponível.'
    );
  }


  return (
    base +
    '?action=arquivo' +
    '&token=' +
    encodeURIComponent(
      token
    ) +
    '&fileId=' +
    encodeURIComponent(
      fileId
    ) +
    '&inscricaoId=' +
    encodeURIComponent(
      inscricaoId
    )
  );
}


/* =====================================================
   VISUALIZAR ARQUIVO PRIVADO
   ===================================================== */

function visualizarArquivoDrive_(
  token,
  fileId,
  inscricaoId
) {

  /*
   * 1. Sessão obrigatória.
   */

  validarSessao_(
    token
  );


  if (!fileId) {

    return paginaArquivoErro_(
      'Arquivo não informado.'
    );
  }


  if (!inscricaoId) {

    return paginaArquivoErro_(
      'Inscrição não informada.'
    );
  }


  try {

    /*
     * 2. Confirma inscrição.
     */

    const inscricao =
      obterInscricaoPorId_(
        inscricaoId
      );


    if (!inscricao) {

      return paginaArquivoErro_(
        'Inscrição não encontrada.'
      );
    }


    /*
     * 3. Localiza a pasta correta.
     */

    const root =
      DriveApp.getFolderById(
        DRIVE_ROOT_FOLDER_ID
      );


    const folderName =
      'INSCRICAO-' +
      String(inscricaoId)
        .padStart(
          3,
          '0'
        );


    const folders =
      root.getFoldersByName(
        folderName
      );


    if (!folders.hasNext()) {

      return paginaArquivoErro_(
        'Pasta da inscrição não encontrada.'
      );
    }


    const folder =
      folders.next();


    /*
     * 4. Procura o arquivo somente dentro
     *    da pasta da inscrição.
     *
     * Isso evita que alguém use um fileId
     * de outro arquivo do Drive.
     */

    const files =
      folder.getFiles();


    let file =
      null;


    while (
      files.hasNext()
    ) {

      const candidato =
        files.next();


      if (
        candidato.getId() ===
        String(fileId)
      ) {

        file =
          candidato;

        break;
      }
    }


    if (!file) {

      return paginaArquivoErro_(
        'Arquivo não pertence a esta inscrição.'
      );
    }


    const blob =
      file.getBlob();


    const mimeType =
      blob.getContentType();


    const nome =
      file.getName();


    const permitidos = [

      'application/pdf',

      'image/jpeg',

      'image/png',

      'image/webp',

      'image/gif'

    ];


    if (
      permitidos.indexOf(
        mimeType
      ) === -1
    ) {

      return paginaArquivoErro_(
        'Este tipo de arquivo não pode ser visualizado diretamente.'
      );
    }


    const base64 =
      Utilities.base64Encode(
        blob.getBytes()
      );


    /*
     * V5.1 — DOWNLOAD DIRETO
     *
     * Não usamos o link do Google Drive e não abrimos
     * o visualizador do Drive. O Web App já possui acesso
     * ao arquivo privado e entrega o conteúdo ao navegador
     * como um download local.
     *
     * Isso evita a tela de login do Google e também evita
     * o bloqueio do visualizador PDF do Opera.
     */

    const downloadUrl =
      'data:' +
      mimeType +
      ';base64,' +
      base64;

    const conteudo =
      '<div class="download-card">' +

      '<div class="download-icon">↓</div>' +

      '<h1>Comprovante pronto</h1>' +

      '<p>O download do comprovante será iniciado automaticamente.</p>' +

      '<a id="downloadBtn" class="download-btn" href="#" ' +
      'download="' + escHtmlServer_(nome) + '">' +
      'BAIXAR COMPROVANTE ↓' +
      '</a>' +

      '<p class="hint">Se o download não iniciar, clique no botão acima.</p>' +

      '</div>';


    const base64Js = JSON.stringify(base64);
    const mimeTypeJs = JSON.stringify(mimeType);
    const nomeArquivoJs = JSON.stringify(nome);

    const scriptDownload =
      '<script>' +
      '(function(){' +
      'var b64=' + base64Js + ';' +
      'var mime=' + mimeTypeJs + ';' +
      'var nome=' + nomeArquivoJs + ';' +
      'function baixar(){' +
      'try{' +
      'var bin=atob(b64);' +
      'var len=bin.length;' +
      'var bytes=new Uint8Array(len);' +
      'for(var i=0;i<len;i++){bytes[i]=bin.charCodeAt(i);}' +
      'var blob=new Blob([bytes],{type:mime});' +
      'var url=URL.createObjectURL(blob);' +
      'var a=document.createElement("a");' +
      'a.href=url;' +
      'a.download=nome;' +
      'a.style.display="none";' +
      'document.body.appendChild(a);' +
      'a.click();' +
      'setTimeout(function(){URL.revokeObjectURL(url);a.remove();},3000);' +
      '}catch(e){console.error(e);}' +
      '}' +
      'var botao=document.getElementById("downloadBtn");' +
      'if(botao){botao.addEventListener("click",function(ev){ev.preventDefault();baixar();});}' +
      'setTimeout(baixar,350);' +
      '})();' +
      '</script>';


    const html =

      '<!DOCTYPE html>' +

      '<html lang="pt-BR">' +

      '<head>' +

      '<meta charset="UTF-8">' +

      '<meta name="viewport" content="width=device-width,initial-scale=1">' +

      '<title>' +
      escHtmlServer_(nome) +
      '</title>' +

      '<style>' +

      '*{box-sizing:border-box;}' +

      'html,body{' +
      'margin:0;' +
      'padding:0;' +
      'width:100%;' +
      'height:100%;' +
      'background:#111;' +
      'color:#fff;' +
      'font-family:Arial,Helvetica,sans-serif;' +
      '}' +

      '.topbar{' +
      'position:fixed;' +
      'top:0;' +
      'left:0;' +
      'right:0;' +
      'height:58px;' +
      'z-index:20;' +
      'display:flex;' +
      'align-items:center;' +
      'justify-content:space-between;' +
      'padding:0 18px;' +
      'background:rgba(10,10,10,.97);' +
      'border-bottom:1px solid #292929;' +
      '}' +

      '.title{' +
      'display:flex;' +
      'align-items:center;' +
      'gap:10px;' +
      'min-width:0;' +
      '}' +

      '.title-icon{' +
      'width:34px;' +
      'height:34px;' +
      'display:flex;' +
      'align-items:center;' +
      'justify-content:center;' +
      'border-radius:8px;' +
      'background:#a8ff00;' +
      'color:#111;' +
      'font-weight:900;' +
      '}' +

      '.title-text{' +
      'min-width:0;' +
      '}' +

      '.title-text strong{' +
      'display:block;' +
      'font-size:13px;' +
      'white-space:nowrap;' +
      'overflow:hidden;' +
      'text-overflow:ellipsis;' +
      'max-width:60vw;' +
      '}' +

      '.title-text small{' +
      'display:block;' +
      'margin-top:2px;' +
      'color:#888;' +
      '}' +

      '.back{' +
      'padding:9px 13px;' +
      'border:1px solid #333;' +
      'border-radius:7px;' +
      'background:#1b1b1b;' +
      'color:#fff;' +
      'text-decoration:none;' +
      'font-size:12px;' +
      'font-weight:700;' +
      '}' +

      '.viewer{' +
      'position:absolute;' +
      'top:58px;' +
      'left:0;' +
      'right:0;' +
      'bottom:0;' +
      'display:flex;' +
      'align-items:center;' +
      'justify-content:center;' +
      'padding:20px;' +
      '}' +

      '.download-card{' +
      'width:100%;' +
      'max-width:520px;' +
      'padding:38px 28px;' +
      'text-align:center;' +
      'background:#1b1b1b;' +
      'border:1px solid #303030;' +
      'border-radius:16px;' +
      'box-shadow:0 20px 60px rgba(0,0,0,.35);' +
      '}' +

      '.download-icon{' +
      'width:64px;' +
      'height:64px;' +
      'margin:0 auto 18px;' +
      'display:flex;' +
      'align-items:center;' +
      'justify-content:center;' +
      'border-radius:50%;' +
      'background:#a8ff00;' +
      'color:#111;' +
      'font-size:32px;' +
      'font-weight:900;' +
      '}' +

      '.download-card h1{' +
      'margin:0 0 10px;' +
      'font-size:24px;' +
      '}' +

      '.download-card p{' +
      'margin:0 auto 22px;' +
      'max-width:420px;' +
      'color:#aaa;' +
      'line-height:1.5;' +
      '}' +

      '.download-btn{' +
      'display:inline-flex;' +
      'align-items:center;' +
      'justify-content:center;' +
      'padding:13px 20px;' +
      'border-radius:8px;' +
      'background:#a8ff00;' +
      'color:#111;' +
      'text-decoration:none;' +
      'font-weight:900;' +
      'font-size:13px;' +
      '}' +

      '.download-btn:hover{' +
      'filter:brightness(1.08);' +
      '}' +

      '.download-card .hint{' +
      'margin-top:16px;' +
      'margin-bottom:0;' +
      'font-size:12px;' +
      'color:#777;' +
      '}' +

      '@media(max-width:600px){' +
      '.topbar{padding:0 10px;}' +
      '.title-text strong{max-width:45vw;}' +
      '.title-text small{display:none;}' +
      '}' +

      '</style>' +

      '</head>' +

      '<body>' +

      '<div class="topbar">' +

      '<div class="title">' +

      '<div class="title-icon">📄</div>' +

      '<div class="title-text">' +

      '<strong>' +
      escHtmlServer_(nome) +
      '</strong>' +

      '<small>' +
      'Download do comprovante — Inscrição #' +
      escHtmlServer_(inscricaoId) +
      '</small>' +

      '</div>' +

      '</div>' +

      '<a class="back" href="javascript:history.back()">← VOLTAR</a>' +

      '</div>' +

      '<div class="viewer">' +

      conteudo +

      '</div>' +

      scriptDownload +

      '</body>' +

      '</html>';


    return HtmlService
      .createHtmlOutput(
        html
      )
      .setTitle(
        'Comprovante - ' +
        nome
      )
      .setXFrameOptionsMode(
        HtmlService
          .XFrameOptionsMode
          .ALLOWALL
      );


  } catch (err) {

    return paginaArquivoErro_(
      'Não foi possível abrir o comprovante: ' +
      err.message
    );
  }
}


/* =====================================================
   ERRO AO ABRIR ARQUIVO
   ===================================================== */

function paginaArquivoErro_(
  mensagem
) {

  const html =

    '<!DOCTYPE html>' +

    '<html lang="pt-BR">' +

    '<head>' +

    '<meta charset="UTF-8">' +

    '<meta name="viewport" content="width=device-width,initial-scale=1">' +

    '<title>Comprovante</title>' +

    '<style>' +

    'body{' +
    'margin:0;' +
    'min-height:100vh;' +
    'display:flex;' +
    'align-items:center;' +
    'justify-content:center;' +
    'padding:20px;' +
    'background:#111;' +
    'color:#fff;' +
    'font-family:Arial,Helvetica,sans-serif;' +
    '}' +

    '.card{' +
    'width:100%;' +
    'max-width:480px;' +
    'padding:32px;' +
    'background:#1b1b1b;' +
    'border:1px solid #333;' +
    'border-radius:14px;' +
    'text-align:center;' +
    '}' +

    '.icon{' +
    'width:55px;' +
    'height:55px;' +
    'margin:0 auto 18px;' +
    'display:flex;' +
    'align-items:center;' +
    'justify-content:center;' +
    'border-radius:50%;' +
    'background:#351313;' +
    'color:#ff7777;' +
    'font-size:28px;' +
    '}' +

    'h1{margin:0 0 10px;font-size:20px;}' +

    'p{margin:0;color:#aaa;line-height:1.5;}' +

    'button{' +
    'margin-top:20px;' +
    'padding:10px 17px;' +
    'border:0;' +
    'border-radius:7px;' +
    'background:#a8ff00;' +
    'color:#111;' +
    'font-weight:800;' +
    'cursor:pointer;' +
    '}' +

    '</style>' +

    '</head>' +

    '<body>' +

    '<div class="card">' +

    '<div class="icon">×</div>' +

    '<h1>Não foi possível abrir</h1>' +

    '<p>' +
    escHtmlServer_(mensagem) +
    '</p>' +

    '<button onclick="history.back()">VOLTAR</button>' +

    '</div>' +

    '</body>' +

    '</html>';


  return HtmlService
    .createHtmlOutput(
      html
    )
    .setTitle(
      'Erro ao abrir comprovante'
    );
}


/* =====================================================
   INSCRIÇÃO POR ID
   ===================================================== */

function obterInscricaoPorId_(
  id
) {

  const inscricoes =
    obterTodasInscricoes_();

  return inscricoes.find(
    function(item) {

      return String(
        item.numeroInscricao
      ) ===
      String(id);

    }
  ) || null;
}


/* =====================================================
   TODAS AS INSCRIÇÕES
   ===================================================== */

function obterTodasInscricoes_() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      'Não foi possível acessar a planilha.'
    );
  }


  const sheet =
    ss.getSheetByName(
      CONFIG.SHEETS.INSCRICOES
    );


  if (!sheet) {
    throw new Error(
      'A aba Inscrições não existe.'
    );
  }


  const dados =
    sheet
      .getDataRange()
      .getValues();


  const resultado = [];


  for (
    let i = 1;
    i < dados.length;
    i++
  ) {

    const linha =
      dados[i];


    if (!linha[0]) {
      continue;
    }


    resultado.push({

      numeroInscricao:
        linha[0],

      nome:
        linha[1],

      cpf:
        linha[2],

      email:
        linha[3],

      telefone:
        linha[4],

      categoria:
        linha[5],

      pagamento:
        linha[6],

      statusInscricao:
        linha[7],

      valor:
        Number(
          linha[8] || 0
        ),

      dataInscricao:
        formatarData_(
          linha[9]
        ),

      observacao:
        linha[10] || ''
    });
  }


  return resultado;
}


/* =====================================================
   CONFIGURAÇÕES
   ===================================================== */

function obterConfiguracoes_(
  token
) {

  validarSessao_(
    token
  );

  return {
    configuracoes:
      obterTodasConfiguracoes_()
  };
}


function obterTodasConfiguracoes_() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        CONFIG.SHEETS.CONFIG
      );


  if (!sheet) {
    throw new Error(
      'A aba Configurações não existe.'
    );
  }


  const dados =
    sheet
      .getDataRange()
      .getValues();


  const resultado = {};


  for (
    let i = 1;
    i < dados.length;
    i++
  ) {

    const chave =
      dados[i][0];


    if (chave) {

      resultado[
        String(chave)
      ] =
        dados[i][1];
    }
  }


  return resultado;
}


function obterConfiguracao_(
  chave
) {

  const configuracoes =
    obterTodasConfiguracoes_();


  return configuracoes[
    chave
  ];
}


/* =====================================================
   ALTERAR CONFIGURAÇÃO
   ===================================================== */

function alterarConfiguracao_(
  token,
  chave,
  valor
) {

  const sessao =
    validarSessao_(
      token
    );


  if (!chave) {
    throw new Error(
      'Informe a configuração.'
    );
  }


  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        CONFIG.SHEETS.CONFIG
      );


  if (!sheet) {
    throw new Error(
      'A aba Configurações não existe.'
    );
  }


  const dados =
    sheet
      .getDataRange()
      .getValues();


  for (
    let i = 1;
    i < dados.length;
    i++
  ) {

    if (
      String(dados[i][0]) ===
      String(chave)
    ) {

      sheet
        .getRange(
          i + 1,
          2
        )
        .setValue(
          valor
        );


      return {

        atualizado:
          true,

        configuracao:
          chave,

        valor:
          valor,

        alteradoPor:
          sessao.email
      };
    }
  }


  sheet.appendRow([
    chave,
    valor
  ]);


  return {

    atualizado:
      true,

    criada:
      true,

    configuracao:
      chave,

    valor:
      valor,

    alteradoPor:
      sessao.email
  };
}


/* =====================================================
   EXTENSÃO
   ===================================================== */

function obterExtensao_(
  nome,
  mimeType
) {

  const match =
    String(
      nome || ''
    )
      .match(
        /(\.[a-z0-9]+)$/i
      );


  if (match) {
    return match[1]
      .toLowerCase();
  }


  const extensoes = {

    'application/pdf':
      '.pdf',

    'image/jpeg':
      '.jpg',

    'image/png':
      '.png',

    'image/webp':
      '.webp',

    'image/gif':
      '.gif'
  };


  return extensoes[
    mimeType
  ] || '';
}


/* =====================================================
   NOME SEGURO
   ===================================================== */

function sanitizarNomeArquivo_(
  nome
) {

  return String(
    nome ||
    'Atleta'
  )
    .trim()
    .replace(
      /[\\/:*?"<>|#]+/g,
      '_'
    )
    .replace(
      /\s+/g,
      ' '
    )
    .substring(
      0,
      120
    );
}


/* =====================================================
   ESCAPAR HTML
   ===================================================== */

function escHtmlServer_(
  valor
) {

  return String(
    valor || ''
  )
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );
}


/* =====================================================
   CABEÇALHO
   ===================================================== */

function garantirCabecalho_(
  sheet,
  cabecalho
) {

  if (
    sheet.getLastRow() === 0
  ) {

    sheet
      .getRange(
        1,
        1,
        1,
        cabecalho.length
      )
      .setValues([
        cabecalho
      ]);

  } else {

    const atual =
      sheet
        .getRange(
          1,
          1,
          1,
          cabecalho.length
        )
        .getValues()[0];


    let precisaAtualizar =
      false;


    for (
      let i = 0;
      i < cabecalho.length;
      i++
    ) {

      if (
        atual[i] !==
        cabecalho[i]
      ) {

        precisaAtualizar =
          true;

        break;
      }
    }


    if (
      precisaAtualizar
    ) {

      sheet
        .getRange(
          1,
          1,
          1,
          cabecalho.length
        )
        .setValues([
          cabecalho
        ]);
    }
  }


  sheet
    .getRange(
      1,
      1,
      1,
      cabecalho.length
    )
    .setFontWeight(
      'bold'
    );


  sheet.setFrozenRows(
    1
  );
}


/* =====================================================
   HASH SHA-256
   ===================================================== */

function hashSenha_(
  senha
) {

  const bytes =
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      String(senha),
      Utilities.Charset.UTF_8
    );


  return bytes
    .map(
      function(byte) {

        const valor =
          byte < 0
            ? byte + 256
            : byte;


        return valor
          .toString(16)
          .padStart(
            2,
            '0'
          );
      }
    )
    .join('');
}


/* =====================================================
   TOKEN
   ===================================================== */

function gerarToken_() {

  return (
    Utilities
      .getUuid()
      .replace(
        /-/g,
        ''
      ) +

    Utilities
      .getUuid()
      .replace(
        /-/g,
        ''
      )
  );
}


/* =====================================================
   ID
   ===================================================== */

function gerarId_() {

  return Utilities
    .getUuid()
    .substring(
      0,
      8
    )
    .toUpperCase();
}


/* =====================================================
   NORMALIZAR STATUS
   ===================================================== */

function normalizarStatus_(
  valor
) {

  return String(
    valor || ''
  )
    .trim()
    .toLowerCase()
    .normalize(
      'NFD'
    )
    .replace(
      /[\u0300-\u036f]/g,
      ''
    );
}


/* =====================================================
   FORMATAR DATA
   ===================================================== */

function formatarData_(
  valor
) {

  if (!valor) {
    return '';
  }


  if (
    Object.prototype
      .toString
      .call(valor) ===
    '[object Date]'
  ) {

    return Utilities
      .formatDate(
        valor,
        Session
          .getScriptTimeZone(),
        'dd/MM/yyyy HH:mm'
      );
  }


  return String(
    valor
  );
}


/* =====================================================
   LER BODY
   ===================================================== */

function obterBody_(
  e
) {

  if (!e) {
    return {};
  }


  if (
    e.postData &&
    e.postData.contents
  ) {

    const conteudo =
      e.postData.contents;


    try {

      return JSON.parse(
        conteudo
      );

    } catch (erro) {

      // Continua para parâmetros.
    }
  }


  return e.parameter || {};
}


/* =====================================================
   RESPOSTA JSON
   ===================================================== */

function resposta_(
  sucesso,
  dados,
  mensagem
) {

  const resultado = {
    sucesso:
      sucesso
  };


  if (
    dados !== undefined
  ) {

    resultado.dados =
      dados;
  }


  if (mensagem) {

    resultado.mensagem =
      mensagem;
  }


  return ContentService
    .createTextOutput(
      JSON.stringify(
        resultado
      )
    )
    .setMimeType(
      ContentService
        .MimeType
        .JSON
    );
}
