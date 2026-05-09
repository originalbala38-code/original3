import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Search, User, ShoppingCart, Star, ChevronLeft, ChevronRight,
  Zap, Truck, ShieldCheck, Clock, Eye, Package, Store, MessageCircle,
  Lock, RotateCcw, BadgeCheck, Headphones, X,
} from "lucide-react";
import lojaEletroLogo from "@/assets/loja-eletro-logo.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lavadora de Alta Pressão Vonder LAV 1300 - 1.300 lbf/pol²" },
      { name: "description", content: "Lavadora de Alta Pressão Vonder LAV 1300 com 81% OFF. Frete grátis, envio imediato e garantia de 1 ano." },
      { property: "og:title", content: "Lavadora Vonder LAV 1300 - 81% OFF" },
      { property: "og:description", content: "Oferta relâmpago: R$ 67,90 com frete grátis e envio imediato." },
      { property: "og:image", content: "https://obtjwxuspfvhnijncwud.supabase.co/storage/v1/object/public/product-images/lav1300-01.webp" },
    ],
    links: [
      { rel: "preconnect", href: "https://obtjwxuspfvhnijncwud.supabase.co", crossOrigin: "" },
      { rel: "preload", as: "image", href: "https://obtjwxuspfvhnijncwud.supabase.co/storage/v1/object/public/product-images/lav1300-01.webp", fetchpriority: "high" },
    ],
  }),
  component: ProductPage,
});

const IMG_BASE = "https://obtjwxuspfvhnijncwud.supabase.co/storage/v1/object/public/product-images";
const productImages = [1, 2, 3, 4, 5, 6].map((n) => `${IMG_BASE}/lav1300-0${n}.webp`);

const reviews = [
  { initial: "C", name: "Carlos M.", date: "06 abr. 2026", text: "Meu marido ainda estava montando ela. A montagem é bem simples. Veio completa, como está no anúncio. Chegou dentro do prazo, tudo certinho! Indico o vendedor e o produto!", photos: [`${IMG_BASE}/reviews/review1-1.webp`, `${IMG_BASE}/reviews/review1-2.webp`, `${IMG_BASE}/reviews/review1-3.webp`] },
  { initial: "F", name: "Fernanda S.", date: "04 abr. 2026", text: "Produto chegou conforme a descrição, ainda não testei, a entrega foi rápida parabéns ao vendedor, agora vamos testar.", photos: [`${IMG_BASE}/reviews/review2-1.webp`, `${IMG_BASE}/reviews/review2-2.webp`] },
  { initial: "R", name: "Roberto L.", date: "03 abr. 2026", text: "Chegou antes do prazo. Vendedor atencioso. Recomendo o produto. Adorei!", photos: [`${IMG_BASE}/reviews/review3-1.webp`, `${IMG_BASE}/reviews/review3-2.webp`] },
  { initial: "A", name: "Ana Paula R.", date: "01 abr. 2026", text: "Muito boa a máquina, recomendo ☺️, chegou antes da data prevista, o valor compensa muito. Chegou tudo certinho e bem embalado. 👍🏼", photos: [`${IMG_BASE}/reviews/review4-1.webp`, `${IMG_BASE}/reviews/review4-2.webp`] },
  { initial: "J", name: "João Pedro A.", date: "31 mar. 2026", text: "Ótimo produto, vendedor rápido e eficiente. Mercadoria chegou antes do esperado, recomendo a todos.", photos: [`${IMG_BASE}/reviews/review5-1.webp`, `${IMG_BASE}/reviews/review5-2.webp`] },
];

