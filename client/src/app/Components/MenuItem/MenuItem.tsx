"use client"

import Image from 'next/image'


export default function MenuItem({drinkName, drinkImage, altTxt, thisOnClick}){
    
    return(
        <main className='w-full h-full flex justify-start items-start bg-indigo-300'>
            <Image
                className='h-full'
                src={drinkImage}
                alt={altTxt}
            ></Image>
            <div className='bg-green-300 w-full'>
                <button className='flex justify-center items-center w-full' onClick={thisOnClick}>
                    {drinkName}
                </button>
            </div>
        </main>
    );
}