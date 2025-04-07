import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, email, subject, message } = await request.json()

    // Validate the required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Turboform Contact Form <contact@mail.turboform.ai>',
      to: 'nico@turboform.ai',
      subject: `Contact Form: ${subject}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4f46e5; margin-bottom: 20px;">New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Subject:</strong> ${subject}</p>
  <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${message}</p>
  </div>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
    <p>This email was sent from the Turboform contact form.</p>
  </div>
</div>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
