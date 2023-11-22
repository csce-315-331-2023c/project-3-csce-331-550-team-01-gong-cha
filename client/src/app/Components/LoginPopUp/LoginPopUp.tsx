"use client"

import React, { useState, useEffect } from 'react'
import './styles.css'
import 'pbkdf2'

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function ReportsModal({open, children, onClose}: ModalProps) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    function userExist(userName: string, password: string){
        // var pbkdf2 = require('pbkdf2');
        // var derivedKey = pbkdf2.pbkdf2Sync(password, '[B@1198b989', 1000, 128, 'sha1')
        // alert(derivedKey.toString('hex'));
        // fetch(`http://18.191.166.59:5000/salesReport/:${date1}/:${date2}`) // Replace with the actual API endpoint URL
        //     .then((response) => {
        //         if (!response.ok) {
        //         alert("did not pass");
        //         throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then((data) => {
        //         // Process the data received from the API and store it in the state
                
        //         const salesReportData: SalesReportItem[] = data.map((item: any) => ({
        //             MenuDrinkName: item.MenuDrinkName,
        //             MenuDrinkPrice: item.MenuDrinkPrice,
        //             AmountSold: item.AmountSold
        //         }));
        //         setSalesReportItems(salesReportData);
        //     })
        if(password === 'Alexa01'){
            window.location.href = './././Manager';
        }
    }

    if (!open) return null

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-400 flex items-center justify-start'>
                    <div className='h-1/5 text-4xl font-bold'>Employee Login</div>
                    <input className='my-4 h-1/5' type="userName" placeholder="Username" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                    <input className='my-4 h-1/5' type="password" placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <div className=' h-1/5 w-full mt-4'>
                        <button className='bg-cyan-200 h-full w-2/5 mr-2' onClick={() => onClose()}>Exit</button>
                        <button className='bg-cyan-200 h-full w-2/5 ml-2' onClick={() => userExist(userName, password)}>Sign In</button> {/* onClick={() => userExist(userName, password)} */}
                    </div>
                </div>
            </div>
        </div>

    );
}
