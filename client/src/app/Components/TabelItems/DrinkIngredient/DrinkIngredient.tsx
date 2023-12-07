"use client"

import Image from 'next/image'
import React, { useState } from 'react'


interface ToppingProps {
  toppingName: string;
  addTopping: (price: number) => void;
  removeTopping: (price: number) => void;
  toppingID: number;
  addedI: boolean;
}

export default function DrinkIngredient({toppingName, addTopping, removeTopping, toppingID, addedI}: ToppingProps){
    const [added, setAdded] = useState(addedI);

    const [backColor, setBackColor] = useState(added ?  'bg-rose-700 text-slate-200 fill-slate-200' : 'bg-slate-200 text-rose-700 fill-rose-700');

    return(
        
            <div className={`${backColor} w-full flex justify-evenly border-4 h-16 rounded-2xl my-1 border-rose-700`}>
                <div className='flex justify-center items-center w-4/6 text-3xl font-semibold'>
                    {toppingName}
                </div>
                <div className='flex justify-evenly w-1/6'>
                    {added ?
                        <button onClick={() => {removeTopping(toppingID), setAdded(false), setBackColor('bg-slate-100 text-rose-700 fill-rose-700')}}>
                            <svg className={`${backColor}`} xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
                        </button>
                        :
                        <button onClick={() => {addTopping(toppingID), setAdded(true), setBackColor('bg-rose-700 text-slate-200 fill-slate-200')}}>
                            <svg className={`${backColor}`} xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        </button>
                    }
                </div>
            </div>
            
    );
}