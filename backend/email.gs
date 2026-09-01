/* =====================================================
   E-MAIL DE PAGAMENTO CONFIRMADO - MULTI-EVENTOS
   ===================================================== */

function enviarEmailPagamentoConfirmado_(dados) {

  if (!dados.email) {
    return;
  }


  const numero =
    String(
      dados.numeroInscricao || ''
    );

  const nome =
    String(
      dados.nome || ''
    );

  const categoria =
    String(
      dados.categoria || ''
    );

  const valor =
    Number(
      dados.valor || 0
    );


  const evento =
    String(
      dados.evento || 'MTB2026'
    )
      .trim()
      .toUpperCase();


  const valorFormatado =
    valor
      .toFixed(2)
      .replace('.', ',');


  /* =================================================
     DADOS DO EVENTO
     ================================================= */

  const isTrail =
    evento === 'TRAIL2026';


  const nomeEvento =
    isTrail
      ? 'Itaitinga Trail Run'
      : 'Itaitinga MTB Race';


  const tituloEvento =
    isTrail
      ? 'ITAITINGA TRAIL RUN'
      : 'ITAITINGA MTB RACE';


  const modalidade =
    isTrail
      ? 'TRAIL RUN 2026'
      : 'XCP 2026';


  const textoPreparacao =
    isTrail
      ? 'Agora é preparar os treinos e as pernas. 🏃'
      : 'Agora é preparar a bike e os treinos. 🚵‍♂️';


  /* =================================================
     ASSUNTO
     ================================================= */

  const assunto =
    `Pagamento confirmado - ${nomeEvento} #${numero}`;


  /* =================================================
     HTML
     ================================================= */

  const html = `
    <div style="
      font-family:Arial,Helvetica,sans-serif;
      max-width:600px;
      margin:0 auto;
      color:#222;
    ">

      <div style="
        background:#111;
        color:#fff;
        padding:24px;
        text-align:center;
      ">

        <h1 style="
          margin:0;
          font-size:24px;
        ">
          ${tituloEvento}
        </h1>

        <p style="
          margin:8px 0 0;
          font-size:14px;
        ">
          ${modalidade}
        </p>

      </div>


      <div style="
        padding:28px;
      ">

        <h2 style="
          margin-top:0;
        ">
          Pagamento confirmado! ✅
        </h2>


        <p>
          Olá, <strong>${nome}</strong>.
        </p>


        <p>
          Recebemos a confirmação do seu pagamento.
          Sua inscrição no
          <strong>${nomeEvento} 2026</strong>
          está confirmada.
        </p>


        <div style="
          background:#f4f4f4;
          border-radius:8px;
          padding:20px;
          margin:24px 0;
        ">

          <p style="margin:6px 0;">
            <strong>Inscrição:</strong>
            #${numero}
          </p>

          <p style="margin:6px 0;">
            <strong>Categoria:</strong>
            ${categoria}
          </p>

          <p style="margin:6px 0;">
            <strong>Valor:</strong>
            R$ ${valorFormatado}
          </p>

          <p style="margin:6px 0;">
            <strong>Status:</strong>
            CONFIRMADA
          </p>

        </div>


        <p>
          ${textoPreparacao}
        </p>

        <p>
          Nos vemos na largada!
        </p>

      </div>


      <div style="
        border-top:1px solid #ddd;
        padding:18px;
        text-align:center;
        font-size:12px;
        color:#777;
      ">

        ${nomeEvento} — ${modalidade}

      </div>

    </div>
  `;


  MailApp.sendEmail({

    to:
      dados.email,

    subject:
      assunto,

    htmlBody:
      html,

    name:
      nomeEvento
  });

}

function testarEmailPagamentoConfirmimado() {

  enviarEmailPagamentoConfirmado_({

    numeroInscricao:
      '999',

    nome:
      'ATLETA TESTE',

    email:
      'caio.ti@live.com',

    categoria:
      'Sport Masculino',

    valor:
      80

  });

}