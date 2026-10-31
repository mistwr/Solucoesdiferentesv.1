# Captação de leads — Soluções Diferentes

Estado: implementação pendente. Não publicar antes de validar.

- Origem: solucoesdiferentes.pt
- Destino: SD Dialer, empresa Soluções Diferentes, sem vendedor atribuído.
- Email de aviso: misterluminai@gmail.com (via Resend, no servidor).
- Formulário: nome, telemóvel, código postal, serviço, operador, mensalidade, consentimento.
- Endpoint dedicado no SD Dialer com validação, limitação de pedidos, anti-spam e proteção de origem; nunca expor service-role key no browser.
- Duplicados: pesquisar apenas dentro do company_id, nunca atualizar leads de outras empresas.
- Guardar consentimento, data, origem e UTM; disponibilizar informação de privacidade.
- Confirmar ID da empresa no Supabase e configuração Resend antes de ativar.
- Testar submissão ponta a ponta em preview, incluindo falha de email, antes de deploy em produção.
