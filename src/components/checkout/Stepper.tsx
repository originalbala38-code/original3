import { Check } from "lucide-react";

export function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Resumo", "Endereço", "Pagamento"];
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-background">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  done ? "bg-success-foreground text-background" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-4" /> : n}
              </div>
              <div className={`text-xs mt-1 ${active ? "text-primary font-semibold" : done ? "text-success-foreground" : "text-muted-foreground"}`}>{label}</div>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${n < current ? "bg-success-foreground" : "bg-muted"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export function CheckoutHeader({ title, backTo = "/" }: { title: string; backTo?: string }) {
  return (
    <header className="sticky top-0 z-30 bg-background border-b">
      <div className="mx-auto max-w-2xl flex items-center gap-2 px-3 py-3">
        <a href={backTo} className="p-2 rounded-full hover:bg-muted">←</a>
        <div className="flex-1 text-center font-bold">{title}</div>
        <div className="size-9 text-success-foreground flex items-center justify-center">🔒</div>
      </div>
    </header>
  );
}
