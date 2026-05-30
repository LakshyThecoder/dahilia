import { sendEmail, testEmailConfiguration } from '@/lib/email-service'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { to, subject, html, text } = await request.json()

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
    })

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in send-email API:', error)
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
  }
}

// Test email configuration
export async function GET() {
  const result = await testEmailConfiguration()
  return NextResponse.json(result)
}
