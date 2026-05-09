import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, ShieldCheck, Star, Package, Truck, Lock, Minus, Plus } from "lucide-react";
import { Stepper, CheckoutHeader } from "@/components/checkout/Stepper";

export const Route = createFileRoute("/checkout/")({
  head: () => ({ meta: [{ title: "Resumo do pedido" }] }),
  component: CheckoutSummary,
});

const PRODUCT_IMG =
  "https://obtjwxuspfvhnijncwud.supabase.co/storage/v1/object/public/product-images/lav1300-01.webp";

function useCouponCountdown() {
  const [s, setS] = useState(30 * 60);
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function CheckoutSummary() {
  const [qty, setQty] = useState(1);
  const [shipping, setShipping] = useState<"normal" | "expresso">("normal");

  const countdown = useCouponCountdown();

  const unit = 67.9;
  const old = 364.9;
  const shipPrice = shipping === "expresso" ? 9.8 : 0;
  const subtotal = old * qty;
  const desconto = (old - unit) * qty;
  const total = unit * qty + shipPrice;
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  return (
    <div className="min-h-screen bg-muted/40 pb-32">
      <CheckoutHeader title="Resumo do pedido" />
      <div className="mx-auto max-w-2xl bg-background">
        <Stepper current={1} />

        <div className="px-4 pb-4 space-y-3">
          <div className="border-2 border-success-foreground/30 bg-success/30 rounded-lg p-3 flex items-center gap-3">
            <div className="size-10 rounded-full bg-success flex items-center justify-center">
              <Zap className="size-5 text-success-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-success-foreground">Pague no Pix e ganhe 5% OFF</div>
              <div className="text-xs text-muted-foreground">Aprovação na hora · Economize R$ 3,40</div>
            </div>
            <div className="text-right">
              <div className="text-xs line-through text-muted-foreground">R$ 67,90</div>
              <div className="font-bold text-success-foreground">R$ 64,50</div>
            </div>
          </div>

          <div className="bg-success/30 text-success-foreground rounded-lg py-2 text-center text-sm font-semibold flex items-center justify-center gap-2">
            <Lock className="size-4" /> Compra segura · SSL 256 bits · Dados protegidos
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="border rounded-lg p-2">
              <div className="flex items-center justify-center gap-1 font-bold"><Star className="size-4 fill-yellow-400 text-yellow-400" />4.9</div>
              <div className="text-[10px] text-muted-foreground">+2.300 avaliações</div>
            </div>
            <div className="border rounded-lg p-2">
              <div className="text-success-foreground font-bold flex items-center justify-center gap-1"><ShieldCheck className="size-4" />+12 mil</div>
              <div className="text-[10px] text-muted-foreground">Pedidos entregues</div>
            </div>
            <div className="border rounded-lg p-2">
              <div className="text-danger font-bold flex items-center justify-center gap-1"><Truck className="size-4" />24h</div>
              <div className="text-[10px] text-muted-foreground">Envio em até 24h</div>
            </div>
          </div>

          <div className="border-2 border-dashed border-danger/40 bg-danger/5 rounded-lg py-2 text-center text-sm text-danger font-semibold">
            ● 128 pessoas estão finalizando esta compra agora
          </div>
        </div>

        {/* Item */}
        <div className="px-4 py-4 border-t flex gap-3">
          <img src={PRODUCT_IMG} alt="produto" className="size-20 rounded-lg border object-contain bg-muted" />
          <div className="flex-1">
            <div className="text-sm font-medium leading-snug">Lavadora de Alta Pressão Vonder LAV 1300 - 1.300 lbf/pol²</div>
            <div className="text-xs mt-1"><span className="text-muted-foreground">Voltagem:</span> <span className="bg-warning text-warning-foreground px-1.5 py-0.5 rounded">127V</span></div>
            <div className="flex items-center justify-between mt-2">
              <div className="font-bold text-primary">{fmt(unit)}</div>
              <div className="flex items-center gap-3 border rounded-full px-2 py-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="size-6 rounded-full border flex items-center justify-center"><Minus className="size-3" /></button>
                <span className="text-sm font-semibold w-4 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Plus className="size-3" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Frete */}
        <div className="px-4 py-4 border-t space-y-2">
          <div className="font-bold">Frete</div>
          {[
            { id: "normal", name: "Frete", desc: "4 a 7 dias", price: "Grátis", priceClass: "text-success-foreground" },
            { id: "expresso", name: "Frete Expresso", desc: "2 a 4 dias", price: "R$ 9,80", priceClass: "" },
          ].map((s) => (
            <label key={s.id} className={`flex items-center gap-3 border-2 rounded-lg p-3 cursor-pointer ${shipping === s.id ? "border-primary" : "border-border"}`}>
              <input type="radio" name="ship" checked={shipping === s.id} onChange={() => setShipping(s.id as any)} className="accent-primary" />
              <div className="flex-1">
                <div className="font-medium text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <div className={`font-bold ${s.priceClass}`}>{s.price}</div>
            </label>
          ))}
        </div>

        {/* Resumo */}
        <div className="px-4 py-4 border-t space-y-1.5 text-sm">
          <div className="font-bold mb-2">Resumo do pedido</div>
          <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          <div className="flex justify-between text-success-foreground"><span>Descontos</span><span>-{fmt(desconto)}</span></div>
          <div className="flex justify-between"><span>Frete</span><span className={shipping === "normal" ? "text-success-foreground" : ""}>{shipping === "normal" ? "Grátis" : fmt(shipPrice)}</span></div>
          <div className="flex justify-between font-bold text-base pt-2 border-t mt-2"><span>Total</span><span className="text-primary">{fmt(total)}</span></div>
          <div className="flex justify-between font-semibold text-sm pt-2"><span>Total ({qty} item)</span><span className="text-primary">{fmt(total)}</span></div>
        </div>

        <div className="mx-4 my-4 bg-success/30 text-success-foreground py-2 text-center rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
          <Lock className="size-4" /> Ambiente 100% seguro e criptografado
        </div>

        <div className="mx-4 mb-4 border rounded-lg p-3 bg-success/20">
          <div className="font-bold text-sm">🛡 Garantia de 1 ano</div>
          <div className="text-xs text-muted-foreground">Cobertura completa contra defeitos de fabricação por 12 meses, direto com o fabricante.</div>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4">
          <div className="text-center"><div className="font-bold text-primary">4.9/5</div><div className="text-[10px] text-muted-foreground">Avaliação média</div></div>
          <div className="text-center"><div className="font-bold text-primary">+12 mil</div><div className="text-[10px] text-muted-foreground">Clientes satisfeitos</div></div>
          <div className="text-center"><div className="font-bold text-primary">98%</div><div className="text-[10px] text-muted-foreground">Recomendam</div></div>
        </div>

        <section className="px-4 mt-6">
          <h2 className="text-lg font-bold mb-3">Por que comprar com a gente</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["Compra protegida", "Reembolso garantido se algo der errado"],
              ["Pagamento seguro", "Pix e cartões com total segurança"],
              ["Envio rastreado", "Acompanhe seu pedido em tempo real"],
              ["Garantia de 1 ano", "Cobertura do fabricante por 12 meses"],
            ].map(([t, d]) => (
              <div key={t} className="border rounded-lg p-3">
                <div className="font-semibold">{t}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-4 mt-6 border rounded-lg p-4 text-sm">
          <div className="font-bold mb-2">🔒 Seus dados estão protegidos</div>
          <ul className="text-muted-foreground text-xs space-y-1">
            <li>• Conexão criptografada com certificado SSL 256 bits</li>
            <li>• Não armazenamos dados bancários ou de cartão</li>
            <li>• Conformidade com a LGPD (Lei Geral de Proteção de Dados)</li>
          </ul>
        </div>

        <div className="px-4 mt-4 text-xs text-muted-foreground">
          <div className="font-bold text-foreground text-sm">Suporte humano de verdade</div>
          Atendimento de segunda a sábado, das 8h às 20h, via WhatsApp e e-mail com resposta em até 1 hora.
        </div>

        <p className="text-[11px] text-center text-muted-foreground px-4 mt-6">
          Ao continuar você concorda com os Termos de Uso e Política de Privacidade.
        </p>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
        <div className="mx-auto max-w-2xl p-3">
          <Link
            to="/checkout/endereco"
            onClick={() => { try { localStorage.setItem("checkout-qty", String(qty)); } catch {} }}
            className="block bg-gradient-to-r from-primary to-danger text-primary-foreground rounded-full py-3 text-center font-bold leading-tight shadow-lg"
          >
            <div>Fazer pedido</div>
            <div className="text-xs font-normal">O cupom expira em {countdown}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
