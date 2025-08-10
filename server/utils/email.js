const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendPasswordReset = async (email, resetToken) => {
  const mailOptions = {
    to: email,
    subject: 'Password Reset',
    html: `<p>Reset your password: <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Click Here</a></p>`
  };

  await transporter.sendMail(mailOptions);
};