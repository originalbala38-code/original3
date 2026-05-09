import { createServerFn } from "@tanstack/react-start";

const API_BASE = "https://api.invictuspay.app.br/api/public/v1";
const PRODUCT_HASH = "j2bt8sj2ge";
const OFFER_HASH = "lmutcwxzvl";
const PRODUCT_TITLE = "Lavadora de Alta Pressão Vonder LAV 1300";
const UNIT_PRICE_CENTS = 6790;

export type PixCustomer = {
  name: string;
  email: string;
  document: string;
  phone_number: string;
  zip_code?: string;
  street_name?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export const createPixTransaction = createServerFn({ method: "POST" })
  .inputValidator((data: { customer: PixCustomer; quantity?: number }) => data)
  .handler(async ({ data }) => {
    const token = process.env.INVICTUSPAY_API_TOKEN;
    if (!token) throw new Error("INVICTUSPAY_API_TOKEN not configured");

    const qty = Math.max(1, data.quantity ?? 1);
    const amount = UNIT_PRICE_CENTS * qty;
    const c = data.customer;

    const payload = {
      amount,
      offer_hash: OFFER_HASH,
      payment_method: "pix",
      installments: 1,
      customer: {
        name: c.name,
        email: c.email,
        document: c.document.replace(/\D/g, ""),
        phone_number: c.phone_number.replace(/\D/g, ""),
        zip_code: (c.zip_code || "00000000").replace(/\D/g, ""),
        street_name: c.street_name || "Rua",
        number: c.number || "0",
        complement: c.complement || "",
        neighborhood: c.neighborhood || "Bairro",
        city: c.city || "Cidade",
        state: (c.state || "SP").toUpperCase(),
      },
      cart: [
        {
          product_hash: PRODUCT_HASH,
          title: PRODUCT_TITLE,
          price: UNIT_PRICE_CENTS,
          quantity: qty,
          operation_type: 1,
          tangible: true,
          cover: null,
        },
      ],
    };

    const res = await fetch(`${API_BASE}/transactions?api_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Invictuspay error", res.status, body);
      throw new Error(
        (body && (body.message || JSON.stringify(body.errors))) ||
          `Invictuspay request failed (${res.status})`,
      );
    }

    return {
      hash: body.hash as string,
      amount: body.amount as number,
      pix_qr_code: body.pix?.pix_qr_code as string | null,
      qr_code_base64: body.pix?.qr_code_base64 as string | null,
      status: body.payment_status as string,
    };
  });

export const getTransactionStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { hash: string }) => data)
  .handler(async ({ data }) => {
    const token = process.env.INVICTUSPAY_API_TOKEN;
    if (!token) throw new Error("INVICTUSPAY_API_TOKEN not configured");
    const res = await fetch(
      `${API_BASE}/transactions/${data.hash}?api_token=${token}`,
      { headers: { Accept: "application/json" } },
    );
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.message || `Status request failed (${res.status})`);
    return { status: body.payment_status as string };
  });
