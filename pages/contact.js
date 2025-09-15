import { useState } from 'react';
import Head from 'next/head';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [allowEmailContact, setAllowEmailContact] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, message, allowEmailContact,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setName('');
      setEmail('');
      setMessage('');
      setAllowEmailContact(true);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact - Milk & Mercy</title>
        <meta name="description" content="Get in touch with us" />
      </Head>

      <div className="contact-page">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="contact-description">
            Have a question or want to get in touch? Send us a message and we&apos;ll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={100}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={2000}
                rows={6}
                placeholder="Your message..."
              />
              <div className="char-count">
                {message.length}/2000
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={allowEmailContact}
                  onChange={(e) => setAllowEmailContact(e.target.checked)}
                />
                <span className="checkmark" />
                It&apos;s okay to contact me by email for a response
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Message sent successfully! We&apos;ll get back to you soon.</div>}

            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          max-width: 700px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        h1 {
          color: var(--primary-color);
          font-size: 2.5rem;
          margin-bottom: 20px;
          text-align: center;
        }

        .contact-description {
          color: var(--text-light);
          font-size: 1.1rem;
          text-align: center;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .contact-form {
          background: var(--background-alt);
          padding: 40px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--text-color);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          font-family: inherit;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          transition: border-color 0.2s;
          box-sizing: border-box;
          background: white;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--link-color);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .char-count {
          text-align: right;
          font-size: 12px;
          color: var(--text-light);
          margin-top: 5px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-color);
          user-select: none;
          margin-bottom: 0;
        }

        .checkbox-label input[type="checkbox"] {
          margin-right: 10px;
          transform: scale(1.2);
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"]:checked {
          accent-color: var(--primary-color);
        }

        .error-message {
          background: #fee;
          color: #d32f2f;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .success-message {
          background: #f0f9ff;
          color: #0369a1;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .submit-btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .contact-page {
            padding: 20px 10px;
          }

          h1 {
            font-size: 2rem;
          }

          .contact-form {
            padding: 25px;
          }

          .form-group input,
          .form-group textarea {
            font-size: 16px;
          }
        }
      `}
      </style>
    </>
  );
}
