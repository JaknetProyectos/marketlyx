import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPPORT_EMAIL = "ayuda@elevark.com.mx";
const BRAND_NAME = "Marketlyx";
const BRAND_URL = "elevark.com.mx";
const BRAND_LOGO = "https://elevark.com.mx/title.png";

const STANDARD_FIELDS = ["nombre", "email", "mensaje", "asunto", "locale", "orderId", "amount", "items", "customer", "metadata"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, email, mensaje, asunto = "Nueva confirmación de compra", locale: bodyLocale, orderId, amount, items, customer, metadata } = body;

    const acceptLanguage = req.headers.get("accept-language") || "es";
    const fallbackLocale = acceptLanguage.split(",")[0].split("-")[0] || "es";
    const locale = bodyLocale || fallbackLocale;

    const t = await getTranslations({ locale, namespace: "ContactEmail" });

    if (!nombre || !email) {
      return NextResponse.json(
        { error: t("missingFields") || "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const extraFields = Object.entries(body).filter(
      ([key, val]) => !STANDARD_FIELDS.includes(key) && val !== undefined && val !== null && val !== ""
    );

    // EMAIL DE CONFIRMACIÓN DE COMPRA CON ESTÉTICA DE FONDO AZUL VIBRANTE
    const purchaseEmailHtml = renderPurchaseEmailTemplate({
      title: "¡Gracias por tu compra!",
      subtitle: "Hemos recibido tu pedido correctamente y ya estamos procesando los detalles de tu orden.",
      nombre,
      email,
      mensaje: mensaje || "Tu pedido se ha procesado con éxito mediante pago seguro.",
      extraFields,
      orderId: orderId || `MC-${Date.now()}`,
      amount: amount || 0.00,
      items: items || [],
      metadata,
      t,
    });

    await resend.emails.send({
      from: `${BRAND_NAME} <${SUPPORT_EMAIL}>`,
      to: email,
      subject: `Confirmación de pedido ${orderId || ""} - ${BRAND_NAME}`,
      html: purchaseEmailHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function renderPurchaseEmailTemplate({
  title,
  subtitle,
  nombre,
  email,
  mensaje,
  extraFields,
  orderId,
  amount,
  items,
  metadata,
  t,
}: {
  title: string;
  subtitle: string;
  nombre: string;
  email: string;
  mensaje: string;
  extraFields: [string, any][];
  orderId: string;
  amount: number;
  items: any[];
  metadata?: any;
  t: any;
}) {
  return `
    <!DOCTYPE html>
    <html lang="${t.locale || 'es'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #2563eb; color: #1e293b; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 20px; }
        .container { background-color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 2.5rem; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .header { padding: 40px 30px 30px 30px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #f8fafc; }
        .logo { height: 32px; width: auto; object-fit: contain; }
        .content { padding: 40px 36px; }
        .title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.02em; }
        .subtitle { font-size: 15px; color: #64748b; margin: 0 0 32px 0; line-height: 1.6; font-weight: 500; }
        .section-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.22em; color: #3b82f6; margin-bottom: 12px; }
        .card { background-color: #f8fafc; border-radius: 1.5rem; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 28px; }
        .field { margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
        .field:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.08em; margin-bottom: 5px; }
        .value { font-size: 14px; color: #0f172a; font-weight: 600; }
        .msg-box { font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap; background-color: #f8fafc; padding: 20px; border-radius: 1.5rem; border: 1px solid #e2e8f0; }
        .footer { text-align: center; padding: 28px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; background-color: #f8fafc; }
        .footer a { color: #2563eb; text-decoration: none; font-weight: 600; }
        .badge { display: inline-block; background-color: #eff6ff; color: #2563eb; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .item-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; }
        .item-row:last-child { border-bottom: none; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          
          <!-- Header Logo -->
          <div class="header">
            <img src="${BRAND_LOGO}" alt="${BRAND_NAME}" class="logo" />
          </div>

          <!-- Body Content -->
          <div class="content">
            <h1 class="title">${title}</h1>
            <p class="subtitle">${subtitle}</p>

            <div class="section-label">Detalles del Pedido</div>
            
            <div class="card">
              <div class="field">
                <div class="label">Número de Orden</div>
                <div class="value"><span class="badge">${orderId}</span></div>
              </div>
              <div class="field">
                <div class="label">Cliente</div>
                <div class="value">${nombre}</div>
              </div>
              <div class="field">
                <div class="label">Correo Electrónico</div>
                <div class="value" style="color: #2563eb; font-weight: 700;">${email}</div>
              </div>
              <div class="field">
                <div class="label">Monto Total Pagado</div>
                <div class="value" style="font-size: 18px; font-weight: 900; color: #0f172a;">$${Number(amount).toFixed(2)} MXN</div>
              </div>

              ${extraFields.map(([key, value]) => `
                <div class="field">
                  <div class="label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                  <div class="value">${value}</div>
                </div>
              `).join('')}
            </div>

            ${items && items.length > 0 ? `
              <div class="section-label">Productos Adquiridos</div>
              <div class="card" style="margin-bottom: 28px;">
                ${items.map((item: any) => `
                  <div class="item-row">
                    <div>
                      <strong style="font-size: 13px; color: #0f172a;">${item.product?.name || 'Producto'}</strong>
                      <div style="font-size: 11px; color: #64748b;">Cantidad: ${item.quantity}</div>
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">
                      $${(Number(item.product?.price || 0) * Number(item.quantity)).toFixed(2)}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div class="section-label">Información Adicional</div>
            <div class="msg-box">${mensaje}</div>

            <p style="font-size: 13px; color: #64748b; margin-top: 28px; line-height: 1.6; font-style: italic;">
              Este es un correo automático generado tras la confirmación exitosa de tu pago en plataforma segura. Si tienes dudas, contáctanos en <a href="mailto:${SUPPORT_EMAIL}" style="color: #2563eb; text-decoration: underline;">${SUPPORT_EMAIL}</a>.
            </p>
          </div>

          <!-- Footer Legal -->
          <div class="footer">
            © ${new Date().getFullYear()} <a href="https://${BRAND_URL}">${BRAND_NAME}</a>. Todos los derechos reservados.<br/>
            Plataforma de Soluciones y Comercio Electrónico
          </div>

        </div>
      </div>
    </body>
    </html>
  `;
}