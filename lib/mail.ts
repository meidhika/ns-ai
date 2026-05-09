import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"NS AI" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Aktivasi Akun NS AI Anda",
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #10B981; text-align: center;">Selamat datang di NS AI!</h2>
        <p>Halo,</p>
        <p>Terima kasih telah mendaftar. Untuk mulai menggunakan layanan kami, silakan aktifkan akun Anda dengan mengklik tombol di bawah ini:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Aktifkan Akun Saya
          </a>
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">
          Jika Anda tidak merasa mendaftar di NS AI, abaikan email ini. Tautan ini akan kedaluwarsa dalam 1 jam.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
