import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});

export const sendEmail = async ({ to, subject, html }) => {
  const emailParams = new EmailParams()
    .setFrom(
      new Sender(process.env.MAIL_FROM_EMAIL, process.env.MAIL_FROM_NAME)
    )
    .setTo([new Recipient(to)])
    .setSubject(subject)
    .setHtml(html);

  try {
    const response = await mailerSend.email.send(emailParams);
    return response;
  } catch (error) {
    console.error("Erreur MailerSend:", error);
    throw error;
  }
};




const app = express();
app.use(express.json());

app.post("/send-mail", async (req, res) => {
  const { email } = req.body;

  try {
    await sendEmail({
      to: email,
      subject: "Bienvenue sur notre application ! 🎉",
      html: "<h1>Merci de vous être inscrit !</h1><p>Votre compte est prêt.</p>",
    });

    res.json({ success: true, message: "Email envoyé avec succès" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi du mail" });
  }
});

app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));