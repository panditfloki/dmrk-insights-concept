'use client';
import { useState } from 'react';
import Link from 'next/link';
export type ReaderMode = 'login' | 'register' | 'forgot' | 'reset';
export default function ReaderForm({mode, next, token, email}:{mode:ReaderMode; next:string; token?:string; email?:string}) {
  const [busy, setBusy] = useState(false), [message,setMessage] = useState(''), [success,setSuccess] = useState(false);
  const password = mode !== 'forgot', newPassword = mode === 'register' || mode === 'reset';
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(''); setSuccess(false);
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/readers/${mode}`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...fields, ...(mode==='reset'?{token,email}:{})})});
      const data = await response.json();
      if (!response.ok) { setMessage(data.errors ? Object.values(data.errors).flat().join(' ') : data.message || 'Please try again.'); return; }
      if (mode==='login'||mode==='register') { window.location.assign(next); return; }
      setSuccess(true); setMessage(data.message);
    } catch {setMessage('Connection failed. Please try again.');} finally {setBusy(false);}
  }
  return <form className={`form reader-form ${mode==='register'?'reader-form--register':''}`} onSubmit={submit}>
    {mode==='register'&&<label className="field"><span>Name</span><input name="name" autoComplete="name" required maxLength={120}/></label>}
    <label className="field"><span>Email address</span><input name="email" type="email" autoComplete="email" required maxLength={254} defaultValue={email} readOnly={mode==='reset'}/></label>
    {password&&<label className="field"><span>{newPassword?'Create password':'Password'}</span><input name="password" type="password" autoComplete={newPassword?'new-password':'current-password'} minLength={newPassword?12:undefined} maxLength={128} required/>{newPassword&&<small>Use 12 or more characters with at least one letter and one number.</small>}</label>}
    {newPassword&&<label className="field"><span>Confirm password</span><input name="password_confirmation" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label>}
    {mode==='register'&&<label className="reader-consent"><input type="checkbox" name="terms" value="1" required/><span>I agree to the <Link href="/terms-of-use">Terms of Use</Link> and have read the <Link href="/privacy-policy">Privacy Policy</Link>.</span></label>}
    {message&&<p role={success?'status':'alert'} className="form-note">{message}</p>}
    <button className="button" disabled={busy}>{busy?'Please wait…':mode==='register'?'Create free account':mode==='forgot'?'Send reset link':mode==='reset'?'Update password':'Sign in'}</button>
    {mode==='login'&&<p><Link href="/reader/forgot">Forgot password?</Link></p>}
    <p>{mode==='register'?'Already registered? ':mode==='login'?'New to DMRK? ':''}<Link href={`/reader/${mode==='login'?'register':'login'}?next=${encodeURIComponent(next)}`}>{mode==='login'?'Create a free account':'Sign in'}</Link></p>
  </form>;
}
