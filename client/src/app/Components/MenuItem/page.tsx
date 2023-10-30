"use client"

import Image from 'next/image'

export default function MenuItem({drinkName, drinkImage, altTxt}){

    return(
        <main className='w-4/5 h-4/5 flex justify-start items-start'>
            <div>
                <Image
                    className='h-full'
                    src={drinkImage}
                    alt={altTxt}
                ></Image>
            </div>
            <div>
                {drinkName}
            </div>
        </main>
    );
}