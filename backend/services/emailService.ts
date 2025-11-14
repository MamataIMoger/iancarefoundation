import nodemailer from "nodemailer"

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use 'gmail' for a common setup, or configure specific host/port
  auth: {
    user: process.env.EMAIL_USER, // Your sender email address
    pass: process.env.EMAIL_PASS, // Your App Password/API Key
  },
})

/**
 * Sends a notification email to the foundation's contact address.
 * @param {object} formData - The data submitted by the user.
 */
export const sendContactEmail = async ({ name, email, phone, message }: ContactFormData) => {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    !process.env.CONTACT_EMAIL_RECEIVER
  ) {
    throw new Error("Email credentials or receiver address are not set in environment variables.")
  }

  const mailOptions = {
    from: `"IAN Cares Contact Form" <${process.env.EMAIL_USER}>`, // Sender address
    to: process.env.CONTACT_EMAIL_RECEIVER, // Receiver address (Foundation's email)
    subject: `New Contact Message from ${name}`, // Subject line
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: 
      ---
      ${message}
      ---
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #0072A6;">New Contact Message Received</h2>
        <p>You have received a new message from the IAN Cares Foundation contact form.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px; margin: 15px 0;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">Phone:</td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
        </table>
        <h3 style="color: #0B3D43;">Message:</h3>
        <p style="border-left: 3px solid #FFC72C; padding-left: 10px; white-space: pre-wrap;">${message}</p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">This message was sent from www.iancaresfoundation.org.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// You might export a default object of services if you have more functions later
export default { sendContactEmail }
