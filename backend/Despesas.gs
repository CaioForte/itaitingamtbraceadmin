function criarAbaDespesas_(ss) {

  let sheet =
    ss.getSheetByName("Despesas");

  if (!sheet) {

    sheet =
      ss.insertSheet("Despesas");

  }

  const headers = [
    "Numero",
    "Evento",
    "Nome",
    "Valor",
    "FornecedorEmpresa",
    "Responsavel",
    "ContatoFornecedor",
    "Status",
    "Observacao",
    "CriadoEm",
    "DataPagamento",
    "FormaPagamento",
    "ComprovantePagamento"
  ];

  const range =
    sheet.getRange(
      1,
      1,
      1,
      headers.length
    );

  range.setValues([
    headers
  ]);

  range.setFontWeight("bold");

  sheet.setFrozenRows(1);

}

/* =====================================================
   CADASTRAR DESPESA
   ===================================================== */

function criarDespesa_(
  token,
  dados
) {

  /* VALIDA SESSÃO ADMIN */
  validarSessao_(token);


  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "Despesas"
    );

  if (!sheet) {
    throw new Error(
      "A aba Despesas não existe."
    );
  }


  /* =====================================================
     EVENTO
     ===================================================== */

  const evento =
    String(
      dados?.evento ||
      "MTB2026"
    )
      .trim()
      .toUpperCase();


  if (
    evento !== "MTB2026" &&
    evento !== "TRAIL2026"
  ) {
    throw new Error(
      "Evento inválido."
    );
  }


  /* =====================================================
     DADOS
     ===================================================== */

  const nome =
    String(
      dados?.nome || ""
    ).trim();

  const valor =
    Number(
      dados?.valor || 0
    );

  const fornecedor =
    String(
      dados?.fornecedorEmpresa || ""
    ).trim();

  const responsavel =
    String(
      dados?.responsavel || ""
    ).trim();

  const contato =
    String(
      dados?.contatoFornecedor || ""
    ).trim();

  const observacao =
    String(
      dados?.observacao || ""
    ).trim();


  if (!nome) {
    throw new Error(
      "Informe o nome da despesa."
    );
  }


  if (
    !Number.isFinite(valor) ||
    valor <= 0
  ) {
    throw new Error(
      "Informe um valor válido para a despesa."
    );
  }


  /* =====================================================
     NÚMERO GLOBAL
     ===================================================== */

  const ultimaLinha =
    sheet.getLastRow();

  let maiorNumero = 0;


  if (ultimaLinha >= 2) {

    const numeros =
      sheet
        .getRange(
          2,
          1,
          ultimaLinha - 1,
          1
        )
        .getValues();


    numeros.forEach(linha => {

      const numero =
        Number(
          String(linha[0] || "")
            .replace(/\D/g, "")
        );

      if (
        Number.isFinite(numero) &&
        numero > maiorNumero
      ) {
        maiorNumero = numero;
      }

    });

  }


  const numero =
    maiorNumero + 1;


  /* =====================================================
     GRAVAR
     ===================================================== */

  const agora =
    new Date();


  sheet.appendRow([
    numero,       // A Numero
    evento,       // B Evento
    nome,         // C Nome
    valor,        // D Valor
    fornecedor,   // E FornecedorEmpresa
    responsavel,  // F Responsavel
    contato,      // G ContatoFornecedor
    "Pendente",   // H Status
    observacao,   // I Observacao
    agora,        // J CriadoEm
    "",           // K DataPagamento
    "",           // L FormaPagamento
    ""            // M ComprovantePagamento
  ]);


  return {
    numero,
    evento,
    nome,
    valor,
    status: "Pendente"
  };

}

/* =====================================================
   LISTAR DESPESAS
   ===================================================== */

