const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your preferred email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
    pass: process.env.EMAIL_PASSWORD || 'your-app-password', // Replace with your app password
  },
});

// Send contact form email
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, and message' 
      });
    }

    // Email options
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER || 'your-email@gmail.com', // Your email to receive messages
      subject: `Contact Form - SportsPro from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide specific error messages
    let errorMessage = 'Failed to send message. Please try again later.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email service authentication failed. Please contact support.';
      console.error('Email auth error: Check EMAIL_USER and EMAIL_PASSWORD in .env file');
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email service. Please try again later.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
