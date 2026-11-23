// Assistente do site solucoesdiferentes.pt (Groq). Recebe { messages } e devolve { reply }.
const SYSTEM = `És o assistente virtual da Soluções Diferentes (solucoesdiferentes.pt), uma empresa portuguesa de consultoria em telecomunicações e energia.
- Falas português de Portugal, simpático e direto, frases curtas, no máximo 4 a 5 frases por resposta.
- Ajudamos famílias e empresas a comparar operadores de telecomunicações (MEO, NOS, Vodafone, DIGI, NOWO) e fornecedores de energia (EDP, Galp, Iberdrola, Endesa, Repsol) e também painéis solares. A consultoria é gratuita e sem compromisso.
- Ferramentas: Simulador de Energia no site, MyPoupar+ (mypoupar.pt) e o SD Dialer para equipas comerciais.
- Nunca inventes preços, campanhas ou condições. Para valores concretos, pede a última fatura e encaminha para a equipa.
- Durante a época de Natal há a Campanha de Natal: revisão gratuita das faturas para começar o ano a pagar menos (não indiques datas-limite).
- Contactos: WhatsApp 915 006 353, email parcerias@solucoesdiferentes.pt.
- Escreve texto simples, sem markdown (sem asteriscos, sem cardinais, sem listas com símbolos).
- Termina, quando fizer sentido, com um próximo passo claro (WhatsApp ou simulador).`;

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };
  try {
    const body = JSON.parse(event.body || '{}');
    const msgs = Array.isArray(body.messages) ? body.messages : [];
    const history = msgs
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    if (!history.length) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Sem mensagens' }) };
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b', temperature: 0.5, max_tokens: 500, messages: [{ role: 'system', content: SYSTEM }, ...history] }),
    });
    const data = await r.json();
    const reply = (data?.choices?.[0]?.message?.content || '').replace(/\*\*|__|^#+\s*/gm, '').trim();
    if (!reply) return { statusCode: 502, headers, body: JSON.stringify({ reply: null, error: 'Sem resposta' }) };
    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ reply: null, error: 'Erro interno' }) };
  }
};
