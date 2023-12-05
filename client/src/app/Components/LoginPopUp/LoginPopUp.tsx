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

    if (!open) return null

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-400 flex items-center justify-start'>
                    <button className='bg-cyan-200 h-3/6 w-4/5 mb-4' onClick={() => redirectManager()}>Manager</button>
                    <button className='bg-cyan-200 h-3/6 w-4/5 mt-4' onClick={() => redirectServer()}>Server</button> {/* onClick={() => userExist(userName, password)} */}
                </div>
            </div>
        </div>
    );
}
