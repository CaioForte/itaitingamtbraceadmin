ITaitinga MTB Race Admin - V5.9.6

CORREÇÕES DE PAGAMENTO
- ALTERAR PAGAMENTO no modal de detalhes agora usa delegação de eventos, evitando perda do clique após renderizações.
- ALTERAR STATUS no modal de detalhes também foi ligado por delegação e possui função completa.
- O modal de pagamento NÃO oferece Pago como alteração manual.
- Para registrar Pago, deve ser usado INSERIR COMPROVANTE.
- Ao enviar comprovante pelo modal de detalhes ou pelo modal de pagamento, o frontend envia o arquivo e em seguida registra Pago.
- O backend continua bloqueando Pago quando não existe comprovante.
- A inscrição é recarregada após o upload/alteração.

IMPORTANTE GOOGLE APPS SCRIPT
1. Substitua os arquivos do painel.
2. No Google Apps Script, substitua o Code.gs pelo backend/Code.gs desta versão.
3. Implante uma NOVA VERSÃO do Web App (Implantar > Gerenciar implantações > Editar > Nova versão).
4. Mantenha acesso conforme a configuração atual do projeto.
5. Faça Ctrl+F5 no navegador para limpar o JavaScript antigo.

V5.9.8: corrigido erro escapeHtml_ que impedia abrir os modais ALTERAR PAGAMENTO/STATUS. Mantido botão ALTERAR na tela Pagamentos.
