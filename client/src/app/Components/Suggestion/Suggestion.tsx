"use client"

import React, { useState, useEffect } from 'react'
import MenuItem from '../TabelItems/Topping/Topping'
import RestockReportIngredient from '../TabelItems/RestockReportIngredient/RestockReportIngredient'
import './styles.css'

interface ModalProps {
    open: boolean;
    children: React.ReactNode
    onClose: () => void;
    temp: number;
    raning: boolean;
}


export default function ReportsModal({open, children, onClose, temp, raning}: ModalProps) {

    if (!open) return null
    
    const [tempString, setTempString] = useState("");

    if(raning){
        setTempString("Dont let the rain get you down show your creative side with a Strawberry Green Tea!");
    }
    else{
        if(temp > 90){
            setTempString("Cool off with a Strawberry Milk Slush!");
        }
        else if(temp > 65){
            setTempString("Enjoy the nice weather with a Brown Sugar Milk Tea!");
        }
        else{
            setTempString("Warm up with a Dolce Milk Coffee!")
        }
    }

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-400 flex items-center justify-start'>
                    <div className='mb-8 text-2xl'>{tempString}</div>
                    <div className='mb-8 text-2xl'>{children}</div>
                    <button onClick={() => onClose()}>Leave</button>
                </div>
            </div>
        </div>

    );
}