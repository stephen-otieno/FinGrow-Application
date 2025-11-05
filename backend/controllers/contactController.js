// backend/controllers/contactController.js

import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';
import sendEmail from '../utils/emailService.js'; 

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const newMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message,
  });

  if (newMessage) {
    // --- 2. ADD EMAIL FUNCTIONALITY ---
    try {
      await sendEmail({
        email: email, // Send to the user who filled out the form
        subject: 'We\'ve received your message | FinGrow',
        html: `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have successfully received your message regarding: "${subject}".</p>
          <p>Our team is reviewing it and will get back to you as soon as possible.</p>
          <br>
          <p><strong>Your Message:</strong></p>
          <p><em>${message}</em></p>
          <br>
          <p>Best regards,</p>
          <p>The FinGrow Team</p>
        `,
      });
      console.log(`Contact confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error(`Email Error: Could not send contact confirmation to ${email}:`, emailError);
      // We don't stop the process if the email fails,
      // as the message is already saved in the DB.
    }
    // --- END OF EMAIL ---

    res.status(201).json({
      message: 'Message sent successfully! We will get back to you soon.',
    });
  } else {
    res.status(400);
    throw new Error('Invalid message data');
  }
});

export { submitContactForm };