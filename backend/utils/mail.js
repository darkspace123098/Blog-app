import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        // user: process.env.SMTP_USER,
        // pass: process.env.SMTP_PASS
        user: 'darkspace123098@gmail.com',
        pass: 'ulmr rxet ufhy glhq'
    }
});

export const sendMail = async ({ to, subject, html }) => {
    if (!to) throw new Error("'to' is required");
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    return transporter.sendMail({ from, to, subject, html });
}


