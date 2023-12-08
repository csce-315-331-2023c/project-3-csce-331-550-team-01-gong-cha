"use client"

import "./styles.css"

interface SoldTogetherProps {
    MenuDrink1: string;
    MenuDrink2: number;
    SalesCount: number;
}

export default function RestockReportIngredient({MenuDrink1, MenuDrink2, SalesCount}: SoldTogetherProps){

    return(
        <div className="flex justify-center">
            <div className='inner bg-rose-700 w-full flex justify-evenly text-slate-200 font-semibold text-xl h-14 my-1 rounded-xl'>
                <div className='flex justify-center items-center w-2/6'>
                    {MenuDrink1}
                </div>
                <div className="flex justify-evenly items-center w-2/6">
                    {MenuDrink2}
                </div>
                <div className='flex w-2/6 justify-center items-center'>
                    {SalesCount}
                </div>
            </div>
        </div>
    );
}