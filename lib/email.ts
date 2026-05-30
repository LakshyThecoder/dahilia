import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'loyalty@dahiliaoven.com'
const FROM_NAME = process.env.RESEND_FROM_NAME || 'Dahilia Oven'

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

export async function sendQRCodeEmail(data: QREmailData) {
  const { to, customerName, qrCodeDataUrl, qrToken } = data

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Dahilia Oven Loyalty Program</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #FFF8F0;
          margin: 0;
          padding: 0;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(74, 55, 40, 0.25);
        }
        
        .header {
          background: linear-gradient(135deg, #D4A574 0%, #8B6914 100%);
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-family: 'Playfair Display', serif;
          color: white;
          font-size: 32px;
          margin: 0;
          font-weight: 700;
        }
        
        .header p {
          color: rgba(255,255,255,0.9);
          font-size: 16px;
          margin: 10px 0 0 0;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 20px;
          color: #4A3728;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .message {
          font-size: 16px;
          color: #6B5B4F;
          line-height: 1.7;
          margin-bottom: 30px;
        }
        
        .qr-section {
          background: linear-gradient(135deg, #FFF8F0 0%, #FFF0E0 100%);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          border: 2px dashed #D4A574;
        }
        
        .qr-code {
          width: 200px;
          height: 200px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(212, 165, 116, 0.3);
          margin: 0 auto 20px;
        }
        
        .qr-instruction {
          font-size: 14px;
          color: #8B6914;
          font-weight: 600;
        }
        
        .benefits {
          background: #FDF8F3;
          border-radius: 16px;
          padding: 25px;
          margin: 30px 0;
        }
        
        .benefits h3 {
          color: #4A3728;
          font-size: 18px;
          margin: 0 0 15px 0;
          font-weight: 600;
        }
        
        .benefits ul {
          margin: 0;
          padding-left: 20px;
          color: #6B5B4F;
        }
        
        .benefits li {
          margin: 10px 0;
          line-height: 1.6;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #E07B39 0%, #C45A1F 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(224, 123, 57, 0.3);
        }
        
        .footer {
          background: #4A3728;
          padding: 30px;
          text-align: center;
        }
        
        .footer p {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          margin: 5px 0;
        }
        
        .footer .address {
          color: #D4A574;
          font-weight: 500;
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
          
          <div style="text-align: center;">
            <p style="font-size: 12px; color: #999; margin-bottom: 5px;">Your Loyalty ID</p>
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
            Follow us @dahiliaoven for daily fresh bakes and special offers!
          </p>
        </div>
        
        <div class="footer">
          <p class="address">📍 123 Bakery Lane, Food District</p>
          <p>Open daily 7am - 8pm</p>
          <p style="margin-top: 15px; font-size: 12px;">
            © 2024 Dahilia Oven. Made with ❤️ and flour.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject: '🥐 Welcome to Dahilia Oven Loyalty!',
      html,
    })
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending QR email:', error)
    return { success: false, error }
  }
}

export async function sendCampaignEmail(data: CampaignEmailData) {
  const { to, subject, title, message, ctaText, ctaLink } = data

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #FFF8F0;
          margin: 0;
          padding: 0;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(74, 55, 40, 0.25);
        }
        
        .header {
          background: linear-gradient(135deg, #D4A574 0%, #8B6914 100%);
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-family: 'Playfair Display', serif;
          color: white;
          font-size: 32px;
          margin: 0;
          font-weight: 700;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #4A3728;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .message {
          font-size: 16px;
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
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(224, 123, 57, 0.3);
        }
        
        .footer {
          background: #4A3728;
          padding: 30px;
          text-align: center;
        }
        
        .footer p {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
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
          <p style="font-size: 12px; margin-top: 10px;">
            You're receiving this as a loyalty member. 
            <a href="#" style="color: #D4A574;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending campaign email:', error)
    return { success: false, error }
  }
}

// Generate QR code data URL from token
export function generateQRCodeDataUrl(token: string): string {
  // This will be implemented on the client side using qrcode.react
  // and converted to data URL for email
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(token)}`
}
