const contactAttempts = new Map();

const escapeHtml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

module.exports = async function contactHandler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({
            success: false,
            message: 'Method not allowed.',
        });
    }

    const name = String(request.body?.name || '').trim();
    const email = String(request.body?.email || '').trim();
    const company = String(request.body?.company || '').trim();
    const message = String(request.body?.message || '').trim();
    const website = String(request.body?.website || '').trim();

    if (website) return response.json({ success: true });

    if (
        name.length < 2 ||
        name.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254 ||
        company.length > 120 ||
        message.length < 10 ||
        message.length > 3000
    ) {
        return response.status(400).json({
            success: false,
            message: 'Please check your name, email, and message.',
        });
    }

    const forwardedFor = request.headers['x-forwarded-for'];
    const clientKey = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : String(forwardedFor || 'unknown').split(',')[0].trim();
    const now = Date.now();
    const recentAttempts = (contactAttempts.get(clientKey) || []).filter(
        (timestamp) => now - timestamp < 15 * 60 * 1000
    );

    if (recentAttempts.length >= 5) {
        return response.status(429).json({
            success: false,
            message: 'Too many messages were sent. Please try again later.',
        });
    }

    recentAttempts.push(now);
    contactAttempts.set(clientKey, recentAttempts);

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'nm_benaboud@esi.dz';
    const fromEmail =
        process.env.CONTACT_FROM_EMAIL ||
        'Mohamed Islam Portfolio <onboarding@resend.dev>';

    if (!apiKey) {
        return response.status(503).json({
            success: false,
            message:
                'Email delivery is being configured. Please contact me on WhatsApp.',
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
            console.error(
                'Contact email provider error:',
                providerResponse.status,
                providerResult
            );
            return response.status(502).json({
                success: false,
                message:
                    'The email could not be delivered. Please try WhatsApp instead.',
            });
        }

        return response.json({
            success: true,
            message: 'Message sent successfully. I will get back to you soon.',
        });
    } catch (error) {
        console.error('Contact email request failed:', error);
        return response.status(502).json({
            success: false,
            message:
                'The email could not be delivered. Please try WhatsApp instead.',
        });
    }
};
