import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// Initialize Resend
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Initialize SMTP transporter
const smtpTransporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null

// Get from address based on transport
function getFromAddress(): string {
  const transport = process.env.EMAIL_TRANSPORT || 'auto'
  
  if (transport === 'smtp' && process.env.SMTP_FROM_EMAIL) {
    const name = process.env.SMTP_FROM_NAME || 'Dahilia Oven'
    return `"${name}" <${process.env.SMTP_FROM_EMAIL}>`
  }
  
  const name = process.env.RESEND_FROM_NAME || 'Dahilia Oven'
  const email = process.env.RESEND_FROM_EMAIL || 'loyalty@dahiliaoven.com'
  return `${name} <${email}>`
}

// Determine which transport to use
function getTransport(): 'smtp' | 'resend' | null {
  const transport = process.env.EMAIL_TRANSPORT || 'auto'
  
  if (transport === 'smtp' && smtpTransporter) return 'smtp'
  if (transport === 'resend' && resend) return 'resend'
  if (transport === 'auto') {
    if (smtpTransporter) return 'smtp'
    if (resend) return 'resend'
  }
  return null
}

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export interface QREmailData {
  to: string
  customerName: string
  qrCodeDataUrl: string
  qrToken: string
}

export interface CampaignEmailData {
  to: string
  subject: string
  title: string
  message: string
  ctaText?: string
  ctaLink?: string
}

// Generic send email function
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: any }> {
  const transport = getTransport()
  
  if (!transport) {
    console.error('No email transport configured')
    return { success: false, error: 'No email transport configured' }
  }

  const from = getFromAddress()

  try {
    if (transport === 'smtp' && smtpTransporter) {
      await smtpTransporter.sendMail({
        from,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      })
      console.log(`✅ Email sent via SMTP to ${data.to}`)
      return { success: true }
    }

    if (transport === 'resend' && resend) {
      await resend.emails.send({
        from,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      })
      console.log(`✅ Email sent via Resend to ${data.to}`)
      return { success: true }
    }

    return { success: false, error: 'Email transport not available' }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return { success: false, error }
  }
}

// Send QR Code Welcome Email
export async function sendQRCodeEmail(data: QREmailData): Promise<{ success: boolean; error?: any }> {
  const { to, customerName, qrCodeDataUrl, qrToken } = data

  const html = generateQRWelcomeEmail(customerName, qrCodeDataUrl, qrToken)
  const text = `Welcome to Dahilia Oven, ${customerName}! Your QR code: ${qrToken}`

  return sendEmail({
    to,
    subject: '🥐 Welcome to Dahilia Oven Loyalty!',
    html,
    text,
  })
}

// Send Campaign Email
export async function sendCampaignEmail(data: CampaignEmailData): Promise<{ success: boolean; error?: any }> {
  const { to, subject, title, message, ctaText, ctaLink } = data

  const html = generateCampaignEmail(title, message, ctaText, ctaLink)
  const text = `${title}\n\n${message}`

  return sendEmail({
    to,
    subject,
    html,
    text,
  })
}

