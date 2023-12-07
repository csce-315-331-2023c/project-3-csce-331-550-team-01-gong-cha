"use client"

import "./styles.css"

interface UsageProps {
    ingredientName: string;
    amountUsed: number;
}

export default function UsageItem({ingredientName, amountUsed}: UsageProps){

    return(
        <div className="flex justify-center">
            <div className='inner bg-rose-700 w-full flex justify-evenly text-slate-200 font-semibold text-xl h-12 my-1 rounded-xl'>
                <div className='flex justify-center items-center w-4/6'>
                    {ingredientName}
                </div>
                <div className="flex justify-evenly w-1/6">
                    {amountUsed}
                </div>
            </div>
        </div>
    );
}