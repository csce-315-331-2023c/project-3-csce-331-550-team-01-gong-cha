"use client"

import "./styles.css"

interface ExcessProps {
    IngredientName: string;
    IngredientNumber: number;
}

export default function ExcessItems({IngredientName}: ExcessProps){

    return(
        <div className="flex justify-center">
            <div className='inner bg-rose-700 w-full flex justify-center text-slate-200 font-semibold text-xl h-12 my-1 rounded-xl'>
                <div className='flex justify-center items-center w-4/6'>
                    {IngredientName}
                </div>
            </div>
        </div>
    );
}