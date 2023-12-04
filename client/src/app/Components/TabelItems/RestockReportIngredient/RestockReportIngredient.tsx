"use client"

import './styles.css'

interface IngredientProps {
    name: string;
    currentAmount: number;
    idealAmount: number;
}

export default function RestockReportIngredient({name, currentAmount, idealAmount}: IngredientProps){

    return(
        <div className='flex justify-center'>
            <div className='inner bg-rose-700 w-full flex justify-evenly border-rose-700 border-4 h-12 my-1 rounded-xl text-slate-200 text-xl font-semibold'>
                <div className='flex justify-center items-center w-4/6'>
                    {name}
                </div>
                <div className="flex justify-center items-center w-1/6">
                    {currentAmount}
                </div>
                <div className='flex w-1/6 justify-center items-center'>
                    {idealAmount}
                </div>
            </div>
        </div>
    );
}