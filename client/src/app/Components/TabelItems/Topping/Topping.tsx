"use client"

import Image from 'next/image'
import React, { useState } from 'react'


interface ToppingProps {
  toppingName: string;
  price: number;
  addTopping: (price: number) => void;
  removeTopping: (price: number) => void;
  toppingID: number;
  toppings: Topping[];
  toppingAmounts: number[];

}

interface Topping {
  id: number;
  toppingName: string;
}

export default function Topping({toppingName, price, addTopping, removeTopping, toppingID, toppings, toppingAmounts}: ToppingProps){
    const [totalAmount, setTotalAmount] = useState(0)

    const addOne = () => {
        setTotalAmount(totalAmount + 1);
        addTopping(price);
        
      }
    
      const removeOne = () => {
        if (totalAmount > 0){
          setTotalAmount(totalAmount - 1)
          removeTopping(price)
        }
        
      }
    
    return(
        
            <div className='bg-rose-700 w-full flex justify-evenly border-white border-2 h-10 text-slate-100 rounded-3xl'>
                <div className='flex justify-center items-center w-4/6'>
                    {toppingName}
                </div>
                <div className="flex justify-evenly w-1/6">
                    <button onClick={() => addOne()}>
                    <svg className="fill-slate-100 h-3/4" xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                    </button>
                    <button onClick={() => removeOne()}>
                    <svg className="fill-slate-100 h-3/4" xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
                    </button>
                </div>
                <div className='w-4/6'>
                    {totalAmount}
                </div>
            </div>
            
    );
}