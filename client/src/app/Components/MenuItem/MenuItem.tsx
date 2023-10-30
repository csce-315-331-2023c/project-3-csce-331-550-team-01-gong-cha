"use client"

import Image from 'next/image'


export default function MenuItem({drinkName, drinkImage, altTxt, thisOnClick}){
    
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