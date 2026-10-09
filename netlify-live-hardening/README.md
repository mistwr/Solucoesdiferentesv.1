# LUMIN Security AI — atualização de segurança do site atualmente publicado na Netlify

**Site público:** https://solucoesdiferentes.pt/

**Projeto ativo:** Netlify `lighthearted-taiyaki-f11356` (Site ID `8b31a806-527a-4cab-82a6-5c914c95b083`).

## Problema identificado e confirmado

O site público responde com `Server: Netlify` e `Strict-Transport-Security`, mas não envia CSP, X-Frame-Options, Referrer-Policy ou X-Content-Type-Options. O LUMIN Security AI observa 1/5 dessas configurações.

**Não equivale a vulnerabilidades exploráveis confirmadas.**

## Correção preparada

O ficheiro `_headers` nesta pasta define:

- CSP com proibição de embedding (`frame-ancestors 'none'`), `object-src 'none'`, `base-uri 'self'`, restrições a fontes/imagens externas conhecidas e scripts/estilos inline necessários para o HTML antigo.
- `X-Frame-Options: DENY`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `X-Content-Type-Options: nosniff`.
- `Permissions-Policy` restritiva.
- HSTS de 1 ano, já observado na Netlify.

## Aplicação em produção: cuidado

O projeto Netlify ativo **não está ligado ao GitHub**. O último deploy está descrito pela Netlify como `Build from drop deployment` e inclui uma Netlify Function chamada `chat`. O projeto Vercel/GitHub `mistwr/Solucoesdiferentesv.1` é outro alojamento e a configuração `vercel.json` lá criada **não corrige** a publicação Netlify.

1. Obter a pasta de **publicação original** utilizada no projeto Netlify ativo, incluindo o código/função `chat` e quaisquer redirecionamentos, formulários e ficheiros.
2. **Adicionar** o ficheiro `_headers` à raiz dessa pasta de publicação (não o carregar como único ficheiro).
3. Antes de publicar, validar os recursos de imagens, fontes, scripts, chamadas à API e funcionalidade do chat perante a CSP. O HTML atual pode conter recursos de terceiros adicionais.
4. Publicar pelo fluxo Netlify existente, **preservando a função chat e todos os outros ficheiros**. Nunca substituir a publicação por uma pasta vazia apenas com `_headers`.
5. Testar de novo o domínio público no LUMIN Security AI. O resultado esperado para as cinco verificações de cabeçalhos é 5/5, se a nova resposta contiver as políticas.

**Estado:** ficheiro de configuração PREPARADO no GitHub; **NÃO aplicado nem confirmado em produção na Netlify**.

## Próximo passo para automação

Ligar a versão exata do site de produção Netlify a um repositório Git, incluindo o código-fonte da função de chat. A partir daí, as correções podem ser publicadas e testadas automaticamente sem dependência de drag-and-drop.
