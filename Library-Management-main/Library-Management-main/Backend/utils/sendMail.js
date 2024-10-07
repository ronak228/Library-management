// import nodemailer from 'nodemailer';
const nodemailer=require("nodemailer")
const { SMTP_HOST, SMTP_PORT, MAIL_USER, MAIL_PASSWORD, ADMIN_MAIL } = require('../config/index.js');

async function sendMail({ to, from = ADMIN_MAIL, subject, text, html }) {
  console.log(`Sending email to: ${to}, from: ${from}, subject: ${subject}`);

  let transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendMail;