function listarDespesas_(
  token,
  evento
) {

  validarSessao_(token);

  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "Despesas"
    );

  if (!sheet) {
    throw new Error(
      "A aba Despesas não existe."
    );
  }


  const eventoAtual =
    String(
      evento ||
      "MTB2026"
    )
      .trim()
      .toUpperCase();


  if (
    eventoAtual !== "MTB2026" &&
    eventoAtual !== "TRAIL2026"
  ) {
    throw new Error(
      "Evento inválido."
    );
  }


  const ultimaLinha =
    sheet.getLastRow();


  if (ultimaLinha < 2) {

    return {
      despesas: []
    };

  }


  const dados =
    sheet
      .getRange(
        2,
        1,
        ultimaLinha - 1,
        13
      )
      .getValues();


  const despesas =
    dados
      .filter(linha => {

        const eventoLinha =
          String(
            linha[1] || ""
          )
            .trim()
            .toUpperCase();

        return (
          eventoLinha ===
          eventoAtual
        );

      })
      .map(linha => {

        return {

          numero:
            linha[0],

          evento:
            linha[1],

          nome:
            linha[2],

          valor:
            Number(
              linha[3] || 0
            ),

          fornecedorEmpresa:
            linha[4],

          responsavel:
            linha[5],

          contatoFornecedor:
            linha[6],

          status:
            linha[7],

          observacao:
            linha[8],

          criadoEm:
            linha[9],

          dataPagamento:
            linha[10],

          formaPagamento:
            linha[11],

          comprovantePagamento:
            linha[12]

        };

      })
      .sort(
        (a, b) =>
          Number(b.numero || 0) -
          Number(a.numero || 0)
      );


  return {
    despesas
  };

}
/* =====================================================
   EDITAR DESPESA
   ===================================================== */

function editarDespesa_(
  token,
  dados
) {

  validarSessao_(token);

  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Despesas");

  if (!sheet) {
    throw new Error(
      "A aba Despesas não existe."
    );
  }


  /* =====================================================
     IDENTIFICAÇÃO
     ===================================================== */

  const numero =
    Number(dados?.numero || 0);

  const evento =
    String(
      dados?.evento || ""
    )
      .trim()
      .toUpperCase();


  if (!numero) {
    throw new Error(
      "Número da despesa inválido."
    );
  }


  if (
    evento !== "MTB2026" &&
    evento !== "TRAIL2026"
  ) {
    throw new Error(
      "Evento inválido."
    );
  }


  /* =====================================================
     NOVOS DADOS
     ===================================================== */

  const nome =
    String(
      dados?.nome || ""
    ).trim();

  const valor =
    Number(
      dados?.valor || 0
    );

  const fornecedor =
    String(
      dados?.fornecedorEmpresa || ""
    ).trim();

  const responsavel =
    String(
      dados?.responsavel || ""
    ).trim();

  const contato =
    String(
      dados?.contatoFornecedor || ""
    ).trim();

  const observacao =
    String(
      dados?.observacao || ""
    ).trim();


  if (!nome) {
    throw new Error(
      "Informe o nome da despesa."
    );
  }


  if (
    !Number.isFinite(valor) ||
    valor <= 0
  ) {
    throw new Error(
      "Informe um valor válido."
    );
  }


  /* =====================================================
     LOCALIZAR DESPESA
     ===================================================== */

  const ultimaLinha =
    sheet.getLastRow();


  if (ultimaLinha < 2) {
    throw new Error(
      "Despesa não encontrada."
    );
  }


  const registros =
    sheet
      .getRange(
        2,
        1,
        ultimaLinha - 1,
        13
      )
      .getValues();


  let linhaPlanilha = 0;


  for (
    let i = 0;
    i < registros.length;
    i++
  ) {

    const numeroLinha =
      Number(
        registros[i][0] || 0
      );

    const eventoLinha =
      String(
        registros[i][1] || ""
      )
        .trim()
        .toUpperCase();


    if (
      numeroLinha === numero &&
      eventoLinha === evento
    ) {

      linhaPlanilha =
        i + 2;

      break;
    }

  }


  if (!linhaPlanilha) {
    throw new Error(
      "Despesa não encontrada."
    );
  }


  /* =====================================================
     ATUALIZAR
     ===================================================== */

  sheet
    .getRange(
      linhaPlanilha,
      3,
      1,
      7
    )
    .setValues([
      [
        nome,          // C Nome
        valor,         // D Valor
        fornecedor,    // E FornecedorEmpresa
        responsavel,   // F Responsavel
        contato,       // G ContatoFornecedor

        // H Status - preserva o atual
        sheet
          .getRange(
            linhaPlanilha,
            8
          )
          .getValue(),

        observacao     // I Observacao
      ]
    ]);


  return {
    numero,
    evento,
    nome,
    valor,
    mensagem:
      "Despesa atualizada com sucesso."
  };

}

