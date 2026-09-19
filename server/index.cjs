const express = require('express');
const path = require('node:path');
const compression = require('compression');
const app = express();
const publicDir = path.resolve(__dirname,'../public');
const contactAttempts = new Map();

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

app.use(compression());
app.use(express.json({ limit: '16kb' }));

app.post('/api/contact', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const company = String(req.body?.company || '').trim();
  const message = String(req.body?.message || '').trim();
  const website = String(req.body?.website || '').trim();

  // Silently accept bot submissions that fill the hidden website field.
  if (website) return res.json({ success: true });

  if (
    name.length < 2 || name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    company.length > 120 ||
    message.length < 10 || message.length > 3000
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please check your name, email, and message.',
    });
  }

  const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recentAttempts = (contactAttempts.get(clientKey) || [])
    .filter((timestamp) => now - timestamp < 15 * 60 * 1000);

  if (recentAttempts.length >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many messages were sent. Please try again later.',
    });
  }

  recentAttempts.push(now);
  contactAttempts.set(clientKey, recentAttempts);

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'nm_benaboud@esi.dz';
  const fromEmail = process.env.CONTACT_FROM_EMAIL ||
    'Mohamed Islam Portfolio <onboarding@resend.dev>';

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      message: 'Email delivery is being configured. Please contact me on WhatsApp.',
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || 'Not provided');
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');

  try {
    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || 'Not provided'}`,
          '',
          message,
        ].join('\n'),
        html: `<h2>New portfolio enquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Company:</strong> ${safeCompany}</p>
          <p><strong>Message:</strong></p><p>${safeMessage}</p>`,
      }),
    });

    const providerResult = await providerResponse.json().catch(() => null);

    if (!providerResponse.ok || !providerResult?.id) {
      console.error('Contact email provider error:', providerResponse.status, providerResult);
      return res.status(502).json({
        success: false,
        message: 'The email could not be delivered. Please try WhatsApp instead.',
      });
    }

    return res.json({
      success: true,
      message: 'Message sent successfully. I will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact email request failed:', error);
    return res.status(502).json({
      success: false,
      message: 'The email could not be delivered. Please try WhatsApp instead.',
    });
  }
});

app.use(express.static(publicDir, { setHeaders(res, filePath) {
  if (path.extname(filePath).toLowerCase() === '.apk') {
    res.type('application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="' + path.basename(filePath) + '"');
  }
}}));
app.use('/os',(req,res,next)=>{
  if((req.method==='GET'||req.method==='HEAD')&&!path.extname(req.path)) return res.sendFile(path.join(publicDir,'os/index.html'));
  next();
});
app.listen(Number(process.env.PORT||3000),'127.0.0.1',()=>console.log(`Mohamed Islam portfolio: http://127.0.0.1:${process.env.PORT||3000}`));

