"use client"

import Image, { StaticImageData } from 'next/image'

interface MenuItemProps {
    drinkName: string;
    drinkImage: StaticImageData;
    altTxt: string;
    thisOnClick: () => void;
  }
  

export default function MenuItem({drinkName, drinkImage, altTxt, thisOnClick}: MenuItemProps){
    
    return(
        <button className='w-full h-full flex justify-center items-center bg-indigo-300' onClick={thisOnClick}>
            <Image
                className='h-full'
                src={drinkImage}
                alt={altTxt}
            />
            <div className='w-full'>
                <div className='flex justify-center items-center w-full text-5xl'>
                    {drinkName}
                </div>
            </div>
        </button>
    );
}