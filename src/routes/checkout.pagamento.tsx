import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Zap, ShieldCheck, Lock, Copy, Check, CreditCard, Truck, Headphones, QrCode, Loader2 } from "lucide-react";
import { Stepper, CheckoutHeader } from "@/components/checkout/Stepper";
import { createPixTransaction, getTransactionStatus } from "@/lib/invictuspay.functions";

export const Route = createFileRoute("/checkout/pagamento")({
  head: () => ({ meta: [{ title: "Pagamento" }] }),
  component: PaymentPage,
});

function PaymentPage() {
  const [addr, setAddr] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(15 * 60);
  const [pix, setPix] = useState<{ hash: string; code: string; amount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const createPix = useServerFn(createPixTransaction);
  const checkStatus = useServerFn(getTransactionStatus);

  useEffect(() => {
    try { setAddr(JSON.parse(localStorage.getItem("checkout-address") || "null")); } catch {}
    try { setQty(parseInt(localStorage.getItem("checkout-qty") || "1") || 1); } catch {}
  }, []);

  useEffect(() => {
    if (!addr) return;
    setLoading(true);
    setError(null);
    createPix({
      data: {
        quantity: qty,
        customer: {
          name: addr.nome,
          email: addr.email,
          document: addr.cpf,
          phone_number: addr.tel,
          zip_code: addr.cep,
          street_name: addr.rua,
          number: addr.numero,
          complement: addr.comp,
          neighborhood: addr.bairro,
          city: addr.cidade,
          state: addr.uf,
        },
      },
    })
      .then((r) => setPix({ hash: r.hash, code: r.pix_qr_code || "", amount: r.amount }))
      .catch((e) => setError(e?.message || "Falha ao gerar Pix"))
      .finally(() => setLoading(false));
  }, [addr, qty]);

  useEffect(() => {
    const id = setInterval(() => setSeconds((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // Polling status
  useEffect(() => {
    if (!pix?.hash || paid) return;
    const id = setInterval(async () => {
      try {
        const r = await checkStatus({ data: { hash: pix.hash } });
        if (r.status === "paid" || r.status === "approved") { setPaid(true); clearInterval(id); }
      } catch {}
    }, 5000);
    return () => clearInterval(id);
  }, [pix?.hash, paid]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const copy = async () => {
    if (!pix?.code) return;
    try { await navigator.clipboard.writeText(pix.code); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const fmt = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
  const valor = pix ? fmt(pix.amount) : fmt(6790 * qty);
  const qrUrl = pix?.code
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(pix.code)}`
    : "";

  return (
    <div className="min-h-screen bg-muted/40 pb-10">
      <CheckoutHeader title="Pagamento" backTo="/checkout/endereco" />
      <div className="mx-auto max-w-2xl bg-background">
        <Stepper current={3} />

        <div className="px-4 space-y-3">
          <div className="border-2 border-success-foreground/30 bg-success/30 rounded-lg p-3 flex items-center gap-3">
            <div className="size-10 rounded-full bg-success flex items-center justify-center"><Zap className="size-5 text-success-foreground" /></div>
            <div className="flex-1">
              <div className="font-bold text-success-foreground">Pagamento via Pix</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Check className="size-3" /> Aprovação na hora</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-success-foreground">{valor}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-success/20 border border-success-foreground/20 rounded-lg p-3">
            <ShieldCheck className="size-5 text-success-foreground" />
            <div className="text-sm">
              <div className="font-semibold text-success-foreground">Garantia de 1 ano</div>
              <div className="text-xs text-muted-foreground">Direto com o fabricante contra defeitos</div>
            </div>
          </div>
        </div>

        {/* Pix card */}
        <section className="mx-4 mt-5 border rounded-xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="size-8 rounded-md bg-success flex items-center justify-center">
              <QrCode className="size-4 text-success-foreground" />
            </div>
            <div className="font-bold">Pague com Pix</div>
          </div>
          <div className="text-sm text-muted-foreground">Valor a pagar: <span className="text-foreground font-bold">{valor}</span></div>

          {paid ? (
            <div className="mt-6 mb-2 bg-success/30 text-success-foreground rounded-lg p-6">
              <Check className="size-12 mx-auto mb-2" />
              <div className="font-bold text-lg">Pagamento confirmado!</div>
              <div className="text-sm text-muted-foreground">Você receberá o e-mail de confirmação em instantes.</div>
            </div>
          ) : !addr ? (
            <div className="mt-6 text-sm text-danger">Preencha o endereço de entrega antes de gerar o Pix.</div>
          ) : loading ? (
            <div className="mt-8 mb-4 flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <div className="text-sm">Gerando seu código Pix…</div>
            </div>
          ) : error ? (
            <div className="mt-6 text-sm text-danger">{error}</div>
          ) : pix ? (
            <>
              <div className="mt-4 inline-block p-3 border rounded-lg bg-background">
                <img src={qrUrl} alt="QR code Pix" className="size-48" />
              </div>

              <div className="mt-3 text-xs text-muted-foreground">Expira em <span className="font-mono font-bold text-danger">{mm}:{ss}</span></div>

              <button onClick={copy} className="mt-4 w-full bg-success-foreground text-background rounded-full py-3 font-bold flex items-center justify-center gap-2">
                {copied ? <><Check className="size-4" /> Código copiado!</> : <><Copy className="size-4" /> Copiar código Pix</>}
              </button>

              <div className="mt-3 text-left">
                <div className="text-xs font-semibold mb-1">Pix Copia e Cola</div>
                <div className="border rounded-md p-2 text-[11px] break-all bg-muted text-muted-foreground font-mono">{pix.code}</div>
              </div>

              <ol className="text-left text-xs text-muted-foreground mt-4 space-y-1.5">
                <li>1. Abra o app do seu banco e escolha pagar via Pix</li>
                <li>2. Escaneie o QR code ou cole o código copiado</li>
                <li>3. Confirme o valor de <span className="font-semibold text-foreground">{valor}</span> e finalize</li>
                <li>4. Aprovação imediata · Você receberá o e-mail de confirmação</li>
              </ol>
            </>
          ) : null}
        </section>

        {/* Endereço */}
        <section className="mx-4 mt-5 border rounded-lg p-4">
          <div className="flex items-center gap-2 text-success-foreground mb-2"><ShieldCheck className="size-4" /><span className="font-semibold">Entregar para</span></div>
          {addr?.nome ? (
            <div className="text-sm">
              <div className="font-semibold">{addr.nome}</div>
              <div className="text-muted-foreground">{addr.rua}, {addr.numero}{addr.comp ? ` - ${addr.comp}` : ""}</div>
              <div className="text-muted-foreground">{addr.bairro} · {addr.cidade}/{addr.uf?.toUpperCase?.()}</div>
              <div className="text-muted-foreground">CEP {addr.cep}</div>
            </div>
          ) : (
            <div className="text-sm text-danger">Preencha o endereço de entrega antes de continuar.</div>
          )}
        </section>

        <div className="mx-4 my-5 bg-success/30 text-success-foreground py-2 text-center rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
          <Lock className="size-4" /> Ambiente 100% seguro e criptografado
        </div>

        <div className="grid grid-cols-2 gap-2 px-4">
          {[
            [ShieldCheck, "Compra protegida", "Seu dinheiro de volta se algo der errado"],
            [CreditCard, "Pagamento Pix", "Aprovação instantânea pelo Banco Central"],
            [Truck, "Envio rastreado", "Acompanhe seu pedido até a entrega"],
            [ShieldCheck, "Garantia de 1 ano", "Cobertura do fabricante por 12 meses"],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="border rounded-lg p-3 text-center">
              <Icon className="size-5 text-primary mx-auto mb-1" />
              <div className="font-semibold text-sm">{t}</div>
              <div className="text-xs text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>

        <div className="mx-4 mt-5 border rounded-lg p-4 text-sm">
          <div className="font-bold mb-2 flex items-center gap-2"><Lock className="size-4" /> Seus dados estão protegidos</div>
          <ul className="text-muted-foreground text-xs space-y-1">
            <li>✓ Conexão criptografada com certificado SSL 256 bits</li>
            <li>✓ Pagamento processado pelo SPI do Banco Central do Brasil</li>
            <li>✓ Não armazenamos dados bancários ou de cartão</li>
            <li>✓ Conformidade com a LGPD (Lei Geral de Proteção de Dados)</li>
          </ul>
        </div>

        <div className="mx-4 mt-4 border rounded-lg p-4 flex items-start gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center"><Headphones className="size-5 text-primary" /></div>
          <div className="text-sm">
            <div className="font-bold">Precisa de ajuda?</div>
            <div className="text-xs text-muted-foreground">Nossa equipe atende de segunda a sábado, das 8h às 20h. Suporte via WhatsApp e e-mail com resposta em até 1 hora.</div>
          </div>
        </div>

        <p className="text-[11px] text-center text-muted-foreground px-4 mt-6">
          Ao finalizar a compra você concorda com os Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}
