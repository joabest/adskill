export async function POST(req: Request) {
  try {
    const body = await req.json()
    const inputText = String(body.inputText || "")

    if (!inputText.trim()) {
      return Response.json({ error: "Cole um anúncio, copy, produto ou oferta para analisar." }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "IA real não configurada. Adicione OPENAI_API_KEY nas variáveis de ambiente da Vercel e faça redeploy." },
        { status: 500 }
      )
    }

    const systemPrompt = "Você é uma IA especialista em marketing de performance, copywriting, anúncios pagos, TikTok Ads, Meta Ads, dropshipping, quiz e VSL. Responda em português do Brasil. Seja prático e específico. Não invente dados, métricas, faturamento ou resultados. Não prometa resultado garantido e não incentive fraude ou burlar políticas."
    const userPrompt = `Ferramenta: ${body.toolType}\nNicho: ${body.niche || "não informado"}\nPlataforma: ${body.platform || "não informado"}\nPaís: ${body.country || "não informado"}\nTom: ${body.tone || "estratégico"}\n\nConteúdo enviado pelo usuário:\n${inputText}\n\nEntregue uma resposta útil baseada apenas no conteúdo informado. Se faltar informação, diga o que precisa ser validado.`

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    })

    const data = await aiResponse.json()

    if (!aiResponse.ok) {
      return Response.json({ error: data?.error?.message || "Erro na API da IA." }, { status: 500 })
    }

    return Response.json({ success: true, result: data.choices?.[0]?.message?.content || "" })
  } catch {
    return Response.json({ error: "Erro ao gerar resposta com IA." }, { status: 500 })
  }
}
