'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import ReaderSignOut from './ReaderSignOut';
export default function ReaderAccountLink(){
  const[signedIn,setSignedIn]=useState(false);
  useEffect(()=>{const controller=new AbortController();fetch('/api/readers/me',{cache:'no-store',signal:controller.signal}).then(r=>r.ok?r.json():null).then(d=>setSignedIn(Boolean(d?.reader))).catch(()=>{});return()=>controller.abort();},[]);
  return signedIn?<span className="reader-link"><ReaderSignOut/></span>:<Link className="reader-link" href="/reader/login">Sign in</Link>;
}