/* =====================================================
   EXCLUIR DESPESA
   ===================================================== */

function excluirDespesa_(
  token,
  dados
) {

  validarSessao_(token);

  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Despesas");

  if (!sheet) {
    throw new Error(
      "A aba Despesas não existe."
    );
  }


  /* =====================================================
     IDENTIFICAÇÃO
     ===================================================== */

  const numero =
    Number(
      dados?.numero || 0
    );

  const evento =
    String(
      dados?.evento || ""
    )
      .trim()
      .toUpperCase();


  if (!numero) {
    throw new Error(
      "Número da despesa inválido."
    );
  }


  if (
    evento !== "MTB2026" &&
    evento !== "TRAIL2026"
  ) {
    throw new Error(
      "Evento inválido."
    );
  }


  /* =====================================================
     LOCALIZAR DESPESA
     ===================================================== */

  const ultimaLinha =
    sheet.getLastRow();


  if (ultimaLinha < 2) {
    throw new Error(
      "Despesa não encontrada."
    );
  }


  const registros =
    sheet
      .getRange(
        2,
        1,
        ultimaLinha - 1,
        2
      )
      .getValues();


  let linhaPlanilha = 0;


  for (
    let i = 0;
    i < registros.length;
    i++
  ) {

    const numeroLinha =
      Number(
        registros[i][0] || 0
      );

    const eventoLinha =
      String(
        registros[i][1] || ""
      )
        .trim()
        .toUpperCase();


    if (
      numeroLinha === numero &&
      eventoLinha === evento
    ) {

      linhaPlanilha =
        i + 2;

      break;
    }

  }


  if (!linhaPlanilha) {
    throw new Error(
      "Despesa não encontrada."
    );
  }


  /* =====================================================
     EXCLUIR
     ===================================================== */

  sheet.deleteRow(
    linhaPlanilha
  );


  return {
    numero,
    evento,
    mensagem:
      "Despesa excluída com sucesso."
  };

}

/* =====================================================
   UPLOAD DE ANEXO - DESPESA
   ===================================================== */

