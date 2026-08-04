import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPPORT_EMAIL = "ayuda@elevark.com.mx";
const BRAND_NAME = "Marketlyx";
const BRAND_URL = "elevark.com.mx";
const BRAND_LOGO = "https://elevark.com.mx/title.png"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customer, items, metadata, locale: bodyLocale } = body;

    // Priorizar el locale enviado desde el frontend o usar fallback
    const acceptLanguage = req.headers.get("accept-language") || "es";
    const fallbackLocale = acceptLanguage.split(",")[0].split("-")[0] || "es";
    const locale = bodyLocale || fallbackLocale;

    // Inicializar traductor de next-intl en server-side
    const t = await getTranslations({ locale, namespace: "PurchaseReceipt" });

    if (!orderId || !amount || !customer || !items) {
      return NextResponse.json(
        { error: t("missingFields") },
        { status: 400 }
      );
    }

    // 1. EMAIL PARA EL CLIENTE (TICKET / RECIBO DE COMPRA)
    const clientReceiptHtml = renderReceiptTemplate({
      title: t("clientTitle"),
      subtitle: t("clientSubtitle", { orderId }),
      orderId,
      amount,
      customer,
      items,
      metadata,
      isBusiness: false,
      locale,
      t,
    });

    await resend.emails.send({
      from: `${BRAND_NAME} <${SUPPORT_EMAIL}>`,
      to: customer.email,
      subject: t("clientSubject", { orderId, brandName: BRAND_NAME }),
      html: clientReceiptHtml,
    });

    // 2. EMAIL PARA EL NEGOCIO (NOTIFICACIÓN DE VENTA)
    const businessNotificationHtml = renderReceiptTemplate({
      title: t("businessTitle"),
      subtitle: t("businessSubtitle", { amount: amount.toFixed(2) }),
      orderId,
      amount,
      customer,
      items,
      metadata,
      isBusiness: true,
      locale,
      t,
    });

    await resend.emails.send({
      from: `${BRAND_NAME} Sales <${SUPPORT_EMAIL}>`,
      to: SUPPORT_EMAIL,
      subject: t("businessSubject", { orderId, amount: amount.toFixed(2) }),
      html: businessNotificationHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Función helper para generar el HTML del ticket con la estética roja y texto blanco
function renderReceiptTemplate({
  title,
  subtitle,
  orderId,
  amount,
  customer,
  items,
  metadata,
  isBusiness,
  locale,
  t,
}: {
  title: string;
  subtitle: string;
  orderId: string;
  amount: number;
  customer: any;
  items: any[];
  metadata: any;
  isBusiness: boolean;
  locale: string;
  t: any;
}) {
  const formattedDate = new Date().toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
    timeZone: "America/Mexico_City",
  });

  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #991b1b; color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 20px; }
        .container { background-color: #dc2626; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
        .header { padding: 36px 24px 24px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.15); background-color: #b91c1c; }
        .logo { height: 36px; width: auto; object-fit: contain; }
        .content { padding: 36px 36px; }
        .title { font-size: 26px; font-weight: 800; color: #ffffff; margin: 0 0 10px 0; letter-spacing: -0.02em; }
        .subtitle { font-size: 15px; color: #fecaca; margin: 0 0 32px 0; line-height: 1.6; }
        .section-label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; color: #f87171; margin-bottom: 12px; }
        
        /* Estilos de Ticket de compra */
        .ticket-box { background-color: #b91c1c; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.15); padding: 22px; margin-bottom: 28px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.1); }
        .ticket-row { display: table; width: 100%; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed rgba(255, 255, 255, 0.3); }
        .ticket-row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .item-name { display: table-cell; font-size: 15px; color: #ffffff; font-weight: 600; }
        .item-qty { font-size: 13px; color: #fecaca; margin-left: 8px; font-weight: 400; }
        .item-price { display: table-cell; text-align: right; font-size: 15px; color: #ffffff; font-weight: 700; }
        
        .total-box { margin-top: 16px; padding-top: 16px; border-top: 2px solid rgba(255, 255, 255, 0.4); }
        .total-label { font-size: 14px; font-weight: 800; color: #ffffff; text-transform: uppercase; }
        .total-amount { font-size: 22px; font-weight: 900; color: #ffffff; text-align: right; }
        
        .grid { display: table; width: 100%; table-layout: fixed; margin-bottom: 28px; }
        .col { display: table-cell; width: 50%; vertical-align: top; }
        .info-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #fca5a5; letter-spacing: 0.08em; margin-bottom: 6px; }
        .info-value { font-size: 14px; color: #ffffff; line-height: 1.6; padding-right: 10px; font-weight: 500; }
        
        .meta-box { font-size: 14px; color: #ffffff; background-color: #b91c1c; padding: 16px 20px; border-radius: 14px; border-left: 4px solid #ffffff; margin-bottom: 28px; font-weight: 500; }
        .footer { text-align: center; padding: 32px; font-size: 13px; color: #fca5a5; border-top: 1px solid rgba(255, 255, 255, 0.15); background-color: #b91c1c; }
        .footer a { color: #ffffff; text-decoration: none; font-weight: 700; }
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

            <!-- Datos Generales de la Transacción -->
            <div class="grid">
              <div class="col">
                <div class="info-label">${t("orderIdLabel")}</div>
                <div class="info-value" style="font-family: ui-monospace, monospace; font-size: 15px; font-weight: 700;">${orderId}</div>
              </div>
              <div class="col">
                <div class="info-label">${t("paymentDateLabel")}</div>
                <div class="info-value">${formattedDate}</div>
              </div>
            </div>

            <!-- Detalles del Cliente & Envío -->
            <div class="section-label">${isBusiness ? t("buyerInfo") : t("billingDetails")}</div>
            <div class="grid">
              <div class="col">
                <div class="info-label">${t("customerLabel")}</div>
                <div class="info-value">
                  <strong>${customer.nombre} ${customer.apellido}</strong><br/>
                  ${customer.email}<br/>
                  ${customer.telefono}
                </div>
              </div>
              <div class="col">
                <div class="info-label">${t("addressLabel")}</div>
                <div class="info-value">
                  ${customer.direccion}<br/>
                  ${customer.direccion2 ? customer.direccion2 + '<br/>' : ''}
                  ${customer.ciudad}, ${customer.estado}<br/>
                  CP: ${customer.cp}, ${customer.pais}
                  ${customer.empresa ? `<br/><strong>${t("companyLabel")}:</strong> ` + customer.empresa : ''}
                </div>
              </div>
            </div>

            <!-- Notas o Metadata del Cupón -->
            ${metadata && (metadata.notes || Object.keys(metadata).length > 0) ? `
              <div class="info-label">${t("operationDetails")}</div>
              <div class="meta-box">
                ${metadata.notes || JSON.stringify(metadata)}
              </div>
            ` : ''}

            <!-- Desglose de Productos (Ticket) -->
            <div class="section-label">${t("productSummary")}</div>
            <div class="ticket-box">
              ${items.map((item: any) => `
                <div class="ticket-row">
                  <div class="item-name">
                    ${item.product.name}
                    <span class="item-qty">x${item.quantity || 1}</span>
                  </div>
                  <div class="item-price">
                    $${(Number(item.product.price) * (item.quantity || 1)).toFixed(2)} MXN
                  </div>
                </div>
              `).join('')}
              
              <!-- Total -->
              <div class="ticket-row total-box">
                <div class="item-name total-label">${t("totalPaid")}</div>
                <div class="item-price total-amount">$${amount.toFixed(2)} MXN</div>
              </div>
            </div>

            ${!isBusiness ? `
              <p style="font-size: 13px; color: #fecaca; margin-top: 32px; line-height: 1.6; font-style: italic; text-align: center;">
                ${t("clientDisclaimer")}
              </p>
            ` : ''}
          </div>

          <!-- Footer Legal -->
          <div class="footer">
            © ${new Date().getFullYear()} <a href="https://${BRAND_URL}">${BRAND_NAME}</a>. ${t("allRightsReserved")}<br/>
            ${t("footerText")}
          </div>

        </div>
      </div>
    </body>
    </html>
  `;
}