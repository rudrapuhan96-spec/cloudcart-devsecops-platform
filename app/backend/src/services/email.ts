import nodemailer from 'nodemailer'

type OrderEmail = {
  orderId: string
  customerName: string
  customerEmail: string
  createdAt: string
  expectedDeliveryAt: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
  address: string
}

function smtpConfig() {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT ?? 465)
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const mailFrom = process.env.MAIL_FROM ?? smtpUser
  return { smtpHost, smtpPort, smtpUser, smtpPass, mailFrom }
}

function money(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}

export async function sendOrderConfirmation(order: OrderEmail): Promise<boolean> {
  const { smtpHost, smtpPort, smtpUser, smtpPass, mailFrom } = smtpConfig()
  if (!smtpHost || !smtpUser || !smtpPass || !mailFrom) {
    console.warn('[email] SMTP is not configured; order confirmation was not sent.')
    return false
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  const itemRows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0">${item.name}</td><td style="padding:8px 0;text-align:center">${item.quantity}</td><td style="padding:8px 0;text-align:right">${money(item.price * item.quantity)}</td></tr>`,
    )
    .join('')

  const text = [
    `Hello ${order.customerName},`,
    '',
    `Your CloudCart order ${order.orderId} was successfully placed.`,
    `Order time: ${new Date(order.createdAt).toLocaleString('en-IN')}`,
    `Expected delivery: ${new Date(order.expectedDeliveryAt).toLocaleString('en-IN')}`,
    `Total: ${money(order.total)}`,
    `Delivery address: ${order.address}`,
    '',
    'No action is required from you right now.',
  ].join('\n')

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#f6f8fb;padding:32px">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px">
        <p style="margin:0 0 8px;color:#2563eb;font-weight:700;letter-spacing:.08em">CLOUDCART</p>
        <h1 style="margin:0 0 12px">Order confirmed ✅</h1>
        <p style="color:#4b5563">Hello ${order.customerName}, your order was successfully placed.</p>
        <div style="background:#f8fafc;border-radius:12px;padding:16px;margin:24px 0">
          <strong>Order ID: ${order.orderId}</strong><br/>
          Order time: ${new Date(order.createdAt).toLocaleString('en-IN')}<br/>
          Expected delivery: ${new Date(order.expectedDeliveryAt).toLocaleString('en-IN')}
        </div>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr><th style="text-align:left">Item</th><th>Qty</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0"/>
        <p style="font-size:18px;font-weight:700;text-align:right">Total: ${money(order.total)}</p>
        <div style="background:#eff6ff;padding:16px;border-radius:12px;margin-top:24px">
          <strong>No action required.</strong><br/>
          Your order is currently being processed. We’ll update you when it moves to the next stage.
        </div>
        <p style="margin-top:24px;color:#6b7280;font-size:14px"><strong>Delivery address:</strong><br/>${order.address}</p>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: order.customerEmail,
      subject: `CloudCart Order Confirmed — ${order.orderId}`,
      text,
      html,
    })
    console.log(`[email] Confirmation sent to ${order.customerEmail} for ${order.orderId}`)
    return true
  } catch (error) {
    console.error('[email] Confirmation send failed:', error)
    return false
  }
}
