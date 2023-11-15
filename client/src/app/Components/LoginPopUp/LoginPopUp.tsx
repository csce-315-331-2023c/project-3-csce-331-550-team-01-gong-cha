"use client"

import React, { useState, useEffect } from 'react'
import { useGeolocated } from 'react-geolocated'
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
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
            useGeolocated({
                positionOptions: {
                    enableHighAccuracy: false,
                },
                userDecisionTimeout: 5000,
            });
    function myFunct(){
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords?.latitude.toFixed(2)}&longitude=${coords?.longitude.toFixed(2)}&current=temperature_2m,is_day,rain,snowfall&temperature_unit=fahrenheit`) // Replace with the actual API endpoint URL
            .then((response) => {
                if (!response.ok) {
                alert("did not pass");
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Process the data received from the API and store it in the state
                alert(data?.current?.temperature_2m);
                
            })
    }

    function userExist(userName: string, password: string){
        // var pbkdf2 = require('pbkdf2');
        // var derivedKey = pbkdf2.pbkdf2Sync(password, '[B@1198b989', 1000, 128, 'sha1')
        // alert(derivedKey.toString('hex'));

        const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({positionOptions: { enableHighAccuracy: false, }, userDecisionTimeout: 5000, });
        alert(coords);
        if(!isGeolocationAvailable){
            alert("not a");
        }
        if(!isGeolocationEnabled){
            alert("not e");
        }
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
                        <button className='bg-cyan-200 h-full w-2/5 ml-2' onClick={() => myFunct()}>Sign In</button> {/* onClick={() => userExist(userName, password)} */}
                    </div>
                </div>
            </div>
        </div>

    );
}
