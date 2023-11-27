"use client"

import Image, { StaticImageData } from 'next/image'

interface MenuItemProps {
    drinkName: string;
    drinkImage: string;
    altTxt: string;
    thisOnClick: () => void;
  }
  

export default function MenuItem({drinkName, drinkImage, altTxt, thisOnClick}: MenuItemProps){
    
    return(

        <button className='w-full h-full flex justify-center items-center bg-slate-100 rounded-3xl border-rose-700 border-4' onClick={thisOnClick}>
            <Image
                className='ml-4 h-4/5 w-fit'
                src={drinkImage}
                alt={altTxt}
            />
            <div className='w-full'>
                <div className='flex justify-center items-center w-full text-5xl font-semibold text-rose-700'>
                    {drinkName}
                </div>
            </div>
        </button>
    );
}