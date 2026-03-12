'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
    if (!url || !email) return;

    setStatus('loading');

    const callbackName = `mc_${Date.now()}`;

    // Derive the honeypot field name from the URL params (Mailchimp bot protection)
    const params = new URLSearchParams(url.split('?')[1]);
    const u = params.get('u') ?? '';
    const id = params.get('id') ?? '';
    const honeypot = `b_${u}_${id}`;

    const jsonpUrl =
      url.replace('/post?', '/post-json?') +
      `&EMAIL=${encodeURIComponent(email)}&${honeypot}=&c=${callbackName}`;

    (window as unknown as Record<string, unknown>)[callbackName] = (data: {
      result: string;
      msg: string;
    }) => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      document.getElementById(callbackName)?.remove();

      if (data.result === 'success') {
        setStatus('success');
        setMessage("You're subscribed! Check your inbox to confirm.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(
          data.msg?.toLowerCase().includes('already subscribed')
            ? "You're already subscribed!"
            : 'Something went wrong. Please try again.'
        );
      }
    };

    const script = document.createElement('script');
    script.id = callbackName;
    script.src = jsonpUrl;
    document.body.appendChild(script);
  };

  const mailchimpConfigured = !!process.env.NEXT_PUBLIC_MAILCHIMP_URL;

  if (!mailchimpConfigured) return null;

  return (
    <section className="bg-stone-50 border-y border-stone-100">
      <div className="max-w-2xl mx-auto px-6 py-14 text-center">
        <h2 className="font-serif text-2xl text-stone-900 mb-2">
          Stay in the loop
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Get a quiet little email whenever a new post goes up. No spam, ever.
        </p>

        {status === 'success' ? (
          <p className="text-green-700 text-sm font-medium">{message}</p>
        ) : (
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'loading'}
              className="w-full sm:w-72 px-4 py-2 border border-stone-300 rounded-md text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2 bg-stone-800 text-white text-sm rounded-md hover:bg-stone-700 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-red-600 text-sm">{message}</p>
        )}
      </div>
    </section>
  );
}