// Generate QR Welcome Email HTML
function generateQRWelcomeEmail(customerName: string, qrCodeDataUrl: string, qrToken: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Dahilia Oven</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #FFF8F0;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(74, 55, 40, 0.15);
    }
    .header {
      background: linear-gradient(135deg, #D4A574 0%, #8B6914 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: white;
      font-size: 32px;
      margin: 0;
    }
    .header p {
      color: rgba(255,255,255,0.9);
      margin: 10px 0 0 0;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 22px;
      color: #4A3728;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .message {
      color: #6B5B4F;
      line-height: 1.7;
      margin-bottom: 30px;
    }
    .qr-section {
      background: linear-gradient(135deg, #FFF8F0 0%, #FFF0E0 100%);
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      border: 2px dashed #D4A574;
    }
    .qr-code {
      width: 200px;
      height: 200px;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(212, 165, 116, 0.3);
    }
    .qr-instruction {
      color: #8B6914;
      font-weight: 600;
      margin-top: 15px;
    }
    .benefits {
      background: #FDF8F3;
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
    }
    .benefits h3 {
      color: #4A3728;
      margin: 0 0 15px 0;
    }
    .benefits ul {
      margin: 0;
      padding-left: 20px;
      color: #6B5B4F;
    }
    .benefits li {
      margin: 10px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #E07B39 0%, #C45A1F 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 10px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #4A3728;
      padding: 30px;
      text-align: center;
    }
    .footer p {
      color: rgba(255,255,255,0.7);
      margin: 5px 0;
    }
    .footer .highlight {
      color: #D4A574;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🥐 Dahilia Oven</h1>
      <p>Artisan Bakery & Café</p>
    </div>
    
    <div class="content">
      <p class="greeting">Welcome, ${customerName}! 👋</p>
      
      <p class="message">
        Thank you for joining the Dahilia Oven Loyalty family! We're delighted to have you 
        as part of our community. Your loyalty card is ready — simply show the QR code below 
        at checkout to earn points with every purchase.
      </p>
      
      <div class="qr-section">
        <img src="${qrCodeDataUrl}" alt="Your Loyalty QR Code" class="qr-code" />
        <p class="qr-instruction">📱 Show this code at the counter</p>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">Your Loyalty ID</p>
        <p style="font-size: 14px; color: #4A3728; font-weight: 600; font-family: monospace;">${qrToken}</p>
      </div>
      
      <div class="benefits">
        <h3>🌟 Your Loyalty Benefits</h3>
        <ul>
          <li><strong>1 Point</strong> for every $1 spent</li>
          <li><strong>Free pastry</strong> at 100 points</li>
          <li><strong>$10 voucher</strong> at 200 points</li>
          <li><strong>Birthday surprise</strong> every year 🎂</li>
          <li><strong>Exclusive offers</strong> via email</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/customer" class="cta-button">
          View My Dashboard
        </a>
      </div>
      
      <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
        Follow us @dahiliaoven for daily fresh bakes!
      </p>
    </div>
    
    <div class="footer">
      <p class="highlight">📍 123 Bakery Lane, Food District</p>
      <p>Open daily 7am - 8pm</p>
      <p style="margin-top: 15px; font-size: 12px;">
        © 2024 Dahilia Oven. Made with ❤️ and flour.
      </p>
    </div>
  </div>
</body>
</html>
`
}

// Generate Campaign Email HTML
function generateCampaignEmail(title: string, message: string, ctaText?: string, ctaLink?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #FFF8F0;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(74, 55, 40, 0.15);
    }
    .header {
      background: linear-gradient(135deg, #D4A574 0%, #8B6914 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: white;
      font-size: 28px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 24px;
      color: #4A3728;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .message {
      color: #6B5B4F;
      line-height: 1.7;
      margin-bottom: 30px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #E07B39 0%, #C45A1F 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 10px;
      font-weight: 600;
    }
    .footer {
      background: #4A3728;
      padding: 30px;
      text-align: center;
    }
    .footer p {
      color: rgba(255,255,255,0.7);
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🥐 Dahilia Oven</h1>
    </div>
    
    <div class="content">
      <h2 class="title">${title}</h2>
      <p class="message">${message}</p>
      
      ${ctaText && ctaLink ? `
      <div style="text-align: center;">
        <a href="${ctaLink}" class="cta-button">${ctaText}</a>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p>Dahilia Oven Artisan Bakery</p>
      <p style="font-size: 12px;">
        You're receiving this as a loyalty member. 
        <a href="#" style="color: #D4A574;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
`
}

// Test email configuration
export async function testEmailConfiguration(): Promise<{ success: boolean; message: string }> {
  const transport = getTransport()
  
  if (!transport) {
    return { 
      success: false, 
      message: 'No email transport configured. Set EMAIL_TRANSPORT to "smtp" or "resend"' 
    }
  }

  if (transport === 'smtp') {
    try {
      await smtpTransporter?.verify()
      return { 
        success: true, 
        message: `SMTP connection verified (${process.env.SMTP_HOST})` 
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: `SMTP connection failed: ${error.message}` 
      }
    }
  }

  if (transport === 'resend') {
    if (!process.env.RESEND_API_KEY) {
      return { 
        success: false, 
        message: 'Resend API key not configured' 
      }
    }
    return { 
      success: true, 
      message: 'Resend API configured' 
    }
  }

  return { 
    success: false, 
    message: 'Unknown transport type' 
  }
}