function uploadAnexoDespesa_(body) {

  if (
    !body ||
    !body.token
  ) {
    throw new Error(
      "Sessão não informada."
    );
  }

  validarSessao_(
    body.token
  );


  const numero =
    Number(
      body.numero || 0
    );

  const evento =
    String(
      body.evento || ""
    )
      .trim()
      .toUpperCase();

  const nomeOriginal =
    String(
      body.nome || "arquivo"
    ).trim();

  const mimeType =
    String(
      body.mimeType ||
      "application/octet-stream"
    ).trim();

  const base64 =
    String(
      body.arquivoBase64 || ""
    ).trim();


  if (!numero) {
    throw new Error(
      "Número da despesa não informado."
    );
  }


  if (
    evento !== "MTB2026" &&
    evento !== "TRAIL2026"
  ) {
    throw new Error(
      "Evento inválido."
    );
  }


  if (!base64) {
    throw new Error(
      "Arquivo não informado."
    );
  }


  /* LIMITE APROXIMADO DE 5 MB */

  if (
    base64.length >
    7 * 1024 * 1024
  ) {
    throw new Error(
      "Arquivo muito grande. O limite é de 5 MB."
    );
  }


  /* =====================================================
     CONFIRMA SE A DESPESA EXISTE
     ===================================================== */

  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "Despesas"
    );

  if (!sheet) {
    throw new Error(
      "A aba Despesas não existe."
    );
  }


  const ultimaLinha =
    sheet.getLastRow();

  let despesa = null;


  if (ultimaLinha >= 2) {

    const dados =
      sheet
        .getRange(
          2,
          1,
          ultimaLinha - 1,
          13
        )
        .getValues();


    for (
      let i = 0;
      i < dados.length;
      i++
    ) {

      if (
        Number(dados[i][0]) === numero &&
        String(
          dados[i][1] || ""
        )
          .trim()
          .toUpperCase() === evento
      ) {

        despesa = {
          numero:
            dados[i][0],

          evento:
            dados[i][1],

          nome:
            dados[i][2]
        };

        break;
      }

    }

  }


  if (!despesa) {
    throw new Error(
      "Despesa não encontrada."
    );
  }


  /* =====================================================
     GOOGLE DRIVE
     ===================================================== */

  try {

    const root =
      DriveApp.getFolderById(
        DRIVE_ROOT_FOLDER_ID
      );


    const folderName =
      "DESPESA-" +
      String(numero)
        .padStart(
          3,
          "0"
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


    const nomeLimpo =
      sanitizarNomeArquivo_(
        despesa.nome ||
        "Despesa"
      );


    const extensao =
      obterExtensao_(
        nomeOriginal,
        mimeType
      );


    const nomeFinal =
      String(numero)
        .padStart(
          3,
          "0"
        ) +
      " - " +
      nomeLimpo +
      " - " +
      Date.now() +
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


    const file =
      folder.createFile(
        blob
      );


    return {

      numero:
        numero,

      evento:
        evento,

      nome:
        file.getName(),

      fileId:
        file.getId(),

      mimeType:
        file.getMimeType(),

      tamanho:
        file.getSize()

    };


  } catch (erro) {

    throw new Error(
      "Erro ao salvar anexo no Google Drive: " +
      erro.message
    );

  }

}

/* =====================================================
   LISTAR ANEXOS DA DESPESA
   ===================================================== */

function listarAnexosDespesa_(
  token,
  numero,
  evento
) {

  validarSessao_(token);


  numero =
    Number(
      numero || 0
    );


  evento =
    String(
      evento || ""
    )
      .trim()
      .toUpperCase();


  if (!numero) {
    throw new Error(
      "Número da despesa não informado."
    );
  }


  if (
    evento !== "MTB2026" &&
    evento !== "TRAIL2026"
  ) {
    throw new Error(
      "Evento inválido."
    );
  }


  /* =====================================================
     CONFIRMA SE A DESPESA EXISTE
     ===================================================== */

  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      "Despesas"
    );


  if (!sheet) {
    throw new Error(
      "A aba Despesas não existe."
    );
  }


  const ultimaLinha =
    sheet.getLastRow();


  let encontrada = false;


  if (ultimaLinha >= 2) {

    const dados =
      sheet
        .getRange(
          2,
          1,
          ultimaLinha - 1,
          13
        )
        .getValues();


    for (
      let i = 0;
      i < dados.length;
      i++
    ) {

      if (
        Number(dados[i][0]) === numero &&
        String(
          dados[i][1] || ""
        )
          .trim()
          .toUpperCase() === evento
      ) {

        encontrada = true;

        break;
      }

    }

  }


  if (!encontrada) {
    throw new Error(
      "Despesa não encontrada."
    );
  }


  /* =====================================================
     LOCALIZA A PASTA
     ===================================================== */

  const root =
    DriveApp.getFolderById(
      DRIVE_ROOT_FOLDER_ID
    );


  const folderName =
    "DESPESA-" +
    String(numero)
      .padStart(
        3,
        "0"
      );


  const folders =
    root.getFoldersByName(
      folderName
    );


  /*
   * Despesa pode existir sem anexos.
   */

  if (!folders.hasNext()) {

    return {
      anexos: []
    };

  }


  const folder =
    folders.next();


  const files =
    folder.getFiles();


  const anexos = [];


  while (files.hasNext()) {

    const file =
      files.next();


    anexos.push({

      fileId:
        file.getId(),

      nome:
        file.getName(),

      mimeType:
        file.getMimeType(),

      tamanho:
        file.getSize(),

      criadoEm:
        file.getDateCreated()

    });

  }


  return {
    anexos
  };

}