import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPPORT_EMAIL = "hello@zenvia.com.mx";
const BRAND_NAME = "Marketlyx";
const BRAND_URL = "marketlyx.com.mx";
const BRAND_LOGO = "https://marketlyx.com.mx/title.png";

const STANDARD_FIELDS = ["nombre", "email", "mensaje", "asunto", "locale", "telefono", "empresa", "metadata"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      nombre, 
      email, 
      mensaje, 
      asunto, 
      telefono, 
      empresa, 
      locale: bodyLocale, 
      metadata 
    } = body;

    const acceptLanguage = req.headers.get("accept-language") || "es";
    const fallbackLocale = acceptLanguage.split(",")[0].split("-")[0] || "es";
    const locale = bodyLocale || fallbackLocale;

    const t = await getTranslations({ locale, namespace: "ContactEmail" });

    if (!nombre || !email) {
      return NextResponse.json(
        { error: t("errors.missingFields") },
        { status: 400 }
      );
    }

    const extraFields = Object.entries(body).filter(
      ([key, val]) => !STANDARD_FIELDS.includes(key) && val !== undefined && val !== null && val !== ""
    );

    const contactEmailHtml = renderContactEmailTemplate({
      nombre,
      email,
      telefono,
      empresa,
      mensaje,
      extraFields,
      metadata,
      locale,
      t,
    });

    const emailSubject = asunto || t("defaultSubject", { brandName: BRAND_NAME });

    await resend.emails.send({
      from: `${BRAND_NAME} <${SUPPORT_EMAIL}>`,
      to: email,
      subject: emailSubject,
      html: contactEmailHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

interface ContactTemplateProps {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  mensaje?: string;
  extraFields: [string, any][];
  metadata?: any;
  locale: string;
  t: any;
}

function renderContactEmailTemplate({
  nombre,
  email,
  telefono,
  empresa,
  mensaje,
  extraFields,
  locale,
  t,
}: ContactTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t("title")}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #2563eb; color: #1e293b; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 20px; }
        .container { background-color: #ffffff; border-radius: 2rem; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .header { padding: 36px 30px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #f8fafc; }
        .logo { height: 32px; width: auto; object-fit: contain; }
        .content { padding: 36px 32px; }
        .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; letter-spacing: -0.02em; }
        .subtitle { font-size: 15px; color: #64748b; margin: 0 0 28px 0; line-height: 1.6; }
        .section-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #3b82f6; margin-bottom: 12px; }
        .card { background-color: #f8fafc; border-radius: 1.25rem; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px; }
        .field { margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        .field:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.08em; margin-bottom: 4px; }
        .value { font-size: 14px; color: #0f172a; font-weight: 600; }
        .msg-box { font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap; background-color: #f8fafc; padding: 18px; border-radius: 1.25rem; border: 1px solid #e2e8f0; }
        .disclaimer { font-size: 13px; color: #64748b; margin-top: 24px; line-height: 1.6; }
        .footer { text-align: center; padding: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; background-color: #f8fafc; }
        .footer a { color: #2563eb; text-decoration: none; font-weight: 600; }
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
            <h1 class="title">${t("title")}</h1>
            <p class="subtitle">${t("subtitle", { name: nombre })}</p>

            <div class="section-label">${t("sections.contactDetails")}</div>
            
            <div class="card">
              <div class="field">
                <div class="label">${t("labels.name")}</div>
                <div class="value">${nombre}</div>
              </div>
              <div class="field">
                <div class="label">${t("labels.email")}</div>
                <div class="value" style="color: #2563eb;">${email}</div>
              </div>
              ${telefono ? `
                <div class="field">
                  <div class="label">${t("labels.phone")}</div>
                  <div class="value">${telefono}</div>
                </div>
              ` : ''}
              ${empresa ? `
                <div class="field">
                  <div class="label">${t("labels.company")}</div>
                  <div class="value">${empresa}</div>
                </div>
              ` : ''}
              ${extraFields.map(([key, value]) => `
                <div class="field">
                  <div class="label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                  <div class="value">${value}</div>
                </div>
              `).join('')}
            </div>

            ${mensaje ? `
              <div class="section-label">${t("sections.message")}</div>
              <div class="msg-box">${mensaje}</div>
            ` : ''}

            <p class="disclaimer">
              ${t("disclaimer", { supportEmail: SUPPORT_EMAIL })}
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            © ${new Date().getFullYear()} <a href="https://${BRAND_URL}">${BRAND_NAME}</a>. ${t("footer.rightsReserved")}
          </div>

        </div>
      </div>
    </body>
    </html>
  `;
}