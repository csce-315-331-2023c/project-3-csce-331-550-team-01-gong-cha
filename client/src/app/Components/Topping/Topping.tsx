"use client"

import Image from 'next/image'
import React, { useState } from 'react'


interface ToppingProps {
  toppingName: string;
  price: number;
  addTopping: (price: number) => void;
  removeTopping: (price: number) => void;
}

export default function Topping({toppingName, price, addTopping, removeTopping}: ToppingProps){
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
        
            <div className='bg-cyan-200 w-full flex justify-evenly border-white border-2 h-10'>
                <div className='flex justify-center items-center w-4/6'>
                    {toppingName}
                </div>
                <div className="flex justify-evenly w-1/6">
                    <button onClick={() => addOne()}>Plus</button>
                    <button onClick={() => removeOne()}>Minus</button>
                </div>
                <div className='w-1/6'>
                    {totalAmount}
                </div>
            </div>
            
    );
}