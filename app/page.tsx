"use client"

import { useMemo, useState } from "react"

type ToolType = "analisar" | "copies" | "tiktok" | "vsl" | "adaptar" | "criativo"

const tools = [
  { value: "analisar", label: "Analisar anúncio", description: "Promessa, público, dor, objeções e melhorias." },
  { value: "copies", label: "Gerar 10 copies", description: "Variações para Meta Ads, TikTok Ads e páginas." },
  { value: "tiktok", label: "Roteiro TikTok Ads", description: "Cena por cena com gancho, prova e CTA." },
  { value: "vsl", label: "Criar VSL", description: "Estrutura completa para vídeo de vendas." },
  { value: "adaptar", label: "Adaptar oferta gringa", description: "Traduz e adapta para o Brasil." },
  { value: "criativo", label: "Melhorar criativo", description: "Novos ângulos, cenas e headlines." },
] as const

export default function Home() {
  const [toolType, setToolType] = useState<ToolType>("analisar")
  const [inputText, setInputText] = useState("")
  const [niche, setNiche] = useState("")
  const [platform, setPlatform] = useState("TikTok Ads")
  const [country, setCountry] = useState("Brasil")
  const [tone, setTone] = useState("Estratégico")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const selectedTool = useMemo(() => tools.find((tool) => tool.value === toolType), [toolType])

  async function generate() {
    if (!inputText.trim()) {
      setError("Cole uma copy, anúncio ou descrição primeiro.")
      return
    }

    setLoading(true)
    setError("")
    setResult("")

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolType, inputText, niche, platform, country, tone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar resposta.")
      }

      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    if (result) await navigator.clipboard.writeText(result)
  }

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#101827] via-[#080b12] to-[#0b111d] p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_.8fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                AdSkill AI • Ad Spy + Copy Intelligence
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Analise anúncios e gere copies com IA.
              </h1>
              <p className="mt-5 max-w-2xl text-zinc-300">
                Plataforma estilo Adsparo para salvar ideias, estudar criativos, adaptar ofertas gringas e criar roteiros para tráfego pago.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Anúncios" value="1.248" />
              <Metric label="Copies" value="8.932" />
              <Metric label="Nichos" value="37" />
              <Metric label="Score" value="86%" />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-emerald-300">Ferramentas</p>
            <h2 className="mt-1 text-2xl font-bold">Modo da IA</h2>
            <div className="mt-5 space-y-3">
              {tools.map((tool) => (
                <button
                  key={tool.value}
                  onClick={() => setToolType(tool.value)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${toolType === tool.value ? "border-emerald-400/50 bg-emerald-400/10" : "border-white/10 bg-[#080b12] hover:bg-white/[0.06]"}`}
                >
                  <p className="font-bold">{tool.label}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{tool.description}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Nicho" value={niche} setValue={setNiche} placeholder="Beleza, quiz..." />
              <Select label="Plataforma" value={platform} setValue={setPlatform} options={["TikTok Ads", "Meta Ads", "Google Ads", "YouTube Ads", "Orgânico"]} />
              <Field label="País" value={country} setValue={setCountry} placeholder="Brasil" />
              <Select label="Tom" value={tone} setValue={setTone} options={["Estratégico", "Direto", "Curioso", "Premium", "Popular"]} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Entrada para {selectedTool?.label}</label>
                <textarea
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="Cole aqui o texto do anúncio, descrição do produto, link da oferta ou ideia de campanha..."
                  className="min-h-[410px] w-full resize-none rounded-3xl border border-white/10 bg-[#080b12] p-5 text-sm leading-7 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                />
                {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
                <button
                  onClick={generate}
                  disabled={loading}
                  className="mt-4 w-full rounded-2xl bg-emerald-400 px-5 py-4 font-black text-black transition hover:bg-emerald-300 disabled:opacity-60"
                >
                  {loading ? "Gerando..." : "Gerar com IA"}
                </button>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">Resultado</label>
                  <button onClick={copy} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 hover:text-emerald-300">Copiar</button>
                </div>
                <div className="min-h-[480px] rounded-3xl border border-white/10 bg-[#080b12] p-5">
                  {result ? (
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-zinc-200">{result}</pre>
                  ) : (
                    <div className="flex h-[430px] items-center justify-center text-center text-zinc-500">
                      O resultado da IA aparece aqui.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-2xl font-black">{value}</p><p className="text-xs text-zinc-400">{label}</p></div>
}

function Field({ label, value, setValue, placeholder }: { label: string; value: string; setValue: (value: string) => void; placeholder: string }) {
  return <div><label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</label><input value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm outline-none focus:border-emerald-400/50" /></div>
}

function Select({ label, value, setValue, options }: { label: string; value: string; setValue: (value: string) => void; options: string[] }) {
  return <div><label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</label><select value={value} onChange={(event) => setValue(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm outline-none focus:border-emerald-400/50">{options.map((option) => <option key={option}>{option}</option>)}</select></div>
}
