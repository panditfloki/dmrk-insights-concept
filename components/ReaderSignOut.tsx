'use client';
import {useState} from 'react';
export default function ReaderSignOut(){const[error,setError]=useState('');return <><button type="button" className="textlink" onClick={async()=>{try{const r=await fetch('/api/readers/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw Error();window.location.reload();}catch{setError('Unable to sign out. Please try again.');}}}>Sign out</button>{error&&<span role="alert">{error}</span>}</>;}
