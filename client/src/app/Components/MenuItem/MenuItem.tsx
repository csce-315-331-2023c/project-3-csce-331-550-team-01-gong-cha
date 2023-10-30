"use client"

import Image from 'next/image'


export default function MenuItem({drinkName, drinkImage, altTxt, thisOnClick}){
    
    return(
        <button className='w-full h-full flex justify-start items-start bg-indigo-300' onClick={thisOnClick}>
            <Image
                className='h-full'
                src={drinkImage}
                alt={altTxt}
            ></Image>
            <div className='bg-green-300 w-full'>
                <div className='flex justify-center items-center w-full'>
                    {drinkName}
                </div>
            </div>
        </button>
    );
}