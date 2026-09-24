'use client';
import { createContext, useContext } from 'react';
import { type Website } from '@/lib/website-shared';
const Context = createContext<Website | null>(null);
export function WebsiteProvider({site,children}:{site:Website;children:React.ReactNode}) { return <Context.Provider value={site}>{children}</Context.Provider>; }
export function useWebsite() { const site=useContext(Context); if(!site) throw new Error('Website provider missing'); return site; }
