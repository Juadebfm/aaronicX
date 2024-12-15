const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  // Use your email service provider's SMTP settings
  // Example for Gmail (not recommended for production - use App Passwords)
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Function to send email
async function sendEmail(userInput) {
  try {
    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: "recipient@example.com", // Recipient address
      subject: "New Form Submission",
      text: `
        Name: ${userInput.name}
        Email: ${userInput.email}
        Message: ${userInput.message}
      `,
      html: `
        <h1>New Form Submission</h1>
        <p><strong>Name:</strong> ${userInput.name}</p>
        <p><strong>Email:</strong> ${userInput.email}</p>
        <p><strong>Message:</strong> ${userInput.message}</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Example route handler (Express.js)
app.post("/submit-form", async (req, res) => {
  const userInput = req.body;
  const emailSent = await sendEmail(userInput);

  if (emailSent) {
    res.status(200).json({ message: "Form submitted successfully" });
  } else {
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = { sendEmail };
