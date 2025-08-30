const express = require("express")
const router = express.Router()
const Contact = require("../models/Contact")
const nodemailer = require("nodemailer")

// Configure email transporter with better error handling
const createTransporter = () => {
  // Validate environment variables
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error("Missing MAIL_USER or MAIL_PASS environment variables")
    return null
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // This MUST be an App Password, not regular password
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

// POST /contact - Send a message
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !subject || !phone || !message) {
      return res.status(400).json({
        message: "Tous les champs sont requis",
        missingFields: {
          name: !name,
          email: !email,
          phone: !phone,
          subject: !subject,
          message: !message,
        },
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide" })
    }

    // Save to database
    const newContact = new Contact({ name, email, phone, subject, message })
    await newContact.save()

    // Create transporter
    const transporter = createTransporter()
    if (!transporter) {
      console.error("Failed to create email transporter")
      return res.status(201).json({
        message: "Message sauvegardé mais email de confirmation non envoyé (configuration email manquante)",
      })
    }

    // Verify transporter configuration
    try {
      await transporter.verify()
    } catch (verifyError) {
      console.error("Email transporter verification failed:", verifyError)
      if (verifyError.code === "EAUTH") {
        console.error(
          "Gmail authentication failed. Make sure you're using an App Password, not your regular Gmail password.",
        )
        console.error("Generate an App Password at: https://myaccount.google.com/apppasswords")
      }
      return res.status(201).json({
        message: "Message sauvegardé mais email de confirmation non envoyé (erreur d'authentification Gmail)",
        hint: "Vérifiez que vous utilisez un App Password Gmail",
      })
    }

    // Send confirmation email to client
    try {
      await transporter.sendMail({
        from: `"Support Client" <${process.env.MAIL_USER}>`, // Updated to use MAIL_USER
        to: email,
        subject: "Confirmation de réception de votre message",
        html: `
                    <h2>Bonjour ${name},</h2>
                    <p>Nous avons bien reçu votre message concernant "<strong>${subject}</strong>".</p>
                    <p>Nous vous contacterons prochainement par téléphone (${phone}) ou par e-mail.</p>
                    <br>
                    <p>Votre message:</p>
                    <blockquote style="border-left: 3px solid #ccc; padding-left: 15px; margin: 15px 0;">
                        ${message}
                    </blockquote>
                    <br>
                    <p>Cordialement,<br>L'équipe Support</p>
                `,
        text: `Bonjour ${name},\n\nNous avons bien reçu votre message concernant "${subject}".\nNous vous contacterons prochainement par téléphone (${phone}) ou par e-mail.\n\nVotre message: ${message}\n\nCordialement,\nL'équipe Support.`,
      })

      res.status(201).json({
        message: "Message envoyé avec succès et email de confirmation envoyé",
        contactId: newContact._id,
      })
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError)
      res.status(201).json({
        message: "Message sauvegardé mais email de confirmation non envoyé",
        contactId: newContact._id,
        emailError: emailError.message,
      })
    }
  } catch (error) {
    console.error("Contact route error:", error)
    res.status(500).json({
      message: "Erreur serveur",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// GET /contact - Get all messages (admin)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 })
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    console.error("Get contacts error:", error)
    res.status(500).json({
      message: "Erreur serveur",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// GET /contact/:id - Get specific message (admin)
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
      return res.status(404).json({ message: "Message non trouvé" })
    }
    res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error("Get contact by ID error:", error)
    res.status(500).json({
      message: "Erreur serveur",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// DELETE /contact/:id - Delete message (admin)
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) {
      return res.status(404).json({ message: "Message non trouvé" })
    }
    res.status(200).json({
      message: "Message supprimé avec succès",
      deletedContact: contact,
    })
  } catch (error) {
    console.error("Delete contact error:", error)
    res.status(500).json({
      message: "Erreur serveur",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

module.exports = router
