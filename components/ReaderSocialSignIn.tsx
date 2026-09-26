'use client';

import {useState} from 'react';
import Link from 'next/link';

type Provider = 'google' | 'apple';
const errors: Record<string, string> = {
  cancelled: 'Sign-in was cancelled. You can try again or use your email.',
  expired: 'This sign-in request expired. Please start again.',
  existing_account: 'An account already uses this email. Please sign in with your password or use password recovery.',
  unavailable: 'This sign-in option is temporarily unavailable. Please use email.',
  retry: 'Please start sign-in again.',
  failed: 'We could not complete sign-in. Please try again or use email.',
};
export default function ReaderSocialSignIn({providers, next, error}: {providers: Record<Provider, boolean>; next: string; error?: string}) {
  const [busy, setBusy] = useState<Provider | null>(null);
  const [message, setMessage] = useState(error ? errors[error] || errors.failed : '');
  const available = providers.google || providers.apple;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const provider = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement)?.value as Provider;
    if (!providers[provider] || busy) return;
    setBusy(provider); setMessage('');
    try {
      const response = await fetch(`/api/readers/social/${provider}/start`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({next, terms: true}),
      });
      const data = await response.json();
      if (!response.ok) {setMessage(data.message || errors.failed); setBusy(null); return;}
      window.location.assign(data.url);
    } catch {setMessage('Connection failed. Please try again.'); setBusy(null);}
  }
  return <div className="reader-social">
    <form onSubmit={submit} aria-label="Sign in with a provider">
      <div className="reader-social-buttons">
        {(['google', 'apple'] as const).map(provider => <button key={provider} type="submit" value={provider}
          className={`reader-social-button reader-social-button--${provider}`} disabled={!!busy || !providers[provider]}
          aria-describedby={!providers[provider] ? 'reader-social-availability' : undefined}>
          <img src={`/auth/${provider}.${provider === 'google' ? 'png' : 'svg'}`} width="20" height="20" alt="" />
          <span>{busy === provider ? 'Connecting…' : `Sign in with ${provider === 'google' ? 'Google' : 'Apple'}`}</span>
        </button>)}
      </div>
      {available && <label className="reader-consent reader-social-consent"><input type="checkbox" required name="social_terms"/>
        <span>I agree to the <Link href="/terms-of-use">Terms of Use</Link> and have read the <Link href="/privacy-policy">Privacy Policy</Link>. A free reader account will be created if needed.</span>
      </label>}
      {(!providers.google || !providers.apple) && <p id="reader-social-availability" className="reader-status">
        {!available ? 'Google and Apple sign-in are not available yet. Please use email below.' : `${providers.google ? 'Apple' : 'Google'} sign-in is not available yet.`}
      </p>}
      {message && <p role="alert" className="form-note">{message}</p>}
    </form>
    <div className="reader-signin-divider"><span>or use your email</span></div>
  </div>;
}
