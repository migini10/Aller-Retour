import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER || 'allogoosn@gmail.com';
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD,
  },
});

export const sendDeliveryCodeEmail = async (
  toEmail: string,
  recipientName: string,
  trackingCode: string,
  deliveryCode: string
) => {
  if (!EMAIL_APP_PASSWORD) {
    console.warn('⚠️ EMAIL_APP_PASSWORD manquant. E-mail non envoyé.');
    console.warn(`[Mock Email] À: ${toEmail} | Code de livraison: ${deliveryCode}`);
    return false;
  }

  const mailOptions = {
    from: `"Allogoo" <${EMAIL_USER}>`,
    to: toEmail,
    subject: `📦 Votre colis ${trackingCode} est en route !`,
    text: `Bonjour ${recipientName},\n\nVotre colis (Suivi: ${trackingCode}) a été enregistré sur Allogoo.\n\nIMPORTANT : Votre code de livraison secret est le ${deliveryCode}. Vous devrez impérativement communiquer ce code au chauffeur pour récupérer votre colis.\n\nMerci de faire confiance à Allogoo !`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #ff7900; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Allogoo</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour <strong>${recipientName}</strong>,</p>
          <p>Votre colis portant le numéro de suivi <strong>${trackingCode}</strong> a bien été enregistré sur Allogoo et sera bientôt en route.</p>
          
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">Votre Code Secret de Livraison</p>
            <h2 style="margin: 10px 0 0 0; font-size: 32px; color: #ff7900; letter-spacing: 5px;">${deliveryCode}</h2>
          </div>

          <p style="color: #d9534f; font-weight: bold;">⚠️ IMPORTANT</p>
          <p>Vous devrez impérativement communiquer ce code au chauffeur lors de la réception pour qu'il puisse vous remettre le colis.</p>
          
          <p>Merci de votre confiance !<br>L'équipe Allogoo.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail envoyé avec succès à ${toEmail} via Nodemailer`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'e-mail Nodemailer :', error);
    return false;
  }
};
