import React, { FormEvent, useMemo, useRef, useState } from 'react';
import colors from '../../constants/colors';
import ghIcon from '../../assets/pictures/contact-gh.png';
import ResumeDownload from './ResumeDownload';

export interface ContactProps {}

const CONTACT_EMAIL = 'nm_benaboud@esi.dz';
const WHATSAPP_NUMBER = '213659361670';
const WHATSAPP_MESSAGE =
    'Hello Mohamed Islam, I visited your portfolio and would like to discuss a project.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
)}`;

const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

interface SocialBoxProps {
    icon: string;
    link: string;
    label: string;
}

const SocialBox: React.FC<SocialBoxProps> = ({ link, icon, label }) => (
    <a rel="noreferrer" target="_blank" href={link} aria-label={label}>
        <div className="big-button-container" style={styles.social}>
            <img src={icon} alt="" style={styles.socialImage} />
        </div>
    </a>
);

type FormStatus = 'idle' | 'success' | 'error';

const Contact: React.FC<ContactProps> = () => {
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [website, setWebsite] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');
    const startedAt = useRef(Date.now());

    const isFormValid = useMemo(
        () =>
            name.trim().length >= 2 &&
            validateEmail(email) &&
            message.trim().length >= 10,
        [email, name, message]
    );

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isFormValid || isLoading) return;

        setIsLoading(true);
        setFormMessage('');
        setFormStatus('idle');

        // Bots commonly fill hidden fields or submit immediately. Treat those
        // submissions as successful without forwarding them to the inbox.
        if (website || Date.now() - startedAt.current < 1200) {
            setIsLoading(false);
            setFormStatus('success');
            setFormMessage('Thank you. Your message was submitted.');
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    company: company.trim() || 'Not provided',
                    message: message.trim(),
                    website,
                }),
            });

            const result = await response.json().catch(() => null);
            const providerAccepted =
                result?.success === true || result?.success === 'true';

            if (!response.ok || !providerAccepted) {
                throw new Error(
                    result?.message ||
                        'The message service did not accept the request.'
                );
            }

            setName('');
            setEmail('');
            setCompany('');
            setMessage('');
            setFormStatus('success');
            setFormMessage(
                'Message sent successfully. I will get back to you soon.'
            );
            startedAt.current = Date.now();
        } catch (error) {
            setFormStatus('error');
            setFormMessage(
                error instanceof Error
                    ? error.message
                    : 'The message could not be sent. Please try again or contact me on WhatsApp.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const statusColor =
        formStatus === 'error'
            ? colors.red
            : formStatus === 'success'
            ? colors.blue
            : colors.black;

    return (
        <div className="site-page-content">
            <div style={styles.header}>
                <h1>Contact</h1>
                <div style={styles.socials}>
                    <SocialBox
                        icon={ghIcon}
                        link="https://github.com/eng-Islam-Mohamed"
                        label="Open Mohamed Islam's GitHub profile"
                    />
                </div>
            </div>

            <div className="text-block">
                <p>
                    Have an idea, a question, or a project to discuss? Send me a
                    message here or start a conversation on WhatsApp.
                </p>

                <div style={styles.quickContact} className="contact-quick-card">
                    <div style={styles.quickContactCopy}>
                        <h3>Chat on WhatsApp</h3>
                        <p>Usually the fastest way to reach me.</p>
                        <p>
                            <b>+213 659 361 670</b>
                        </p>
                    </div>
                    <a
                        className="site-button"
                        style={styles.whatsappButton}
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open WhatsApp
                    </a>
                </div>

                <p>
                    <b>Email: </b>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </p>

                <form style={styles.form} onSubmit={submitForm} noValidate>
                    <div style={styles.honeypot} aria-hidden="true">
                        <label htmlFor="contact-website">Website</label>
                        <input
                            id="contact-website"
                            name="website"
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={website}
                            onChange={(event) => setWebsite(event.target.value)}
                        />
                    </div>

                    <label htmlFor="contact-name">
                        <p>
                            {name.trim().length < 2 && (
                                <span style={styles.star}>*</span>
                            )}
                            <b>Your name:</b>
                        </p>
                    </label>
                    <input
                        id="contact-name"
                        style={styles.formItem}
                        type="text"
                        name="name"
                        placeholder="Name"
                        autoComplete="name"
                        maxLength={100}
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />

                    <label htmlFor="contact-email">
                        <p>
                            {!validateEmail(email) && (
                                <span style={styles.star}>*</span>
                            )}
                            <b>Email:</b>
                        </p>
                    </label>
                    <input
                        id="contact-email"
                        style={styles.formItem}
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        maxLength={254}
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <label htmlFor="contact-company">
                        <p>
                            <b>Company (optional):</b>
                        </p>
                    </label>
                    <input
                        id="contact-company"
                        style={styles.formItem}
                        type="text"
                        name="company"
                        placeholder="Company"
                        autoComplete="organization"
                        maxLength={120}
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                    />

                    <label htmlFor="contact-message">
                        <p>
                            {message.trim().length < 10 && (
                                <span style={styles.star}>*</span>
                            )}
                            <b>Message:</b>
                        </p>
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        placeholder="Tell me about your project or idea..."
                        style={styles.formItem}
                        minLength={10}
                        maxLength={3000}
                        required
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                    />

                    <div style={styles.buttons} className="contact-form-actions">
                        <button
                            className="site-button"
                            style={styles.button}
                            type="submit"
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <span className="loading">Sending</span>
                            ) : (
                                'Send Message'
                            )}
                        </button>
                        <div style={styles.formInfo} className="contact-form-info">
                            <p
                                role="status"
                                aria-live="polite"
                                style={{ color: statusColor }}
                            >
                                <b>
                                    <sub>
                                        {formMessage ||
                                            'Your message will be sent directly to my inbox.'}
                                    </sub>
                                </b>
                            </p>
                            <p>
                                <sub>
                                    {!isFormValid ? (
                                        <span>
                                            <b style={styles.star}>*</b> = required
                                            (message: 10+ characters)
                                        </span>
                                    ) : (
                                        '\xa0'
                                    )}
                                </sub>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
            <ResumeDownload altText="Explore more of my work?" />
        </div>
    );
};

const styles: StyleSheetCSS = {
    form: {
        flexDirection: 'column',
        marginTop: 32,
    },
    formItem: {
        marginTop: 4,
        marginBottom: 16,
    },
    honeypot: {
        position: 'absolute',
        left: -10000,
        width: 1,
        height: 1,
        overflow: 'hidden',
    },
    quickContact: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 24,
        padding: 16,
        boxShadow:
            'inset -1px -1px #2b2b2b, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #747474',
        backgroundColor: '#d8e8d2',
        gap: 24,
    },
    quickContactCopy: {
        flexDirection: 'column',
        gap: 4,
    },
    whatsappButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 148,
        minHeight: 32,
        textDecoration: 'none',
        flexShrink: 0,
    },
    socialImage: {
        width: 36,
        height: 36,
    },
    buttons: {
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
    },
    formInfo: {
        textAlign: 'right',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingLeft: 24,
    },
    star: {
        paddingRight: 4,
        color: 'red',
    },
    button: {
        minWidth: 184,
        height: 32,
    },
    header: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    socials: {
        marginBottom: 16,
        justifyContent: 'flex-end',
    },
    social: {
        width: 4,
        height: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
};

export default Contact;
