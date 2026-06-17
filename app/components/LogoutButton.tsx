"use client";

import React from 'react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/partner-login" })} 
      className="w-full flex justify-center items-center gap-2 mt-4 px-4 py-2 text-xs text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-bold uppercase tracking-wider"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  );
}
