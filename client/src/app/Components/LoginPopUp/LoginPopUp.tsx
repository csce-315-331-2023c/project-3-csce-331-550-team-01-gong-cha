"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import './styles.css'

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function ReportsModal({open, children, onClose}: ModalProps) {
    const { data: session } = useSession();

    function redirectManager(){
        if(session){
            window.location.href = '/Manager';
        }
        else{
            signIn("google", {callbackUrl: '/Manager'});
        }
    }

    function redirectServer(){
        if(session){
            window.location.href = '/Manager';
        }
        else{
            signIn("google", {callbackUrl: '/Manager'}, {login_hint: '2'});
        }
    }

    function openAdmin(){

    }

    if (!open) return null

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-200 flex items-center justify-start border-8 border-rose-700 rounded-3xl'>
                    <button className='bg-rose-700 h-3/6 w-4/5 rounded-2xl text-slate-200 fone font-semibold text-4xl' onClick={() => redirectManager()}>Server</button>
                    <button className='bg-rose-700 h-3/6 w-4/5 mt-4 rounded-2xl text-slate-200 fone font-semibold text-4xl' onClick={() => redirectServer()}>Manager</button> 
                    <button className='bg-rose-700 h-3/6 w-4/5 mt-4 rounded-2xl text-slate-200 fone font-semibold text-3xl' onClick={() => openAdmin()}>Employee Manager</button>
                    <button className='bg-rose-700 h-3/6 w-4/5 mt-4 rounded-2xl text-slate-200 fone font-semibold text-4xl' onClick={() => onClose()}>Exit</button>
                </div>
            </div>
        </div>
    );
}
