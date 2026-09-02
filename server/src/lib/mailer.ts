import nodemailer, { type Transporter } from 'nodemailer'
import { config } from '../config.js'
import type { Inquiry } from './schema.js'

/**
 * Delivery for enquiries.
 *
 * The transport is created lazily, so a site running without SMTP credentials
 * still boots and still accepts submissions — they are logged rather than
 * lost, and the visitor is never shown an error caused by my configuration.
 */

let transporter: Transporter | null = null

function getTransport(): Transporter | null {
  if (!config.mail.enabled) return null
  transporter ??= nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth: { user: config.mail.user, pass: config.mail.pass },
  })
  return transporter
}

const NEED_LABEL: Record<Inquiry['need'], string> = {
  website: 'A website',
  application: 'A web application',
  system: 'A custom system',
  rebuild: 'Fixing or rebuilding something',
  unsure: 'Not sure yet',
}

const METHOD_LABEL: Record<Inquiry['method'], string> = {
  email: 'Email',
  phone: 'Phone or message',
  either: 'Either',
}

/** Escapes anything that goes into the HTML body of the notification. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendInquiry(inquiry: Inquiry): Promise<'sent' | 'logged'> {
  const subject = `New enquiry — ${inquiry.name}${inquiry.business ? ` (${inquiry.business})` : ''}`

  const lines = [
    `Name:      ${inquiry.name}`,
    `Business:  ${inquiry.business || '—'}`,
    `Needs:     ${NEED_LABEL[inquiry.need]}`,
    `Reply by:  ${METHOD_LABEL[inquiry.method]} — ${inquiry.contact}`,
    '',
    inquiry.message,
  ]
  const text = lines.join('\n')

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px;font-size:18px">${esc(subject)}</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 16px 4px 0;color:#666">Name</td><td>${esc(inquiry.name)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Business</td><td>${esc(inquiry.business || '—')}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Needs</td><td>${esc(NEED_LABEL[inquiry.need])}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Reply by</td><td>${esc(METHOD_LABEL[inquiry.method])} — ${esc(inquiry.contact)}</td></tr>
      </table>
      <p style="margin:20px 0 0;white-space:pre-wrap;font-size:15px">${esc(inquiry.message)}</p>
    </div>
  `

  const transport = getTransport()

  if (!transport) {
    console.warn('[inquiry] SMTP is not configured — logging the enquiry instead of sending it.')
    console.info(text)
    return 'logged'
  }

  await transport.sendMail({
    from: config.mail.from,
    to: config.mail.to,
    subject,
    text,
    html,
    // So hitting reply in a mail client goes to the person, when they gave an
    // address rather than a phone number.
    replyTo: inquiry.contact.includes('@') ? inquiry.contact : undefined,
  })

  return 'sent'
}
