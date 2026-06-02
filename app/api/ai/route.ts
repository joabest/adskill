export async function POST(req: Request) {
  try {
    const body = await req.json()
    const inputText = String(body.inputText || "")

    if (!inputText.trim()) {
      return Response.json({ error: "Texto obrigatório." }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      const fallback = `Análise AdSkill AI\n\nFerramenta: ${body.toolType || "analisar"}\nNicho: ${body.niche || "não informado"}\nPlataforma: ${body.platform || "não informado"}\nPaís: ${body.country || "não informado"}\nTom: ${body.tone || "estratégico"}\n\n1. Promessa principal\nIdentifique uma transformação clara e específica para o público.\n\n2. Público-alvo\nDefina idade, desejo, dor e objeções antes de criar o anúncio.\n\n3. Ângulo de venda\nUse um gancho direto, demonstração simples e CTA objetivo.\n\n4. Melhorias\nCrie variações de headline, teste criativos UGC e evite promessas irreais.\n\nAdicione OPENAI_API_KEY na Vercel para ativar a IA real.`
      return Response.json({ success: true, result: fallback })
    }

    const systemPrompt = "Você é uma IA especialista em marketing de performance, copywriting, anúncios pagos, TikTok Ads, Meta Ads, dropshipping, quiz e VSL. Responda em português do Brasil. Não prometa resultados garantidos e não incentive fraude ou burlar políticas."
    const userPrompt = `Ferramenta: ${body.toolType}\nNicho: ${body.niche || "não informado"}\nPlataforma: ${body.platform || "não informado"}\nPaís: ${body.country || "não informado"}\nTom: ${body.tone || "estratégico"}\n\nConteúdo enviado:\n${inputText}`

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
        temperature: 0.8,
      }),
    })

    const data = await aiResponse.json()

    if (!aiResponse.ok) {
      return Response.json({ error: "Erro na API da IA." }, { status: 500 })
    }

    return Response.json({ success: true, result: data.choices?.[0]?.message?.content || "" })
  } catch {
    return Response.json({ error: "Erro ao gerar resposta com IA." }, { status: 500 })
  }
}
