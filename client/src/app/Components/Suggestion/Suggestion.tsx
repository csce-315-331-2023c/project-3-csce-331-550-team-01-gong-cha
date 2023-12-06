"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import coffeeImage from '../../../../public/drinkImages/53.png'
import milkImage from '../../../../public/drinkImages/30.png'
import creImage from '../../../../public/drinkImages/18.png'
import slushImage from '../../../../public/drinkImages/44.png'

import "./SugStyles.css";


interface SelectedData {
    name: string;
    ID: number;
    normPrice: number;
    largePrice: number;
    normCost: number;
    largeCost: number;
}

interface ModalProps {
    open: boolean;
    children: React.ReactNode
    onClose: () => void;
    temp: number;
    raning: boolean;
    onDataSelect: (data: SelectedData) => void;
}


export default function Suggestion({onDataSelect, open, children, onClose, temp, raning}: ModalProps) {

    const [tempString, setTempString] = useState("");

    const [suggested, setSuggested] = useState(false);

    const [drinkImage, setDrinkImage] = useState(coffeeImage);
    const [addtoOrder, setAddtoOrder] = useState(false);
    const [thisdrinkName, setDrinkName] = useState("");
    const [thisdrinkID, setDrinkID] = useState(0);
    const [thisnormPrice, setNormPrice] = useState(0);
    const [thislargePrice, setLargePrice] = useState(0);
    const [thisnormCost, setNormCost] = useState(0);
    const [thislargeCost, setLargeCost] = useState(0);4

    const setString = useCallback((suggested: boolean) => {
        if(!suggested){
            if(raning){
                setTempString("Dont let the rain get you down show your creative side with a Strawberry Green Tea!");
                setDrinkImage(creImage);
                setDrinkName("Strawberry Green Tea");
                setDrinkID(18);
                setNormPrice(5);
                setLargePrice(5.75);
                setNormCost(4);
                setLargeCost(4.6);
            }
            else{
                if(temp > 90){
                    setTempString("Cool off with a Strawberry Milk Slush!");
                    setDrinkImage(slushImage);
                    setDrinkName("Strawberry Milk Slush"); 
                    setDrinkID(44);
                    setNormPrice(6);
                    setLargePrice(6.75);
                    setNormCost(4.8);
                    setLargeCost(5.4);

                }
                else if(temp > 65){
                    setTempString("Enjoy the nice weather with a Brown Sugar Milk Tea!");
                    setDrinkImage(milkImage);
                    setDrinkName("Brown Sugar Milk Tea");
                    setDrinkID(7);
                    setNormPrice(5);
                    setLargePrice(5.75);
                    setNormCost(4);
                    setLargeCost(4.6);

                }
                else{
                    setTempString("Warm up with a Dolce Milk Coffee!");
                    setDrinkImage(coffeeImage);
                    setDrinkName("Dolce Milk Coffee");
                    setDrinkID(53);
                    setNormPrice(5.5);
                    setLargePrice(6.25);
                    setNormCost(4.4);
                    setLargeCost(5);
                }
            }
            setSuggested(true);
        }
    }, [raning, temp, setTempString, setDrinkImage, setDrinkName, setDrinkID, setNormPrice, setLargePrice, setNormCost, setLargeCost, setSuggested]);
    useEffect(() => {
        setString(suggested)
    }, [suggested, temp, raning, setString]);


    if (!open) return null;
    const sendDataBack = () => {
        const data: SelectedData = {
            name: thisdrinkName,
            ID: thisdrinkID,
            normPrice: thisnormPrice,
            largePrice: thislargePrice,
            normCost: thisnormCost,
            largeCost: thislargeCost
        };

        onDataSelect(data);
    }
    return (
        <div>
            <div className='Overlay_StylesSug'>
                <div className='Modal_StylesSug bg-slate-200 rounded-3xl flex items-center justify-start border-8 border-rose-700'>
                    
                    <div className='text-4xl font-semibold text-rose-700'>{tempString}</div>
                    <Image
                        className='ml-4 h-4/5 w-fit'
                        src={drinkImage}
                        alt={"Drink Image"}
                    />
                    <div className='flex w-full justify-center h-full mt-4'>
                        <button className='bg-rose-700 rounded-lg w-2/5 mr-8 text-slate-200 h-full' onClick={() => onClose()}>No Thanks</button>
                        <button className='bg-rose-700 rounded-lg w-2/5 ml-8 text-slate-200 text-xl' onClick={() => {sendDataBack(); onClose()}}>Add to Order</button>
                    </div>
                </div>
            </div>
        </div>

    )}
