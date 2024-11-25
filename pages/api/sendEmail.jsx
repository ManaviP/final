const nodemailer = require('nodemailer');
require('dotenv').config();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { movieName, tickets } = req.body;
    console.log('Email User:', process.env.EMAIL_USER); 
    console.log('Email Password:', process.env.EMAIL_PASS); 

    // Create transporter using Gmail service and environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,   
      },
    });
    console.log('Transporter created:', transporter);
    // Email content construction
    const emailPromises = tickets.map((ticket) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,  
        to: ticket.email,             
        subject: `Reminder: Tickets for ${movieName}`,
        text: `Hello ${ticket.name},\n\nThis is a reminder that you have booked ${ticket.count} ticket(s) for the movie "${movieName}".\n\nEnjoy the show!`,
      };

      return transporter.sendMail(mailOptions);
    });

    try {
      await Promise.all(emailPromises); 
      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).json({ message: 'Error sending emails', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
