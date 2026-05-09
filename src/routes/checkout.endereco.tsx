import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, CreditCard, Mail, Phone, MapPin, Lock, ShieldCheck, Truck } from "lucide-react";
import { Stepper, CheckoutHeader } from "@/components/checkout/Stepper";

export const Route = createFileRoute("/checkout/endereco")({
  head: () => ({ meta: [{ title: "Endereço de entrega" }] }),
  component: AddressPage,
});

function Field({ icon: Icon, label, children }: any) {
  return (
    <div>
      <label className="text-sm font-semibold flex items-center gap-1.5 mb-1">{Icon && <Icon className="size-4" />} {label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary";

function AddressPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    nome: "", cpf: "", email: "", tel: "", cep: "", rua: "", numero: "", comp: "", bairro: "", cidade: "", uf: "",
  });
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const ok = form.nome && form.cpf && form.email && form.tel && form.cep && form.rua && form.numero && form.bairro && form.cidade && form.uf;

  return (
    <div className="min-h-screen bg-muted/40 pb-28">
      <CheckoutHeader title="Endereço de entrega" backTo="/checkout" />
      <div className="mx-auto max-w-2xl bg-background">
        <Stepper current={2} />

        <div className="mx-4 bg-success/30 text-success-foreground rounded-lg py-2 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <Lock className="size-4" /> Ambiente 100% seguro · Conexão criptografada SSL
        </div>

        <section className="px-4 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center"><User className="size-4 text-primary" /></div>
            <div>
              <div className="font-bold">Dados pessoais</div>
              <div className="text-xs text-muted-foreground">Para emissão da nota fiscal</div>
            </div>
          </div>
          <div className="space-y-3">
            <Field icon={User} label="Nome completo"><input className={inputCls} placeholder="Como aparece no seu documento" value={form.nome} onChange={set("nome")} /></Field>
            <Field icon={CreditCard} label="CPF"><input className={inputCls} placeholder="000.000.000-00" value={form.cpf} onChange={set("cpf")} /></Field>
            <Field icon={Mail} label="E-mail">
              <input type="email" className={inputCls} placeholder="seu@email.com" value={form.email} onChange={set("email")} />
              <div className="text-xs text-muted-foreground mt-1">Enviaremos a confirmação e o código de rastreio</div>
            </Field>
            <Field icon={Phone} label="Telefone / WhatsApp"><input className={inputCls} placeholder="(11) 99999-9999" value={form.tel} onChange={set("tel")} /></Field>
          </div>
        </section>

        <hr className="my-6" />

        <section className="px-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center"><MapPin className="size-4 text-primary" /></div>
            <div>
              <div className="font-bold">Endereço de entrega</div>
              <div className="text-xs text-muted-foreground">Onde devemos entregar seu pedido</div>
            </div>
          </div>
          <div className="space-y-3">
            <Field label="CEP"><input className={inputCls} placeholder="00000-000" value={form.cep} onChange={set("cep")} /></Field>
            <Field label="Rua / Logradouro"><input className={inputCls} placeholder="Ex: Av. Paulista" value={form.rua} onChange={set("rua")} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Número"><input className={inputCls} placeholder="123" value={form.numero} onChange={set("numero")} /></Field>
              <Field label="Complemento"><input className={inputCls} placeholder="Apto, bloco (opcional)" value={form.comp} onChange={set("comp")} /></Field>
            </div>
            <Field label="Bairro"><input className={inputCls} placeholder="Ex: Centro" value={form.bairro} onChange={set("bairro")} /></Field>
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <Field label="Cidade"><input className={inputCls} value={form.cidade} onChange={set("cidade")} /></Field>
              <Field label="UF"><input maxLength={2} className={inputCls + " uppercase"} value={form.uf} onChange={set("uf")} /></Field>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-2 px-4 mt-6 text-center text-xs">
          {[
            [ShieldCheck, "Garantia de 1 ano", "Direto com o fabricante"],
            [Truck, "Envio rastreado", "Acompanhe pelo e-mail"],
            [Lock, "Dados protegidos", "Criptografia SSL"],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="border rounded-lg p-2">
              <Icon className="size-4 mx-auto text-primary mb-1" />
              <div className="font-semibold">{t}</div>
              <div className="text-[10px] text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center px-4 mt-4">
          Seus dados são usados apenas para processar e entregar o seu pedido. Não compartilhamos com terceiros.
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
        <div className="mx-auto max-w-2xl p-3 text-center">
          <button
            disabled={!ok}
            onClick={() => {
              try { localStorage.setItem("checkout-address", JSON.stringify(form)); } catch {}
              nav({ to: "/checkout/pagamento" });
            }}
            className="w-full bg-gradient-to-r from-primary to-danger text-primary-foreground rounded-full py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="size-4" /> Continuar para pagamento
          </button>
          <div className="text-[11px] text-muted-foreground mt-1">Compra 100% segura · Garantia de 1 ano</div>
        </div>
      </div>
    </div>
  );
}