const otherProducts = [
  { title: "Mini Aspirador de Pó Portátil 3 em 1 Recarregável 6000Pa", price: "R$ 26,99", old: "R$ 129,90", img: "https://svzmueexktjqcssaitzp.supabase.co/storage/v1/object/public/product-images/aspirador/asp1.webp" },
  { title: "Caixa de Som Boombox 3 Bluetooth Preta", price: "R$ 149,00", old: "R$ 899,00", img: "https://http2.mlstatic.com/D_NQ_NP_2X_932616-MLA99475097854_112025-F.webp" },
  { title: "Bicicleta Ergométrica Fitness 6kg Inércia Sevenfit", price: "R$ 147,00", old: "R$ 1.094,00", img: "https://http2.mlstatic.com/D_NQ_NP_2X_679526-MLA100501405537_122025-F.webp" },
  { title: "Ar Condicionado Portátil HQ 8.500 BTU/h", price: "R$ 92,80", old: "R$ 754,44", img: "https://down-br.img.susercontent.com/file/sg-11134201-7renf-m8lxuc60fdsy07" },
  { title: "Piscina Borda Inflável 1000 Litros Pixlar", price: "R$ 69,99", old: "R$ 139,99", img: "https://down-br.img.susercontent.com/file/sg-11134201-82260-mhoz9j95dloj8d" },
  { title: "Câmera Instax Mini 12 + Filme 60 Poses", price: "R$ 69,90", old: "R$ 497,90", img: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lydweugeyjad30" },
];

function useCountdown(seconds: number) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function ProductPage() {
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number; name: string } | null>(null);
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((l) => l && { ...l, index: (l.index + 1) % l.photos.length });
      if (e.key === "ArrowLeft") setLightbox((l) => l && { ...l, index: (l.index - 1 + l.photos.length) % l.photos.length });
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lightbox]);
  const [voltage, setVoltage] = useState<"127V" | "220V">("127V");
  const countdown = useCountdown(60 * 17);

  const next = () => setImgIdx((i) => (i + 1) % productImages.length);
  const prev = () => setImgIdx((i) => (i - 1 + productImages.length) % productImages.length);

  return (
    <div className="min-h-screen bg-muted/40 pb-28">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="mx-auto max-w-2xl flex items-center gap-2 px-3 py-3">
          <button className="p-2 rounded-full hover:bg-muted"><ArrowLeft className="size-5" /></button>
          <div className="flex-1 relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="w-full bg-muted rounded-full pl-9 pr-3 py-2 text-sm outline-none" placeholder="Pesquisar" />
          </div>
          <button className="p-2 rounded-full hover:bg-muted"><User className="size-5" /></button>
          <button className="p-2 rounded-full hover:bg-muted"><ShoppingCart className="size-5" /></button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl bg-background">
        {/* Gallery */}
        <div className="relative bg-background">
          <div className="zoom-hover w-full aspect-square">
            <img key={imgIdx} src={productImages[imgIdx]} alt={`Lavadora Vonder LAV 1300 - imagem ${imgIdx + 1}`} width={800} height={800} loading={imgIdx === 0 ? "eager" : "lazy"} fetchPriority={imgIdx === 0 ? "high" : "auto"} decoding="async" className="w-full h-full object-contain img-fade" />
          </div>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 border rounded-full p-2 shadow"><ChevronLeft className="size-5" /></button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 border rounded-full p-2 shadow"><ChevronRight className="size-5" /></button>
          <div className="absolute bottom-3 right-3 bg-foreground/70 text-background text-xs px-2 py-1 rounded-full">{imgIdx + 1} / {productImages.length}</div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {productImages.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`size-1.5 rounded-full ${i === imgIdx ? "bg-foreground" : "bg-foreground/30"}`} />
            ))}
          </div>
        </div>

        {/* Flash offer banner */}
        <div className="bg-flash text-flash-foreground px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-background text-flash text-xs font-bold px-1.5 py-0.5 rounded">-81%</span>
            <div className="text-xl font-bold leading-none">R$ 67,90 <span className="text-sm font-normal line-through opacity-80 ml-1">R$ 364,90</span></div>
          </div>
          <div className="text-right leading-tight">
            <div className="flex items-center gap-1 text-xs font-semibold justify-end"><Zap className="size-3.5" /> OFERTA RELÂMPAGO</div>
            <div className="text-xs">Encerra em <span className="font-mono font-bold">{countdown}</span></div>
          </div>
        </div>

        {/* Tags + title */}
        <div className="px-4 pt-4 space-y-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-warning text-warning-foreground px-2 py-1 rounded-md font-semibold">81% OFF</span>
            <span className="bg-warning text-warning-foreground px-2 py-1 rounded-md font-semibold">Frete Grátis</span>
            <span className="bg-warning text-warning-foreground px-2 py-1 rounded-md font-semibold">Envio Imediato</span>
            <span className="bg-success text-success-foreground px-2 py-1 rounded-md font-semibold">Garantia 1 ano</span>
          </div>
          <h1 className="text-lg font-bold leading-snug">Lavadora de Alta Pressão Vonder LAV 1300 - 1.300 lbf/pol²</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">4.8</span>
            <span>(456)</span>
            <span>|</span>
            <span>+9.547 vendido(s)</span>
          </div>

          {/* Voltage */}
          <div className="space-y-2">
            <div className="text-sm"><span className="font-semibold">Voltagem:</span> {voltage} <span className="text-danger ml-2">{voltage === "127V" ? "4" : "3"} unidades disponíveis</span></div>
            <div className="flex gap-2">
              {(["127V", "220V"] as const).map((v) => (
                <button key={v} onClick={() => setVoltage(v)} className={`relative px-4 py-2 rounded-lg border-2 text-sm font-medium ${voltage === v ? "border-primary text-primary" : "border-border"}`}>
                  {v}
                  <span className="absolute -top-2 -right-2 bg-danger text-danger-foreground text-[10px] rounded-full size-5 flex items-center justify-center font-bold">{v === "127V" ? 4 : 3}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock bar */}
          <div className="border-2 border-dashed border-danger/40 bg-danger/5 rounded-lg p-3">
            <div className="flex justify-between text-sm font-semibold text-danger">
              <span className="flex items-center gap-1.5"><Clock className="size-4" /> Estoque acabando</span>
              <span>4 unidades</span>
            </div>
            <div className="mt-2 h-1.5 bg-danger/20 rounded-full overflow-hidden">
              <div className="h-full w-[15%] bg-danger rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="border rounded-lg p-3 flex items-center gap-2">
              <Eye className="size-5 text-primary" />
              <div className="text-xs"><div className="font-bold">127 pessoas</div><div className="text-muted-foreground">vendo agora</div></div>
            </div>
            <div className="border rounded-lg p-3 flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <div className="text-xs"><div className="font-bold">+38 vendidos</div><div className="text-muted-foreground">nas últimas 24h</div></div>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="mx-4 mt-4 border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Truck className="size-5 text-success-foreground" />
            <div className="flex-1">
              <div className="text-sm"><span className="font-bold text-success-foreground">Frete grátis</span> Receba até 24 de abr</div>
              <div className="text-xs text-muted-foreground">Taxa de envio: <span className="line-through">R$ 29,00</span></div>
            </div>
          </div>
        </div>

        {/* Customer protection */}
        <div className="mx-4 mt-4 border rounded-lg p-4">
          <div className="font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="size-5 text-success-foreground" /> Proteção do cliente</div>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li>• Garantia de 1 ano do fabricante</li>
            <li>• Devolução gratuita em 7 dias</li>
            <li>• Reembolso automático por danos</li>
            <li>• Pagamento seguro</li>
          </ul>
          <div className="mt-3 bg-success/40 rounded-md p-3 text-sm">
            <div className="font-semibold">Garantia de 1 ano</div>
            <div className="text-muted-foreground text-xs mt-1">Cobertura completa contra defeitos de fabricação por 12 meses, direto com o fabricante. Troca ou reparo sem custo adicional.</div>
          </div>
        </div>

        {/* Description */}
        <section className="px-4 mt-6 space-y-4">
          <h2 className="text-xl font-bold">Descrição</h2>
          <p className="font-semibold">Por que escolher a Lavadora Vonder LAV 1300?</p>
          <ul className="space-y-3 text-sm">
            {[
              ["Potência de 1.300 libras", "Remove as sujeiras mais difíceis em qualquer superfície, deixando tudo impecável em minutos."],
              ["Motor universal de 1.200W", "Alto desempenho com baixo consumo de energia, ideal para uso doméstico."],
              ["Sistema Stop Total", "Desliga automaticamente quando o gatilho não está pressionado, garantindo maior vida útil e economia."],
              ["Bico ajustável", "Alterne entre jato leque e jato concentrado conforme a necessidade da limpeza."],
              ["Compacta e leve (4,2 kg)", "Fácil de transportar e armazenar, com alça ergonômica e suporte para pistola."],
              ["Reservatório externo para detergente", "Praticidade na aplicação de produtos de limpeza."],
            ].map(([t, d]) => (
              <li key={t}><span className="text-success-foreground font-bold">✔ {t}</span><br /><span className="text-muted-foreground">{d}</span></li>
            ))}
          </ul>

          <h3 className="font-bold pt-2">Especificações Técnicas</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Pressão máxima: 1.300 lbf/pol² – 90 bar – 9 MPa</li>
            <li>• Pressão nominal: 870 lbf/pol² – 60 bar – 6 MPa</li>
            <li>• Potência: 1.200W (1,3 cv/hp)</li>
            <li>• Vazão máxima: 390 litros/hora – 6,5 litros/min</li>
            <li>• Vazão nominal: 300 litros/hora – 5 litros/min</li>
            <li>• Nível de ruído: 75 dB(A)</li>
            <li>• Pistões da bomba em Aço Inox</li>
            <li>• Frequência: 60 Hz</li>
            <li>• Peso: 4,2 kg</li>
          </ul>

          <h3 className="font-bold pt-2">Ideal para</h3>
          <ul className="text-sm space-y-1">
            <li>✔ Lavar carros, motos e bicicletas</li>
            <li>✔ Limpar calçadas, quintais e garagens</li>
            <li>✔ Higienizar fachadas e muros</li>
            <li>✔ Lavar pisos, decks e áreas externas</li>
          </ul>

          <h3 className="font-bold pt-2">O que você recebe</h3>
          <ul className="text-sm space-y-1">
            <li>✔ 1 Lavadora de Alta Pressão LAV 1300</li>
            <li>✔ 1 Pistola com gatilho</li>
            <li>✔ 1 Lança com bico ajustável</li>
            <li>✔ 1 Mangueira de alta pressão com 3m</li>
            <li>✔ 1 Acessório para detergente</li>
            <li>✔ 1 Conector engate rápido 1/2"</li>
          </ul>
        </section>

        {/* Store card */}
        <section className="mx-4 mt-6 border rounded-lg p-4 flex items-center gap-3">
          <img src={lojaEletroLogo} alt="Loja Eletro" className="size-14 rounded-full object-cover" />
          <div className="flex-1">
            <div className="font-bold">Loja Eletro</div>
            <div className="text-xs text-success-foreground">● Online</div>
            <div className="text-xs text-muted-foreground">4.98 | +16 mil vendas | 98% positivas</div>
          </div>
          <button className="px-3 py-1.5 border rounded-md text-sm font-medium">Visitar</button>
        </section>

        {/* Buy with safety */}
        <section className="px-4 mt-6 space-y-3">
          <h2 className="text-xl font-bold">Compre com segurança</h2>
          <p className="text-sm text-muted-foreground">Ambiente 100% seguro · SSL 256 bits · LGPD</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              [Lock, "Compra protegida", "Reembolso garantido se algo der errado"],
              [Truck, "Envio rastreado", "Acompanhe seu pedido em tempo real"],
              [ShieldCheck, "Garantia de 1 ano", "Cobertura completa do fabricante por 12 meses"],
              [RotateCcw, "7 dias para troca", "Devolução grátis conforme CDC"],
              [BadgeCheck, "+8 anos no mercado", "Loja oficial com mais de 12 mil pedidos entregues"],
              [Headphones, "Suporte humano", "Seg-Sáb 8h-20h via WhatsApp e e-mail"],
            ].map(([Icon, t, d]: any) => (
              <div key={t} className="border rounded-lg p-3">
                <Icon className="size-5 text-primary mb-1.5" />
                <div className="font-semibold text-sm">{t}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 pt-2">
            <li>• Pagamento processado pelo SPI do Banco Central</li>
            <li>• Não armazenamos dados de cartão ou bancários</li>
            <li>• Nota fiscal eletrônica enviada por e-mail</li>
          </ul>
        </section>

        {/* Reviews */}
        <section className="px-4 mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold">Avaliações dos clientes (456)</h2>
            <div className="text-sm font-bold">4.8/5</div>
          </div>
          <div className="mt-4 space-y-5">
            {reviews.map((r) => (
              <div key={r.name} className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{r.initial}</div>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.date}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm mt-2 text-muted-foreground">{r.text}</p>
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {r.photos.map((p, i) => (
                    <button key={i} onClick={() => setLightbox({ photos: r.photos, index: i, name: r.name })} className="shrink-0">
                      <img src={p} alt={`Foto da avaliação de ${r.name}`} width={80} height={80} loading="lazy" decoding="async" className="size-20 rounded-md object-cover border hover:opacity-80 transition" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 border rounded-lg text-sm font-medium">Ver mais avaliações (451 restantes)</button>
        </section>

        {/* Other products */}
        <section className="px-4 mt-8">
          <div className="flex items-baseline justify-between">
            <h3 className="font-bold">Mais produtos da loja</h3>
            <a className="text-sm text-primary font-medium">Ver tudo</a>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {otherProducts.map((p) => (
              <div key={p.title} className="border rounded-lg overflow-hidden card-lift bg-background">
                <div className="zoom-hover w-full aspect-square bg-muted">
                  <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-2 space-y-1">
                  <div className="text-xs line-clamp-2 h-8">{p.title}</div>
                  <div className="text-sm font-bold text-primary">{p.price}</div>
                  <div className="text-xs text-muted-foreground line-through">{p.old}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
        <div className="mx-auto max-w-2xl flex items-center gap-2 p-3">
          <button className="flex flex-col items-center text-xs px-2"><Store className="size-5" />Loja</button>
          <button className="flex flex-col items-center text-xs px-2"><MessageCircle className="size-5" />Chat</button>
          <button className="relative flex flex-col items-center text-xs px-2">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="size-6 text-primary" />
            </div>
          </button>
          <Link to="/checkout" className="flex-1 bg-primary text-primary-foreground rounded-full py-3 font-bold leading-tight text-center animate-cta-pulse hover:brightness-110 transition">
            <div>R$ 67,90</div>
            <div className="text-xs font-normal">Comprar agora · Frete grátis</div>
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"><X className="size-6" /></button>
          <div className="absolute top-4 left-4 text-white text-sm">
            <div className="font-semibold">{lightbox.name}</div>
            <div className="text-xs opacity-75">{lightbox.index + 1} / {lightbox.photos.length}</div>
          </div>
          {lightbox.photos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.photos.length) % lightbox.photos.length }); }} className="absolute left-2 sm:left-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"><ChevronLeft className="size-6" /></button>
              <button onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.photos.length }); }} className="absolute right-2 sm:right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"><ChevronRight className="size-6" /></button>
            </>
          )}
          <img src={lightbox.photos[lightbox.index]} alt="" onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-[92vw] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}
