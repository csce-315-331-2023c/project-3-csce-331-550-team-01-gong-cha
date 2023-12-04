"use client"

import React, { useState, useEffect } from 'react'
import './styles.css'
import Image from 'next/image'
import coffeeImage from '../../../../public/drinkImages/53.png'
import milkImage from '../../../../public/drinkImages/30.png'
import creImage from '../../../../public/drinkImages/18.png'
import slushImage from '../../../../public/drinkImages/44.png'

interface ModalProps {
    open: boolean;
    children: React.ReactNode
    onClose: () => void;
    temp: number;
    raning: boolean;
}


export default function Suggestion({open, children, onClose, temp, raning}: ModalProps) {

    if (!open) return null

    const [tempString, setTempString] = useState("");

    const [suggested, setSuggested] = useState(false);

    const [drinkImage, setDrinkImage] = useState(coffeeImage);
    const [addtoOrder, setAddtoOrder] = useState(false);

    function setString(suggested: boolean){
        if(!suggested){
            if(raning){
                setTempString("Dont let the rain get you down show your creative side with a Strawberry Green Tea!");
                setDrinkImage(creImage);
            }
            else{
                if(temp > 90){
                    setTempString("Cool off with a Strawberry Milk Slush!");
                    setDrinkImage(slushImage);
                }
                else if(temp > 65){
                    setTempString("Enjoy the nice weather with a Brown Sugar Milk Tea!");
                    setDrinkImage(milkImage);
                }
                else{
                    setTempString("Warm up with a Dolce Milk Coffee!");
                    setDrinkImage(coffeeImage);
                }
            }
            setSuggested(true);
        }
    }

    useEffect(() => setString(suggested));

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-200 rounded-3xl flex items-center justify-start border-8 border-rose-700'>
                    <div className='text-4xl font-semibold text-rose-700'>{tempString}</div>
                    <Image
                        className='ml-4 h-4/5 w-fit'
                        src={drinkImage}
                        alt={"Drink Image"}
                    />
                    <div className='flex w-full justify-center h-full mt-4'>
                        <button className='bg-rose-700 rounded-lg w-2/5 mr-8 text-slate-200 h-full' onClick={() => onClose()}>No Thanks</button>
                        <button className='bg-rose-700 rounded-lg w-2/5 ml-8 text-slate-200 text-xl' onClick={() => onClose()}>Add to Order</button>
                    </div>
                </div>
            </div>
        </div>

    );
}