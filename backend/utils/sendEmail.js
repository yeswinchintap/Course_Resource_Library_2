const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your app password
  }
});

const sendConfirmationEmail = async (to, bookTitle, location) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Book Borrowing Confirmation: ${bookTitle}`,
    html: `
      <p>Hi,</p>
      <p>Your request to borrow <strong>${bookTitle}</strong> has been confirmed.</p>
      <p>Please collect it from: <strong>${location}</strong>.</p>
      <p>Thank you!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendCourseConfirmationEmail = async (to, username, course, registrationId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Course Registration Confirmation: ${course}`,
    html: `
      <p>Hello <strong>${username}</strong>,</p>
      <p>You have successfully registered for the course: <strong>${course}</strong>.</p>
      <p>Your Registration ID is <strong>${registrationId}</strong>.</p>
      <br/>
      <p>Thank you,<br/>Course Resource Library Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendQuizSuccessEmail  = async (to, username, courseName, messageText) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `✅ Congratulations: You Passed ${courseName}`,
    html: `
      <p>Hi ${username},</p>
      <p>${messageText}</p>
      <p>You're now eligible for certification!</p>
      <p>Regards,<br/>Course Resource Library Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};


module.exports = { sendConfirmationEmail, sendCourseConfirmationEmail , sendQuizSuccessEmail  };
