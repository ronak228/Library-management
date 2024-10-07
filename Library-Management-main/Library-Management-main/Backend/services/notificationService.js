const cron = require('node-cron');
const Loan = require('../models/loan');
const User = require('../models/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'galanimeghji@gmail.com',
    pass: 'prisha@8275',
  },
});

const sendNotification = async () => {
  try {
    const overdueLoans = await Loan.find({ dueDate: { $lt: new Date() }, returned: false }).populate('user book');
    for (const loan of overdueLoans) {
      const mailOptions = {
        from: 'galanimeghji@gmail.com',
        to: loan.user.email,
        subject: 'Overdue Book Notification',
        text: `Dear ${loan.user.name},\n\nYour borrowed book "${loan.book.title}" is overdue. Please return it as soon as possible.\n\nThank you!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
  } catch (error) {
    console.error('Error in notification service:', error);
  }
};

// Schedule the notification service to run daily
cron.schedule('0 0 * * *', sendNotification);

module.exports = { sendNotification };
